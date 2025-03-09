import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { compact } from 'lodash'
import { LessThan } from 'typeorm'

import { HistoryType, OToken, OTokenAPY, OTokenAddress, OTokenHistory, OTokenRebase, RebasingOption } from '@model'
import { Block, Context, Trace, calculateAPY } from '@originprotocol/squid-utils'
import { ensureExchangeRate } from '@shared/post-processors/exchange-rates'
import { CurrencyAddress } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { OUSD_STABLE_OTOKENS } from '@utils/addresses'
import { isContract } from '@utils/isContract'

import { OToken_2023_12_21 } from './otoken-2023-12-21'
import { OToken_2025_03_04 } from './otoken-2025-03-04'

dayjs.extend(utc)

export class OTokenEntityProducer {
  otoken: OToken_2023_12_21 | OToken_2025_03_04
  public ctx: Context
  public block: Block
  private otokenMap: Map<string, OToken> = new Map()
  private addressMap: Map<string, OTokenAddress> = new Map()
  private histories: OTokenHistory[] = []
  private apyMap: Map<string, OTokenAPY> = new Map()
  private rebaseMap: Map<string, OTokenRebase> = new Map()

  constructor(otoken: OToken_2023_12_21 | OToken_2025_03_04, ctx: Context, block: Block) {
    this.otoken = otoken
    this.ctx = ctx
    this.block = block
  }

  private async getOrCreateTokenEntity(): Promise<OToken> {
    const id = `${this.ctx.chain.id}:${this.otoken.address}:${this.block.header.height}`
    let token = this.otokenMap.get(id)
    if (!token) {
      token = await this.ctx.store.get(OToken, id)
    }
    if (!token) {
      token = new OToken({
        id,
        chainId: this.ctx.chain.id,
        otoken: this.otoken.address,
        timestamp: new Date(this.otoken.block.header.timestamp),
        blockNumber: this.otoken.block.header.height,
        totalSupply: 0n,
        rebasingSupply: 0n,
        nonRebasingSupply: 0n,
        unallocatedSupply: 0n,
        creditsPerToken: 0n,
        holderCount: 0,
      })
    }

    // Update with current values
    token.totalSupply = this.otoken.totalSupply
    token.rebasingSupply = this.otoken.rebasingSupply
    token.nonRebasingSupply = this.otoken.nonRebasingSupply
    token.creditsPerToken = this.otoken.rebasingCreditsPerTokenHighres()
    token.timestamp = new Date(this.otoken.block.header.timestamp)
    token.blockNumber = this.otoken.block.header.height

    this.otokenMap.set(id, token)
    return token
  }

