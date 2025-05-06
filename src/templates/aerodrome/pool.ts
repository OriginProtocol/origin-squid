import * as aerodromePoolAbi from '@abi/aerodrome-pool'
import * as aerodromeVoterAbi from '@abi/aerodrome-voter'
import { AeroPoolEpochState, AeroPoolState } from '@model'
import { Processor, blockFrequencyUpdater } from '@originprotocol/squid-utils'
import { convertRate } from '@shared/post-processors/exchange-rates'
import { createAeroPoolEpoch } from '@templates/aerodrome/epoch'
import { getVoterTotalWeight } from '@templates/aerodrome/shared'
import { PoolDefinition, baseAddresses } from '@utils/addresses-base'

export const aerodromePool = (params: PoolDefinition): Processor => {
  const frequencyUpdater = blockFrequencyUpdater({ from: params.from, parallelProcessing: true })
  return {
    from: params.from,
    name: `Aerodrome Pool ${params.address}`,
    setup: (processor) => {
      processor.includeAllBlocks({ from: params.from })
    },
    process: async (ctx) => {
      const states: AeroPoolState[] = []
      const epochs: AeroPoolEpochState[] = []
      await frequencyUpdater(ctx, async (ctx, block) => {
        const poolContract = new aerodromePoolAbi.Contract(ctx, block.header, params.address)
        const voterContract = new aerodromeVoterAbi.Contract(ctx, block.header, baseAddresses.aerodrome.voter)

        const [liquidity, stakedLiquidity, reserves, totalVoteWeight, voteWeight, epochState] = await Promise.all([
          poolContract.totalSupply(),
          params.gauge ? poolContract.balanceOf(params.gauge.address) : Promise.resolve(0n),
          poolContract.getReserves(),
          getVoterTotalWeight(ctx, block),
          voterContract.weights(params.address),
          createAeroPoolEpoch(ctx, block, params.address),
        ])

        const [reserve0Usd, reserve1Usd] = await Promise.all([
          convertRate(ctx, block, params.assets[0].address, baseAddresses.tokens.USDC, reserves._reserve0),
          convertRate(ctx, block, params.assets[1].address, baseAddresses.tokens.USDC, reserves._reserve1),
        ])

        const votePercentage = (voteWeight * 10n ** 18n) / totalVoteWeight
        const state = new AeroPoolState({
          id: `${ctx.chain.id}-${params.address}-${block.header.height}`,
          chainId: ctx.chain.id,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          address: params.address,
          liquidity,
          stakedLiquidity,
          totalUsd: reserve0Usd + reserve1Usd,
          asset0: reserves._reserve0,
          asset1: reserves._reserve1,
          voteWeight,
          votePercentage,
        })
        states.push(state)

        if (epochState) {
          epochs.push(epochState)
        }
      })
      await Promise.all([ctx.store.insert(states), ctx.store.insert(epochs)])
    },
  }
}
