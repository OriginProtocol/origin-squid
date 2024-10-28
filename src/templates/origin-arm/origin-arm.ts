import dayjs from 'dayjs'
import { last } from 'lodash'

import * as erc20Abi from '@abi/erc20'
import * as originLidoArmAbi from '@abi/origin-lido-arm'
import * as originLidoArmCapManagerAbi from '@abi/origin-lido-arm-cap-manager'
import { Arm, ArmDailyStat, ArmState, ArmWithdrawalRequest, TraderateChanged } from '@model'
import { Block, Context, Processor } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { createERC20SimpleTracker } from '@templates/erc20-simple'
import { createEventProcessor } from '@templates/events/createEventProcessor'
import { blockFrequencyTracker } from '@utils/blockFrequencyUpdater'
import { calculateAPY } from '@utils/calculateAPY'
import { logFilter } from '@utils/logFilter'

export const createOriginARMProcessors = ({
  name,
  from,
  armAddress,
  capManagerAddress,
}: {
  name: string
  from: number
  armAddress: string
  capManagerAddress: string
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
  const tradeRateProcessor = createEventProcessor({
    event: originLidoArmAbi.events.TraderateChanged,
    address: armAddress,
    from,
    mapEntity: (ctx, block, log, decoded) => {
      return new TraderateChanged({
        id: `${ctx.chain.id}:${log.id}`,
        chainId: ctx.chain.id,
        txHash: log.transactionHash,
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
      const armContract = new originLidoArmAbi.Contract(ctx, ctx.blocks[0].header, armAddress)
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
        const getStateId = (block: Block) => `${ctx.chain.id}:${block.header.height}:${armAddress}`
        const getPreviousState = async () => {
          return (
            last(states) ??
            (await ctx.store.findOne(ArmState, {
              order: { timestamp: 'DESC' },
              where: { chainId: ctx.chain.id, address: armAddress },
            }))
          )
        }
        const getCurrentState = async (block: Block) => {
          const stateId = getStateId(block)
          if (states[states.length - 1]?.id === stateId) {
            return states[states.length - 1]
          }
          const previousState = await getPreviousState()
          const armContract = new originLidoArmAbi.Contract(ctx, block.header, armAddress)
          const controllerContract = new originLidoArmCapManagerAbi.Contract(ctx, block.header, capManagerAddress)
          const [assets0, assets1, outstandingAssets1, totalAssets, totalAssetsCap, totalSupply, assetsPerShare] =
            await Promise.all([
              new erc20Abi.Contract(ctx, block.header, armEntity.token0).balanceOf(armAddress),
              new erc20Abi.Contract(ctx, block.header, armEntity.token1).balanceOf(armAddress),
              armContract.lidoWithdrawalQueueAmount(),
              armContract.totalAssets(),
              controllerContract.totalAssetsCap(),
              armContract.totalSupply(),
              armContract.previewRedeem(10n ** 18n),
            ])
          const date = new Date(block.header.timestamp)
          const armStateEntity = new ArmState({
            id: stateId,
            chainId: ctx.chain.id,
            timestamp: date,
            blockNumber: block.header.height,
            address: armAddress,
            assets0,
            assets1,
            outstandingAssets1,
            totalAssets,
            totalAssetsCap,
            totalSupply,
            assetsPerShare,
            totalDeposits: previousState?.totalDeposits ?? 0n,
            totalWithdrawals: previousState?.totalWithdrawals ?? 0n,
            totalFees: previousState?.totalFees ?? 0n,
            totalYield: 0n,
          })
          armStateEntity.totalYield = calculateTotalYield(armStateEntity)
          states.push(armStateEntity)
          return armStateEntity
        }
        const calculateTotalYield = (state: ArmState) =>
          state.totalAssets - state.totalDeposits + state.totalWithdrawals

        for (const block of ctx.blocks) {
          if (tracker(ctx, block)) {
            // ArmState
            const state = await getCurrentState(block)

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
              totalAssets: state.totalAssets,
              totalAssetsCap: state.totalAssetsCap,
              totalSupply: state.totalSupply,
              assetsPerShare: state.assetsPerShare,
              apr: armDayApy.apr,
              apy: armDayApy.apy,
              fees: state.totalFees - (previousDailyStat?.fees ?? 0n),
              yield: state.totalYield - (previousDailyStat?.yield ?? 0n),
            })
            dailyStatsMap.set(currentDayId, armDailyStatEntity)
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
            }
            if (feeCollectedFilter.matches(log)) {
              const event = originLidoArmAbi.events.FeeCollected.decode(log)
              const state = await getCurrentState(block)
              state.totalFees += event.fee
            }
          }
        }
        await ctx.store.insert(states)
        await ctx.store.upsert([...dailyStatsMap.values()])
        await ctx.store.upsert([...redemptionMap.values()])
        await tradeRateProcessor.process(ctx)
      },
    },
    // The ARM is an ERC20, so we can use the ERC20SimpleTracker to track holder balances
    createERC20SimpleTracker({
      from,
      address: armAddress,
    }),
  ]
}