  private async getOrCreateAddress(account: string): Promise<OTokenAddress> {
    const id = `${this.ctx.chain.id}:${this.otoken.address}:${account}`
    let address = this.addressMap.get(id)
    if (!address) {
      address = await this.ctx.store.get(OTokenAddress, id)
    }

    if (!address) {
      const isContractAddress = await isContract(this.ctx, this.otoken.block, account)
      address = new OTokenAddress({
        id,
        chainId: this.ctx.chain.id,
        otoken: this.otoken.address,
        address: account,
        isContract: isContractAddress,
        rebasingOption: RebasingOption.OptIn, // Default
        credits: 0n,
        alternativeCreditsPerToken: 0n,
        balance: 0n,
        balanceEarned: 0n,
        blockNumber: this.otoken.block.header.height,
        lastUpdated: new Date(this.otoken.block.header.timestamp),
        since: new Date(this.otoken.block.header.timestamp),
      })
    }

    const otoken = this.otoken as OToken_2025_03_04

    // Update entity with current values
    const balance = this.otoken.balanceOf(account)
    const [credits, creditsPerToken] = this.otoken.creditsBalanceOf(account)

    const yieldFrom = 'yieldFrom' in otoken ? otoken.yieldFrom[account] : null
    const yieldTo = 'yieldTo' in otoken ? otoken.yieldTo[account] : null
    address.balance = balance
    address.credits = credits
    address.alternativeCreditsPerToken = creditsPerToken
    address.blockNumber = this.otoken.block.header.height
    address.lastUpdated = new Date(this.otoken.block.header.timestamp)
    address.yieldFrom = yieldFrom ? await this.getOrCreateAddress(yieldFrom) : null
    address.yieldTo = yieldTo ? await this.getOrCreateAddress(yieldTo) : null
    address.isContract = await isContract(this.ctx, this.otoken.block, account)

    // Update rebasing option based on token state
    if ('rebaseState' in this.otoken) {
      const state = this.otoken.rebaseState[account]
      switch (state) {
        case 3: // YieldDelegationSource
          address.rebasingOption = RebasingOption.YieldDelegationSource
          break
        case 4: // YieldDelegationTarget
          address.rebasingOption = RebasingOption.YieldDelegationTarget
          break
        case 1: // StdNonRebasing or OptOut
          address.rebasingOption = RebasingOption.OptOut
          break
        case 2: // StdRebasing or OptIn
          address.rebasingOption = RebasingOption.OptIn
          break
        default:
          if (typeof this.otoken.nonRebasingCreditsPerToken === 'function') {
            address.rebasingOption =
              this.otoken.nonRebasingCreditsPerToken(account) > 0n ? RebasingOption.OptOut : RebasingOption.OptIn
          } else {
            address.rebasingOption =
              this.otoken.nonRebasingCreditsPerToken[account] > 0n ? RebasingOption.OptOut : RebasingOption.OptIn
          }
      }
    }

    this.addressMap.set(id, address)
    return address
  }

  private async createHistory(
    trace: Trace,
    from: string | null,
    to: string | null,
    value: bigint,
  ): Promise<OTokenHistory[]> {
    const id = `${this.ctx.chain.id}:${trace.transaction!.hash}:${trace.traceAddress.join('-')}`

    const entries = compact([
      from
        ? new OTokenHistory({
            id: `${id}-sent`,
            chainId: this.ctx.chain.id,
            otoken: this.otoken.address,
            address: await this.getOrCreateAddress(from),
            timestamp: new Date(this.otoken.block.header.timestamp),
            blockNumber: this.otoken.block.header.height,
            txHash: this.otoken.block.header.hash,
            type: HistoryType.Sent,
            value: value,
            balance: this.otoken.balanceOf(from),
          })
        : undefined,
      to
        ? new OTokenHistory({
            id: `${id}-received`,
            chainId: this.ctx.chain.id,
            otoken: this.otoken.address,
            address: await this.getOrCreateAddress(to),
            timestamp: new Date(this.otoken.block.header.timestamp),
            blockNumber: this.otoken.block.header.height,
            txHash: this.otoken.block.header.hash,
            type: HistoryType.Received,
            value: value,
            balance: this.otoken.balanceOf(to),
          })
        : undefined,
    ])

    this.histories.push(...entries)

    return entries
  }

