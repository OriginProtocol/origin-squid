import fs from 'fs'

import { addresses } from './../src/utils/addresses'
import { baseAddresses } from './../src/utils/addresses-base'

const LIMIT = 1000

const gql = (query: string) => query

const executeQuery = async (query: string) => {
  const response = await fetch('https://origin.squids.live/origin-squid/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch (err) {
    console.log(text)
    throw err
  }
}
const takePortion = (arr: any[], takeEvery: number) => {
  if (takeEvery <= 0) {
    throw new Error('takeEvery must be greater than 0')
  }

  return arr.filter((_, index) => index % takeEvery === 0)
}

const oTokens = (prefix: string, address: string) => {
  return gql(`
    ${prefix}_oTokens: oTokens(
      limit: ${LIMIT},
      orderBy: id_ASC,
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
      limit: ${LIMIT},
      orderBy: id_ASC,
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
      limit: ${LIMIT},
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
      limit: ${LIMIT},
      orderBy: id_ASC,
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
      limit: ${LIMIT},
      orderBy: id_ASC,
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
      limit: ${LIMIT},
      orderBy: id_ASC,
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

const oToken = (otoken: string, address: string) => [
  oTokens(otoken, address),
  oTokenApies(otoken, address),
  oTokenHistories(otoken, address),
  oTokenRebases(otoken, address),
  oTokenVaults(otoken, address),
  oTokenDailyStats(otoken, address),
]

const erc20Balances = (prefix: string, address: string) => {
  return gql(`
    ${prefix}_erc20Balances: erc20Balances(
      limit: ${LIMIT},
      orderBy: id_ASC,
      where: { address_eq: "${address}" }
    ) {
      id
      timestamp
      blockNumber
      chainId
      address
      account
      balance
    }
  `)
}

const main = async () => {
  const queries: string[] = [
    ...oToken('oeth', addresses.oeth.address),
    ...oToken('ousd', addresses.ousd.address),
    ...oToken('superoethb', baseAddresses.superOETHb.address),
    erc20Balances('ogn', '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26'),
    erc20Balances('ousd', '0x2a8e1e676ec238d8a992307b495b45b3feaa5e86'),
    erc20Balances('oeth', '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3'),
    erc20Balances('superoethb', '0xdbfefd2e8460a6ee4955a68582f85708baea60a3'),
  ].map((query) => `query Query { ${query} }`)

  console.log('Total queries:', queries.length)
  const entities = {} as Record<string, any[]>
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i]
    console.log(`Executing: \`${query.replace(/(\n|\s)+/g, ' ').slice(0, 80)}\`...`)
    const result = await executeQuery(query)
    if (!result.data) {
      console.log(result)
      throw new Error('Query failed')
    }
    for (const key of Object.keys(result.data)) {
      entities[key] = takePortion(result.data[key], 25)
    }
  }

  fs.writeFileSync(__dirname + '/../src/validation/entities.json', JSON.stringify(entities, null, 2))
}

main()
