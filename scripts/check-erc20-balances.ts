import { config } from 'dotenv'
import { createPublicClient, erc20Abi, http } from 'viem'
import { mainnet } from 'viem/chains'

config()

const gql = (query: string) => query

const executeQuery = async (query: string) => {
  const response = await fetch('https://origin.squids.live/origin-squid:prod/api/graphql', {
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
          limit: 10000
          where: {
            chainId_eq: 1
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

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.RPC_ENDPOINT!),
})

const main = async () => {
  const ousdAddress = '0x2a8e1e676ec238d8a992307b495b45b3feaa5e86'
  const balanceEntities = await erc20Balances(ousdAddress).then((res) => {
    console.log(res)
    return res.data.erc20Balances
  })
  let total = 0
  let errors = 0
  let chainBalanceTotal = 0n
  let entityBalanceTotal = 0n
  for (const entity of balanceEntities) {
    const chainBalance = await publicClient.readContract({
      address: ousdAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [entity.account],
      blockNumber: entity.blockNumber,
    })
    if (chainBalance.toString() !== entity.balance) {
      console.log(entity.blockNumber, entity.account, chainBalance.toString(), entity.balance)
      errors++
    }
    total++
    chainBalanceTotal += chainBalance
    entityBalanceTotal += BigInt(entity.balance)
  }
  console.log('Chain Balance Total', chainBalanceTotal)
  console.log('Entity Balance Total', entityBalanceTotal)
  console.log(
    `Total: ${total}, Errors: ${errors}, Total Balance Off: ${(
      (Number(chainBalanceTotal) / Number(entityBalanceTotal)) *
      100
    ).toFixed(6)}%`,
  )
}

main()
