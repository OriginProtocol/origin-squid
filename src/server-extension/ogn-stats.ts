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

import * as Erc20ABI from '@abi/erc20.abi'
import { OGN_ADDRESS } from '@utils/addresses'

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
    // '0xe011fa2a6df98c69383457d87a056ed0103aa352', // foundation_reserve_old
    // '0xcaa5ef7abc36d5e5a3e4d7930dcff3226617a167', // team_distribution_old
    // '0x2eae0cae2323167abf78462e0c0686865c67a655', // team_distribution_old
    // '0x3da5045699802ea1fcc60130dedea67139c5b8c0', // investor_distribution_old
    // '0xfe730b3cf80ca7b31905f70241f7c786baf443e3', // investor_distribution_old
    // '0x1a34e5b97d684b124e32bd3b7dc82736c216976b', // distribution_staging_old
    // '0xbc0722eb6e8ba0217aeea5694fe4f214d2e53017', // partnerships
    // '0x2d00c3c132a0567bbbb45ffcfd8c6543e08ff626', // ecosystem_growth

    '0xbe2ab3d3d8f6a32b96414ebbd865dbd276d3d899', // foundation_reserve
    '0xa2cc2eae69cbf04a3d5660bc3e689b035324fc3f', // limitless_alpha
    '0x8ac3b96d118288427055ae7f62e407fC7c482F57', // brave_endeavors
    '0x12d7ef3c933d091210cd931224ead45d9cfddde0', // distribution_staging
    '0x494d8f7f0ceaA527A12367c242fF0ef8E24806Dc', // investor_distribution
    '0x82723DFDCd2F6391Bd5f62593f1f4A3f8e82aAb4', // team_distribution
    '0xcce8e784c777fb9435f89f4e45f8b7fc49f7669f', // story_staking
    '0x501804b374ef06fa9c427476147ac09f1551b9a0', // legacy_ogn_staking
    '0x95c347d6214614a780847b8aaf4f96eb84f4da6d', // ogv_migrator
    '0x63898b3b6ef3d39332082178656e9862bee45c57', // ogn_staking
    '0x000000000000000000000000000000000000dEaD', // burn_address
    '0x5c8228e709D7F91209DE898F6a7B8c6035A7B78f', // incentives
    '0x684b38997afbBBC055e0BEB6d536686Ebd171bdB', // ecosystem_development
    '0x6E75645EeDCCCAA0f472323Afce8f82B875C8CB9', // community_reserves
    '0xe555EFA16d38747F9e496926b576FD1ebD31DeCa', // future_contributors
    '0x69497A2A170c138876F05Df01bFfDd5C4b651CF2', // research_development
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
