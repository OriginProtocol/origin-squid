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
import {
  ProtocolDailyStat,
  ProtocolDailyStatDetail,
} from '@model'
import { Context } from '@originprotocol/squid-utils'

import * as exchangeRates from '@shared/post-processors/exchange-rates/exchange-rates'
import { protocolProcessor } from './protocol'

describe('Protocol Processor - Integration Tests', () => {
  let ctx: Context
  let getLatestExchangeRateForDateStub: sinon.SinonStub
  
  // Track all upserted data across phases
  let upsertedDetails: ProtocolDailyStatDetail[] = []
  let upsertedDailyStats: ProtocolDailyStat[] = []
  let existingDetails: ProtocolDailyStatDetail[] = []

  beforeEach(() => {
    ctx = createMockContext()
    upsertedDetails = []
    upsertedDailyStats = []
    existingDetails = []
    
    // Mock exchange rate
    getLatestExchangeRateForDateStub = sinon.stub(exchangeRates, 'getLatestExchangeRateForDate')
    getLatestExchangeRateForDateStub.resolves({ rate: BigInt(1800 * 10 ** 8) }) // $1800 ETH
    
    // Mock store upsert to capture all upserted data
    const mockStore = ctx.store as any
    mockStore.upsert.callsFake(async (entities: any[]) => {
      for (const entity of entities) {
        if (entity.constructor.name === 'ProtocolDailyStatDetail' || entity.product) {
          // Remove existing detail for same date/product and add new one
          upsertedDetails = upsertedDetails.filter(d => !(d.date === entity.date && d.product === entity.product))
          upsertedDetails.push({ ...entity })
          existingDetails = existingDetails.filter(d => !(d.date === entity.date && d.product === entity.product))
          existingDetails.push({ ...entity })
        }
        if (entity.constructor.name === 'ProtocolDailyStat' || entity.earningTvl !== undefined) {
          // Remove existing daily stat for same date and add new one
          upsertedDailyStats = upsertedDailyStats.filter(s => s.date !== entity.date)
          upsertedDailyStats.push({ ...entity })
        }
      }
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('Phased Processing: Simulating Real Async Data Flow', () => {
    it('should handle complete async data evolution across 4 phases', async () => {
      const testDate = '2023-10-01'
      
      // ======================
      // PHASE 1: Only OETH data available
      // ======================
      console.log('\n📊 PHASE 1: OETH processor runs first')
      
      const oethDailyStat = createMockOTokenDailyStat({
        date: testDate,
        otoken: OETH_ADDRESS,
        totalSupply: BigInt(100000 * 10 ** 18), // 100k OETH
        rebasingSupply: BigInt(90000 * 10 ** 18), // 90k rebasing
        yield: BigInt(1000 * 10 ** 18), // 1000 ETH yield
        fees: BigInt(100 * 10 ** 18), // 100 ETH fees
        rateETH: BigInt(10 ** 18),
      })

      const oethProcessingStatus = createMockProcessingStatus({
        id: 'oeth',
        timestamp: new Date(`${testDate}T23:59:59Z`),
      })

      setupMockStore(ctx, {
        otokenDailyStats: [oethDailyStat],
        processingStatuses: [oethProcessingStatus],
        strategyBalances: [], // No strategy balances yet
        protocolDailyStatDetails: existingDetails,
      })

      await protocolProcessor.process(ctx)

      // Validate Phase 1 results
      const phase1OethDetail = upsertedDetails.find(d => d.product === 'OETH' && d.date === testDate)!
      expect(phase1OethDetail).to.not.be.undefined
      expect(phase1OethDetail.inheritedTvl).to.equal(BigInt(0)) // No super token balances yet
      expect(phase1OethDetail.inheritedYield).to.equal(BigInt(0))
      expect(phase1OethDetail.inheritedRevenue).to.equal(BigInt(0))
      expect(phase1OethDetail.tvl).to.equal(BigInt(100000 * 10 ** 18)) // Basic TVL from OETH supply
      
      const phase1DailyStat = upsertedDailyStats.find(s => s.date === testDate)!
      expect(phase1DailyStat).to.not.be.undefined
      expect(phase1DailyStat.tvl).to.equal(BigInt(100000 * 10 ** 18)) // No inherited TVL to subtract
      
      console.log(`✅ Phase 1 Complete: OETH TVL = ${Number(phase1OethDetail.tvl) / 1e18} ETH, Inherited TVL = ${Number(phase1OethDetail.inheritedTvl) / 1e18} ETH`)

      // ======================
      // PHASE 2: superOETHb processor runs, but no strategy balances yet
      // ======================
      console.log('\n📊 PHASE 2: superOETHb processor runs (no strategy balances)')

      const superOETHbDailyStat = createMockOTokenDailyStat({
        date: testDate,
        otoken: baseAddresses.superOETHb.address,
        totalSupply: BigInt(5000 * 10 ** 18), // 5k superOETHb
        rebasingSupply: BigInt(4500 * 10 ** 18),
        yield: BigInt(50 * 10 ** 18), // 50 ETH yield
        fees: BigInt(5 * 10 ** 18), // 5 ETH fees
        rateETH: BigInt(10 ** 18),
      })

      const superOETHbProcessingStatus = createMockProcessingStatus({
        id: 'oethb',
        timestamp: new Date(`${testDate}T23:59:59Z`),
      })

      setupMockStore(ctx, {
        otokenDailyStats: [oethDailyStat, superOETHbDailyStat],
        processingStatuses: [oethProcessingStatus, superOETHbProcessingStatus],
        strategyBalances: [], // Still no strategy balances
        protocolDailyStatDetails: existingDetails,
      })

      await protocolProcessor.process(ctx)

      // Validate Phase 2 results - OETH should be recalculated but still no inherited TVL
      const phase2OethDetail = upsertedDetails.find(d => d.product === 'OETH' && d.date === testDate)!
      const phase2SuperOETHbDetail = upsertedDetails.find(d => d.product === 'superOETHb' && d.date === testDate)!
      
      expect(phase2OethDetail.inheritedTvl).to.equal(BigInt(0)) // Still no strategy balances
      expect(phase2SuperOETHbDetail).to.not.be.undefined
      expect(phase2SuperOETHbDetail.bridgedTvl).to.equal(BigInt(0)) // No wrapped OETH balance
      
      // superOETHb should have base revenue but no additional OETH revenue yet
      const expectedBaseSuperOETHbRevenue = BigInt(5 * 10 ** 18) // Just its own fees
      expect(phase2SuperOETHbDetail.revenue).to.equal(expectedBaseSuperOETHbRevenue)
      
      console.log(`✅ Phase 2 Complete: superOETHb created, OETH inherited TVL still ${Number(phase2OethDetail.inheritedTvl) / 1e18} ETH`)

      // ======================
      // PHASE 3: Strategy balance processor runs - adds wrapped OETH balances
      // ======================
      console.log('\n📊 PHASE 3: Strategy balance processor runs')

      const superOETHbStrategyBalance = createMockStrategyBalance({
        strategy: baseAddresses.superOETHb.strategies.bridgedWOETH,
        balanceETH: BigInt(3000 * 10 ** 18), // 3k ETH wrapped in superOETHb
        timestamp: new Date(`${testDate}T18:00:00Z`),
      })

      const superOETHpStrategyBalance = createMockStrategyBalance({
        strategy: plumeAddresses.superOETHp.strategies.bridgedWOETH,
        balanceETH: BigInt(2000 * 10 ** 18), // 2k ETH wrapped in superOETHp  
        timestamp: new Date(`${testDate}T18:00:00Z`),
      })

      setupMockStore(ctx, {
        otokenDailyStats: [oethDailyStat, superOETHbDailyStat],
        processingStatuses: [oethProcessingStatus, superOETHbProcessingStatus],
        strategyBalances: [superOETHbStrategyBalance, superOETHpStrategyBalance],
        protocolDailyStatDetails: existingDetails,
      })

      await protocolProcessor.process(ctx)

      // Validate Phase 3 results - OETH should now have inherited TVL
      const phase3OethDetail = upsertedDetails.find(d => d.product === 'OETH' && d.date === testDate)!
      const phase3SuperOETHbDetail = upsertedDetails.find(d => d.product === 'superOETHb' && d.date === testDate)!
      
      const expectedInheritedTvl = BigInt(5000 * 10 ** 18) // 3k + 2k wrapped ETH
      expect(phase3OethDetail.inheritedTvl).to.equal(expectedInheritedTvl)
      expect(phase3OethDetail.bridgedTvl).to.equal(expectedInheritedTvl)
      
      // Inherited yield should be proportional: (1000 ETH yield * 5000 inherited) / 90000 earning TVL
      const expectedInheritedYield = (BigInt(1000 * 10 ** 18) * expectedInheritedTvl) / BigInt(90000 * 10 ** 18)
      expect(phase3OethDetail.inheritedYield).to.equal(expectedInheritedYield)
      
      // superOETHb should now have additional revenue from OETH
      expect(phase3SuperOETHbDetail.bridgedTvl).to.equal(BigInt(3000 * 10 ** 18))
      
      // Additional revenue = (OETH revenue * wrapped amount) / OETH TVL = (100 * 3000) / 100000 = 3 ETH
      const expectedAdditionalRevenue = (BigInt(100 * 10 ** 18) * BigInt(3000 * 10 ** 18)) / BigInt(100000 * 10 ** 18)
      const expectedTotalSuperOETHbRevenue = BigInt(5 * 10 ** 18) + expectedAdditionalRevenue
      expect(phase3SuperOETHbDetail.revenue).to.equal(expectedTotalSuperOETHbRevenue)
      
      console.log(`✅ Phase 3 Complete: OETH inherited TVL = ${Number(phase3OethDetail.inheritedTvl) / 1e18} ETH, superOETHb bridged TVL = ${Number(phase3SuperOETHbDetail.bridgedTvl) / 1e18} ETH`)

      // ======================
      // PHASE 4: superOETHp processor runs late
      // ======================
      console.log('\n📊 PHASE 4: superOETHp processor finally runs')

      const superOETHpDailyStat = createMockOTokenDailyStat({
        date: testDate,
        otoken: plumeAddresses.superOETHp.address,
        totalSupply: BigInt(2500 * 10 ** 18), // 2.5k superOETHp
        rebasingSupply: BigInt(2200 * 10 ** 18),
        yield: BigInt(25 * 10 ** 18), // 25 ETH yield
        fees: BigInt(2.5 * 10 ** 18), // 2.5 ETH fees  
        rateETH: BigInt(10 ** 18),
      })

      const superOETHpProcessingStatus = createMockProcessingStatus({
        id: 'plume',
        timestamp: new Date(`${testDate}T23:59:59Z`),
      })

      setupMockStore(ctx, {
        otokenDailyStats: [oethDailyStat, superOETHbDailyStat, superOETHpDailyStat],
        processingStatuses: [oethProcessingStatus, superOETHbProcessingStatus, superOETHpProcessingStatus],
        strategyBalances: [superOETHbStrategyBalance, superOETHpStrategyBalance],
        protocolDailyStatDetails: existingDetails,
      })

      await protocolProcessor.process(ctx)

      // Validate Phase 4 results - All tokens should be properly calculated
      const finalOethDetail = upsertedDetails.find(d => d.product === 'OETH' && d.date === testDate)!
      const finalSuperOETHbDetail = upsertedDetails.find(d => d.product === 'superOETHb' && d.date === testDate)!
      const finalSuperOETHpDetail = upsertedDetails.find(d => d.product === 'superOETHp' && d.date === testDate)!
      const finalDailyStat = upsertedDailyStats.find(s => s.date === testDate)!

      // OETH should have the same inherited TVL (5k ETH total)
      expect(finalOethDetail.inheritedTvl).to.equal(BigInt(5000 * 10 ** 18))
      
      // superOETHp should have its bridged TVL and additional OETH revenue
      expect(finalSuperOETHpDetail.bridgedTvl).to.equal(BigInt(2000 * 10 ** 18))
      
      // superOETHp additional revenue = (100 * 2000) / 100000 = 2 ETH
      const expectedSuperOETHpAdditionalRevenue = (BigInt(100 * 10 ** 18) * BigInt(2000 * 10 ** 18)) / BigInt(100000 * 10 ** 18)
      const expectedTotalSuperOETHpRevenue = BigInt(2.5 * 10 ** 18) + expectedSuperOETHpAdditionalRevenue
      expect(finalSuperOETHpDetail.revenue).to.equal(expectedTotalSuperOETHpRevenue)

      // Final protocol daily stat should aggregate everything correctly
      const totalDetailsRevenue = finalOethDetail.revenue + finalSuperOETHbDetail.revenue + finalSuperOETHpDetail.revenue
      const totalDetailsTvl = finalOethDetail.tvl + finalSuperOETHbDetail.tvl + finalSuperOETHpDetail.tvl - finalOethDetail.inheritedTvl
      
      expect(finalDailyStat.revenue).to.equal(totalDetailsRevenue)
      expect(finalDailyStat.tvl).to.equal(totalDetailsTvl)
      
      console.log(`✅ Phase 4 Complete: Final protocol TVL = ${Number(finalDailyStat.tvl) / 1e18} ETH, Revenue = ${Number(finalDailyStat.revenue) / 1e18} ETH`)
      console.log(`   OETH: TVL=${Number(finalOethDetail.tvl) / 1e18}, Inherited=${Number(finalOethDetail.inheritedTvl) / 1e18}`)
      console.log(`   superOETHb: TVL=${Number(finalSuperOETHbDetail.tvl) / 1e18}, Bridged=${Number(finalSuperOETHbDetail.bridgedTvl) / 1e18}`)
      console.log(`   superOETHp: TVL=${Number(finalSuperOETHpDetail.tvl) / 1e18}, Bridged=${Number(finalSuperOETHpDetail.bridgedTvl) / 1e18}`)

      // ======================
      // VALIDATION: Ensure no double counting
      // ======================
      
      // Total protocol TVL should not double-count inherited TVL
      const expectedProtocolTvl = BigInt(100000 * 10 ** 18) + // OETH base TVL
                                  BigInt(5000 * 10 ** 18) +   // superOETHb TVL  
                                  BigInt(2500 * 10 ** 18) -   // superOETHp TVL
                                  BigInt(5000 * 10 ** 18)     // minus inherited TVL (avoid double counting)
      
      expect(finalDailyStat.tvl).to.equal(expectedProtocolTvl)
      
      // All three token types should be represented
      expect(upsertedDetails.filter(d => d.date === testDate)).to.have.length(3)
      
      console.log(`\n🎉 All phases completed successfully! Final protocol TVL: ${Number(finalDailyStat.tvl) / 1e18} ETH`)
    })

    it('should handle strategy balance updates affecting historical OETH data', async () => {
      const earlyDate = '2023-09-15'
      const lateDate = '2023-09-25'
      
      // ======================
      // PHASE 1: Process OETH and superOETHb for early date
      // ======================
      console.log('\n📊 PHASE 1: Early date processing')
      
      const earlyOethStat = createMockOTokenDailyStat({
        date: earlyDate,
        otoken: OETH_ADDRESS,
        totalSupply: BigInt(80000 * 10 ** 18),
        rebasingSupply: BigInt(72000 * 10 ** 18),
        yield: BigInt(800 * 10 ** 18),
        fees: BigInt(80 * 10 ** 18),
        rateETH: BigInt(10 ** 18),
      })

      const earlySuperOETHbStat = createMockOTokenDailyStat({
        date: earlyDate,
        otoken: baseAddresses.superOETHb.address,
        totalSupply: BigInt(4000 * 10 ** 18),
        rebasingSupply: BigInt(3600 * 10 ** 18),
        yield: BigInt(40 * 10 ** 18),
        fees: BigInt(4 * 10 ** 18),
        rateETH: BigInt(10 ** 18),
      })

      const processingStatuses = [
        createMockProcessingStatus({ id: 'oeth', timestamp: new Date(`${earlyDate}T23:59:59Z`) }),
        createMockProcessingStatus({ id: 'oethb', timestamp: new Date(`${earlyDate}T23:59:59Z`) }),
      ]

      setupMockStore(ctx, {
        otokenDailyStats: [earlyOethStat, earlySuperOETHbStat],
        processingStatuses,
        strategyBalances: [], // No strategy balances initially
        protocolDailyStatDetails: existingDetails,
      })

      await protocolProcessor.process(ctx)

      const phase1EarlyOeth = upsertedDetails.find(d => d.product === 'OETH' && d.date === earlyDate)!
      expect(phase1EarlyOeth.inheritedTvl).to.equal(BigInt(0))

      // ======================
      // PHASE 2: Add strategy balances for later date
      // ======================
      console.log('\n📊 PHASE 2: Later date with strategy balances')

      const lateOethStat = createMockOTokenDailyStat({
        date: lateDate,
        otoken: OETH_ADDRESS,
        totalSupply: BigInt(120000 * 10 ** 18),
        rebasingSupply: BigInt(108000 * 10 ** 18),
        yield: BigInt(1200 * 10 ** 18),
        fees: BigInt(120 * 10 ** 18),
        rateETH: BigInt(10 ** 18),
      })

      const lateSuperOETHbStat = createMockOTokenDailyStat({
        date: lateDate,
        otoken: baseAddresses.superOETHb.address,
        totalSupply: BigInt(8000 * 10 ** 18),
        rebasingSupply: BigInt(7200 * 10 ** 18),
        yield: BigInt(80 * 10 ** 18),
        fees: BigInt(8 * 10 ** 18),
        rateETH: BigInt(10 ** 18),
      })

      const lateStrategyBalance = createMockStrategyBalance({
        strategy: baseAddresses.superOETHb.strategies.bridgedWOETH,
        balanceETH: BigInt(6000 * 10 ** 18), // 6k ETH wrapped
        timestamp: new Date(`${lateDate}T18:00:00Z`),
      })

      const updatedProcessingStatuses = [
        createMockProcessingStatus({ id: 'oeth', timestamp: new Date(`${lateDate}T23:59:59Z`) }),
        createMockProcessingStatus({ id: 'oethb', timestamp: new Date(`${lateDate}T23:59:59Z`) }),
      ]

      setupMockStore(ctx, {
        otokenDailyStats: [earlyOethStat, earlySuperOETHbStat, lateOethStat, lateSuperOETHbStat],
        processingStatuses: updatedProcessingStatuses,
        strategyBalances: [lateStrategyBalance],
        protocolDailyStatDetails: existingDetails,
      })

      await protocolProcessor.process(ctx)

      // Validate that BOTH dates are processed due to minimum date logic
      const finalEarlyOeth = upsertedDetails.find(d => d.product === 'OETH' && d.date === earlyDate)!
      const finalLateOeth = upsertedDetails.find(d => d.product === 'OETH' && d.date === lateDate)!

      // Early date should now have inherited TVL due to strategy balance existence
      expect(finalEarlyOeth.inheritedTvl).to.equal(BigInt(6000 * 10 ** 18))
      expect(finalLateOeth.inheritedTvl).to.equal(BigInt(6000 * 10 ** 18))

      console.log(`✅ Historical backfill complete: Early OETH inherited TVL = ${Number(finalEarlyOeth.inheritedTvl) / 1e18} ETH`)
      console.log(`✅ Current date: Late OETH inherited TVL = ${Number(finalLateOeth.inheritedTvl) / 1e18} ETH`)
    })
  })

  describe('Edge Cases and Error Conditions', () => {
    it('should handle missing processing status gracefully', async () => {
      const testDate = '2023-10-01'
      
      setupMockStore(ctx, {
        otokenDailyStats: [],
        processingStatuses: [], // No processing status
        strategyBalances: [],
        protocolDailyStatDetails: [],
      })

      await protocolProcessor.process(ctx)

      // Should not crash and should not create any details
      expect(upsertedDetails).to.have.length(0)
      expect(upsertedDailyStats).to.have.length(0)
    })

    it('should handle missing OToken daily stats gracefully', async () => {
      const testDate = '2023-10-01'
      
      const processingStatus = createMockProcessingStatus({
        id: 'oeth',
        timestamp: new Date(`${testDate}T23:59:59Z`),
      })

      setupMockStore(ctx, {
        otokenDailyStats: [], // No daily stats
        processingStatuses: [processingStatus],
        strategyBalances: [],
        protocolDailyStatDetails: [],
      })

      await protocolProcessor.process(ctx)

      // Should not create details for missing daily stats
      expect(upsertedDetails).to.have.length(0)
      expect(upsertedDailyStats).to.have.length(0)
    })
  })
})