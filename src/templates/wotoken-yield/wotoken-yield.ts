import * as wotokenAbi from '@abi/woeth'
import { WOTokenAddressYield } from '@model'
import { Block, Context, EvmBatchProcessor, Processor, logFilter } from '@originprotocol/squid-utils'
import { ADDRESS_ZERO } from '@utils/addresses'
import { DayBoundaryCarry, dayEndBlocks, forEachBlockByDay } from '@utils/for-each-block-by-day'

const ONE = 10n ** 18n

/**
 * Per-holder realized yield for a wrapped OToken (ERC4626: wOETH, wOUSD, wsuperOETHb, wOS).
 *
 * A wrapped OToken is non-rebasing — a holder's share balance is constant except on
 * wrap/unwrap/transfer, and all yield accrues as `assetsPerShare` (previewRedeem(1e18), "R")
 * rises. Per holder, on every checkpoint:
 *
 *   yield        = balance * (R - lastR)        -- wei-exact, carrying the sub-wei remainder
 *   value        = balance * R / 1e18           -- position value in underlying OToken units
 *   costBasis    = assets in at wrap/peer-in (= shares * R); proportional removal on unwrap/out
 *   roi          = value / costBasis - 1
 *
 * Transfers checkpoint at exact event time; a daily forced checkpoint captures pure
 * share-appreciation for passive holders. Value/yield/costBasis are all denominated in the
 * underlying OToken (OETH/OUSD/OS), which the portfolio resolver values in USD via that
 * OToken's daily-stat rate. Mirrors the ARM per-holder engine (see origin-arm.ts `checkpoint`).
 */
