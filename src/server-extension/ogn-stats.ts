import { GraphQLResolveInfo } from 'graphql'
import { Field, Info, ObjectType, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { createPublicClient, fallback, formatEther, getContract, http } from 'viem'
import { mainnet } from 'viem/chains'

import * as Erc20ABI from '@abi/erc20.abi'
import { chainConfigs } from '@originprotocol/squid-utils'
import { OGN_ADDRESS } from '@utils/addresses'
import { getOGNCirculatingSupply } from '@utils/circulating-supply'

import './fetch-polyfill'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: fallback(chainConfigs[mainnet.id].endpoints.map((url) => http(url))),
})

const ogn = getContract({
  address: OGN_ADDRESS,
  abi: Erc20ABI.ABI_JSON,
  client: publicClient,
})

@ObjectType()
export class OGNStatsResult {
  @Field(() => Number, { nullable: false })
  circulatingSupply!: number

  @Field(() => Number, { nullable: false })
  totalSupply!: number

  constructor(props: Partial<OGNStatsResult>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class OGNStatsResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => OGNStatsResult)
  async ognStats(@Info() info: GraphQLResolveInfo): Promise<OGNStatsResult> {
    const result = new OGNStatsResult({})
    const fields = info.fieldNodes[0].selectionSet?.selections.map((selection) => (selection as any).name.value)

    // Only fetch the fields that are requested
    if (fields?.includes('circulatingSupply')) {
      result.circulatingSupply = await getOGNCirculatingSupply().catch((err) => {
        console.error(err)
        return 0
      })
    }
    if (fields?.includes('totalSupply')) {
      result.totalSupply = await getTotalSupply().catch((err) => {
        console.error(err)
        return 0
      })
    }

    return result
  }
}


async function getTotalSupply(): Promise<number> {
  const totalSupply = (await ogn.read.totalSupply()) as bigint
  return Number(formatEther(totalSupply))
}
