import { createPublicClient, fallback, formatEther, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

import { chainConfigs } from '@originprotocol/squid-utils'
import { OGN_ADDRESS } from '@utils/addresses'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: fallback(chainConfigs[mainnet.id].endpoints.map((url) => http(url))),
})

const abi = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
])

// Addresses to exclude from OGN circulating supply calculations
const OGN_EXCLUDE_ADDRESSES = [
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

export async function getOGNCirculatingSupply(blockNumber?: number | bigint): Promise<number> {
  const contractCalls = [
    { address: OGN_ADDRESS, abi, functionName: 'totalSupply' },
    ...OGN_EXCLUDE_ADDRESSES.map((addr) => ({
      address: OGN_ADDRESS,
      abi,
      functionName: 'balanceOf',
      args: [addr],
    })),
  ] as never

  const balances = await publicClient.multicall<{ result: bigint }[]>({ 
    contracts: contractCalls,
    blockNumber: blockNumber ? BigInt(blockNumber) : undefined
  })

  const circulatingSupply = balances.slice(1).reduce((m, o) => {
    if (o.status !== 'success') return m
    return (m -= o.result as bigint)
  }, balances[0].result as bigint)

  return Number(formatEther(circulatingSupply))
}