import dayjs from 'dayjs';
import { findLast } from 'lodash';
import { LessThan } from 'typeorm';
import { formatEther, formatUnits } from 'viem';



import * as erc20Abi from '@abi/erc20';
import * as originOsArmAbi from '@abi/origin-arm';
import * as originEthenaArmAbi from '@abi/origin-ethena-arm';
import * as originEtherfiArmAbi from '@abi/origin-etherfi-arm';
import * as originLidoArmAbi from '@abi/origin-lido-arm';
import * as originLidoArmCapManagerAbi from '@abi/origin-lido-arm-cap-manager';
import { Arm, ArmDailyStat, ArmState, ArmSwap, ArmWithdrawalRequest, TraderateChanged } from '@model';
import { Block, Context, EvmBatchProcessor, Processor, blockFrequencyTracker, calculateAPY, logFilter } from '@originprotocol/squid-utils';
import { ensureExchangeRate } from '@shared/post-processors/exchange-rates';
import { Currency, mainnetCurrencies, MainnetCurrencySymbol } from '@shared/post-processors/exchange-rates/mainnetCurrencies';
import { createERC20Entry } from '@templates/erc20/erc20-entry';
import { createERC20EventTracker } from '@templates/erc20/erc20-event';
import { createEventProcessor } from '@templates/events/createEventProcessor'
import { traceFilter } from '@utils/traceFilter'

const currencyToAddress = (currency: Currency): string => {
  if (currency.startsWith('0x')) return currency.toLowerCase()
  return mainnetCurrencies[currency as MainnetCurrencySymbol].toLowerCase()
}

