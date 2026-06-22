import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { findLast } from 'lodash'
import { IsNull, LessThan, LessThanOrEqual } from 'typeorm'
import { formatEther, formatUnits } from 'viem'

import * as erc20Abi from '@abi/erc20'
import * as originOsArmAbi from '@abi/origin-arm'
import * as originEthenaArmAbi from '@abi/origin-ethena-arm'
import * as originEtherfiArmAbi from '@abi/origin-etherfi-arm'
import * as originLidoArmAbi from '@abi/origin-lido-arm'
import * as originLidoArmCapManagerAbi from '@abi/origin-lido-arm-cap-manager'
import * as originMultibaseArmAbi from '@abi/origin-multibase-arm'
import {
  Arm,
  ArmAddressYield,
  ArmDailyAssetYield,
  ArmDailyStat,
  ArmState,
  ArmSwap,
  ArmWithdrawalRequest,
  TraderateChanged,
} from '@model'
import {
  Block,
  Context,
  EvmBatchProcessor,
  Processor,
  blockFrequencyTracker,
  logFilter,
} from '@originprotocol/squid-utils'
import { ensureExchangeRate } from '@shared/post-processors/exchange-rates'
import { Currency, currencyToAddress } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { createERC20Entry } from '@templates/erc20/erc20-entry'
import { createERC20EventTracker } from '@templates/erc20/erc20-event'
import { createEventProcessor } from '@templates/events/createEventProcessor'
import { ADDRESS_ZERO } from '@utils/addresses'
import { traceFilter } from '@utils/traceFilter'

import { calculateArmDailyApy } from './arm-apy'

dayjs.extend(utc)

