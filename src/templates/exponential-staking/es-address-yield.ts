import * as abi from '@abi/exponential-staking'
import { ESAddressYield } from '@model'
import { Block, Context, EvmBatchProcessor, Processor, logFilter } from '@originprotocol/squid-utils'

// xOGN is a MasterChef-style accumulator: previewRewards(user) == balanceOf(user) *
// (accRewardPerShare - rewardDebtPerShare(user)) / 1e12. So accRewardPerShare is scaled by 1e12 and a
// holder's realized reward accrues as points * d(accRewardPerShare) / 1e12. (Verified on-chain.)
const REWARD_PRECISION = 10n ** 12n

/**
 * Per-holder realized staking yield for an ExponentialStaking (xOGN) contract.
 *
 * Rewards (OGN) are streamed at a fixed rate and distributed pro-rata by a holder's points (their
 * xOGN balance, which is lock-multiplier weighted). This mirrors the ARM/wrapped engine with
 * R = accRewardPerShare (read per block) as the accumulator:
 *
 *   yield        = points * (R - lastR) / 1e12      -- wei-exact, carries the sub-unit remainder
 *   cumulative   = lifetime OGN rewards (claimed + still-pending) — captured whether or not claimed
 *   roi          = cumulativeYield / stakedBalance  -- return on the OGN principal
 *
 * `balance` tracks points (the reward-share basis) from Stake/Unstake; `stakedBalance` tracks the OGN
 * principal (the position value / APY denominator). Stake/Unstake change balance at exact event time;
 * a daily forced checkpoint captures pure accrual for holders who don't interact. Value/yield are in
 * OGN, which the portfolio resolver prices via OGN's daily USD rate.
 */
