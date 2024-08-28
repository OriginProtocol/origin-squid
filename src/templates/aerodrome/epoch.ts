import * as aerodromeLPSugarAbi from '@abi/aerodrome-lp-sugar-v3'
import { AeroPoolEpochState, TokenAmount } from '@model'
import { Block, Context } from '@processor'
import { baseAddresses } from '@utils/addresses-base'

const sugarDeployBlock = 16962730

export const createAeroPoolEpoch = async (ctx: Context, block: Block, address: string) => {
  if (block.header.height < sugarDeployBlock) return undefined
  const sugar = new aerodromeLPSugarAbi.Contract(ctx, block.header, baseAddresses.aerodrome.sugarLPV3)
  const epochData = await sugar.epochsByAddress(1, 0, address).then((r) => r[0])
  if (epochData) {
    return new AeroPoolEpochState({
      id: `${ctx.chain.id}-${address}-${block.header.height}`,
      chainId: ctx.chain.id,
      blockNumber: block.header.height,
      timestamp: new Date(block.header.timestamp),
      address,
      epoch: epochData.ts,
      votes: epochData.votes,
      emissions: epochData.emissions,
      fees: epochData.fees.map((amount) => new TokenAmount(amount)),
      bribes: epochData.bribes.map((amount) => new TokenAmount(amount)),
    })
  }
  return undefined
}