export const createOriginARMProcessors = ({
  chainId = 1,
  name,
  from,
  armAddress,
  token0,
  token1,
  getRate1,
  capManagerAddress,
  marketFrom,
  armType,
  yieldBaseline,
}: {
  chainId?: number
  name: string
  from: number
  armAddress: string
  token0: Currency
  token1: Currency
  getRate1?: (ctx: Context, block: Block) => Promise<bigint>
  capManagerAddress: string
  marketFrom?: number
  armType: 'lido' | 'etherfi' | 'os' | 'ethena'
  // One-time history cleanup for an ARM whose on-chain assetsPerShare was corrupted by a
  // since-resolved contract bug (e.g. the sUSDe ARM, 2026-04-23..05-13). All yield series
  // (ArmDailyStat, ArmDailyAssetYield, ArmAddressYield) start clean at `block`, with cumulative
  // counters rebased by the captured on-chain baseline. Holder share balances / cost basis are
  // never touched. Omit for unaffected ARMs.
  yieldBaseline?: { block: number; cumulativeYield: bigint; cumulativeFees: bigint }
}): Processor[] => {
  const redeemRequestedFilter = logFilter({
    address: [armAddress],
    topic0: [originLidoArmAbi.events.RedeemRequested.topic],
    range: { from },
  })
  const redeemClaimedFilter = logFilter({
    address: [armAddress],
    topic0: [originLidoArmAbi.events.RedeemClaimed.topic],
    range: { from },
  })
  const depositFilter = logFilter({
    address: [armAddress],
    topic0: [originLidoArmAbi.events.Deposit.topic],
    range: { from },
  })
  const withdrawalFilter = logFilter({
    address: [armAddress],
    topic0: [originLidoArmAbi.events.RedeemRequested.topic],
    range: { from },
  })
  const feeCollectedFilter = logFilter({
    address: [armAddress],
    topic0: [originLidoArmAbi.events.FeeCollected.topic],
    range: { from },
  })
  const transferFilter = logFilter({
    address: [armAddress],
    topic0: [originLidoArmAbi.events.Transfer.topic],
    range: { from },
  })
  // Inbound transfers of the base asset (token0) advance the ARM's claimable
  // pointer. Mainnet-only template, so resolve the symbol against chainId 1.
  const token0Address = currencyToAddress(chainId, token0)
  const baseAssetInboundFilter = logFilter({
    address: [token0Address],
    topic0: [erc20Abi.events.Transfer.topic],
    topic2: [armAddress],
    range: { from },
  })
  // Every ERC20 transfer in/out of the ARM (any token; filtered to registered base assets at
  // runtime). A rebase grows balanceOf with no Transfer, so the balance change not explained by
  // these transfers is rebase yield. Token-agnostic so it covers every base asset, including ones
  // added later via BaseAssetAdded (a static per-token filter can't). Requests are transfers out, so
  // they net out — keeps it generic, no per-protocol redemption events.
  const armInboundFilter = logFilter({
    topic0: [erc20Abi.events.Transfer.topic],
    topic2: [armAddress],
    range: { from },
  })
  const armOutboundFilter = logFilter({
    topic0: [erc20Abi.events.Transfer.topic],
    topic1: [armAddress],
    range: { from },
  })
  // Multi-base upgrade (arm-oeth PR #221) registers each base asset + adapter and
  // emits BaseAssetAdded. The first occurrence marks the upgrade for this ARM. The
  // new contract also re-emits TraderateChanged with a different signature/topic, so
  // detection is event-driven rather than tied to a hardcoded deploy block.
  const baseAssetAddedFilter = logFilter({
    address: [armAddress],
    topic0: [originMultibaseArmAbi.events.BaseAssetAdded.topic],
    range: { from },
  })
  // Lending-market allocations (deposits/withdrawals to the ERC4626 market). Two signatures exist:
  // Allocated(market, assets) [Lido/EtherFi/OS] and Allocated(market, targetLiquidityDelta,
  // actualLiquidityDelta) [multibase/Ethena]. Filter on both topics and decode by the one that
  // matched so the net flow is exact regardless of ARM generation.
  const allocatedFilter = logFilter({
    address: [armAddress],
    topic0: [originOsArmAbi.events.Allocated.topic, originMultibaseArmAbi.events.Allocated.topic],
    range: { from },
  })
  const swapFilter = traceFilter({
    type: ['call'],
    callTo: [armAddress],
    callSighash: [
      originLidoArmAbi.functions.swapExactTokensForTokens.sighash,
      originLidoArmAbi.functions.swapExactTokensForTokens_1.sighash,
      originLidoArmAbi.functions.swapTokensForExactTokens.sighash,
      originLidoArmAbi.functions.swapTokensForExactTokens_1.sighash,
    ],
    range: { from },
    transaction: true,
    transactionLogs: true,
  })

  const tradeRateProcessor = createEventProcessor({
    event: originLidoArmAbi.events.TraderateChanged,
    address: armAddress,
    from,
    extraFilterArgs: {
      transaction: true,
    },
    mapEntity: (ctx, block, log, decoded) => {
      return new TraderateChanged({
        id: `${ctx.chain.id}:${log.id}`,
        chainId: ctx.chain.id,
        txHash: log.transactionHash,
        txFee: (log.transaction?.gasUsed ?? 0n) * (log.transaction?.effectiveGasPrice ?? 0n),
        timestamp: new Date(block.header.timestamp),
        blockNumber: block.header.height,
        address: armAddress,
        traderate0: decoded.traderate0,
        traderate1: decoded.traderate1,
        // Dual-write to the new format so consumers can migrate. token1 here is a Currency
        // symbol, so resolve it to the on-chain address to match the new event's `asset`.
        asset: currencyToAddress(chainId, token1).toLowerCase(),
        buyPrice: decoded.traderate0,
        sellPrice: decoded.traderate1,
      })
    },
  })
  // Post-upgrade (arm-oeth PR #221) TraderateChanged has a different signature and
  // topic0, so it needs its own processor/filter. It populates the new fields only.
  const tradeRateMultibaseProcessor = createEventProcessor({
    event: originMultibaseArmAbi.events.TraderateChanged,
    address: armAddress,
    from,
    extraFilterArgs: {
      transaction: true,
    },
    mapEntity: (ctx, block, log, decoded) => {
      return new TraderateChanged({
        id: `${ctx.chain.id}:${log.id}`,
        chainId: ctx.chain.id,
        txHash: log.transactionHash,
        txFee: (log.transaction?.gasUsed ?? 0n) * (log.transaction?.effectiveGasPrice ?? 0n),
        timestamp: new Date(block.header.timestamp),
        blockNumber: block.header.height,
        address: armAddress,
        // Dual-write to the old format so old-format consumers keep working post-upgrade.
        traderate0: decoded.buyPrice,
        traderate1: decoded.sellPrice,
        asset: decoded.asset.toLowerCase(),
        buyPrice: decoded.buyPrice,
        sellPrice: decoded.sellPrice,
        buyLiquidityRemaining: decoded.buyLiquidityRemaining,
        sellLiquidityRemaining: decoded.sellLiquidityRemaining,
      })
    },
  })
  const tracker = blockFrequencyTracker({ from })
  let armEntity: Arm
  let initialized = false
  const previousDayRows = new Map<string, ArmAddressYield>()
  const currentDayRows = new Map<string, ArmAddressYield>()
  let yieldRowsInitialized = false
  // yieldBaseline history-cleanup state. `sawBelowBaseline` ensures the one-time holder reset only
  // fires during a backfill that actually processes the pre-baseline blocks — never on a production
  // resume that starts past the baseline (which would wrongly re-zero accrued yield).
  let sawBelowBaseline = false
  let yieldBaselineApplied = false
  // Per-(date:asset) running accumulator of swap trading profit + volume, for ArmDailyAssetYield.
  // Persists across batches; seeded once at processor start from today's persisted rows so a
  // mid-day restart keeps summing. Keyed `${date}:${assetLower}`.
  const currentDayAssetYield = new Map<string, { tradingYield: bigint; swapVolume: bigint }>()
  // Per-date lending yield, built by segmented accrual (each segment earns sharesHeld × Δpps,
  // credited to the segment-end day). Settling before each flow keeps it day-boundary-safe.
  const currentDayLending = new Map<string, bigint>()
  // Carried market-position checkpoint (shares/pps held since the last settle), seeded from the
  // latest ArmState so a resumed run continues from the right baseline.
  let lastMarketShares = 0n
  let lastMarketPps = 10n ** 18n
  let lastMarketAddress = ADDRESS_ZERO
  // Per-date rebase yield (folded into appreciationYield). Keyed by asset: lastBaseBalance is the
  // balance at the last settle; baseTransferFlow is net transfers since then (reset on settle, so it
  // covers the same window as Δbalance).
  const currentDayRebase = new Map<string, bigint>()
  const lastBaseBalance = new Map<string, bigint>()
  const baseTransferFlow = new Map<string, bigint>()
  let yieldSourceInitialized = false
  let initialize = async (ctx: Context) => {
    if (ctx.blocks[0].header.height < from) return
    // Must match the id the entity is created with below (`armAddress`). Previously this looked up
    // `${chainId}:${armAddress}`, never found the row, and rebuilt a fresh Arm every run — silently
    // dropping persisted state (upgradeBlock, adapters, appended base assets) and breaking upgrade
    // detection on any run that resumed past the upgrade block.
    const id = armAddress
    let entity = await ctx.store.get(Arm, id)
    if (entity) {
      armEntity = entity
    } else {
      const armContract = new originOsArmAbi.Contract(ctx, ctx.blocks[0].header, armAddress)
      const [name, symbol, decimals] = await Promise.all([
        armContract.name(),
        armContract.symbol(),
        armContract.decimals(),
      ])
      // token0()/token1() were removed in the multi-base upgrade — calling them reverts on upgraded
      // ARMs. Resolve the liquidity + primary-base addresses from the configured Currency symbols.
      const token0Addr = currencyToAddress(chainId, token0)
      const token1Addr = currencyToAddress(chainId, token1)
      const arm = new Arm({
        id: armAddress,
        chainId: ctx.chain.id,
        address: armAddress,
        name,
        symbol,
        decimals,
        token0: token0Addr,
        token1: token1Addr,
        // assets[0] = liquidity asset (token0), assets[1] = primary base asset (token1).
        // The liquidity asset is trivially 1:1 with itself (pegged=true). An appreciating
        // base asset (getRate1 set, e.g. sUSDe) is not pegged; 1:1 assets are. BaseAssetAdded
        // appends further base assets to assets[1+].
        assets: [token0Addr, token1Addr],
        assetSymbols: [token0, token1],
        assetPegged: [true, !getRate1],
        // No adapters pre-upgrade (the adapter system ships with the upgrade); populated
        // from BaseAssetAdded when the upgrade registers assets (including the existing one).
        assetAdapters: [ADDRESS_ZERO, ADDRESS_ZERO],
      })
      await ctx.store.save(arm)
      armEntity = arm
    }
    initialized = true
  }
  return [
    {
      name,
      from,
      setup: (p: EvmBatchProcessor) => {
        p.includeAllBlocks({ from })
        p.addLog(redeemRequestedFilter.value)
        p.addLog(redeemClaimedFilter.value)
        p.addLog(depositFilter.value)
        p.addLog(withdrawalFilter.value)
        p.addLog(feeCollectedFilter.value)
        p.addLog(transferFilter.value)
        p.addLog(baseAssetInboundFilter.value)
        p.addLog(armInboundFilter.value)
        p.addLog(armOutboundFilter.value)
        p.addLog(baseAssetAddedFilter.value)
        p.addLog(allocatedFilter.value)
        p.addTrace(swapFilter.value)
        tradeRateProcessor.setup(p)
        tradeRateMultibaseProcessor.setup(p)
      },
      initialize,
      process: async (ctx: Context) => {
        if (!initialized) {
          // We can only initialize once we've hit our target block.
          await initialize(ctx)
        }
        if (!yieldRowsInitialized) {
          // Bulk-load yield rows once at processor start. Bucket the latest row per
          // address into either today's in-progress map or yesterday/older into the
          // previous-day map. Both maps persist across batches.
          const today = new Date(ctx.blocks[0].header.timestamp).toISOString().slice(0, 10)
          const allRows = await ctx.store.find(ArmAddressYield, {
            where: { chainId: ctx.chain.id, arm: armAddress },
            order: { date: 'DESC' },
          })
          for (const row of allRows) {
            if (row.date === today) {
              if (!currentDayRows.has(row.address)) currentDayRows.set(row.address, row)
            } else {
              if (!previousDayRows.has(row.address)) previousDayRows.set(row.address, row)
            }
          }
          yieldRowsInitialized = true
        }
        if (!yieldSourceInitialized) {
          // Seed the trading accumulator from today's persisted ArmDailyAssetYield rows so a
          // mid-day restart continues summing rather than double-counting from zero.
          const today = new Date(ctx.blocks[0].header.timestamp).toISOString().slice(0, 10)
          const rows = await ctx.store.find(ArmDailyAssetYield, {
            where: { chainId: ctx.chain.id, address: armAddress, date: today },
          })
          for (const row of rows) {
            currentDayAssetYield.set(`${row.date}:${row.asset.toLowerCase()}`, {
              tradingYield: row.tradingYield,
              swapVolume: row.swapVolume,
            })
            // Seed today's accrued lending from the liquidity asset's persisted row so a mid-day
            // restart continues accruing rather than restarting today's total from zero.
            if (row.lendingYield !== 0n) currentDayLending.set(row.date, row.lendingYield)
          }
          // Seed the carried checkpoint (shares + pps + market) from the latest state so the first
          // segment after a resume settles from the correct baseline.
          const lastState = await ctx.store.findOne(ArmState, {
            where: { chainId: ctx.chain.id, address: armAddress },
            order: { blockNumber: 'DESC' },
          })
          if (lastState) {
            lastMarketShares = lastState.marketShares
            lastMarketPps = lastState.marketPricePerShare
            lastMarketAddress = lastState.activeMarket
            // Seed each base asset's balance baseline so the first rebase settle after a resume
            // doesn't book the whole position as passive growth.
            for (let i = 1; i < armEntity.assets.length; i++) {
              lastBaseBalance.set(armEntity.assets[i].toLowerCase(), BigInt(lastState.assetBalances[i] ?? '0'))
            }
          }
          yieldSourceInitialized = true
        }
        const states: ArmState[] = []
        const dailyStatsMap = new Map<string, ArmDailyStat>()
        const dailyAssetYieldMap = new Map<string, ArmDailyAssetYield>()
        const changedYieldRows = new Map<string, ArmAddressYield>()
        const redemptionMap = new Map<string, ArmWithdrawalRequest>()
        const swaps: ArmSwap[] = []
        const getStateId = (block: Block) => `${ctx.chain.id}:${block.header.height}:${armAddress}`
        const getPreviousState = async (block: Block) => {
          return (
            findLast(states, (state) => state.blockNumber < block.header.height) ??
            (await ctx.store.findOne(ArmState, {
              order: { timestamp: 'DESC' },
              where: { chainId: ctx.chain.id, address: armAddress, blockNumber: LessThan(block.header.height) },
            }))
          )
        }
        const getYesterdayState = async (block: Block) => {
          const startOfToday = dayjs.utc(block.header.timestamp).startOf('day').toDate()
          return (
            findLast(states, (state) => state.timestamp < startOfToday) ??
            (await ctx.store.findOne(ArmState, {
              order: { timestamp: 'DESC' },
              where: { chainId: ctx.chain.id, address: armAddress, timestamp: LessThan(startOfToday) },
            }))
          )
        }
        const getCurrentState = async (block: Block) => {
          const stateId = getStateId(block)
          let armStateEntity = states.find((state) => state.id === stateId)
          if (armStateEntity) {
            return armStateEntity
          }
          const previousState = await getPreviousState(block)
          // An upgrade transaction can emit state-triggering events before BaseAssetAdded.
          // eth_call sees the upgraded implementation for the entire block, so consider
          // the ARM upgraded when BaseAssetAdded appears anywhere in the current block.
          const upgraded =
            (armEntity.upgradeBlock != null && block.header.height >= armEntity.upgradeBlock) ||
            block.logs.some((log) => baseAssetAddedFilter.matches(log))
          const armContract = new originOsArmAbi.Contract(ctx, block.header, armAddress)
          const lidoArmContract = new originLidoArmAbi.Contract(ctx, block.header, armAddress)
          const ethenaArmContract = new originEthenaArmAbi.Contract(ctx, block.header, armAddress)
          const osArmContract = new originOsArmAbi.Contract(ctx, block.header, armAddress)
          const etherfiArmContract = new originEtherfiArmAbi.Contract(ctx, block.header, armAddress)
          const controllerContract = new originLidoArmCapManagerAbi.Contract(ctx, block.header, capManagerAddress)
          // Per-asset balances over the full registry: assets[0] = liquidity asset, [1+] = base assets.
          const assetBalancesBig = await Promise.all(
            armEntity.assets.map((a) => new erc20Abi.Contract(ctx, block.header, a).balanceOf(armAddress)),
          )
          const assets0 = assetBalancesBig[0] ?? 0n // idle liquidity asset (WETH / USDe)
          const assets1 = assetBalancesBig[1] ?? 0n // legacy primary base asset
          // Per-asset protocol redemptions in-flight (adapter withdrawal queues), aligned to
          // armEntity.assets. [0] = liquidity asset (never redeems into itself) = 0; [i>0] =
          // liquidity-denominated amount pending for base asset i. Multiple base assets can be
          // redeeming at once post-upgrade. Legacy scalar outstandingAssets1 == sum of [1+].
          let outstandingAssetsBig: bigint[]
          if (upgraded) {
            // Post-upgrade: pending protocol redemptions live per base asset in liquidity terms.
            const multibase = new originMultibaseArmAbi.Contract(ctx, block.header, armAddress)
            const configs = await Promise.all(armEntity.assets.slice(1).map((a) => multibase.baseAssetConfigs(a)))
            outstandingAssetsBig = [0n, ...configs.map((c) => c.pendingRedeemAssets)]
          } else {
            // Pre-upgrade: single base asset, one chain-specific withdrawal-queue call.
            const single = await {
              lido: lidoArmContract.lidoWithdrawalQueueAmount.bind(lidoArmContract),
              os: osArmContract.vaultWithdrawalAmount.bind(osArmContract),
              etherfi: etherfiArmContract.etherfiWithdrawalQueueAmount.bind(etherfiArmContract),
              ethena: async () => {
                if (block.header.height < 24043952) return 0n
                return await ethenaArmContract.liquidityAmountInCooldown()
              },
            }[armType]()
            outstandingAssetsBig = [0n, single]
          }
          const outstandingAssets1 = outstandingAssetsBig.reduce((acc, b) => acc + b, 0n)
          const [feesAccrued, totalAssets, totalAssetsCap, totalSupply, assetsPerShare, activeMarket, claimable] =
            await Promise.all([
              armContract.feesAccrued(),
              armContract.totalAssets(),
              controllerContract.totalAssetsCap(),
              armContract.totalSupply(),
              armContract.previewRedeem(10n ** 18n),
              marketFrom && block.header.height >= marketFrom ? armContract.activeMarket() : Promise.resolve(undefined),
              armContract.claimable(),
            ])
          // Guard against the zero address: an ARM may expose activeMarket()
          // from its deploy block but not have a market wired up until later.
          // Calling balanceOf on 0x0 returns empty bytes and crashes the decoder.
          const hasMarket = !!activeMarket && activeMarket !== ADDRESS_ZERO
          const marketBalanceOf = hasMarket
            ? await new erc20Abi.Contract(ctx, block.header, activeMarket!).balanceOf(armAddress)
            : 0n
          const activeMarketContract = hasMarket
            ? new originOsArmAbi.Contract(ctx, block.header, activeMarket!)
            : undefined
          // Always value the market position with convertToAssets (true shares x price), never
          // previewRedeem — previewRedeem caps at currently-withdrawable liquidity, so it understates
          // the position when the market is illiquid (the same bug that was fixed in the ARM contract).
          const marketAssets =
            activeMarketContract && marketBalanceOf > 0n
              ? await activeMarketContract.convertToAssets(marketBalanceOf)
              : 0n
          // Lending-market factors for yield-source attribution. pricePerShare = convertToAssets(1e18);
          // defaults to 1e18 when there is no market so day-over-day diffs are no-ops.
          const marketShares = marketBalanceOf
          const marketPricePerShare = activeMarketContract
            ? await activeMarketContract.convertToAssets(10n ** 18n)
            : 10n ** 18n
          const activeMarketAddress = hasMarket ? activeMarket!.toLowerCase() : ADDRESS_ZERO
          const date = new Date(block.header.timestamp)
          armStateEntity = new ArmState({
            id: stateId,
            chainId: ctx.chain.id,
            timestamp: date,
            blockNumber: block.header.height,
            address: armAddress,
            assets0,
            assets1,
            outstandingAssets1,
            marketAssets,
            feesAccrued,
            totalAssets,
            totalAssetsCap,
            totalSupply,
            assetsPerShare,
            totalDeposits: previousState?.totalDeposits ?? 0n,
            totalWithdrawals: previousState?.totalWithdrawals ?? 0n,
            totalWithdrawalsClaimed: previousState?.totalWithdrawalsClaimed ?? 0n,
            totalFees: previousState?.totalFees ?? 0n,
            totalYield: 0n,
            claimable,
            // Aligned to armEntity.assets (append-only). [0] = idle liquidity (== assets0).
            assetBalances: assetBalancesBig.map((b) => b.toString()),
            // [0] aggregates all liquidity-denominated value (idle + redeeming + market);
            // [i>0] = raw base balance. assetTotals[i] x assetRates[i] = value in liquidity terms.
            assetTotals: [
              (assets0 + outstandingAssets1 + marketAssets).toString(),
              ...assetBalancesBig.slice(1).map((b) => b.toString()),
            ],
            // Per-asset redemptions in-flight, aligned to assets. [0] = 0; sum of [1+] == outstandingAssets1.
            outstandingAssets: outstandingAssetsBig.map((b) => b.toString()),
            marketShares,
            marketPricePerShare,
            activeMarket: activeMarketAddress,
          })
          armStateEntity.totalYield = calculateTotalYield(armStateEntity)
          states.push(armStateEntity)
          states.sort((a, b) => a.blockNumber - b.blockNumber) // sort ascending
          await resolveClaimableRequests(block, claimable)
          return armStateEntity
        }
        const computeClaimableAt = (requestTimestampMs: number, blockTimestampMs: number): Date => {
          // 10-minute floor: even when the vault already has enough liquidity,
          // a request can never have been claimable sooner than 10 minutes
          // after it was made (per product spec).
          const floor = requestTimestampMs + 10 * 60 * 1000
          return new Date(blockTimestampMs > floor ? blockTimestampMs : floor)
        }
        const resolveClaimableRequests = async (block: Block, claimable: bigint) => {
          for (const req of redemptionMap.values()) {
            if (req.claimableAt == null && req.queued <= claimable) {
              req.claimableAt = computeClaimableAt(req.timestamp.getTime(), block.header.timestamp)
            }
          }
          const rows = await ctx.store.find(ArmWithdrawalRequest, {
            where: {
              chainId: ctx.chain.id,
              address: armAddress,
              claimableAt: IsNull(),
              queued: LessThanOrEqual(claimable),
            },
          })
          for (const row of rows) {
            if (redemptionMap.has(row.id)) continue
            row.claimableAt = computeClaimableAt(row.timestamp.getTime(), block.header.timestamp)
            redemptionMap.set(row.id, row)
          }
        }
        const calculateTotalYield = (state: ArmState) =>
          state.totalAssets - state.totalDeposits + state.totalWithdrawals
        // Accumulate a swap's trading profit + liquidity-terms volume into the per-(date:asset)
        // running total that feeds ArmDailyAssetYield.tradingYield.
        const accrueTradingYield = (block: Block, asset: string, spread: bigint, token0Volume: bigint) => {
          const dateStr = new Date(block.header.timestamp).toISOString().slice(0, 10)
          const key = `${dateStr}:${asset.toLowerCase()}`
          const acc = currentDayAssetYield.get(key) ?? { tradingYield: 0n, swapVolume: 0n }
          acc.tradingYield += spread
          acc.swapVolume += token0Volume
          currentDayAssetYield.set(key, acc)
        }
        // Settle the lending segment up to this block (lastMarketShares × Δpps), then advance the
        // checkpoint. Call at each allocation (before its share change) and each daily snapshot. A
        // market switch resets the baseline so pps is never diffed across two markets. `state` must
        // be the post-allocation snapshot.
        const settleLending = (block: Block, state: ArmState) => {
          const switched = lastMarketAddress !== ADDRESS_ZERO && state.activeMarket !== lastMarketAddress
          if (!switched && lastMarketShares > 0n) {
            const appreciation = (lastMarketShares * (state.marketPricePerShare - lastMarketPps)) / 10n ** 18n
            const dateStr = new Date(block.header.timestamp).toISOString().slice(0, 10)
            currentDayLending.set(dateStr, (currentDayLending.get(dateStr) ?? 0n) + appreciation)
          }
          lastMarketShares = state.marketShares
          lastMarketPps = state.marketPricePerShare
          lastMarketAddress = state.activeMarket
        }
        // Rebase per base asset: the balance change since the last settle not explained by transfers,
        // valued at rate. ~0 for non-rebasing bases.
        const settleRebase = (state: ArmState, dateStr: string, rates: string[]) => {
          const ONE = 10n ** 18n
          for (let i = 1; i < armEntity.assets.length; i++) {
            const asset = armEntity.assets[i].toLowerCase()
            const balanceNow = BigInt(state.assetBalances[i] ?? '0')
            const rate = BigInt(rates[i] ?? ONE.toString())
            const flow = baseTransferFlow.get(asset) ?? 0n
            // First settle for this asset (cold start, or a base added mid-history): seed the
            // baseline to the window-start balance (balanceNow - flow) so the first window books 0
            // instead of mistaking the opening inflow for rebase.
            const prevBalance = lastBaseBalance.get(asset) ?? balanceNow - flow
            const rebaseValue = ((balanceNow - prevBalance - flow) * rate) / ONE
            if (rebaseValue !== 0n) {
              currentDayRebase.set(`${dateStr}:${asset}`, (currentDayRebase.get(`${dateStr}:${asset}`) ?? 0n) + rebaseValue)
            }
            lastBaseBalance.set(asset, balanceNow)
            baseTransferFlow.set(asset, 0n)
          }
        }
        // A base asset's rate in asset0 (liquidity) terms, 1e18-scaled (token0 per base).
        // Mirrors the assetRates logic: pegged base assets and the liquidity asset are 1:1;
        // appreciating assets use their adapter (post-upgrade) or getRate1 (pre-upgrade single base).
        const getBaseAssetRate = async (block: Block, assetIdx: number): Promise<bigint> => {
          if (assetIdx === 0 || armEntity.assetPegged[assetIdx]) return 10n ** 18n
          const upgraded = armEntity.upgradeBlock != null && block.header.height >= armEntity.upgradeBlock
          if (upgraded) {
            return new originMultibaseArmAbi.Contract(
              ctx,
              block.header,
              armEntity.assetAdapters[assetIdx],
            ).convertToAssets(10n ** 18n)
          }
          return getRate1 ? await getRate1(ctx, block) : 10n ** 18n
        }
        const checkpoint = (
          account: string,
          block: Block,
          R: bigint,
          balanceDelta: bigint,
          costBasisDelta?: bigint,
        ) => {
          // Wei-exact accrual checkpoint for a holder. Updates today's row in-place,
          // creating it (seeded from prior state) when the date rolls over.
          // Cost basis: outflows reduce proportionally, inflows take the explicit delta.
          const lower = account.toLowerCase()
          const dateStr = new Date(block.header.timestamp).toISOString().slice(0, 10)
          const id = `${ctx.chain.id}:${armAddress}:${lower}:${dateStr}`
          let row = currentDayRows.get(lower)
          if (!row || row.date !== dateStr) {
            // Date rolled over (or first touch): retire current to previous, seed new.
            if (row) previousDayRows.set(lower, row)
            const seed = row ?? previousDayRows.get(lower)
            row = new ArmAddressYield({
              id,
              chainId: ctx.chain.id,
              arm: armAddress,
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
          let intPart = product / 10n ** 18n
          let remainder = product % 10n ** 18n
          if (remainder < 0n) {
            intPart -= 1n
            remainder += 10n ** 18n
          }
          row.cumulativeYield += intPart
          row.yieldRemainder = remainder
          row.lastR = R
          // Cost basis: outflow → proportional removal; inflow → explicit delta.
          if (balanceDelta < 0n && row.balance > 0n) {
            const sharesOut = -balanceDelta
            const costRemoved = (row.costBasis * sharesOut) / row.balance
            row.costBasis -= costRemoved
          } else if (costBasisDelta !== undefined) {
            row.costBasis += costBasisDelta
          }
          row.balance += balanceDelta
          row.value = (row.balance * R) / 10n ** 18n
          row.yield = row.cumulativeYield - (previousDayRows.get(lower)?.cumulativeYield ?? 0n)
          row.roi = row.costBasis > 0n ? Number(row.value) / Number(row.costBasis) - 1 : 0
          row.timestamp = new Date(block.header.timestamp)
          row.blockNumber = block.header.height
          changedYieldRows.set(row.id, row)
        }

        for (const block of ctx.blocks) {
          // yieldBaseline history cleanup: when the backfill crosses the baseline block, reset every
          // holder's accumulated yield to a clean zero and re-anchor lastR to the current (resolved)
          // rate, so yield accrues cleanly from here. Share balances and cost basis are left intact.
          // Guarded by sawBelowBaseline so a resume starting past the baseline never re-fires.
          if (yieldBaseline) {
            if (block.header.height < yieldBaseline.block) {
              sawBelowBaseline = true
            } else if (sawBelowBaseline && !yieldBaselineApplied) {
              const baselineState = await getCurrentState(block)
              const R0 = baselineState.assetsPerShare
              for (const row of new Set([...currentDayRows.values(), ...previousDayRows.values()])) {
                row.cumulativeYield = 0n
                row.yieldRemainder = 0n
                row.lastR = R0
                row.yield = 0n
              }
              yieldBaselineApplied = true
            }
          }
          for (const log of block.logs) {
            // ArmWithdrawalRequest
            if (redeemRequestedFilter.matches(log)) {
              const event = originLidoArmAbi.events.RedeemRequested.decode(log)
              const eventId = `${ctx.chain.id}:${armAddress}:${event.requestId}`
              const redemptionEntity = new ArmWithdrawalRequest({
                id: eventId,
                chainId: ctx.chain.id,
                txHash: log.transactionHash,
                timestamp: new Date(block.header.timestamp),
                blockNumber: block.header.height,
                address: armAddress,
                account: event.withdrawer,
                requestId: event.requestId,
                amount: event.assets,
                queued: event.queued,
                claimed: false,
              })
              redemptionMap.set(redemptionEntity.id, redemptionEntity)
            } else if (redeemClaimedFilter.matches(log)) {
              const event = originLidoArmAbi.events.RedeemClaimed.decode(log)
              const eventId = `${ctx.chain.id}:${armAddress}:${event.requestId}`
              const redemptionEntity =
                redemptionMap.get(eventId) ?? (await ctx.store.get(ArmWithdrawalRequest, eventId))
              if (redemptionEntity) {
                redemptionEntity.claimed = true
                redemptionEntity.claimedAt = new Date(block.header.timestamp)
                redemptionMap.set(eventId, redemptionEntity)
              }
            }
            // Process these with separate `if` since there is filter overlap.
            if (depositFilter.matches(log)) {
              const event = originLidoArmAbi.events.Deposit.decode(log)
              const state = await getCurrentState(block)
              state.totalDeposits += event.assets
              state.totalYield = calculateTotalYield(state)
              // Cost basis for the depositor: the actual asset amount paid in.
              // Balance change is handled by the paired Transfer (mint) below.
              checkpoint(event.owner, block, state.assetsPerShare, 0n, event.assets)
            } else if (withdrawalFilter.matches(log)) {
              const event = originLidoArmAbi.events.RedeemRequested.decode(log)
              const state = await getCurrentState(block)
              state.totalWithdrawals += event.assets
              state.totalYield = calculateTotalYield(state)
            } else if (redeemClaimedFilter.matches(log)) {
              const event = originLidoArmAbi.events.RedeemClaimed.decode(log)
              const state = await getCurrentState(block)
              state.totalWithdrawalsClaimed += event.assets
            }
            if (feeCollectedFilter.matches(log)) {
              const event = originLidoArmAbi.events.FeeCollected.decode(log)
              const state = await getCurrentState(block)
              state.totalFees += event.fee
            }
            if (transferFilter.matches(log)) {
              // Mint = from 0; burn = to 0; peer transfer otherwise.
              // Mint cost basis is set by the Deposit event above; here we only move balance.
              // Burns and peer-outs reduce cost basis proportionally (auto in checkpoint).
              // Peer-ins mark new cost basis at current R.
              const event = originLidoArmAbi.events.Transfer.decode(log)
              const state = await getCurrentState(block)
              const R = state.assetsPerShare
              const fromZero = event.from.toLowerCase() === ADDRESS_ZERO
              const toZero = event.to.toLowerCase() === ADDRESS_ZERO
              if (!fromZero) {
                checkpoint(event.from, block, R, -event.value)
              }
              if (!toZero) {
                const isPeer = !fromZero
                const costBasisDelta = isPeer ? (event.value * R) / 10n ** 18n : undefined
                checkpoint(event.to, block, R, event.value, costBasisDelta)
              }
            }
            if (baseAssetInboundFilter.matches(log)) {
              // Inbound base-asset transfer changes the ARM's liquidity, which can
              // advance claimable. Snapshot ArmState so the new value is captured.
              await getCurrentState(block)
            }
            // Explicit balance moves of a registered base asset, netted out by the rebase settle.
            // (log.address is the token; only base assets, index >= 1, are tracked. Self-transfer
            // matches both directions → nets 0.)
            const inbound = armInboundFilter.matches(log)
            const outbound = armOutboundFilter.matches(log)
            if (inbound || outbound) {
              // log.address (lowercase) is the token; only registered base assets (index >= 1) accrue
              // rebase flow. It keys baseTransferFlow directly, matching settleRebase's lowercased key.
              const idx = armEntity.assets.findIndex((a) => a.toLowerCase() === log.address)
              if (idx >= 1) {
                const value = erc20Abi.events.Transfer.decode(log).value
                baseTransferFlow.set(log.address, (baseTransferFlow.get(log.address) ?? 0n) + (inbound ? value : 0n) - (outbound ? value : 0n))
              }
            }
            if (baseAssetAddedFilter.matches(log)) {
              // Multi-base upgrade: the ARM registered a base asset + adapter. Append
              // new assets to the registry (deduped, append-only), and record the
              // upgrade block on first sight. Pegged flag comes straight from the event;
              // appreciating assets (wstETH/weETH/sUSDe) are valued via their adapter.
              const event = originMultibaseArmAbi.events.BaseAssetAdded.decode(log)
              const asset = event.asset.toLowerCase()
              const adapter = event.adapter.toLowerCase()
              const idx = armEntity.assets.findIndex((a) => a.toLowerCase() === asset)
              if (idx === -1) {
                // New base asset: append to the registry.
                const symbol = await new erc20Abi.Contract(ctx, block.header, asset).symbol()
                armEntity.assets.push(asset)
                armEntity.assetSymbols.push(symbol)
                armEntity.assetPegged.push(event.peggedToLiquidityAsset)
                armEntity.assetAdapters.push(adapter)
              } else {
                // Existing asset re-registered (e.g. the pre-upgrade base asset at upgrade time):
                // refresh its adapter + pegged flag so post-upgrade rate reads use the real adapter.
                armEntity.assetAdapters[idx] = adapter
                armEntity.assetPegged[idx] = event.peggedToLiquidityAsset
              }
              if (armEntity.upgradeBlock == null) {
                armEntity.upgradeBlock = block.header.height
              }
              await ctx.store.save(armEntity)
            }
            if (allocatedFilter.matches(log)) {
              // An allocation is about to change the market position. Snapshot the post-allocation
              // state and settle the lending segment first: the pre-flow position earned up to this
              // block (the deposit/withdraw mints/burns at the current pps, so pps is unchanged across
              // the flow), then the carried baseline advances to the new position. This closes the
              // appreciation window before the flow, so the flow never bleeds into another day.
              const state = await getCurrentState(block)
              settleLending(block, state)
            }
          }

          const swapHandledTransactions = new Set<string>()
          for (const trace of block.traces) {
            if (trace.type === 'call' && swapFilter.matches(trace)) {
              const transactionHash = trace.transaction?.hash ?? ''
              if (!swapHandledTransactions.has(transactionHash)) {
                swapHandledTransactions.add(transactionHash)
                if (!trace.transaction) throw new Error('Transaction not found')
                const transfers = trace.transaction.logs.filter(
                  (log) => log.topics[0] === erc20Abi.events.Transfer.topic,
                )
                const transfers0 = transfers
                  .filter((log) => log.address === armEntity.token0)
                  .map((log) => erc20Abi.events.Transfer.decode(log))

                const ONE = 10n ** 18n
                const swapMeta = {
                  chainId: ctx.chain.id,
                  txHash: transactionHash,
                  txFrom: trace.transaction?.from ?? '',
                  txTo: trace.transaction?.to ?? '',
                  timestamp: new Date(block.header.timestamp),
                  blockNumber: block.header.height,
                  address: armAddress,
                  from: trace.action.from,
                }

                // Every swap is liquidityAsset(token0) <-> one base asset (the contract forbids
                // base<->base). Pair token0 transfers against each base asset and emit one ArmSwap
                // per (tx, baseAsset, direction) with raw amounts and each side's asset0 rate.
                for (let assetIdx = 1; assetIdx < armEntity.assets.length; assetIdx++) {
                  const baseAsset = armEntity.assets[assetIdx]
                  const transfersB = transfers
                    .filter((log) => log.address === baseAsset)
                    .map((log) => erc20Abi.events.Transfer.decode(log))
                  if (transfersB.length === 0) continue

                  const rateB = await getBaseAssetRate(block, assetIdx) // token0 per base
                  const rateBNumber = +formatEther(rateB)

                  // Trader sells base for token0: ARM receives base, sends token0.
                  const transfersOut0 = transfers0.filter((t) => t.from.toLowerCase() === armAddress)
                  const transfersInB = transfersB.filter((t) => t.to.toLowerCase() === armAddress)
                  let sellBaseIn = 0n
                  let sellToken0Out = 0n
                  for (let i = 0; i < transfersOut0.length; i++) {
                    for (let j = 0; j < transfersInB.length; j++) {
                      const out0 = transfersOut0[i]
                      const inB = transfersInB[j]
                      if (out0.value === 0n || inB.value === 0n) continue
                      const rate = +formatEther((out0.value * ONE) / inB.value) // token0 per base
                      if (Math.abs(rate - rateBNumber) <= 0.01) {
                        sellBaseIn += inB.value
                        sellToken0Out += out0.value
                        transfersInB.splice(j, 1)
                        break
                      }
                    }
                  }
                  if (sellBaseIn > 0n) {
                    // Redeemable-value delta: base received (at rateB) − token0 paid out.
                    const spread = (sellBaseIn * rateB - sellToken0Out * ONE) / ONE
                    swaps.push(
                      new ArmSwap({
                        ...swapMeta,
                        id: `${ctx.chain.id}::${transactionHash}:${baseAsset}:sell`,
                        tokenIn: baseAsset,
                        amountIn: sellBaseIn,
                        rateIn: rateB,
                        tokenOut: armEntity.token0,
                        amountOut: sellToken0Out,
                        rateOut: ONE,
                        assets0: -sellToken0Out,
                        assets1: (sellBaseIn * rateB) / ONE,
                        spread,
                      }),
                    )
                    accrueTradingYield(block, baseAsset, spread, sellToken0Out)
                  }

                  // Trader buys base with token0: ARM receives token0, sends base.
                  const transfersOutB = transfersB.filter((t) => t.from.toLowerCase() === armAddress)
                  const transfersIn0 = transfers0.filter((t) => t.to.toLowerCase() === armAddress)
                  let buyBaseOut = 0n
                  let buyToken0In = 0n
                  for (let i = 0; i < transfersOutB.length; i++) {
                    for (let j = 0; j < transfersIn0.length; j++) {
                      const outB = transfersOutB[i]
                      const in0 = transfersIn0[j]
                      if (outB.value === 0n || in0.value === 0n) continue
                      const rate = +formatEther((in0.value * ONE) / outB.value) // token0 per base
                      if (Math.abs(rate - rateBNumber) <= 0.01) {
                        buyBaseOut += outB.value
                        buyToken0In += in0.value
                        transfersIn0.splice(j, 1)
                        break
                      }
                    }
                  }
                  if (buyBaseOut > 0n) {
                    // Redeemable-value delta: token0 received − base paid out (at rateB).
                    const spread = (buyToken0In * ONE - buyBaseOut * rateB) / ONE
                    swaps.push(
                      new ArmSwap({
                        ...swapMeta,
                        id: `${ctx.chain.id}::${transactionHash}:${baseAsset}:buy`,
                        tokenIn: armEntity.token0,
                        amountIn: buyToken0In,
                        rateIn: ONE,
                        tokenOut: baseAsset,
                        amountOut: buyBaseOut,
                        rateOut: rateB,
                        assets0: buyToken0In,
                        assets1: -(buyBaseOut * rateB) / ONE,
                        spread,
                      }),
                    )
                    accrueTradingYield(block, baseAsset, spread, buyToken0In)
                  }
                }
              }
            }
          }

          if (tracker(ctx, block) || (block.header.height > from && ctx.latestBlockOfDay(block))) {
            // ArmState
            const [state, yesterdayState, rateUSD, rateETH, rateNative, rateAsset1] = await Promise.all([
              getCurrentState(block),
              getYesterdayState(block),
              ensureExchangeRate(ctx, block, token0, 'USD'),
              ensureExchangeRate(ctx, block, token0, 'ETH'),
              ensureExchangeRate(ctx, block, token0, ctx.chain.nativeCurrency.symbol as Currency),
              getRate1?.(ctx, block),
            ])

            // Per-holder yield checkpoint: capture share-appreciation accrual for
            // every known holder, even those with no events on this block.
            const R = state.assetsPerShare
            const knownHolders = new Set<string>([...currentDayRows.keys(), ...previousDayRows.keys()])
            for (const account of knownHolders) {
              const seedRow = currentDayRows.get(account) ?? previousDayRows.get(account)
              if (!seedRow || seedRow.balance === 0n) continue
              checkpoint(account, block, R, 0n)
            }

            // ArmDailyStat
            const date = new Date(block.header.timestamp)
            const dateStr = date.toISOString().slice(0, 10)
            const previousDateStr = dayjs.utc(date).subtract(1, 'day').format('YYYY-MM-DD')
            const currentDayId = `${ctx.chain.id}:${dateStr}:${armAddress}`
            const previousDayId = `${ctx.chain.id}:${previousDateStr}:${armAddress}`
            const previousDailyStat =
              dailyStatsMap.get(previousDayId) ?? (await ctx.store.get(ArmDailyStat, previousDayId))
            const armDayApy = calculateArmDailyApy({ block, state, previousDailyStat })
            // Close the day's final lending segment at this end-of-day snapshot (the position held
            // since the last checkpoint earned up to now). After this, currentDayLending[dateStr]
            // holds the full, exact lending yield for the day.
            settleLending(block, state)

            // asset->liquidity rate, 1e18-scaled, aligned to armEntity.assets. [0] (liquidity) = 1e18.
            const upgraded = armEntity.upgradeBlock != null && block.header.height >= armEntity.upgradeBlock
            const ONE = (10n ** 18n).toString()
            let assetRates: string[]
            if (upgraded) {
              const baseRates = await Promise.all(
                armEntity.assets.slice(1).map(async (_, idx) => {
                  const i = idx + 1
                  if (armEntity.assetPegged[i]) return ONE
                  // Adapter address came from BaseAssetAdded (Arm.assetAdapters) — no baseAssetConfigs
                  // round-trip. It exposes IAssetAdapter.convertToAssets(uint256)->uint256 (same selector
                  // as the ARM's), so the generated decoder works pointed at the adapter.
                  const rate = await new originMultibaseArmAbi.Contract(
                    ctx,
                    block.header,
                    armEntity.assetAdapters[i],
                  ).convertToAssets(10n ** 18n)
                  return rate.toString()
                }),
              )
              assetRates = [ONE, ...baseRates]
            } else {
              assetRates = [ONE, (rateAsset1 ?? 10n ** 18n).toString()]
            }

            // Close the rebase window at this snapshot now that we have state + rate.
            settleRebase(state, dateStr, assetRates)

            const armDailyStatEntity = new ArmDailyStat({
              id: currentDayId,
              chainId: ctx.chain.id,
              timestamp: new Date(block.header.timestamp),
              blockNumber: block.header.height,
              date: dateStr,
              address: armAddress,
              assets0: state.assets0,
              assets1: state.assets1,
              outstandingAssets1: state.outstandingAssets1,
              marketAssets: state.marketAssets,
              feesAccrued: state.feesAccrued,
              totalAssets: state.totalAssets,
              totalAssetsCap: state.totalAssetsCap,
              totalSupply: state.totalSupply,
              assetsPerShare: state.assetsPerShare,
              totalDeposits: state.totalDeposits,
              totalWithdrawals: state.totalWithdrawals,
              totalWithdrawalsClaimed: state.totalWithdrawalsClaimed,
              apr: armDayApy.apr,
              apy: armDayApy.apy,
              fees:
                state.totalFees +
                state.feesAccrued -
                ((yesterdayState?.totalFees ?? 0n) + (yesterdayState?.feesAccrued ?? 0n)),
              yield: state.totalYield - (yesterdayState?.totalYield ?? 0n),
              // Rebase cumulative counters by the captured on-chain baseline so the cleaned series
              // starts at 0 at the anchor (daily yield/fees above are unaffected — they're deltas of
              // already-clean post-anchor values).
              cumulativeFees: state.totalFees + state.feesAccrued - (yieldBaseline?.cumulativeFees ?? 0n),
              cumulativeYield: state.totalYield - (yieldBaseline?.cumulativeYield ?? 0n),
              rateUSD: +formatUnits(rateUSD?.rate ?? 0n, rateUSD?.decimals ?? 18),
              rateETH: +formatUnits(rateETH?.rate ?? 0n, rateETH?.decimals ?? 18),
              rateNative: +formatUnits(rateNative?.rate ?? 0n, rateNative?.decimals ?? 18),
              rateAsset1: +formatUnits(rateAsset1 ?? 10n ** 18n, 18),
              // Aligned to armEntity.assets (append-only). [0] = liquidity asset.
              assetBalances: state.assetBalances,
              assetTotals: state.assetTotals,
              assetRates,
              outstandingAssets: state.outstandingAssets,
              marketShares: state.marketShares,
              marketPricePerShare: state.marketPricePerShare,
              activeMarket: state.activeMarket,
            })
            dailyStatsMap.set(currentDayId, armDailyStatEntity)

            // ArmDailyAssetYield: one row per asset, partitioning the day's redeemable-value
            // change into non-overlapping sources. Drifts are day-over-day vs the previous daily
            // stat (same prev reference the daily `yield` uses), valued at par (the redeem rate).
            const ONE_BIG = 10n ** 18n
            const prevBalances = previousDailyStat?.assetBalances ?? []
            const prevRates = previousDailyStat?.assetRates ?? []
            // Exact lending yield: the appreciation accrued segment-by-segment over the day (settled
            // at each allocation + this end-of-day snapshot). No flow subtraction, so it can't carry
            // day-boundary noise; goes on the liquidity-asset row only.
            const lendingYield = currentDayLending.get(dateStr) ?? 0n
            for (let i = 0; i < armEntity.assets.length; i++) {
              const asset = armEntity.assets[i].toLowerCase()
              const acc = currentDayAssetYield.get(`${dateStr}:${asset}`)
              const tradingYield = acc?.tradingYield ?? 0n
              const swapVolume = acc?.swapVolume ?? 0n
              // Appreciation = rebase (rebasing bases) + rate appreciation (non-pegged bases). The
              // two are orthogonal (a base does one or the other), so they add.
              let appreciationYield = i > 0 ? (currentDayRebase.get(`${dateStr}:${asset}`) ?? 0n) : 0n
              if (i > 0 && !armEntity.assetPegged[i] && prevBalances[i] != null && prevRates[i] != null) {
                appreciationYield += (BigInt(prevBalances[i]) * (BigInt(assetRates[i]) - BigInt(prevRates[i]))) / ONE_BIG
              }
              const assetLendingYield = i === 0 ? lendingYield : 0n
              dailyAssetYieldMap.set(`${ctx.chain.id}:${dateStr}:${armAddress}:${asset}`, new ArmDailyAssetYield({
                id: `${ctx.chain.id}:${dateStr}:${armAddress}:${asset}`,
                chainId: ctx.chain.id,
                address: armAddress,
                asset,
                assetSymbol: armEntity.assetSymbols[i],
                date: dateStr,
                timestamp: new Date(block.header.timestamp),
                blockNumber: block.header.height,
                tradingYield,
                appreciationYield,
                lendingYield: assetLendingYield,
                yield: tradingYield + appreciationYield + assetLendingYield,
                swapVolume,
              }))
            }
          }
        }

        // yieldBaseline history cleanup: suppress all yield-series rows at/before the anchor block so
        // the cleaned history starts at the first full post-anchor day (whose day-over-day delta is
        // measured against the anchor day's clean, post-recovery ArmState). Raw ArmState and the ERC20
        // holder-balance tracker are never gated, so balances stay complete and correct.
        const afterBaseline = (blockNumber: number) => !yieldBaseline || blockNumber > yieldBaseline.block
        await Promise.all([
          ctx.store.insert(states),
          ctx.store.upsert([...dailyStatsMap.values()].filter((r) => afterBaseline(r.blockNumber))),
          ctx.store.upsert([...dailyAssetYieldMap.values()].filter((r) => afterBaseline(r.blockNumber))),
          ctx.store.upsert([...changedYieldRows.values()].filter((r) => afterBaseline(r.blockNumber))),
          ctx.store.upsert([...redemptionMap.values()]),
          ctx.store.insert(swaps),
          tradeRateProcessor.process(ctx),
          tradeRateMultibaseProcessor.process(ctx),
        ])
      },
    },
    // The ARM is an ERC20, so we can use the ERC20SimpleTracker to track holder balances
    createERC20EventTracker({
      from,
      address: armAddress,
    }),
    createERC20Entry({
      from,
      addressOrSymbol: token0,
    }),
    createERC20Entry({
      from,
      addressOrSymbol: token1,
    }),
  ]
}
