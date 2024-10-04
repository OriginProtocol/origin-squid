import dayjs from 'dayjs'

import * as erc20Abi from '@abi/erc20'
import * as originLidoArmAbi from '@abi/origin-lido-arm'
import * as originLiquidityProviderControllerAbi from '@abi/origin-liquidity-provider-controller'
import { Arm, ArmDailyState, ArmRedemption, ArmState } from '@model'
import { Context, Processor } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { createERC20SimpleTracker } from '@templates/erc20-simple'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'
import { calculateAPY } from '@utils/calculateAPY'
import { logFilter } from '@utils/logFilter'

export const createOriginARMProcessors = ({
  name,
  from,
  armAddress,
  liquidityProviderControllerAddress,
}: {
  name: string
  from: number
  armAddress: string
  liquidityProviderControllerAddress: string
}): Processor[] => {
  const redeemRequestedFilter = logFilter({
    address: [armAddress],
    topic0: [originLidoArmAbi.events.RedeemRequested.topic],
  })
  const redeemClaimedFilter = logFilter({
    address: [armAddress],
    topic0: [originLidoArmAbi.events.RedeemClaimed.topic],
  })
  const updater = blockFrequencyUpdater({ from })
  let armEntity: Arm
  return [
    {
      name,
      from,
      setup: (p: EvmBatchProcessor) => {
        p.includeAllBlocks({ from })
        p.addLog(redeemRequestedFilter.value)
        p.addLog(redeemClaimedFilter.value)
      },
      initialize: async (ctx: Context) => {
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
      },
      process: async (ctx: Context) => {
        const states: ArmState[] = []
        const dailyStatesMap = new Map<string, ArmDailyState>()
        const redemptionMap = new Map<string, ArmRedemption>()
        await updater(ctx, async (ctx, block) => {
          const armContract = new originLidoArmAbi.Contract(ctx, block.header, armAddress)
          const controllerContract = new originLiquidityProviderControllerAbi.Contract(
            ctx,
            block.header,
            liquidityProviderControllerAddress,
          )
          const [
            assets0,
            assets1,
            outstandingAssets1,
            totalAssets,
            totalAssetsCap,
            totalSupply,
            redemptionRate,
            feesAccrued,
          ] = await Promise.all([
            new erc20Abi.Contract(ctx, block.header, armEntity.token0).balanceOf(armAddress),
            new erc20Abi.Contract(ctx, block.header, armEntity.token1).balanceOf(armAddress),
            armContract.lidoWithdrawalQueueAmount(),
            armContract.totalAssets(),
            controllerContract.totalAssetsCap(),
            armContract.totalSupply(),
            armContract.previewRedeem(10n ** 18n),
            armContract.feesAccrued(),
          ])
          const date = new Date(block.header.timestamp)
          const armStateEntity = new ArmState({
            id: `${ctx.chain.id}:${block.header.height}:${armAddress}`,
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
            redemptionRate,
            fees: feesAccrued,
          })
          const dateStr = date.toISOString().slice(0, 10)
          const previousDateStr = dayjs(date).subtract(1, 'day').toISOString().slice(0, 10)
          const currentDayId = `${ctx.chain.id}:${dateStr}:${armAddress}`
          const previousDayId = `${ctx.chain.id}:${previousDateStr}:${armAddress}`
          const previousArmDailyStateEntity =
            dailyStatesMap.get(previousDayId) ?? (await ctx.store.get(ArmDailyState, previousDayId))
          const startOfDay = dayjs(date).startOf('day').toDate()
          const endOfDay = dayjs(date).endOf('day').toDate()
          const armStateApr = calculateAPY(
            startOfDay,
            endOfDay,
            previousArmDailyStateEntity?.redemptionRate ?? redemptionRate,
            redemptionRate,
          )

          const armDailyStateEntity = new ArmDailyState({
            id: currentDayId,
            chainId: ctx.chain.id,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            address: armAddress,
            assets0,
            assets1,
            outstandingAssets1,
            totalAssets,
            totalAssetsCap,
            totalSupply,
            redemptionRate,
            apr: armStateApr.apr,
            apy: armStateApr.apy,
            fees: feesAccrued,
          })
          states.push(armStateEntity)
          dailyStatesMap.set(currentDayId, armDailyStateEntity)
        })
        for (const block of ctx.blocks) {
          for (const log of block.logs) {
            if (redeemRequestedFilter.matches(log)) {
              const event = originLidoArmAbi.events.RedeemRequested.decode(log)
              const eventId = `${ctx.chain.id}:${armAddress}:${event.requestId}`
              const redemptionEntity = new ArmRedemption({
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
              const redemptionEntity = redemptionMap.get(eventId) ?? (await ctx.store.get(ArmRedemption, eventId))
              if (redemptionEntity) {
                redemptionEntity.claimed = true
                redemptionMap.set(eventId, redemptionEntity)
              }
            }
          }
        }
        await ctx.store.insert(states)
        await ctx.store.upsert([...dailyStatesMap.values()])
        await ctx.store.upsert([...redemptionMap.values()])
      },
    },
    // The ARM is an ERC20, so we can use the ERC20SimpleTracker to track holder balances
    createERC20SimpleTracker({
      from,
      address: armAddress,
    }),
  ]
}