export const createESAddressYieldProcessor = ({
  from,
  address,
}: {
  from: number
  /** The xOGN ExponentialStaking contract address. */
  address: string
}): Processor => {
  const staking = address.toLowerCase()

  const stakeFilter = logFilter({ address: [staking], topic0: [abi.events.Stake.topic], range: { from } })
  const unstakeFilter = logFilter({ address: [staking], topic0: [abi.events.Unstake.topic], range: { from } })

  // Persisted across batches, seeded once from persisted rows (see `hydrate`).
  const currentDayRows = new Map<string, ESAddressYield>()
  const previousDayRows = new Map<string, ESAddressYield>()
  let hydrated = false

  const hydrate = async (ctx: Context) => {
    // Bulk-load this contract's yield rows once, bucketing the latest row per account into today's
    // in-progress map or yesterday/older into the previous-day map. Mirrors the ARM/wrapped hydration.
    const today = new Date(ctx.blocks[0].header.timestamp).toISOString().slice(0, 10)
    const allRows = await ctx.store.find(ESAddressYield, {
      where: { chainId: ctx.chain.id, address: staking },
      order: { date: 'DESC' },
    })
    for (const row of allRows) {
      // Bucket independently: today's latest row seeds currentDay; the latest older row seeds
      // previousDay. Both are needed even when an account has a today row — previousDay supplies the
      // daily-yield baseline. (Don't gate previousDay on currentDay, or a mid-day restart would
      // recompute today's `yield` against a zero baseline.)
      if (row.date === today) {
        if (!currentDayRows.has(row.account)) currentDayRows.set(row.account, row)
      } else if (!previousDayRows.has(row.account)) {
        previousDayRows.set(row.account, row)
      }
    }
    hydrated = true
  }

  return {
    name: `xOGN Address Yield ${staking}`,
    from,
    setup: (p: EvmBatchProcessor) => {
      // includeAllBlocks so the daily forced checkpoint can fire on the last block of each day even
      // when no stake/unstake occurred (matches the ARM/otoken batch).
      p.includeAllBlocks({ from })
      p.addLog(stakeFilter.value)
      p.addLog(unstakeFilter.value)
    },
    process: async (ctx: Context) => {
      if (ctx.blocks[ctx.blocks.length - 1].header.height < from) return
      if (!hydrated) await hydrate(ctx)

      const chainId = ctx.chain.id
      const changedYieldRows = new Map<string, ESAddressYield>()
      // Memoize accRewardPerShare per block height (reset each batch).
      const rCache = new Map<number, bigint>()
      const getR = async (block: Block): Promise<bigint> => {
        const cached = rCache.get(block.header.height)
        if (cached !== undefined) return cached
        const R = await new abi.Contract(ctx, block.header, staking).accRewardPerShare()
        rCache.set(block.header.height, R)
        return R
      }

      // Accrual checkpoint for a staker. Updates today's row in-place, creating it (seeded from prior
      // state) when the date rolls over. `pointsDelta` moves the reward-share basis; `stakedDelta`
      // moves the OGN principal.
      const checkpoint = (account: string, block: Block, R: bigint, pointsDelta: bigint, stakedDelta: bigint) => {
        const lower = account.toLowerCase()
        const dateStr = new Date(block.header.timestamp).toISOString().slice(0, 10)
        const id = `${chainId}:${staking}:${lower}:${dateStr}`
        let row = currentDayRows.get(lower)
        if (!row || row.date !== dateStr) {
          if (row) previousDayRows.set(lower, row)
          const seed = row ?? previousDayRows.get(lower)
          row = new ESAddressYield({
            id,
            chainId,
            address: staking,
            account: lower,
            date: dateStr,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            balance: seed?.balance ?? 0n,
            stakedBalance: seed?.stakedBalance ?? 0n,
            yield: 0n,
            cumulativeYield: seed?.cumulativeYield ?? 0n,
            roi: 0,
            lastR: seed?.lastR ?? R,
            yieldRemainder: seed?.yieldRemainder ?? 0n,
          })
          currentDayRows.set(lower, row)
        }
        // Accrual: points * d(accRewardPerShare), carrying the sub-unit remainder, floor-divide.
        const product = row.balance * (R - row.lastR) + row.yieldRemainder
        let intPart = product / REWARD_PRECISION
        let remainder = product % REWARD_PRECISION
        if (remainder < 0n) {
          intPart -= 1n
          remainder += REWARD_PRECISION
        }
        row.cumulativeYield += intPart
        row.yieldRemainder = remainder
        row.lastR = R
        // Points can't go negative (unstake burns exactly what was minted); clamp defensively.
        row.balance += pointsDelta
        if (row.balance < 0n) row.balance = 0n
        row.stakedBalance += stakedDelta
        // When fully unstaked, force principal to zero: an Unstake reports the post-penalty withdrawn
        // amount, so early exits could otherwise leave a small penalty residual behind.
        if (row.balance === 0n || row.stakedBalance < 0n) row.stakedBalance = 0n
        row.yield = row.cumulativeYield - (previousDayRows.get(lower)?.cumulativeYield ?? 0n)
        row.roi = row.stakedBalance > 0n ? Number(row.cumulativeYield) / Number(row.stakedBalance) : 0
        row.timestamp = new Date(block.header.timestamp)
        row.blockNumber = block.header.height
        changedYieldRows.set(row.id, row)
      }

      for (const block of ctx.blocks) {
        for (const log of block.logs) {
          if (stakeFilter.matches(log)) {
            // Stake mints `points` xOGN and locks `amount` OGN (new stake or the relock half of an
            // extend). Accrue at the old balance first, then apply both deltas.
            const event = abi.events.Stake.decode(log)
            const R = await getR(block)
            checkpoint(event.user, block, R, event.points, event.amount)
          } else if (unstakeFilter.matches(log)) {
            // Unstake burns `points` xOGN and withdraws OGN principal. `amount` is the post-penalty
            // withdrawn amount; the full-exit clamp above zeroes any residual once points hit 0.
            const event = abi.events.Unstake.decode(log)
            const R = await getR(block)
            checkpoint(event.user, block, R, -event.points, -event.amount)
          }
        }

        // Daily forced checkpoint: close out each day's accrual for every staker with a live balance,
        // including passive ones. Skip when there are no active stakers so we never call the contract
        // before it has any (keeps `from` robust). `latestBlockOfDay` fires on each day's last block
        // and the batch tail, so one sweep/day completes the series and the tail keeps today fresh.
        if (block.header.height >= from && ctx.latestBlockOfDay(block)) {
          const activeStakers: string[] = []
          for (const account of new Set([...currentDayRows.keys(), ...previousDayRows.keys()])) {
            const seedRow = currentDayRows.get(account) ?? previousDayRows.get(account)
            if (seedRow && seedRow.balance > 0n) activeStakers.push(account)
          }
          if (activeStakers.length > 0) {
            const R = await getR(block)
            for (const account of activeStakers) checkpoint(account, block, R, 0n, 0n)
          }
        }
      }

      await ctx.store.upsert([...changedYieldRows.values()])
    },
  }
}
