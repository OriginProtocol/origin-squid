import * as Erc20ABI from '@abi/erc20.abi'
import { OGN_ADDRESS } from '@utils/addresses'
import { GraphQLResolveInfo } from 'graphql'
import 'reflect-metadata'
import { Field, Info, ObjectType, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import {
  createPublicClient,
  fallback,
  formatEther,
  getContract,
  http,
  parseAbi,
} from 'viem'
import { mainnet } from 'viem/chains'

import './fetch-polyfill'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: fallback([
    http(process.env.RPC_ENDPOINT),
    http(process.env.RPC_BACKUP),
  ]),
})

const ogn = getContract({
  address: OGN_ADDRESS,
  abi: Erc20ABI.ABI_JSON,
  publicClient,
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
    const fields = info.fieldNodes[0].selectionSet?.selections.map(
      (selection) => (selection as any).name.value,
    )

    // Only fetch the fields that are requested
    if (fields?.includes('circulatingSupply')) {
      result.circulatingSupply = await getCirculatingSupply()
    }
    if (fields?.includes('totalSupply')) {
      result.totalSupply = await getTotalSupply()
    }

    return result
  }
}

async function getCirculatingSupply(): Promise<number> {
  const excludeBalance = [
    '0xe011fa2a6df98c69383457d87a056ed0103aa352', // foundation_reserve
    '0xbe2ab3d3d8f6a32b96414ebbd865dbd276d3d899', // new_foundation_reserve
    '0xcaa5ef7abc36d5e5a3e4d7930dcff3226617a167', // team_dist
    '0x2eae0cae2323167abf78462e0c0686865c67a655', // new_team_dist
    '0x3da5045699802ea1fcc60130dedea67139c5b8c0', // investor_dist
    '0xfe730b3cf80ca7b31905f70241f7c786baf443e3', // new_investor_dist
    '0x1a34e5b97d684b124e32bd3b7dc82736c216976b', // dist_staging
    '0x12d7ef3c933d091210cd931224ead45d9cfddde0', // new_dist_staging
    '0xbc0722eb6e8ba0217aeea5694fe4f214d2e53017', // partnerships
    '0x2d00c3c132a0567bbbb45ffcfd8c6543e08ff626', // ecosystem_growth
    '0x8ac3b96d118288427055ae7f62e407fc7c482f57', // brave_endeavors
    '0xa2cc2eae69cbf04a3d5660bc3e689b035324fc3f', // limitless_alpha
  ]

  const abi = parseAbi([
    'function balanceOf(address owner) view returns (uint256)',
    'function totalSupply() view returns (uint256)',
  ])

  const contractCalls = [
    { address: OGN_ADDRESS, abi, functionName: 'totalSupply' },
    ...excludeBalance.map((addr) => ({
      address: OGN_ADDRESS,
      abi,
      functionName: 'balanceOf',
      args: [addr],
    })),
  ] as never

  const balances = await publicClient.multicall({ contracts: contractCalls })

  const circulatingSupply = balances.slice(1).reduce((m, o) => {
    if (o.status !== 'success') return m
    return (m -= o.result as bigint)
  }, balances[0].result as bigint)

  return Number(formatEther(circulatingSupply))
}

async function getTotalSupply(): Promise<number> {
  const totalSupply = (await ogn.read.totalSupply()) as bigint
  return Number(formatEther(totalSupply))
}
