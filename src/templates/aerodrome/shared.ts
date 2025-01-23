import * as aerodromeVoterAbi from '@abi/aerodrome-voter'
import { Block, Context, useProcessorState } from '@originprotocol/squid-utils'
import { baseAddresses } from '@utils/addresses-base'

export const getVoterTotalWeight = async (ctx: Context, block: Block) => {
  const [totalWeight, setTotalWeight] = useProcessorState<bigint | undefined>(ctx, 'aerodrome-totalWeight')
  if (totalWeight) return totalWeight
  const voterContract = new aerodromeVoterAbi.Contract(ctx, block.header, baseAddresses.aerodrome.voter)
  const retrievedTotalWeight = await voterContract.totalWeight()
  setTotalWeight(retrievedTotalWeight)
  return retrievedTotalWeight
}
