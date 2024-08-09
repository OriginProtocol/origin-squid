import * as aerodromeVoterAbi from '@abi/aerodrome-voter'
import { Block, Context } from '@processor'
import { baseAddresses } from '@utils/addresses-base'
import { useProcessorState } from '@utils/state'

export const getVoterTotalWeight = async (ctx: Context, block: Block) => {
  const [totalWeight, setTotalWeight] = useProcessorState<bigint | undefined>(ctx, 'aerodrome-totalWeight')
  if (totalWeight) return totalWeight
  const voterContract = new aerodromeVoterAbi.Contract(ctx, block.header, baseAddresses.aerodromeVoter)
  const retrievedTotalWeight = await voterContract.totalWeight()
  setTotalWeight(retrievedTotalWeight)
  return retrievedTotalWeight
}
