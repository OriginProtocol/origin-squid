import { expect } from 'chai'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { parseEther } from 'viem'

import { StrategyDailyYield, StrategyYield } from '@model'
import { Block } from '@originprotocol/squid-utils'
import { mainnetCurrencies } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { MockStore, createMockContext } from '@test-utils/context-helper'
import { OUSD_ADDRESS, USDC_ADDRESS } from '@utils/addresses'

import { IStrategyData } from './strategy'
import { processStrategyEarnings } from './strategy-earnings'

dayjs.extend(utc)

const strategyData: IStrategyData = {
  chainId: 1,
  from: 100000,
  address: '0x26a02ec47acc2a3442b757f45e0a82b8e993ce11',
  name: 'OUSD Curve AMO',
  contractName: 'CurveAMOStrategy',
  oTokenAddress: OUSD_ADDRESS,
  kind: 'CurveAMO',
  base: { address: mainnetCurrencies.USD, decimals: 18 },
  assets: [
    { address: OUSD_ADDRESS, decimals: 18 },
    { address: USDC_ADDRESS, decimals: 6 },
  ],
  earnings: { passiveByDepositWithdrawal: true },
}

const recordEarnings = async (previousBalance: bigint, ousdBalance: bigint, usdcBalance: bigint) => {
  const previous = new StrategyYield({
    id: `100000:${strategyData.address}:${strategyData.base.address}`,
    blockNumber: 100000,
    timestamp: new Date('2026-11-03T23:59:59.999Z'),
    otoken: OUSD_ADDRESS,
    strategy: strategyData.address,
    asset: strategyData.base.address,
    balance: previousBalance,
    balanceWeight: 1,
    earnings: parseEther('200'),
    earningsChange: 0n,
  })
  const previousDaily = new StrategyDailyYield({
    ...previous,
    id: `${strategyData.address}:${strategyData.base.address}:2026-11-03`,
    apr: 0,
    apy: 0,
  })
  const block = {
    header: { height: 100001, timestamp: Date.parse('2026-11-04T23:59:59.999Z') },
    logs: [],
    traces: [],
  } as unknown as Block
  const ctx = createMockContext({
    blocks: [block],
    blockRate: 12,
    chain: { id: 1 },
    _chain: { client: { url: 'https://rpc.invalid' } },
    latestBlockOfDay: () => true,
    log: { warn: () => undefined },
  } as unknown as Parameters<typeof createMockContext>[0])
  const store = ctx.store as unknown as MockStore
  let yields: StrategyYield[] = []
  let daily: StrategyDailyYield[] = []
  store.findOne.callsFake(async (entity) => (entity === StrategyYield ? previous : previousDaily))
  store.find.callsFake(async () => yields)
  store.upsert.callsFake(async (rows: (StrategyYield | StrategyDailyYield)[]) => {
    if (rows[0] instanceof StrategyYield) yields = rows as StrategyYield[]
    else daily = rows as StrategyDailyYield[]
  })

  await processStrategyEarnings(ctx, strategyData, async () => [
    { address: strategyData.address, asset: OUSD_ADDRESS, balance: ousdBalance },
    { address: strategyData.address, asset: USDC_ADDRESS, balance: usdcBalance },
  ])

  expect(yields).to.have.length(1)
  expect(daily).to.have.length(1)
  return { current: yields[0], daily: daily[0] }
}

describe('Curve AMO passive earnings', () => {
  it('records positive passive earnings at the non-OUSD weight and carries them into daily APY', async () => {
    const { current, daily } = await recordEarnings(parseEther('900'), parseEther('500'), 500_000_000n)

    expect(current.balance).to.equal(parseEther('1000'))
    expect(current.balanceWeight).to.equal(0.5)
    expect(current.earningsChange).to.equal(parseEther('50'))
    expect(current.earnings).to.equal(parseEther('250'))
    expect(daily.earningsChange).to.equal(parseEther('50'))
    expect(daily.earnings).to.equal(parseEther('250'))
    expect(daily.apr).to.be.greaterThan(0)
    expect(daily.apy).to.be.greaterThan(0)
  })

  it('records negative passive earnings at the non-OUSD weight', async () => {
    const { current, daily } = await recordEarnings(parseEther('1100'), parseEther('500'), 500_000_000n)

    expect(current.earningsChange).to.equal(-parseEther('50'))
    expect(current.earnings).to.equal(parseEther('150'))
    expect(daily.earningsChange).to.equal(-parseEther('50'))
    expect(daily.apr).to.be.lessThan(0)
    expect(daily.apy).to.be.lessThan(0)
  })

  it('preserves all passive earnings when the non-OUSD weight is one', async () => {
    const { current, daily } = await recordEarnings(parseEther('900'), 0n, 1_000_000_000n)

    expect(current.balanceWeight).to.equal(1)
    expect(current.earningsChange).to.equal(parseEther('100'))
    expect(current.earnings).to.equal(parseEther('300'))
    expect(daily.earningsChange).to.equal(parseEther('100'))
  })
})