export const createWOTokenYieldProcessor = ({
  name,
  from,
  wotokenAddress,
  otokenAddress,
}: {
  name: string
  from: number
  /** The wrapped ERC4626 token address (the ERC20 whose transfers drive accrual). */
  wotokenAddress: string
  /** The underlying OToken address (denomination of value/yield; used for USD valuation). */
  otokenAddress: string
}): Processor => {
  const wotoken = wotokenAddress.toLowerCase()
  const otoken = otokenAddress.toLowerCase()

  const transferFilter = logFilter({
    address: [wotoken],
    topic0: [wotokenAbi.events.Transfer.topic],
    range: { from },
  })

  // Persisted across batches, seeded once from persisted rows (see `hydrate`).
  const currentDayRows = new Map<string, WOTokenAddressYield>()
  const previousDayRows = new Map<string, WOTokenAddressYield>()
  const dayCarry: DayBoundaryCarry = {}
  let hydrated = false
  let warnedNegativeBalance = false

  const hydrate = async (ctx: Context) => {
    // Bulk-load this wrapped token's yield rows once. Bucket the latest row per address into
    // today's in-progress map or yesterday/older into the previous-day map, so accrual resumes
    // correctly after a restart. Mirrors the ARM startup hydration.
    const today = new Date(ctx.blocks[0].header.timestamp).toISOString().slice(0, 10)
    const allRows = await ctx.store.find(WOTokenAddressYield, {
      where: { chainId: ctx.chain.id, wotoken },
      order: { date: 'DESC' },
    })
    for (const row of allRows) {
      // Bucket independently: today's latest row seeds currentDay; the latest older row seeds
      // previousDay. Both are needed even when an account has a today row — previousDay supplies the
      // daily-yield baseline. (Don't gate previousDay on currentDay, or a mid-day restart would
      // recompute today's `yield` against a zero baseline.)
      if (row.date === today) {
        if (!currentDayRows.has(row.address)) currentDayRows.set(row.address, row)
      } else if (!previousDayRows.has(row.address)) {
        previousDayRows.set(row.address, row)
      }
    }
    hydrated = true
  }

  return {
    name,
    from,
    setup: (p: EvmBatchProcessor) => {
      // includeAllBlocks so the day-boundary detection sees consecutive blocks (and thus every true
      // end-of-day) even on days with no wrapped transfer. Redundant on these chains — the OToken
      // processor already includes all blocks from an earlier block — but keeps this self-sufficient.
      p.includeAllBlocks({ from })
      p.addLog(transferFilter.value)
    },
    process: async (ctx: Context) => {
      if (ctx.blocks[ctx.blocks.length - 1].header.height < from) return
      if (!hydrated) await hydrate(ctx)

      const chainId = ctx.chain.id
      const changedYieldRows = new Map<string, WOTokenAddressYield>()
      // Memoize previewRedeem(1e18) per block height (reset each batch).
      const rCache = new Map<number, bigint>()
      const getR = async (block: Block): Promise<bigint> => {
        const cached = rCache.get(block.header.height)
        if (cached !== undefined) return cached
        const R = await new wotokenAbi.Contract(ctx, block.header, wotoken).previewRedeem(ONE)
        rCache.set(block.header.height, R)
        return R
      }

      // Wei-exact accrual checkpoint for a holder. Updates today's row in-place, creating it
      // (seeded from prior state) when the date rolls over. Cost basis: outflows reduce
      // proportionally, inflows take the explicit delta.
      const checkpoint = (account: string, block: Block, R: bigint, balanceDelta: bigint, costBasisDelta?: bigint) => {
        const lower = account.toLowerCase()
        const dateStr = new Date(block.header.timestamp).toISOString().slice(0, 10)
        const id = `${chainId}:${wotoken}:${lower}:${dateStr}`
        let row = currentDayRows.get(lower)
        if (!row || row.date !== dateStr) {
          // Date rolled over (or first touch): retire current to previous, seed new.
          if (row) previousDayRows.set(lower, row)
          const seed = row ?? previousDayRows.get(lower)
          row = new WOTokenAddressYield({
            id,
            chainId,
            wotoken,
            otoken,
            address: lower,
            date: dateStr,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            balance: seed?.balance ?? 0n,
            value: 0n,
            costBasis: seed?.costBasis ?? 0n,
            yield: 0n,
            cumulativeYield: seed?.cumulativeYield ?? 0n,
            roi: 0,
            lastR: seed?.lastR ?? R,
            yieldRemainder: seed?.yieldRemainder ?? 0n,
          })
          currentDayRows.set(lower, row)
        }
        // Wei-exact accrual: carry the fractional remainder, floor-divide.
        const product = row.balance * (R - row.lastR) + row.yieldRemainder
        let intPart = product / ONE
        let remainder = product % ONE
        if (remainder < 0n) {
          intPart -= 1n
          remainder += ONE
        }
        row.cumulativeYield += intPart
        row.yieldRemainder = remainder
        row.lastR = R
        if (balanceDelta < 0n) {
          // Outflow. Clamp to the tracked balance so it can never go negative: an outflow larger
          // than what we've tracked means the matching inbound predates this processor's `from`
          // (i.e. `from` is set after the token's genesis). A negative holding is physically
          // impossible, so floor at zero and warn once — the real fix is moving `from` to the
          // wrapped token's first transfer. Cost basis is removed proportionally to shares actually
          // held, so it also floors cleanly.
          const sharesOut = -balanceDelta > row.balance ? row.balance : -balanceDelta
          if (-balanceDelta > row.balance && !warnedNegativeBalance) {
            warnedNegativeBalance = true
            ctx.log.warn(
              `${wotoken}: outflow exceeds tracked balance for ${lower} — 'from' (${from}) is likely after the token's genesis; clamping to zero.`,
            )
          }
          if (row.balance > 0n) {
            row.costBasis -= (row.costBasis * sharesOut) / row.balance
          }
          row.balance -= sharesOut
        } else {
          if (costBasisDelta !== undefined) row.costBasis += costBasisDelta
          row.balance += balanceDelta
        }
        row.value = (row.balance * R) / ONE
        row.yield = row.cumulativeYield - (previousDayRows.get(lower)?.cumulativeYield ?? 0n)
        row.roi = row.costBasis > 0n ? Number(row.value) / Number(row.costBasis) - 1 : 0
        row.timestamp = new Date(block.header.timestamp)
        row.blockNumber = block.header.height
        changedYieldRows.set(row.id, row)
      }

      // Pre-warm the rate cache in one parallel batch (the RPC client coalesces these into batched
      // eth_calls): every block that needs R — those with a wrapped transfer, plus each day-end — is
      // fetched concurrently so the sequential per-day pass below never blocks on a round-trip.
      // Best-effort — a pre-init revert on the empty vault is ignored and simply skipped by onDayEnd's
      // active-holder guard.
      const rBlocks = new Map<number, Block>()
      for (const block of ctx.blocks) {
        if (block.logs.some((log) => transferFilter.matches(log))) rBlocks.set(block.header.height, block)
      }
      for (const block of dayEndBlocks(ctx, dayCarry)) rBlocks.set(block.header.height, block)
      await Promise.all([...rBlocks.values()].map((block) => getR(block).catch(() => undefined)))

      // Deterministic per-day accrual: transfers checkpoint at exact event time; each day's pure
      // share-appreciation is closed out once, at that day's true last block (`onDayEnd`), regardless
      // of how blocks are batched. At the chain head the current day is also swept for freshness.
      await forEachBlockByDay(ctx, dayCarry, {
        onBlock: async (block) => {
          for (const log of block.logs) {
            if (transferFilter.matches(log)) {
              // Mint = from 0 (wrap); burn = to 0 (unwrap); peer transfer otherwise.
              // Every inbound (wrap or peer-in) marks cost basis at current R: for a wrap you deposit
              // `shares * R` underlying assets; a peer-in is acquired at current market value.
              // Outbounds reduce cost basis proportionally (handled inside checkpoint).
              const event = wotokenAbi.events.Transfer.decode(log)
              const R = await getR(block)
              const fromZero = event.from.toLowerCase() === ADDRESS_ZERO
              const toZero = event.to.toLowerCase() === ADDRESS_ZERO
              if (!fromZero) {
                checkpoint(event.from, block, R, -event.value)
              }
              if (!toZero) {
                checkpoint(event.to, block, R, event.value, (event.value * R) / ONE)
              }
            }
          }
        },
        onDayEnd: async (block) => {
          if (block.header.height < from) return
          // Collect holders with a live balance first, and skip the block entirely when there are
          // none. Before the vault's first deposit there are no holders and its ERC4626 views revert,
          // so we must not call previewRedeem (getR) yet. This keeps `from` robust: it can sit at (or
          // before) the token's genesis without a knife-edge on the exact vault-initialization block.
          const activeHolders: string[] = []
          for (const account of new Set([...currentDayRows.keys(), ...previousDayRows.keys()])) {
            const seedRow = currentDayRows.get(account) ?? previousDayRows.get(account)
            if (seedRow && seedRow.balance > 0n) activeHolders.push(account)
          }
          if (activeHolders.length > 0) {
            const R = await getR(block)
            for (const account of activeHolders) checkpoint(account, block, R, 0n)
          }
        },
      })

      await ctx.store.upsert([...changedYieldRows.values()])
    },
  }
}
