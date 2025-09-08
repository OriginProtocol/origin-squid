import { expect } from 'chai'
import { describe, it, beforeEach, afterEach } from 'mocha'
import sinon from 'sinon'

import { OETH_ADDRESS } from '@utils/addresses'
import { baseAddresses } from '@utils/addresses-base'
import { plumeAddresses } from '@utils/addresses-plume'
import {
  createMockContext,
  createMockOTokenDailyStat,
  createMockProtocolDailyStatDetail,
  createMockProcessingStatus,
  createMockStrategyBalance,
  setupMockStore,
} from '@test-utils/context-helper'
import { Context } from '@originprotocol/squid-utils'

import * as exchangeRates from '@shared/post-processors/exchange-rates/exchange-rates'
import { protocolProcessor } from './protocol'

describe('Protocol Processor', () => {
  let ctx: Context
  let getLatestExchangeRateForDateStub: sinon.SinonStub

  beforeEach(() => {
    ctx = createMockContext()
    
    // Mock the exchange rate function
    getLatestExchangeRateForDateStub = sinon.stub(exchangeRates, 'getLatestExchangeRateForDate')
    getLatestExchangeRateForDateStub.resolves({ rate: BigInt(1800 * 10 ** 8) }) // $1800 in 8 decimals
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('Basic processing', () => {
    it('should process OETH without super token dependencies', async () => {
      const testDate = '2023-10-01'
      const oethDailyStat = createMockOTokenDailyStat({
        id: `${testDate}-OETH`,
        date: testDate,
        otoken: OETH_ADDRESS,
        totalSupply: BigInt(100000 * 10 ** 18),
        rebasingSupply: BigInt(90000 * 10 ** 18),
        yield: BigInt(100 * 10 ** 18),
        fees: BigInt(10 * 10 ** 18),
      })

      // Don't create any previous details - let the processor start from startDate
      // but only provide daily stats for the target date to create a simple test scenario

      const processingStatuses = [
        createMockProcessingStatus({ id: 'oeth', timestamp: new Date(`${testDate}T23:59:59Z`) }),
        createMockProcessingStatus({ id: 'ousd', timestamp: new Date(`${testDate}T23:59:59Z`) }),
        createMockProcessingStatus({ id: 'sonic', timestamp: new Date(`${testDate}T23:59:59Z`) }),
        createMockProcessingStatus({ id: 'oethb', timestamp: new Date(`${testDate}T23:59:59Z`) }),
        createMockProcessingStatus({ id: 'plume', timestamp: new Date(`${testDate}T23:59:59Z`) }),
        createMockProcessingStatus({ id: 'mainnet', timestamp: new Date(`${testDate}T23:59:59Z`) }),
      ]

      setupMockStore(ctx, {
        otokenDailyStats: [oethDailyStat], // Only OETH has daily stats
        processingStatuses,
        strategyBalances: [], // No strategy balances
        protocolDailyStatDetails: [], // No previous records - clean start
      })

      await protocolProcessor.process(ctx)

      // Verify OETH detail was created  
      const mockStore = ctx.store as any
      const upsertCalls = mockStore.upsert.getCalls()
      
      // Debug the upsert calls
      console.log('Upsert calls:', upsertCalls.length)
      upsertCalls.forEach((call: any, i: number) => {
        console.log(`Call ${i}:`, call.args[0].map((item: any) => ({ 
          product: item.product, 
          constructor: item.constructor.name,
          id: item.id 
        })))
      })
      
      expect(upsertCalls).to.have.length.greaterThan(0)
      
      const detailsCall = upsertCalls.find((call: any) => 
        Array.isArray(call.args[0]) && call.args[0].some((item: any) => item.product === 'OETH')
      )
      expect(detailsCall).to.not.be.undefined
      
      const oethDetail = detailsCall!.args[0].find((item: any) => item.product === 'OETH')
      expect(oethDetail.inheritedTvl).to.equal(BigInt(0)) // No super token balances
      expect(oethDetail.inheritedYield).to.equal(BigInt(0))
      expect(oethDetail.inheritedRevenue).to.equal(BigInt(0))
    })

    it('should calculate OETH inherited TVL from super token strategy balances', async () => {
      const oethDailyStat = createMockOTokenDailyStat({
        id: '2023-10-01-OETH',
        date: '2023-10-01',
        otoken: OETH_ADDRESS,
        totalSupply: BigInt(100000 * 10 ** 18),
        rebasingSupply: BigInt(90000 * 10 ** 18),
        yield: BigInt(1000 * 10 ** 18), // 1000 ETH yield
        fees: BigInt(100 * 10 ** 18),   // 100 ETH fees
        rateETH: BigInt(10 ** 18),
      })

      const superOETHbBalance = createMockStrategyBalance({
        strategy: baseAddresses.superOETHb.strategies.bridgedWOETH,
        balanceETH: BigInt(5000 * 10 ** 18), // 5000 ETH in superOETHb
        timestamp: new Date('2023-10-01T12:00:00Z'),
      })

      const superOETHpBalance = createMockStrategyBalance({
        strategy: plumeAddresses.superOETHp.strategies.bridgedWOETH,
        balanceETH: BigInt(3000 * 10 ** 18), // 3000 ETH in superOETHp
        timestamp: new Date('2023-10-01T12:00:00Z'),
      })

      const processingStatus = createMockProcessingStatus({
        id: 'oeth',
        timestamp: new Date('2023-10-01T23:59:59Z'),
      })

      setupMockStore(ctx, {
        otokenDailyStats: [oethDailyStat],
        processingStatuses: [processingStatus],
        strategyBalances: [superOETHbBalance, superOETHpBalance],
      })

      await protocolProcessor.process(ctx)

      const mockStore = ctx.store as any
      const upsertCalls = mockStore.upsert.getCalls()
      const detailsCall = upsertCalls.find((call: any) => call.args[0].some((item: any) => item.product === 'OETH'))
      const oethDetail = detailsCall!.args[0].find((item: any) => item.product === 'OETH')

      // Expected inherited TVL = 5000 + 3000 = 8000 ETH
      expect(oethDetail.inheritedTvl).to.equal(BigInt(8000 * 10 ** 18))
      expect(oethDetail.bridgedTvl).to.equal(BigInt(8000 * 10 ** 18))
      
      // Expected inherited yield = (1000 * 8000) / 90000 ≈ 88.89 ETH
      const expectedInheritedYield = (BigInt(1000 * 10 ** 18) * BigInt(8000 * 10 ** 18)) / BigInt(90000 * 10 ** 18)
      expect(oethDetail.inheritedYield).to.equal(expectedInheritedYield)
      
      // Expected inherited revenue = (100 * 8000) / 90000 ≈ 8.89 ETH  
      const expectedInheritedRevenue = (BigInt(100 * 10 ** 18) * BigInt(8000 * 10 ** 18)) / BigInt(90000 * 10 ** 18)
      expect(oethDetail.inheritedRevenue).to.equal(expectedInheritedRevenue)
    })
  })

  describe('Super token processing', () => {
    it('should process superOETHb with OETH revenue allocation', async () => {
      const oethDetail = createMockProtocolDailyStatDetail({
        product: 'OETH',
        date: '2023-10-01',
        tvl: BigInt(100000 * 10 ** 18), // 100k ETH TVL
        revenue: BigInt(200 * 10 ** 18), // 200 ETH revenue
      })

      const superOETHbDailyStat = createMockOTokenDailyStat({
        id: '2023-10-01-superOETHb',
        date: '2023-10-01',
        otoken: baseAddresses.superOETHb.address,
        totalSupply: BigInt(10000 * 10 ** 18),
        rebasingSupply: BigInt(9000 * 10 ** 18),
        yield: BigInt(50 * 10 ** 18),
        fees: BigInt(5 * 10 ** 18),
        rateETH: BigInt(10 ** 18),
      })

      const superOETHbBalance = createMockStrategyBalance({
        strategy: baseAddresses.superOETHb.strategies.bridgedWOETH,
        balanceETH: BigInt(10000 * 10 ** 18), // 10k ETH wrapped
        timestamp: new Date('2023-10-01T12:00:00Z'),
      })

      const processingStatuses = [
        createMockProcessingStatus({ id: 'oeth', timestamp: new Date('2023-10-01T23:59:59Z') }),
        createMockProcessingStatus({ id: 'oethb', timestamp: new Date('2023-10-01T23:59:59Z') }),
      ]

      setupMockStore(ctx, {
        otokenDailyStats: [superOETHbDailyStat],
        processingStatuses,
        strategyBalances: [superOETHbBalance],
        protocolDailyStatDetails: [oethDetail],
      })

      await protocolProcessor.process(ctx)

      const mockStore = ctx.store as any
      const upsertCalls = mockStore.upsert.getCalls()
      const detailsCall = upsertCalls.find((call: any) => call.args[0].some((item: any) => item.product === 'superOETHb'))
      const superOETHbDetail = detailsCall!.args[0].find((item: any) => item.product === 'superOETHb')

      expect(superOETHbDetail.bridgedTvl).to.equal(BigInt(10000 * 10 ** 18))
      
      // Expected additional revenue = (200 ETH OETH revenue * 10k wrapped) / 100k OETH TVL = 20 ETH
      const baseRevenue = BigInt(5 * 10 ** 18) // Original fees
      const additionalRevenue = (BigInt(200 * 10 ** 18) * BigInt(10000 * 10 ** 18)) / BigInt(100000 * 10 ** 18)
      expect(superOETHbDetail.revenue).to.equal(baseRevenue + additionalRevenue)
    })
  })

  describe('2-stage processing with super token updates', () => {
    it('should recalculate OETH when super tokens are updated', async () => {
      const oethDailyStat = createMockOTokenDailyStat({
        date: '2023-10-01',
        otoken: OETH_ADDRESS,
        totalSupply: BigInt(100000 * 10 ** 18),
        rebasingSupply: BigInt(90000 * 10 ** 18),
        yield: BigInt(1000 * 10 ** 18),
        fees: BigInt(100 * 10 ** 18),
        rateETH: BigInt(10 ** 18),
      })

      const superOETHbDailyStat = createMockOTokenDailyStat({
        date: '2023-10-01',
        otoken: baseAddresses.superOETHb.address,
        totalSupply: BigInt(10000 * 10 ** 18),
        rebasingSupply: BigInt(9000 * 10 ** 18),
        yield: BigInt(50 * 10 ** 18),
        fees: BigInt(5 * 10 ** 18),
        rateETH: BigInt(10 ** 18),
      })

      // Strategy balance that will be found during recalculation
      const updatedStrategyBalance = createMockStrategyBalance({
        strategy: baseAddresses.superOETHb.strategies.bridgedWOETH,
        balanceETH: BigInt(15000 * 10 ** 18), // Updated to 15k ETH
        timestamp: new Date('2023-10-01T18:00:00Z'), // Later timestamp
      })

      const processingStatuses = [
        createMockProcessingStatus({ id: 'oeth', timestamp: new Date('2023-10-01T23:59:59Z') }),
        createMockProcessingStatus({ id: 'oethb', timestamp: new Date('2023-10-01T23:59:59Z') }),
      ]

      setupMockStore(ctx, {
        otokenDailyStats: [oethDailyStat, superOETHbDailyStat],
        processingStatuses,
        strategyBalances: [updatedStrategyBalance],
      })

      await protocolProcessor.process(ctx)

      // Verify OETH was recalculated in stage 2
      const mockStore = ctx.store as any
      const upsertCalls = mockStore.upsert.getCalls()
      
      // Should have at least 2 upsert calls - initial processing + recalculation
      expect(upsertCalls.length).to.be.greaterThan(1)
      
      // Find the final OETH detail (could be in either call)
      let finalOethDetail
      for (const call of upsertCalls) {
        const oethDetail = call.args[0].find((item: any) => item.product === 'OETH')
        if (oethDetail) {
          finalOethDetail = oethDetail
        }
      }
      
      expect(finalOethDetail).to.not.be.undefined
      // Should reflect the updated strategy balance of 15k ETH
      expect(finalOethDetail.inheritedTvl).to.equal(BigInt(15000 * 10 ** 18))
    })
  })

  describe('Dependency handling', () => {
    it('should use minimum date across OETH variants for processing range', async () => {
      // This test verifies the minimum date logic that ensures all interdependent
      // records are recalculated when any one of them gets updated
      
      const oldOethDetail = createMockProtocolDailyStatDetail({
        product: 'OETH',
        date: '2023-09-15', // Older date
      })

      const newerSuperOETHbDetail = createMockProtocolDailyStatDetail({
        product: 'superOETHb', 
        date: '2023-09-25', // Newer date
      })

      const dailyStats = [
        createMockOTokenDailyStat({
          date: '2023-09-15',
          otoken: OETH_ADDRESS,
        }),
        createMockOTokenDailyStat({
          date: '2023-09-25',
          otoken: OETH_ADDRESS,
        }),
      ]

      const processingStatus = createMockProcessingStatus({
        id: 'oeth',
        timestamp: new Date('2023-09-25T23:59:59Z'),
      })

      setupMockStore(ctx, {
        otokenDailyStats: dailyStats,
        processingStatuses: [processingStatus],
        protocolDailyStatDetails: [oldOethDetail, newerSuperOETHbDetail],
      })

      await protocolProcessor.process(ctx)

      // Verify that OETH processing started from the older date (2023-09-15)
      // not the newer superOETHb date (2023-09-25)
      const mockStore = ctx.store as any
      const findCalls = mockStore.find.getCalls()
      const otokenFindCall = findCalls.find((call: any) => 
        call.args[1]?.where?.otoken === OETH_ADDRESS
      )
      
      expect(otokenFindCall).to.not.be.undefined
      // The dates array should include both 2023-09-15 and later dates
      const dates = otokenFindCall!.args[1].where.date.value
      expect(dates).to.include('2023-09-15')
    })
  })
})