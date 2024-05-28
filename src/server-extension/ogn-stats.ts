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
    '0xbe2ab3d3d8f6a32b96414ebbd865dbd276d3d899', // Treasury
    '0xa2cc2eae69cbf04a3d5660bc3e689b035324fc3f', // Custodian #1
    '0x8ac3b96d118288427055ae7f62e407fC7c482F57', // Custodian #2
    '0x12d7ef3c933d091210cd931224ead45d9cfddde0', // Distribution Staging
    '0x494d8f7f0ceaA527A12367c242fF0ef8E24806Dc', // Investor Distribution (New 2024)
    '0x82723DFDCd2F6391Bd5f62593f1f4A3f8e82aAb4', // Team Distribution (New 2024)
    '0xcce8e784c777fb9435f89f4e45f8b7fc49f7669f', // Story Staking
    '0x501804b374ef06fa9c427476147ac09f1551b9a0', // Legacy Staking
    '0x95c347d6214614a780847b8aaf4f96eb84f4da6d', // OGV Migration
    '0x63898b3b6ef3d39332082178656e9862bee45c57', // OGN Staking
    '0x000000000000000000000000000000000000dEaD', // Alternate Burn Address
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
