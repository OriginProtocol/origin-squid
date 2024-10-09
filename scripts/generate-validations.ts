import fs from 'fs'

import { addresses } from './../src/utils/addresses'
import { baseAddresses } from './../src/utils/addresses-base'

const gql = (query: string) => query

const executeQuery = async (query: string) => {
  const response = await fetch('https://origin.squids.live/origin-squid/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
  return response.json()
}

const isOfType = (type: { kind: string; ofType?: any }, kind: string): boolean => {
  return type.kind === kind || (type.ofType && isOfType(type.ofType, kind))
}

const takePortion = (arr: any[], percentage: number) => {
  if (percentage <= 0 || percentage > 1) {
    throw new Error('Percentage must be between 0 and 1')
  }

  const totalItems = Math.max(1, Math.floor(arr.length * percentage))
  const result: any[] = []

  if (totalItems === 1) {
    return [arr[Math.floor(arr.length / 2)]]
  }

  const step = arr.length / (totalItems - 1)

  for (let i = 0; i < totalItems; i++) {
    const index = Math.min(Math.floor(i * step), arr.length - 1)
    result.push(arr[index])
  }

  return result
}

const main = async () => {
  const result = await executeQuery(query)
  if (!result.data) {
    console.log(result)
    throw new Error('Query failed')
  }

  const data = result.data

  for (const key of Object.keys(data)) {
    data[key] = takePortion(data[key], 0.03) // Take 3% of the data spread evenly
  }
  fs.writeFileSync(__dirname + '/../src/validation/entities.json', JSON.stringify(result.data, null, 2))
}

const oTokens = (prefix: string, address: string) => {
  return gql(`
    ${prefix}_oTokens: oTokens(
      limit: 1000,
      orderBy: timestamp_ASC,
      where: { otoken_eq: "${address}" }
    ) {
      id
      timestamp
      blockNumber
      otoken
      chainId
      nonRebasingSupply
      rebasingSupply
      totalSupply
    }
  `)
}
const oTokenApies = (prefix: string, address: string) => {
  return gql(`
    ${prefix}_oTokenApies: oTokenApies(
      limit: 1000,
      orderBy: timestamp_ASC,
      where: { otoken_eq: "${address}" }
    ) {
      id
      timestamp
      blockNumber
      chainId
      otoken
      apr
      apy
      apy14DayAvg
      apy30DayAvg
      apy7DayAvg
      date
      rebasingCreditsPerToken
      txHash
    }
  `)
}
const oTokenHistories = (prefix: string, address: string) => {
  return gql(`
    ${prefix}_oTokenHistories: oTokenHistories(
      limit: 1000,
      orderBy: timestamp_ASC,
      where: { otoken_eq: "${address}" }
    ) {
      id
      timestamp
      blockNumber
      chainId
      balance
      otoken
      type
      txHash
      value
    }
  `)
}

const oTokenRebases = (prefix: string, address: string) => {
  return gql(`
    ${prefix}_oTokenRebases: oTokenRebases(
      limit: 1000,
      orderBy: timestamp_ASC,
      where: { otoken_eq: "${address}" }
    ) {
      id
      timestamp
      blockNumber
      chainId
      otoken
      fee
      feeETH
      feeUSD
      rebasingCredits
      rebasingCreditsPerToken
      totalSupply
      txHash
      yield
      yieldETH
      yieldUSD
    }
  `)
}

const oTokenVaults = (prefix: string, address: string) => {
  return gql(`
    ${prefix}_oTokenVaults: oTokenVaults(
      limit: 1000,
      orderBy: timestamp_ASC,
      where: { otoken_eq: "${address}" }
    ) {
      id
      timestamp
      blockNumber
      chainId
      otoken
      address
      totalValue
    }
  `)
}

const oTokenDailyStats = (prefix: string, address: string) => {
  return gql(`
    ${prefix}_oTokenDailyStats: oTokenDailyStats(
      limit: 1000,
      orderBy: timestamp_ASC,
      where: { otoken_eq: "${address}" }
    ) {
      id
      timestamp
      blockNumber
      chainId
      otoken
      totalSupply
      rebasingSupply
      nonRebasingSupply
      wrappedSupply
      amoSupply
      apr
      apy
      apy14
      apy30
      apy7
      cumulativeFees
      cumulativeYield
      dripperWETH
      fees
      rateETH
      rateUSD
      yield
      marketCapUSD
    }
  `)
}

const oToken = (otoken: string, address: string) =>
  gql(`
  ${oTokens(otoken, address)}
  ${oTokenApies(otoken, address)}
  ${oTokenHistories(otoken, address)}
  ${oTokenRebases(otoken, address)}
  ${oTokenVaults(otoken, address)}
  ${oTokenDailyStats(otoken, address)}
`)

const query = gql(`

query MegaQuery {
  ${oToken('oeth', addresses.oeth.address)}
  ${oToken('ousd', addresses.ousd.address)}
  ${oToken('superoethb', baseAddresses.superOETHb.address)}
}

`)

main()
