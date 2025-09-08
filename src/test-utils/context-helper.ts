import { EntityManager } from 'typeorm'
import sinon from 'sinon'

import {
  ArmDailyStat,
  OTokenDailyStat,
  ProcessingStatus,
  ProtocolDailyStat,
  ProtocolDailyStatDetail,
  StrategyBalance,
} from '@model'
import { Context } from '@originprotocol/squid-utils'
import { OETH_ADDRESS } from '@utils/addresses'

export interface MockStore {
  findOne: sinon.SinonStub
  find: sinon.SinonStub
  findBy: sinon.SinonStub
  upsert: sinon.SinonStub
  save: sinon.SinonStub
  insert: sinon.SinonStub
  update: sinon.SinonStub
  delete: sinon.SinonStub
}

export const createMockStore = (): MockStore => {
  return {
    findOne: sinon.stub(),
    find: sinon.stub(),
    findBy: sinon.stub(),
    upsert: sinon.stub(),
    save: sinon.stub(),
    insert: sinon.stub(),
    update: sinon.stub(),
    delete: sinon.stub(),
  }
}

export const createMockContext = (overrides: Partial<Context> = {}): Context => {
  const mockStore = createMockStore()
  
  return {
    store: mockStore,
    block: {
      height: 18000000,
      hash: '0x123',
      timestamp: new Date('2023-10-01'),
      parentHash: '0x456',
    },
    blocks: [],
    isHead: true,
    finalityConfirmation: 75,
    ...overrides,
  } as Context
}

export const createMockOTokenDailyStat = (overrides: Partial<OTokenDailyStat> = {}): OTokenDailyStat => {
  return {
    id: '2023-10-01-OETH',
    date: '2023-10-01',
    otoken: OETH_ADDRESS,
    timestamp: new Date('2023-10-01T23:59:59Z'),
    blockNumber: 18000000,
    rateETH: BigInt(10 ** 18), // 1:1 rate
    rateUSD: BigInt(1800 * 10 ** 18), // $1800 ETH
    totalSupply: BigInt(100000 * 10 ** 18), // 100k tokens
    rebasingSupply: BigInt(90000 * 10 ** 18), // 90k rebasing
    nonRebasingSupply: BigInt(10000 * 10 ** 18), // 10k non-rebasing
    amoSupply: BigInt(0),
    yield: BigInt(100 * 10 ** 18), // 100 ETH yield
    fees: BigInt(10 * 10 ** 18), // 10 ETH fees
    apy: 0.05, // 5% APY
    ...overrides,
  } as OTokenDailyStat
}

export const createMockStrategyBalance = (overrides: Partial<StrategyBalance> = {}): StrategyBalance => {
  return {
    id: 'strategy-balance-1',
    timestamp: new Date('2023-10-01T12:00:00Z'),
    blockNumber: 18000000,
    strategy: '0x123',
    asset: '0x456',
    balanceETH: BigInt(1000 * 10 ** 18), // 1000 ETH
    balance: BigInt(1000 * 10 ** 18),
    ...overrides,
  } as StrategyBalance
}

export const createMockProtocolDailyStatDetail = (overrides: Partial<ProtocolDailyStatDetail> = {}): ProtocolDailyStatDetail => {
  return {
    id: '2023-10-01-OETH',
    date: '2023-10-01',
    product: 'OETH',
    timestamp: new Date('2023-10-01T23:59:59Z'),
    rateUSD: BigInt(1800 * 10 ** 18),
    earningTvl: BigInt(90000 * 10 ** 18),
    tvl: BigInt(100000 * 10 ** 18),
    yield: BigInt(110 * 10 ** 18),
    revenue: BigInt(10 * 10 ** 18),
    apy: 0.05,
    inheritedTvl: BigInt(0),
    inheritedYield: BigInt(0),
    inheritedRevenue: BigInt(0),
    bridgedTvl: BigInt(0),
    supply: BigInt(100000 * 10 ** 18),
    ...overrides,
  } as ProtocolDailyStatDetail
}

export const createMockProcessingStatus = (overrides: Partial<ProcessingStatus> = {}): ProcessingStatus => {
  return {
    id: 'oeth',
    timestamp: new Date('2023-10-01T23:59:59Z'),
    blockNumber: 18000000,
    startTimestamp: new Date('2023-10-01T00:00:00Z'),
    ...overrides,
  } as ProcessingStatus
}

// Helper to setup common mock responses
export const setupMockStore = (ctx: Context, data: {
  otokenDailyStats?: OTokenDailyStat[]
  strategyBalances?: StrategyBalance[]
  protocolDailyStatDetails?: ProtocolDailyStatDetail[]
  processingStatuses?: ProcessingStatus[]
}) => {
  const mockStore = ctx.store as unknown as MockStore
  // Setup findOne responses
  mockStore.findOne.callsFake((entity: any, options: any) => {
    if (entity === OTokenDailyStat) {
      return data.otokenDailyStats?.find(stat => 
        stat.date === options.where?.date && stat.otoken === options.where?.otoken
      ) || null
    }
    
    if (entity === StrategyBalance) {
      // Handle LessThanOrEqual queries for strategy balances
      if (options.where?.timestamp && typeof options.where.timestamp === 'object') {
        return data.strategyBalances?.find(balance => 
          balance.strategy === options.where.strategy &&
          balance.timestamp <= options.where.timestamp.value
        ) || null
      }
      return data.strategyBalances?.find(balance => 
        balance.strategy === options.where?.strategy
      ) || null
    }
    
    if (entity === ProtocolDailyStatDetail) {
      if (options.where?.date && options.where?.product) {
        // Query for specific date and product
        const result = data.protocolDailyStatDetails?.find(detail => 
          detail.date === options.where.date && detail.product === options.where.product
        ) || null
        return result
      } else if (options.where?.product && options.order?.date === 'desc') {
        // Query for latest by product (getLatestProtocolDailyStatDetail)
        const matches = data.protocolDailyStatDetails?.filter(detail => 
          detail.product === options.where.product
        ) || []
        const result = matches.sort((a, b) => b.date.localeCompare(a.date))[0] || null
        return result
      }
      return null
    }
    
    if (entity === ProcessingStatus) {
      const result = data.processingStatuses?.find(status => 
        status.id === options.where?.id
      ) || null
      return result
    }
    
    return null
  })
  
  // Setup find responses
  mockStore.find.callsFake((entity: any, options: any) => {
    if (entity === OTokenDailyStat && options.where?.date?._type === 'in') {
      const dates = options.where.date._value
      const result = data.otokenDailyStats?.filter(stat => 
        dates.includes(stat.date) && stat.otoken === options.where.otoken
      ) || []
      return result
    }
    
    if (entity === ProtocolDailyStatDetail && options.where?.date?.constructor.name === 'In') {
      const dates = options.where.date.value
      return data.protocolDailyStatDetails?.filter(detail => 
        dates.includes(detail.date)
      ) || []
    }
    
    return []
  })
  
  // Setup findBy responses
  mockStore.findBy.callsFake((entity: any, options: any) => {
    if (entity === ProtocolDailyStatDetail && options.date?.constructor.name === 'In') {
      const dates = options.date.value
      return data.protocolDailyStatDetails?.filter(detail => 
        dates.includes(detail.date)
      ) || []
    }
    
    return []
  })
  
  // Setup upsert to just return the input
  mockStore.upsert.resolves()
}