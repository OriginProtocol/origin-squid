import { expect } from 'chai'
import sinon from 'sinon'
import { encodeAbiParameters } from 'viem'

import { ExchangeRate, ExchangeRateDaily } from '@model'
import { Block, Context } from '@originprotocol/squid-utils'
import { baseAddresses } from '@utils/addresses-base'

import { convertRate, process } from './exchange-rates'
import { BaseCurrency, getBasePrice } from './price-routing-base'

const E18 = 10n ** 18n
const CRV = '0x8ee73c484a26e0a5df2ee2a4960b789967dd0415'
const POOL = '0xde37e221442fa15c35dc19fbae11ed106ba52fb2'
const ETH_USD = '0x71041dddad3595f9ced3dccfbe3d1f4b0a16bb70'
const POOL_HEIGHT = 3327708
const BLOCK_HEIGHT = 53000000

// Mock the RPC boundary, leaving symbol routing, ABI decoding and rate conversion real.
describe('Base CRV reward pricing', () => {
  let ctx: Context
  let block: Block
  let call: sinon.SinonStub
  let upsert: sinon.SinonStub
  let crvOracle: bigint
  let ethOracle: bigint

  beforeEach(() => {
    crvOracle = 2n * E18 // 2 CRV per crvUSD = $0.50 per CRV
    ethOracle = 2000n * 10n ** 8n // Chainlink ETH/USD has 8 decimals
    call = sinon.stub().callsFake(async (method: string, params: any[]) => {
      expect(method).to.equal('eth_call')
      const [{ to, data }, height] = params
      expect(height).to.equal(`0x${block.header.height.toString(16)}`)
      if (to === POOL && data === '0x86fc88d3') {
        return encodeAbiParameters([{ type: 'uint256' }], [crvOracle])
      }
      if (to === ETH_USD && data === '0x50d25bcd') {
        return encodeAbiParameters([{ type: 'int256' }], [ethOracle])
      }
      throw new Error(`Unexpected oracle call: ${to} ${data}`)
    })
    upsert = sinon.stub().resolves()
    block = { header: { height: BLOCK_HEIGHT, timestamp: Date.UTC(2026, 9, 26) } } as Block
    ctx = {
      chain: { id: 8453 },
      _chain: { client: { call } },
      __state: new Map(),
      store: { upsert },
      log: { error: sinon.stub(), info: sinon.stub(), debug: sinon.stub() },
    } as unknown as Context
  })

  it('values harvested CRV in WETH and persists a nonzero historical exchange rate', async () => {
    // This is the same address-to-address conversion used by RewardTokenCollected.
    expect(await convertRate(ctx, block, CRV, baseAddresses.tokens.WETH, 1000n * E18)).to.equal(E18 / 4n)
    await process(ctx)

    const [rates] = upsert.firstCall.args
    const [dailyRates] = upsert.secondCall.args
    expect(rates[0]).to.be.instanceOf(ExchangeRate)
    expect(rates[0]).to.include({ chainId: 8453, pair: 'CRV_ETH', rate: E18 / 4000n, decimals: 18 })
    expect(dailyRates[0]).to.be.instanceOf(ExchangeRateDaily)
    expect(dailyRates[0]).to.include({ chainId: 8453, pair: 'CRV_ETH', rate: E18 / 4000n, date: '2026-10-26' })
    expect(call.callCount).to.equal(2)
  })

  it('supports symbols and USDC/USD quotes with the correctly inverted oracle', async () => {
    expect(baseAddresses.tokens.CRV).to.equal(CRV)
    expect(await getBasePrice(ctx, block.header, 'CRV', 'USD')).to.deep.equal([E18 / 2n, 18])
    expect(await getBasePrice(ctx, block.header, CRV, baseAddresses.tokens.USDC)).to.deep.equal([E18 / 2n, 18])
    expect(await getBasePrice(ctx, block.header, 'CRV', 'ETH')).to.deep.equal([E18 / 4000n, 18])
  })

  it('does not query the pool before deployment and supports its first block', async () => {
    block.header.height = POOL_HEIGHT - 1
    expect(await getBasePrice(ctx, block.header, CRV, baseAddresses.tokens.WETH)).to.equal(undefined)
    expect(call.called).to.equal(false)
    block.header.height = POOL_HEIGHT
    expect(await getBasePrice(ctx, block.header, CRV, baseAddresses.tokens.WETH)).to.deep.equal([E18 / 4000n, 18])
  })

  it('does not value an unsupported token as CRV', async () => {
    const mainnetCrv = '0xd533a949740bb3306d119cc777fa900ba034cd52' as BaseCurrency
    expect(await getBasePrice(ctx, block.header, mainnetCrv, 'ETH')).to.equal(undefined)
    expect(call.called).to.equal(false)
  })

  for (const oracle of ['CRV', 'ETH'] as const) {
    it(`fails instead of silently dropping rewards when the ${oracle} oracle returns zero`, async () => {
      if (oracle === 'CRV') crvOracle = 0n
      else ethOracle = 0n
      let error: unknown
      try {
        await convertRate(ctx, block, CRV, baseAddresses.tokens.WETH, E18)
      } catch (err) {
        error = err
      }
      expect(error).to.be.instanceOf(Error)
      expect((error as Error).message).to.contain('Invalid')
      expect(upsert.called).to.equal(false)
    })
  }

  it('propagates RPC failures rather than recording zero earnings', async () => {
    call.rejects(new Error('archive RPC unavailable'))
    let error: unknown
    try {
      await convertRate(ctx, block, CRV, baseAddresses.tokens.WETH, E18)
    } catch (err) {
      error = err
    }
    expect((error as Error).message).to.equal('archive RPC unavailable')
  })
})