  private async getOrCreateAPYEntity(): Promise<OTokenAPY> {
    const dateStr = new Date(this.otoken.block.header.timestamp).toISOString().split('T')[0]
    const id = `${this.ctx.chain.id}:${this.otoken.address}:${dateStr}`

    let apy = this.apyMap.get(id)
    if (!apy) {
      apy = await this.ctx.store.get(OTokenAPY, id)
    }

    // Get the previous day's APY record to calculate rate of change
    const previousDate = dayjs.utc(dateStr).subtract(1, 'day').format('YYYY-MM-DD')
    const previousId = `${this.ctx.chain.id}:${this.otoken.address}:${previousDate}`
    let previousApy = this.apyMap.get(previousId)
    // If previous day's entry doesn't exist, find the most recent entry before current date
    if (!previousApy) {
      previousApy = await this.ctx.store.findOne(OTokenAPY, {
        where: {
          chainId: this.ctx.chain.id,
          otoken: this.otoken.address,
          date: LessThan(dateStr),
        },
        order: { date: 'DESC' },
      })
      if (previousApy) {
        this.apyMap.set(previousId, previousApy)
      }
    }

    const currentCreditsPerToken = this.otoken.rebasingCreditsPerTokenHighres()

    if (!apy) {
      apy = new OTokenAPY({
        id,
        chainId: this.ctx.chain.id,
        otoken: this.otoken.address,
        timestamp: new Date(this.otoken.block.header.timestamp),
        blockNumber: this.otoken.block.header.height,
        txHash: this.otoken.block.header.hash,
        date: dateStr,
        apr: 0,
        apy: 0,
        apy7DayAvg: 0,
        apy14DayAvg: 0,
        apy30DayAvg: 0,
        rebasingCreditsPerToken: currentCreditsPerToken,
      })
    }

    // Update current values
    apy.rebasingCreditsPerToken = currentCreditsPerToken
    apy.timestamp = new Date(this.otoken.block.header.timestamp)
    apy.blockNumber = this.otoken.block.header.height
    apy.txHash = this.otoken.block.header.hash // Not a great field considering we can have more than one rebase per day.

    // Calculate APY if we have previous data
    if (previousApy) {
      const apyCalc = calculateAPY(
        dayjs.utc(apy.timestamp).startOf('day').toDate(),
        dayjs.utc(apy.timestamp).endOf('day').toDate(),
        currentCreditsPerToken,
        previousApy.rebasingCreditsPerToken,
      )

      apy.apr = apyCalc.apr
      apy.apy = apyCalc.apy

      // Update average APYs - we'll need to fetch older records
      await this.updateAverageAPYs(apy)
    }

    this.apyMap.set(id, apy)
    return apy
  }

  private async updateAverageAPYs(currentApy: OTokenAPY): Promise<void> {
    const currentDate = dayjs.utc(currentApy.date)

    // Collect APY values for different time periods
    const apy7Days: number[] = [currentApy.apy]
    const apy14Days: number[] = [currentApy.apy]
    const apy30Days: number[] = [currentApy.apy]

    // Fetch the last 30 days of APY data
    for (let i = 1; i <= 30; i++) {
      const pastDate = currentDate.subtract(i, 'day').format('YYYY-MM-DD')
      const pastId = `${this.ctx.chain.id}:${this.otoken.address}:${pastDate}`

      let pastApy = this.apyMap.get(pastId)
      if (!pastApy) {
        pastApy = await this.ctx.store.get(OTokenAPY, pastId)
      }

      if (pastApy) {
        if (i < 7) apy7Days.push(pastApy.apy)
        if (i < 14) apy14Days.push(pastApy.apy)
        apy30Days.push(pastApy.apy)
      }
    }

    // Calculate averages
    currentApy.apy7DayAvg = apy7Days.reduce((sum, val) => sum + val, 0) / apy7Days.length
    currentApy.apy14DayAvg = apy14Days.reduce((sum, val) => sum + val, 0) / apy14Days.length
    currentApy.apy30DayAvg = apy30Days.reduce((sum, val) => sum + val, 0) / apy30Days.length
  }

