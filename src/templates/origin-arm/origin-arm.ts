import * as erc20Abi from '@abi/erc20'
import * as originLidoArmAbi from '@abi/origin-lido-arm'
import * as originLiquidityProviderControllerAbi from '@abi/origin-liquidity-provider-controller'
import { Arm, ArmState } from '@model'
import { Context, Processor } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'
import { logFilter } from '@utils/logFilter'

export const createOriginARMProcessor = ({
  name,
  from,
  armAddress,
  liquidityProviderControllerAddress,
}: {
  name: string
  from: number
  armAddress: string
  liquidityProviderControllerAddress: string
}): Processor => {
  const filter1 = logFilter({
    address: [armAddress],
    topic0: [],
  })
  const filter2 = logFilter({
    address: [liquidityProviderControllerAddress],
    topic0: [originLiquidityProviderControllerAbi.events.LiquidityProviderCap.topic],
  })
  const updater = blockFrequencyUpdater({ from })
  let armEntity: Arm
  return {
    name,
    from,
    setup: (p: EvmBatchProcessor) => {
      p.includeAllBlocks({ from })
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
      await updater(ctx, async (ctx, block) => {
        const armContract = new originLidoArmAbi.Contract(ctx, block.header, armAddress)
        const controllerContract = new originLiquidityProviderControllerAbi.Contract(
          ctx,
          block.header,
          liquidityProviderControllerAddress,
        )
        const [assets0, assets1, outstandingAssets1, totalAssets, totalSupply] = await Promise.all([
          new erc20Abi.Contract(ctx, block.header, armEntity.token0).balanceOf(armAddress),
          new erc20Abi.Contract(ctx, block.header, armEntity.token1).balanceOf(armAddress),
          armContract.outstandingEther(),
          armContract.totalAssets(),
          armContract.totalSupply(),
        ])
        const armStateEntity = new ArmState({
          id: `${ctx.chain.id}:${block.header.height}:${armAddress}`,
          chainId: ctx.chain.id,
          blockNumber: block.header.height,
          address: armAddress,
          assets0,
          assets1,
          outstandingAssets1,
          totalAssets,
          totalSupply,
        })
      })
    },
  }
}