export const createOriginARMProcessors = ({
  name,
  from,
  armAddress,
  token0,
  token1,
  getRate1,
  capManagerAddress,
  marketFrom,
  armType,
}: {
  name: string
  from: number
  armAddress: string
  token0: Currency
  token1: Currency
  getRate1?: (ctx: Context, block: Block) => Promise<bigint>
  capManagerAddress: string
  marketFrom?: number
  armType: 'lido' | 'etherfi' | 'os' | 'ethena'
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
  const swapFilter = traceFilter({
    type: ['call'],
    callTo: [armAddress],
    callSighash: [
      originLidoArmAbi.functions['swapExactTokensForTokens(uint256,uint256,address[],address,uint256)'].sighash,
      originLidoArmAbi.functions['swapExactTokensForTokens(address,address,uint256,uint256,address)'].sighash,
      originLidoArmAbi.functions['swapTokensForExactTokens(uint256,uint256,address[],address,uint256)'].sighash,
      originLidoArmAbi.functions['swapTokensForExactTokens(address,address,uint256,uint256,address)'].sighash,
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
      })
    },
  })
  const tracker = blockFrequencyTracker({ from })
  let armEntity: Arm
  let initialized = false
  let initialize = async (ctx: Context) => {
    if (ctx.blocks[0].header.height < from) return
    const id = `${ctx.chain.id}:${armAddress}`
    let entity = await ctx.store.get(Arm, id)
    if (entity) {
      armEntity = entity
    } else {
      const armContract = new originOsArmAbi.Contract(ctx, ctx.blocks[0].header, armAddress)
      const [name, symbol, decimals, token0, token1] = await Promise.all([
        armContract.name(),
        armContract.symbol(),
        armContract.decimals(),
        armContract.token0(),
        armContract.token1(),
      ])
      const arm = new Arm({
        id: armAddress,
        chainId: ctx.chain.id,
        address: armAddress,
        name,
        symbol,
        decimals,
        token0,
        token1,
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
        p.addTrace(swapFilter.value)
        tradeRateProcessor.setup(p)
      },
      initialize,
      process: async (ctx: Context) => {
        if (!initialized) {
          // We can only initialize once we've hit our target block.
          await initialize(ctx)
        }
        const states: ArmState[] = []
        const dailyStatsMap = new Map<string, ArmDailyStat>()
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
          const startOfToday = dayjs(block.header.timestamp).startOf('day').toDate()
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
          const armContract = new originOsArmAbi.Contract(ctx, block.header, armAddress)
          const lidoArmContract = new originLidoArmAbi.Contract(ctx, block.header, armAddress)
          const ethenaArmContract = new originEthenaArmAbi.Contract(ctx, block.header, armAddress)
          const osArmContract = new originOsArmAbi.Contract(ctx, block.header, armAddress)
          const etherfiArmContract = new originEtherfiArmAbi.Contract(ctx, block.header, armAddress)
          const controllerContract = new originLidoArmCapManagerAbi.Contract(ctx, block.header, capManagerAddress)
          const [
            assets0,
            assets1,
            outstandingAssets1,
            feesAccrued,
            totalAssets,
            totalAssetsCap,
            totalSupply,
            assetsPerShare,
            activeMarket,
          ] = await Promise.all([
            new erc20Abi.Contract(ctx, block.header, armEntity.token0).balanceOf(armAddress),
            new erc20Abi.Contract(ctx, block.header, armEntity.token1).balanceOf(armAddress),
            {
              lido: lidoArmContract.lidoWithdrawalQueueAmount.bind(lidoArmContract),
              os: osArmContract.vaultWithdrawalAmount.bind(osArmContract),
              etherfi: etherfiArmContract.etherfiWithdrawalQueueAmount.bind(etherfiArmContract),
              ethena: async () => {
                if (block.header.height < 24043952) return 0n
                return await ethenaArmContract.liquidityAmountInCooldown()
              },
            }[armType](),
            armContract.feesAccrued(),
            armContract.totalAssets(),
            controllerContract.totalAssetsCap(),
            armContract.totalSupply(),
            armContract.previewRedeem(10n ** 18n),
            marketFrom && block.header.height >= marketFrom ? armContract.activeMarket() : Promise.resolve(undefined),
          ])
          const marketBalanceOf = activeMarket
            ? await new erc20Abi.Contract(ctx, block.header, activeMarket).balanceOf(armAddress)
            : 0n
          const activeMarketContract = activeMarket
            ? new originOsArmAbi.Contract(ctx, block.header, activeMarket)
            : undefined
          const marketAssets =
            activeMarketContract && marketBalanceOf > 0n
              ? await activeMarketContract.previewRedeem(marketBalanceOf)
              : 0n
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
          })
          armStateEntity.totalYield = calculateTotalYield(armStateEntity)
          states.push(armStateEntity)
          states.sort((a, b) => a.blockNumber - b.blockNumber) // sort ascending
          return armStateEntity
        }
        const calculateTotalYield = (state: ArmState) =>
          state.totalAssets - state.totalDeposits + state.totalWithdrawals

        for (const block of ctx.blocksWithContent) {
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
                const transfers1 = transfers
                  .filter((log) => log.address === armEntity.token1)
                  .map((log) => erc20Abi.events.Transfer.decode(log))

                const pairs: { assets0: bigint; assets1: bigint }[] = []

                const transfersOut0 = transfers0.filter((t) => t.from.toLowerCase() === armAddress)
                const transfersIn1 = transfers1.filter((t) => t.to.toLowerCase() === armAddress)

                const rate1 = getRate1 ? await getRate1(ctx, block) : 10n ** 18n
                const rate1Number = +formatEther(rate1)

                for (let i = 0; i < transfersOut0.length; i++) {
                  for (let j = 0; j < transfersIn1.length; j++) {
                    const out0 = transfersOut0[i]
                    const in1 = transfersIn1[j]
                    if (out0.value === 0n || in1.value === 0n) continue
                    const rate = +formatEther((out0.value * 10n ** 18n) / in1.value)
                    if (Math.abs(rate - rate1Number) <= 0.01) {
                      pairs.push({ assets0: -out0.value, assets1: (in1.value * rate1) / 10n ** 18n })
                      transfersIn1.splice(j, 1)
                      break
                    }
                  }
                }

                const transfersOut1 = transfers1.filter((t) => t.from.toLowerCase() === armAddress)
                const transfersIn0 = transfers0.filter((t) => t.to.toLowerCase() === armAddress)
                for (let i = 0; i < transfersOut1.length; i++) {
                  for (let j = 0; j < transfersIn0.length; j++) {
                    const out1 = transfersOut1[i]
                    const in0 = transfersIn0[j]
                    if (out1.value === 0n || in0.value === 0n) continue
                    const rate = +formatEther((out1.value * 10n ** 18n) / in0.value)
                    if (Math.abs(rate - rate1Number) <= 0.01) {
                      pairs.push({ assets0: in0.value, assets1: (-out1.value * rate1) / 10n ** 18n })
                      transfersIn0.splice(j, 1)
                      break
                    }
                  }
                }

                const assets0 = pairs.reduce((acc, pair) => acc + pair.assets0, 0n)
                const assets1 = pairs.reduce((acc, pair) => acc + pair.assets1, 0n)

                swaps.push(
                  new ArmSwap({
                    id: `${ctx.chain.id}::${transactionHash}:${trace.traceAddress.join(':')}`,
                    chainId: ctx.chain.id,
                    txHash: transactionHash,
                    txFrom: trace.transaction?.from ?? '',
                    txTo: trace.transaction?.to ?? '',
                    timestamp: new Date(block.header.timestamp),
                    blockNumber: block.header.height,
                    address: armAddress,
                    from: trace.action.from,
                    assets0,
                    assets1,
                  }),
                )
              }
            }
          }
        }
        for (const block of ctx.blocks) {
          if (tracker(ctx, block) || (block.header.height > from && ctx.latestBlockOfDay(block))) {
            // ArmState
            const [state, yesterdayState, rateUSD, rateETH, rateNative] = await Promise.all([
              getCurrentState(block),
              getYesterdayState(block),
              ensureExchangeRate(ctx, block, token0, 'USD'),
              ensureExchangeRate(ctx, block, token0, 'ETH'),
              ensureExchangeRate(ctx, block, token0, ctx.chain.nativeCurrency.symbol as Currency),
            ])

            // ArmDailyStat
            const date = new Date(block.header.timestamp)
            const dateStr = date.toISOString().slice(0, 10)
            const previousDateStr = dayjs(date).subtract(1, 'day').toISOString().slice(0, 10)
            const currentDayId = `${ctx.chain.id}:${dateStr}:${armAddress}`
            const previousDayId = `${ctx.chain.id}:${previousDateStr}:${armAddress}`
            const previousDailyStat =
              dailyStatsMap.get(previousDayId) ?? (await ctx.store.get(ArmDailyStat, previousDayId))
            const startOfDay = dayjs(date).startOf('day').toDate()
            const endOfDay = dayjs(date).endOf('day').toDate()
            const armDayApy = calculateAPY(
              startOfDay,
              endOfDay,
              previousDailyStat?.assetsPerShare ?? 10n ** 18n,
              state.assetsPerShare,
            )

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
              fees: state.totalFees - (yesterdayState?.totalFees ?? 0n),
              yield: state.totalYield - (yesterdayState?.totalYield ?? 0n),
              cumulativeFees: state.totalFees,
              cumulativeYield: state.totalYield,
              rateUSD: +formatUnits(rateUSD?.rate ?? 0n, rateUSD?.decimals ?? 18),
              rateETH: +formatUnits(rateETH?.rate ?? 0n, rateETH?.decimals ?? 18),
              rateNative: +formatUnits(rateNative?.rate ?? 0n, rateNative?.decimals ?? 18),
            })
            dailyStatsMap.set(currentDayId, armDailyStatEntity)
          }
        }

        await Promise.all([
          ctx.store.insert(states),
          ctx.store.upsert([...dailyStatsMap.values()]),
          ctx.store.upsert([...redemptionMap.values()]),
          ctx.store.insert(swaps),
          tradeRateProcessor.process(ctx),
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
      address: currencyToAddress(token0),
    }),
    createERC20Entry({
      from,
      address: currencyToAddress(token1),
    }),
  ]
}