  private async getOrCreateRebaseEntity(trace: Trace, totalSupplyDiff: bigint): Promise<OTokenRebase> {
    const id = `${this.ctx.chain.id}:${this.otoken.address}:${this.block.header.height}-${trace.traceAddress.join('-')}`

    let rebase = this.rebaseMap.get(id)
    if (!rebase) {
      rebase = await this.ctx.store.get(OTokenRebase, id)
    }

    const _yield = totalSupplyDiff
    const _fee = (_yield * 25n) / 100n
    let feeETH = 0n
    let yieldETH = 0n
    let feeUSD = 0n
    let yieldUSD = 0n
    if (OUSD_STABLE_OTOKENS.includes(this.otoken.address)) {
      const rate = await ensureExchangeRate(this.ctx, this.block, this.otoken.address as CurrencyAddress, 'ETH').then(
        (er) => er?.rate ?? 0n,
      )
      feeUSD = _fee
      yieldUSD = _yield
      feeETH = (feeUSD * rate) / 1000000000000000000n
      yieldETH = (yieldUSD * rate) / 1000000000000000000n
    } else {
      const rate = await ensureExchangeRate(this.ctx, this.block, this.otoken.address as CurrencyAddress, 'USD').then(
        (er) => er?.rate ?? 0n,
      )
      feeETH = _fee
      yieldETH = _yield
      feeUSD = (feeETH * rate) / 1000000000000000000n
      yieldUSD = (yieldETH * rate) / 1000000000000000000n
    }

    if (!rebase) {
      rebase = new OTokenRebase({
        id,
        chainId: this.ctx.chain.id,
        otoken: this.otoken.address,
        timestamp: new Date(this.otoken.block.header.timestamp),
        blockNumber: this.otoken.block.header.height,
        txHash: this.otoken.block.header.hash,
        totalSupply: this.otoken.totalSupply,
        rebasingCredits: this.otoken.rebasingCreditsHighres(),
        rebasingCreditsPerToken: this.otoken.rebasingCreditsPerTokenHighres(),
        fee: _fee,
        feeETH,
        feeUSD,
        yield: _yield,
        yieldETH,
        yieldUSD,
      })
    }

    // Update with current values
    rebase.apy = await this.getOrCreateAPYEntity()
    rebase.totalSupply = this.otoken.totalSupply
    rebase.rebasingCredits = this.otoken.rebasingCreditsHighres()
    rebase.rebasingCreditsPerToken = this.otoken.rebasingCreditsPerTokenHighres()
    rebase.timestamp = new Date(this.otoken.block.header.timestamp)
    rebase.blockNumber = this.otoken.block.header.height
    rebase.txHash = this.otoken.block.header.hash

    this.rebaseMap.set(id, rebase)
    return rebase
  }

  async afterMint(trace: Trace, to: string, value: bigint): Promise<void> {
    await this.getOrCreateTokenEntity()
    await this.createHistory(trace, null, to, value)
  }

  async afterBurn(trace: Trace, from: string, value: bigint): Promise<void> {
    await this.getOrCreateTokenEntity()
    await this.createHistory(trace, from, null, value)
  }

  async afterTransfer(trace: Trace, from: string, to: string, value: bigint): Promise<void> {
    await this.getOrCreateTokenEntity()
    await this.createHistory(trace, from, to, value)
  }

  async afterTransferFrom(trace: Trace, from: string, to: string, value: bigint): Promise<void> {
    await this.getOrCreateTokenEntity()
    await this.createHistory(trace, from, to, value)
  }

  // async afterApprove(trace: Trace, owner: string, spender: string, value: bigint): Promise<void> {
  // }

  async afterChangeSupply(trace: Trace, newTotalSupply: bigint, totalSupplyDiff: bigint): Promise<void> {
    await this.getOrCreateTokenEntity()
    await this.getOrCreateAPYEntity()
    await this.getOrCreateRebaseEntity(trace, totalSupplyDiff)
  }

  async afterDelegateYield(from: string, to: string): Promise<void> {
    await this.getOrCreateAddress(from)
    await this.getOrCreateAddress(to)
  }

  async afterUndelegateYield(from: string, to: string): Promise<void> {
    await this.getOrCreateAddress(from)
    await this.getOrCreateAddress(to)
  }

  async afterRebaseOptIn(account: string): Promise<void> {
    await this.getOrCreateTokenEntity()
    await this.getOrCreateAddress(account)
  }

  async afterRebaseOptOut(account: string): Promise<void> {
    await this.getOrCreateTokenEntity()
    await this.getOrCreateAddress(account)
  }

  async save(): Promise<void> {
    await this.ctx.store.upsert([...this.otokenMap.values()])
    await this.ctx.store.upsert([...this.addressMap.values()])
    await this.ctx.store.upsert([...this.apyMap.values()])
    await this.ctx.store.insert([...this.rebaseMap.values()])
    await this.ctx.store.insert(this.histories)

    this.otokenMap.clear()
    this.addressMap.clear()
    this.apyMap.clear()
    this.rebaseMap.clear()
    this.histories = []
  }
}
