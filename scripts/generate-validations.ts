import fs from 'fs'

import { oethStrategies } from '../src/oeth/processors/strategies'
import { ousdStrategies } from '../src/ousd/processors/strategies'
import { IStrategyData } from '../src/templates/strategy'
import { addresses } from '../src/utils/addresses'
import { baseAddresses } from '../src/utils/addresses-base'
import { retry } from '../src/utils/retry'

const LIMIT = 1000

const gql = (query: string) => query

const executeQuery = async (query: string) => {
  const response = await fetch('https://origin.squids.live/origin-squid@v66/api/graphql', {
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

const takeValidationEntries = (arr: any[]) => {
  return arr.filter((entry) => entry.blockNumber % 100000 === 0)
}

const takeEvery = (arr: any[], n: number = 25) => {
  return arr.filter((_, i) => i % n === 0)
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
      orderBy: id_ASC,
      where: { otoken_eq: "${address}" }
    ) {
      id
      timestamp
      blockNumber
      chainId
      balance
      otoken
      address { address }
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
      orderBy: [blockNumber_ASC, account_ASC],
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

const arm = (prefix: string, armAddress: string) => {
  return [
    gql(`
      ${prefix}_armStates: armStates(
        limit: ${LIMIT},
        orderBy: id_ASC,
        where: { address_eq: "${armAddress}" }
      ) {
        id
        chainId
        timestamp
        blockNumber
        address
        assets0
        assets1
        assetsPerShare
        outstandingAssets1
        totalAssets
        totalAssetsCap
        totalDeposits
        totalFees
        totalSupply
        totalWithdrawals
        totalYield
      }
    `),
    gql(`
      ${prefix}_armWithdrawalRequests: armWithdrawalRequests(
        limit: ${LIMIT},
        orderBy: id_ASC,
        where: { address_eq: "${armAddress}" }
      ) {
        id
        blockNumber
        timestamp
        address
        account
        amount
        chainId
        claimed
        queued
        requestId
        txHash
      }
    `),
    gql(`
      ${prefix}_armDailyStats: armDailyStats(
        limit: ${LIMIT},
        orderBy: id_ASC,
        where: { address_eq: "${armAddress}" }
      )  {
        id
        chainId
        blockNumber
        timestamp
        address
        apr
        apy
        assets0
        assets1
        assetsPerShare
        date
        fees
        outstandingAssets1
        rateUSD
        totalAssets
        totalAssetsCap
        totalSupply
        yield
      }
    `),
  ]
}

const ognDailyStats = () => {
  return gql(`
    ognDailyStats: ognDailyStats(
      limit: ${LIMIT},
      orderBy: id_ASC,
    ) {
      id
      blockNumber
      timestamp
      holdersOverThreshold
      totalStaked
    }
  `)
  // Due to coingecko dependency, we can't validate these fields.
  // totalSupplymarketCapUSD
  // priceUSD
  // totalSupplyUSD
  // tradingVolumeUSD
}

export const beaconDepositEvents = (address: string) => {
  return gql(`
    beaconDepositEvents: beaconDepositEvents(
      limit: ${LIMIT},
      orderBy: id_ASC,
      where: { address_eq: "${address}" }
    ) {
      id
      chainId
      index
      caller
      blockNumber
      amount
      address
      signature
      timestamp
      txHash
      withdrawalCredentials
      pubkey {
        id
      }
    }
  `)
}

export const transactionDetails = (prefix: string, from: string) => {
  return gql(`
    ${prefix}_transactionDetails: transactionDetails(
      limit: ${LIMIT},
      orderBy: id_ASC,
      where: { from_eq: "${from}" }
    ) {
      id
      chainId
      timestamp
      blockNumber
      txHash
      from
      to
      gasUsed
      effectiveGasPrice
      transactionFee
    }
  `)
}

const strategy = (prefix: string, strategies: string) => {
  return [
    gql(`
      strategyBalances_${prefix}: strategyBalances(
        limit: ${LIMIT},
        orderBy: id_ASC,
        where: { strategy_eq: "${strategies}" }
      ) {
        id
        blockNumber
        timestamp
        asset
        balance
        balanceETH
        chainId
        symbol
        strategy
      }
    `),
    gql(`
      strategyDailyYields_${prefix}: strategyDailyYields(
        limit: ${LIMIT},
        orderBy: id_ASC,
        where: { strategy_eq: "${strategies}" }
      ) {
        id
        timestamp
        blockNumber
        strategy
        apr
        apy
        asset
        balance
        balanceWeight
        earnings
        earningsChange
      }
    `),
  ]
}

const main = async () => {
  const queries: string[] = [
    ...oethStrategies.map((s: IStrategyData) => strategy(`oeth_${s.address}`, s.address)),
    ...ousdStrategies.map((s: IStrategyData) => strategy(`ousd_${s.address}`, s.address)),
    ...Object.values(baseAddresses.superOETHb.strategies).map((s: string) => strategy(`superoethb_${s}`, s)),
    ...oToken('oeth', addresses.oeth.address),
    ...oToken('ousd', addresses.ousd.address),
    ...oToken('superoethb', baseAddresses.superOETHb.address),
    erc20Balances('ogn', '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26'),
    erc20Balances('ousd', '0x2a8e1e676ec238d8a992307b495b45b3feaa5e86'),
    erc20Balances('oeth', '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3'),
    erc20Balances('superoethb', '0xdbfefd2e8460a6ee4955a68582f85708baea60a3'),
    ...arm('lidoarm', '0x85b78aca6deae198fbf201c82daf6ca21942acc6'),
    ognDailyStats(),
    beaconDepositEvents('0x00000000219ab540356cbb839cbe05303d7705fa'),
    transactionDetails('lidoarm', '0x39878253374355dbcc15c86458f084fb6f2d6de7'),
  ].map((query) => `query Query { ${query} }`)

  console.log('Total queries:', queries.length)
  const entities = {} as Record<string, any[]>
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i]
    console.log(`Executing: \`${query.replace(/(\n|\s)+/g, ' ').slice(0, 80)}\`...`)
    const result = await retry(() => executeQuery(query), 5)
    if (!result.data) {
      console.log(result)
      throw new Error('Query failed')
    }
    for (const key of Object.keys(result.data)) {
      entities[key] = takeValidationEntries(result.data[key])
      if (entities[key].length < 5) {
        entities[key] = takeEvery(result.data[key], 25)
      }
    }
  }

  fs.writeFileSync(__dirname + '/../src/validation/entities.json', JSON.stringify(entities, null, 2))
}

main()
