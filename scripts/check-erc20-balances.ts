import { config } from 'dotenv'
import { createPublicClient, erc20Abi, http } from 'viem'
import { sonic } from 'viem/chains'

import { ABI_JSON as otokenAbi } from '../src/abi/otoken.abi'
import { sonicAddresses } from '../src/utils/addresses-sonic'

config()

const gql = (query: string) => query

const executeQuery = async (query: string) => {
  const response = await fetch('https://origin.squids.live/origin-squid@v81/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
  const text = await response.text()
  if (response.status !== 200) {
    throw new Error(`Failed to fetch data: ${response.status}\n${text}`)
  }
  try {
    return JSON.parse(text)
  } catch (err) {
    console.log(text)
    throw err
  }
}

const erc20Balances = (address: string) => {
  return executeQuery(
    gql(`
      query GetBalances {
        erc20Balances(
          limit: 10000
          orderBy: [blockNumber_ASC, id_ASC]
          where: {
            chainId_eq: 1
            address_eq: "${address}"
            timestamp_gte: "2024-01-01T00:00:00Z"
          }
        ) {
          timestamp
          blockNumber
          account
          balance
        }
    }
  `),
  )
}

const erc20Holders = (address: string) => {
  return executeQuery(
    gql(`
      query GetHolders {
        erc20Holders(
          limit: 100000
          where: {
            address_eq: "${address}"
          }
        ) {
          account
          balance
        }
      }
    `),
  )
}

const otokenState = (address: string) => {
  return executeQuery(
    gql(`
      query GetOTokens {
        oTokens(
          limit: 1
          where: {
            otoken_eq: "${address}"
          }
          orderBy: blockNumber_DESC
        ) {
          nonRebasingSupply
          totalSupply
        }
      }
    `),
  )
}

const publicClient = createPublicClient({
  chain: sonic,
  transport: http(process.env.RPC_SONIC_MAINNET_HTTP!),
})

const main = async () => {
  const state = await otokenState(sonicAddresses.tokens.OS).then(
    (res) => res.data.oTokens[0] as { nonRebasingSupply: string; totalSupply: string },
  )
  console.log('\n--- Validating OToken State ---')

  // Get OToken state from the contract
  const otokenContract = {
    address: sonicAddresses.tokens.OS as `0x${string}`,
    abi: otokenAbi,
  }

  // Fetch key state variables from the contract
  const [totalSupply, nonRebasingSupply] = await Promise.all([
    publicClient.readContract({
      ...otokenContract,
      functionName: 'totalSupply',
    }),
    publicClient.readContract({
      ...otokenContract,
      functionName: 'nonRebasingSupply',
    }),
  ])

  const compare = (expected: bigint, actual: bigint) => {
    const diff = expected - actual
    const diffPercentage = (Number(diff) / Number(expected)) * 100
    console.log(`Difference: ${diff.toString()} (${diffPercentage.toFixed(6)}%)`)
  }
  console.log('Total Supply:', (totalSupply as bigint).toString())
  compare(totalSupply as bigint, BigInt(state.totalSupply))
  console.log('Non-Rebasing Supply:', (nonRebasingSupply as bigint).toString())
  compare(nonRebasingSupply as bigint, BigInt(state.nonRebasingSupply))

  console.log('\n--- Validating OToken Balances ---')
  const balanceEntities = await erc20Holders(sonicAddresses.tokens.OS).then(
    (res) => res.data.erc20Holders as { account: string; balance: string }[],
  )
  let total = 0
  let errors = 0
  let chainBalanceTotal = 0n
  let entityBalanceTotal = 0n

  // Prepare batch call to get balanceOf for all entity addresses
  const batchCalls = balanceEntities.map((entity) => ({
    address: sonicAddresses.tokens.OS as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [entity.account],
  }))

  console.log(`Preparing batch call for ${batchCalls.length} addresses...`)

  // Execute batch multicall
  const batchResults = await publicClient.multicall({
    contracts: batchCalls,
  })

  // Create a map of account to chain balance for quick lookup
  const chainBalanceMap = new Map<string, bigint>()

  batchResults.forEach((result, index) => {
    if (result.status === 'success') {
      chainBalanceMap.set(balanceEntities[index].account, result.result as bigint)
    } else {
      console.error(`Failed to get balance for ${balanceEntities[index].account}: ${result.error}`)
    }
  })
  for (const entity of balanceEntities) {
    const chainBalance = chainBalanceMap.get(entity.account)
    if (!chainBalance) {
      console.error(`Failed to get balance for ${entity.account}`)
      errors++
      continue
    }
    if (chainBalance.toString() !== entity.balance) {
      console.log('Invalid Balance: ', entity.account, chainBalance.toString(), entity.balance)
      errors++
    }
    total++
    chainBalanceTotal += chainBalance
    entityBalanceTotal += BigInt(entity.balance)
  }
  console.log('Chain Balance Total', chainBalanceTotal)
  console.log('Entity Balance Total', entityBalanceTotal)
  console.log(
    `Total: ${total}, Errors: ${errors}, Total Balance Accuracy: ${(
      (Number(chainBalanceTotal) / Number(entityBalanceTotal)) *
      100
    ).toFixed(6)}%`,
  )
}

main()
