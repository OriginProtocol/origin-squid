import fs from 'fs'

import { retry } from '@originprotocol/squid-utils'

import { oethStrategies } from '../src/oeth/processors/strategies'
import { ousdStrategies } from '../src/ousd/processors/strategies'
import { IStrategyData } from '../src/templates/strategy'
import { addresses } from '../src/utils/addresses'
import { baseAddresses } from '../src/utils/addresses-base'
import { sonicAddresses } from '../src/utils/addresses-sonic'

const LIMIT = 1000

const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)

const gql = (query: string) => query

const executeQuery = async (query: string) => {
  const response = await fetch(`https://origin.squids.live/origin-squid@${process.argv[2]}/api/graphql`, {
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
      orderBy: [blockNumber_ASC, id_ASC],
      where: { otoken_eq: "${address}", timestamp_lte: "${twoDaysAgo.toISOString()}", timestamp_gte: "2022-01-01T00:00:00Z" }
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
      orderBy: [blockNumber_ASC, id_ASC],
      where: { otoken_eq: "${address}", timestamp_lte: "${twoDaysAgo.toISOString()}", timestamp_gte: "2022-01-01T00:00:00Z" }
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
      orderBy: [blockNumber_ASC, id_ASC],
      where: { otoken_eq: "${address}", timestamp_lte: "${twoDaysAgo.toISOString()}", timestamp_gte: "2022-01-01T00:00:00Z" }
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
      orderBy: [blockNumber_ASC, id_ASC],
      where: { otoken_eq: "${address}", timestamp_lte: "${twoDaysAgo.toISOString()}", timestamp_gte: "2022-01-01T00:00:00Z" }
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
      orderBy: [blockNumber_ASC, id_ASC],
      where: { otoken_eq: "${address}", timestamp_lte: "${twoDaysAgo.toISOString()}", timestamp_gte: "2022-01-01T00:00:00Z" }
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
      orderBy: [blockNumber_ASC, id_ASC],
      where: { otoken_eq: "${address}", timestamp_lte: "${twoDaysAgo.toISOString()}", timestamp_gte: "2022-01-01T00:00:00Z" }
    ) {
      id
      timestamp
      blockNumber
      chainId
      otoken
      date
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
      rateNative
      yield
      marketCapUSD
      accountsOverThreshold
      rateWrapped
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
      orderBy: [blockNumber_ASC, id_ASC],
      where: { address_eq: "${address}", timestamp_lte: "${twoDaysAgo.toISOString()}", timestamp_gte: "2022-01-01T00:00:00Z" }
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
        orderBy: [blockNumber_ASC, id_ASC],
        where: { address_eq: "${armAddress}", timestamp_lte: "${twoDaysAgo.toISOString()}" }
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
        orderBy: [blockNumber_ASC, id_ASC],
        where: { address_eq: "${armAddress}", timestamp_lte: "${twoDaysAgo.toISOString()}", timestamp_gte: "2022-01-01T00:00:00Z" }
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
        orderBy: [blockNumber_ASC, id_ASC],
        where: { address_eq: "${armAddress}", timestamp_lte: "${twoDaysAgo.toISOString()}", timestamp_gte: "2022-01-01T00:00:00Z" }
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
        rateNative
      }
    `),
  ]
}

const ognDailyStats = () => {
  return gql(`
    ognDailyStats: ognDailyStats(
      limit: ${LIMIT},
      orderBy: [blockNumber_ASC, id_ASC],
      where: { timestamp_lte: "${twoDaysAgo.toISOString()}", timestamp_gte: "2022-01-01T00:00:00Z" }
    ) {
      id
      blockNumber
      timestamp
      totalStaked
    }
  `)
  // Due to issue we don't validate:
  // - holdersOverThreshold
  // Due to coingecko dependency, we can't validate these fields.
  // - totalSupplymarketCapUSD
  // - priceUSD
  // - totalSupplyUSD
  // - tradingVolumeUSD
}

export const beaconDepositEvents = (address: string) => {
  return gql(`
    beaconDepositEvents: beaconDepositEvents(
      limit: ${LIMIT},
      orderBy: [blockNumber_ASC, id_ASC],
      where: { address_eq: "${address}", timestamp_lte: "${twoDaysAgo.toISOString()}", timestamp_gte: "2022-01-01T00:00:00Z" }
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
      orderBy: [blockNumber_ASC, id_ASC],
      where: { from_eq: "${from}", timestamp_lte: "${twoDaysAgo.toISOString()}", timestamp_gte: "2022-01-01T00:00:00Z" }
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
        orderBy: [blockNumber_ASC, id_ASC],
        where: { strategy_eq: "${strategies}", timestamp_lte: "${twoDaysAgo.toISOString()}", timestamp_gte: "2022-01-01T00:00:00Z" }
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
        orderBy: [blockNumber_ASC, id_ASC],
        where: { strategy_eq: "${strategies}", timestamp_lte: "${twoDaysAgo.toISOString()}", timestamp_gte: "2022-01-01T00:00:00Z" }
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

const bridging = () => {
  return [
    gql(`
    bridgeTransfers(
      limit: ${LIMIT},
      orderBy: [blockNumber_ASC, id_ASC],
    ) {
      amountIn
      amountOut
      bridge
      blockNumber
      chainIn
      chainOut
      id
      messageId
      receiver
      sender
      state
      timestamp
      tokenIn
      tokenOut
      transactor
      txHashIn
      txHashOut
      }
    `),
    gql(`
      bridgeTransferStates: bridgeTransferStates(
        limit: ${LIMIT},
      orderBy: [blockNumber_ASC, id_ASC],
      ) {  
        blockNumber
        id
        state
        timestamp
        txHash
      }
    `),
  ]
}

const aeroPoolEpochStates = () => {
  return gql(`
      aeroPoolEpochStates(where: {address_eq: "0x6446021f4e396da3df4235c62537431372195d38"}, limit: 50, orderBy: blockNumber_ASC) {
        address
        blockNumber
        bribes {
          amount
          token
        }
        chainId
        emissions
        epoch
        fees {
          amount
          token
        }
        id
        timestamp
        votes
      }
  `)
}

const protocolDailyStats = () => {
  return gql(`
    protocolDailyStats: protocolDailyStats(
      limit: ${LIMIT},
      orderBy: [timestamp_ASC, id_ASC],
      where: { timestamp_lte: "${twoDaysAgo.toISOString()}", timestamp_gte: "2022-01-01T00:00:00Z" }
    ) {
      id
      date
      timestamp
      rateUSD
      earningTvl
      tvl
      yield
      revenue
      apy
      meta
    }
  `)
}

const protocolDailyStatDetails = () => {
  return gql(`
    protocolDailyStatDetails: protocolDailyStatDetails(
      limit: ${LIMIT},
      orderBy: [timestamp_ASC, id_ASC],
      where: { timestamp_lte: "${twoDaysAgo.toISOString()}", timestamp_gte: "2022-01-01T00:00:00Z" }
    ) {
      id
      date
      product
      timestamp
      rateUSD
      earningTvl
      tvl
      yield
      revenue
      apy
      inheritedTvl
      inheritedYield
      inheritedRevenue
      bridgedTvl
    }
  `)
}

const main = async () => {
  console.log(`Generating validations for: ${process.argv[2]}`)
  const queries: string[] = [
    ...oethStrategies.map((s: IStrategyData) => strategy(`oeth_${s.address}`, s.address)),
    ...ousdStrategies.map((s: IStrategyData) => strategy(`ousd_${s.address}`, s.address)),
    ...Object.values(baseAddresses.superOETHb.strategies).map((s: string) => strategy(`superoethb_${s}`, s)),
    ...oToken('oeth', addresses.oeth.address),
    ...oToken('ousd', addresses.ousd.address),
    ...oToken('superoethb', baseAddresses.superOETHb.address),
    ...oToken('os', sonicAddresses.tokens.OS),
    erc20Balances('ogn', '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26'),
    erc20Balances('ousd', '0x2a8e1e676ec238d8a992307b495b45b3feaa5e86'),
    erc20Balances('oeth', '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3'),
    erc20Balances('superoethb', '0xdbfefd2e8460a6ee4955a68582f85708baea60a3'),
    erc20Balances('os', sonicAddresses.tokens.OS),
    ...arm('lidoarm', '0x85b78aca6deae198fbf201c82daf6ca21942acc6'),
    ognDailyStats(),
    beaconDepositEvents('0x00000000219ab540356cbb839cbe05303d7705fa'),
    transactionDetails('lidoarm', '0x39878253374355dbcc15c86458f084fb6f2d6de7'),
    ...bridging(),
    aeroPoolEpochStates(),
    protocolDailyStatDetails(),
    protocolDailyStats(),
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
        entities[key] = takeEvery(result.data[key], 50)
      }
    }
  }

  fs.writeFileSync(__dirname + '/../src/validation/entities.json', JSON.stringify(entities, null, 2))
}

main()
