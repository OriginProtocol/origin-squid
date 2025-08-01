import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { LessThan } from 'typeorm'
import { parseUnits } from 'viem'

import * as otokenHarvester from '@abi/otoken-base-harvester'
import * as otokenVault from '@abi/otoken-vault'
import {
  ERC20Holder,
  HistoryType,
  OToken,
  OTokenAPY,
  OTokenAddress,
  OTokenDailyStat,
  OTokenHarvesterYieldSent,
  OTokenHistory,
  OTokenRebase,
  OTokenRebaseOption,
  OTokenYieldForwarded,
  RebasingOption,
} from '@model'
import { Block, Context, Log, Trace, calculateAPY } from '@originprotocol/squid-utils'
import { ensureExchangeRate } from '@shared/post-processors/exchange-rates'
import { CurrencyAddress } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { OUSD_STABLE_OTOKENS } from '@utils/addresses'
import { isContract } from '@utils/isContract'

import { createOTokenProcessor2 } from './otoken-2'
import { OToken_2025_03_04 } from './otoken-2025-03-04'
import { getOTokenDailyStat, processOTokenDailyStats } from './otoken-daily-stats'
import { processOTokenERC20 } from './otoken-erc20'
import { OTokenClass } from './types'
import { isYieldDelegationContract } from './utils'

dayjs.extend(utc)

export class OTokenEntityProducer {
  otoken: OTokenClass
  public name: string
  public symbol: string
  public from: number
  public ctx: Context
  public block: Block
  /** The OToken processor will use YieldDistribution events to
   *  calculate fees unless a feeStructure is replacing a time-period. */
  public feeStructure: { fee: bigint; from?: number; to?: number }[]
  public otokenVaultAddress: string
  public initialized = false

  // For balances under this threshold, we won't update the balance after rebases.
  public rebaseBalanceUpdateThreshold = parseUnits('.0001', 18)

  // Entity storage which should be reset after every `process`.
  private otokenMap: Map<string, OToken> = new Map()
  private addressMap: Map<string, OTokenAddress> = new Map()
  private changedAddressMap: Map<string, OTokenAddress> = new Map() // Only to contain addresses whose content has changed during the context.
  private histories: Map<string, OTokenHistory> = new Map()
  private apyMap: Map<string, OTokenAPY> = new Map()
  private rebaseMap: Map<string, OTokenRebase> = new Map()
  private rebaseOptions: OTokenRebaseOption[] = []
  private harvesterYieldSent: OTokenHarvesterYieldSent[] = []
  private yieldForwarded: OTokenYieldForwarded[] = []
  private dailyStats: Map<string, { block: Block; entity: OTokenDailyStat }> = new Map()
  private transfers: {
    block: Block
    transactionHash: string
    from: string
    fromBalance: bigint
    to: string
    toBalance: bigint
    value: bigint
  }[] = []

  constructor(
    otoken: OTokenClass,
    params: {
      name: string
      symbol: string
      from: number
      ctx: Context
      block: Block
      /** The OToken processor will use YieldDistribution events to
       *  calculate fees unless a feeStructure is replacing a time-period. */
      feeStructure: { fee: bigint; from?: number; to?: number }[]
      otokenVaultAddress: string
    },
  ) {
    this.otoken = otoken
    this.name = params.name
    this.symbol = params.symbol
    this.from = params.from
    this.ctx = params.ctx
    this.block = params.block
    this.feeStructure = params.feeStructure
    this.otokenVaultAddress = params.otokenVaultAddress
  }

  public async initialize() {
    // Load all addresses for this otoken into the addressMap
    const addresses = await this.ctx.store.find(OTokenAddress, {
      where: {
        chainId: this.ctx.chain.id,
        otoken: this.otoken.address,
      },
    })

    // Populate the addressMap with all retrieved addresses
    for (const address of addresses) {
      this.addressMap.set(address.address, address)
    }

    this.initialized = true
  }

  private async getOrCreateOTokenEntity(): Promise<OToken> {
    const id = `${this.ctx.chain.id}:${this.otoken.address}:${this.block.header.height}`
    let token = this.otokenMap.get(id)
    // We don't try to retrieve from database because this is unique per block.
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

  private async getAddress(account: string): Promise<OTokenAddress | undefined> {
    const id = `${this.ctx.chain.id}:${this.otoken.address}:${account}`
    let address = this.addressMap.get(account)
    if (!address) {
      address = await this.ctx.store.get(OTokenAddress, id)
    }
    return address
  }

  private async getOrCreateAddress(account: string): Promise<OTokenAddress> {
    const id = `${this.ctx.chain.id}:${this.otoken.address}:${account}`
    let address = this.addressMap.get(account)
    if (!address) {
      address = await this.ctx.store.get(OTokenAddress, account)
    }

    const isContractAddress =
      'isContract' in this.otoken
        ? await this.otoken.isContract(account) // Use logic from class if available (e.g. EIP7702 in OToken_2025_07_01)
        : await isContract(this.ctx, this.otoken.block, account, false)
    if (!address) {
      address = new OTokenAddress({
        id,
        chainId: this.ctx.chain.id,
        otoken: this.otoken.address,
        address: account,
        isContract: isContractAddress,
        rebasingOption: isContractAddress ? RebasingOption.OptOut : RebasingOption.OptIn, // Default
        credits: 0n,
        creditsPerToken: 0n,
        balance: 0n,
        earned: 0n,
        blockNumber: this.otoken.block.header.height,
        lastUpdated: new Date(this.otoken.block.header.timestamp),
        since: new Date(this.otoken.block.header.timestamp),
      })
    }
    this.addressMap.set(account, address)
    address.isContract = isContractAddress
    this.updateAddress(account)
    return address
  }

  /**
   * An update path which is not async.
   */
  private updateAddress(account: string, calculateEarnings = false): OTokenAddress {
    const address = this.addressMap.get(account)
    if (!address) throw new Error('All addresses should exist here: ' + account)

    const otoken = this.otoken as OToken_2025_03_04

    // Update entity with current values
    const balance = this.otoken.balanceOf(account)
    const [credits, creditsPerToken] = this.otoken.creditsBalanceOf(account)

    const yieldFrom = 'yieldFrom' in otoken ? otoken.yieldFrom[account] : null
    const yieldTo = 'yieldTo' in otoken ? otoken.yieldTo[account] : null
    if (calculateEarnings) {
      const earned = balance - address.balance
      address.earned += earned
    }
    address.credits = credits
    address.creditsPerToken = creditsPerToken
    address.balance = balance
    address.blockNumber = this.otoken.block.header.height
    address.lastUpdated = new Date(this.otoken.block.header.timestamp)
    address.yieldFrom = yieldFrom ?? null
    address.yieldTo = yieldTo ?? null

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

    this.changedAddressMap.set(account, address)
    return address
  }

  private async createHistory(
    trace: Trace,
    from: string | null,
    to: string | null,
    value: bigint,
  ): Promise<OTokenHistory[]> {
    const id = `${this.ctx.chain.id}:${trace.transaction!.hash}:${trace.traceAddress.join('-')}`
    const entries: OTokenHistory[] = []
    if (from) {
      const sentEntity = new OTokenHistory({
        id: `${id}-sent`,
        chainId: this.ctx.chain.id,
        otoken: this.otoken.address,
        address: await this.getOrCreateAddress(from),
        timestamp: new Date(this.otoken.block.header.timestamp),
        blockNumber: this.otoken.block.header.height,
        txHash: trace.transaction!.hash,
        type: HistoryType.Sent,
        value: value,
        balance: this.otoken.balanceOf(from),
      })
      this.histories.set(sentEntity.id, sentEntity)
      entries.push(sentEntity)
    }
    if (to) {
      const receivedEntity = new OTokenHistory({
        id: `${id}-received`,
        chainId: this.ctx.chain.id,
        otoken: this.otoken.address,
        address: await this.getOrCreateAddress(to),
        timestamp: new Date(this.otoken.block.header.timestamp),
        blockNumber: this.otoken.block.header.height,
        txHash: trace.transaction!.hash,
        type: HistoryType.Received,
        value: value,
        balance: this.otoken.balanceOf(to),
      })
      this.histories.set(receivedEntity.id, receivedEntity)
      entries.push(receivedEntity)
    }

    return entries
  }

  private async getOrCreateAPYEntity(trace: Trace): Promise<OTokenAPY> {
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
        this.apyMap.set(previousApy.id, previousApy)
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
        txHash: trace.transaction!.hash,
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
    apy.txHash = trace.transaction!.hash // Not a great field considering we can have more than one rebase per day.

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

  /**
   * @param trace The trace causing the rebase.
   * @param _yield The yield distributed to the OToken.
   * @param _fee The fee paid to the OToken.
   */
  private async getOrCreateRebaseEntity(trace: Trace, _yield: bigint, _fee: bigint): Promise<OTokenRebase> {
    const id = `${this.ctx.chain.id}:${this.otoken.address}:${this.block.header.height}-${trace.traceAddress.join('-')}`

    let rebase = this.rebaseMap.get(id)
    // We don't try to retrieve from database because this is unique per block & trace.

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
        txHash: trace.transaction!.hash,
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
    rebase.apy = await this.getOrCreateAPYEntity(trace)
    rebase.totalSupply = this.otoken.totalSupply
    rebase.rebasingCredits = this.otoken.rebasingCreditsHighres()
    rebase.rebasingCreditsPerToken = this.otoken.rebasingCreditsPerTokenHighres()
    rebase.timestamp = new Date(this.otoken.block.header.timestamp)
    rebase.blockNumber = this.otoken.block.header.height
    rebase.txHash = trace.transaction!.hash

    this.rebaseMap.set(id, rebase)
    return rebase
  }

  private yieldForwardInfo: Map<
    string,
    {
      from: string
      to: string
      balance: bigint
      forwardedBalance: bigint
      forwardedBalancePercentage: bigint
      yieldEarned: bigint
    }
  > = new Map()

  private accountEarningsByHour: Map<string, bigint> = new Map()

  beforeBlock() {
    this.yieldForwardInfo = new Map()
  }

  async afterMint(trace: Trace, to: string, value: bigint): Promise<void> {
    await this.getOrCreateOTokenEntity()
    await this.createHistory(trace, null, to, value)
    this.transfers.push({
      block: this.block,
      transactionHash: trace.transaction!.hash,
      from: '0x0000000000000000000000000000000000000000',
      fromBalance: 0n,
      to,
      toBalance: this.otoken.balanceOf(to),
      value,
    })
  }

  async afterBurn(trace: Trace, from: string, value: bigint): Promise<void> {
    await this.getOrCreateOTokenEntity()
    await this.createHistory(trace, from, null, value)
    this.transfers.push({
      block: this.block,
      transactionHash: trace.transaction!.hash,
      from,
      fromBalance: this.otoken.balanceOf(from),
      to: '0x0000000000000000000000000000000000000000',
      toBalance: 0n,
      value,
    })
  }

  async afterTransfer(trace: Trace, from: string, to: string, value: bigint): Promise<void> {
    await this.getOrCreateOTokenEntity()
    await this.createHistory(trace, from, to, value)
    this.transfers.push({
      block: this.block,
      transactionHash: trace.transaction!.hash,
      from,
      fromBalance: this.otoken.balanceOf(from),
      to,
      toBalance: this.otoken.balanceOf(to),
      value,
    })
  }

  async afterTransferFrom(trace: Trace, from: string, to: string, value: bigint): Promise<void> {
    await this.getOrCreateOTokenEntity()
    await this.createHistory(trace, from, to, value)
    this.transfers.push({
      block: this.block,
      transactionHash: trace.transaction!.hash,
      from,
      fromBalance: this.otoken.balanceOf(from),
      to,
      toBalance: this.otoken.balanceOf(to),
      value,
    })
  }

  // async afterApprove(trace: Trace, owner: string, spender: string, value: bigint): Promise<void> {
  // }

  async beforeChangeSupply(): Promise<void> {
    if ('yieldFrom' in this.otoken) {
      for (const account of Object.keys(this.otoken.creditBalances)) {
        const from = this.otoken.yieldFrom[account]
        if (from) {
          const balance = this.otoken.balanceOf(account)
          const forwardedBalance = this.otoken.balanceOf(from)
          const forwardedBalancePercentage = (forwardedBalance * 10n ** 18n) / (balance + forwardedBalance)
          const to = account
          // Thought is put into more than once change supply happening in the same block.
          // Also thought is put into there possibly being yield forwarded, then forwarding changing, and then yield forwarded again to somewhere else.
          // This will probably *never* happen, but I'm trying to account for it by using `from-to` as the key.
          const yieldEarned = this.yieldForwardInfo.get(`${from}-${to}`)?.yieldEarned ?? 0n
          this.yieldForwardInfo.set(`${from}-${to}`, {
            from,
            to,
            balance,
            forwardedBalance,
            forwardedBalancePercentage,
            yieldEarned,
          })
        }
      }
    }
  }

  async afterChangeSupply(trace: Trace, newTotalSupply: bigint, totalSupplyDiff: bigint): Promise<void> {
    if (totalSupplyDiff === 0n) return // Skip if there was no change in supply.
    await this.getOrCreateOTokenEntity()
    await this.getOrCreateAPYEntity(trace)

    // Fee Logic
    let _yield = 0n
    let _fee = 0n
    const feeDirective = this.feeStructure.find(
      (f) => (!f.from || f.from <= this.block.header.height) && (!f.to || f.to >= this.block.header.height),
    )
    if (feeDirective) {
      _fee = (totalSupplyDiff * feeDirective.fee) / (100n - feeDirective.fee) // Total supply diff does not include the fee.
      _yield = totalSupplyDiff + _fee // The yield shown here should represent all yield generated, including the fee.
      // This yield is different from daily stat yield which does *not* include the fee.
    } else {
      const yieldDistributionEvent = trace.transaction!.logs.find(
        (l) =>
          otokenVault.events.YieldDistribution.topic === l.topics[0] &&
          (l.address === this.otoken.vaultAddress || l.address === this.otokenVaultAddress),
      )
      const yieldDistributionEventData =
        yieldDistributionEvent && otokenVault.events.YieldDistribution.decode(yieldDistributionEvent)

      _yield = yieldDistributionEventData?._yield ?? 0n
      _fee = yieldDistributionEventData?._fee ?? 0n
    }

    // Create Rebase Entity
    await this.getOrCreateRebaseEntity(trace, _yield, _fee)

    // Trying not to have any async calls within this loop.
    for (const account of Object.keys(this.otoken.creditBalances)) {
      //Delete previous hour accrual
      const previousDateHour = dayjs(this.otoken.block.header.timestamp).subtract(1, 'hour').toISOString().slice(0, 13)
      this.accountEarningsByHour.delete(previousDateHour)
      if (this.otoken.balanceOf(account) > this.rebaseBalanceUpdateThreshold) {
        const dateHour = dayjs(this.otoken.block.header.timestamp).toISOString().slice(0, 13) // Date including hour
        const id = `${this.ctx.chain.id}-${this.otoken.address}-${account}-${dateHour}`

        // Get the address first so we can see it's earnings prior to being updated.
        let address = this.addressMap.get(account)!
        if (!address) throw new Error('Address should be cached: ' + account)
        const earned = address.earned

        // Update the address state and check new earnings.
        address = this.updateAddress(account, true)
        const earnedDiff = address.earned - earned

        if (earnedDiff > 0n) {
          const hourlyEarnings = (this.accountEarningsByHour.get(id) ?? 0n) + earnedDiff
          this.accountEarningsByHour.set(id, hourlyEarnings)
          const history = new OTokenHistory({
            id,
            chainId: this.ctx.chain.id,
            otoken: this.otoken.address,
            address,
            timestamp: new Date(this.otoken.block.header.timestamp),
            blockNumber: this.otoken.block.header.height,
            txHash: trace.transaction!.hash,
            type: HistoryType.Yield,
            value: hourlyEarnings,
            balance: this.otoken.balanceOf(account),
          })
          this.histories.set(history.id, history)
        }
      }
    }
    // Calculate Yield Forwarded
    if (isYieldDelegationContract(this.otoken)) {
      const otoken = this.otoken as OToken_2025_03_04 // We need a type which has yield delegation properties on it.
      for (const to of Object.keys(otoken.creditBalances)) {
        const from = otoken.yieldFrom[to]
        if (from) {
          const yieldForwardInfo = this.yieldForwardInfo.get(`${from}-${to}`)!
          const newBalance = otoken.balanceOf(to)
          const yieldEarned = newBalance - yieldForwardInfo.balance
          const yieldEarnedFromForwarding = (yieldEarned * yieldForwardInfo.forwardedBalancePercentage) / 10n ** 18n
          yieldForwardInfo.yieldEarned += yieldEarnedFromForwarding
        }
      }
    }
  }

  async createRebasingOption(trace: Trace, account: string) {
    const traceAddress = trace.traceAddress.join('-')
    const address = await this.getOrCreateAddress(account)
    this.rebaseOptions.push(
      new OTokenRebaseOption({
        id: `${this.ctx.chain.id}-${trace.transaction!.hash}-${traceAddress}-${account}`,
        chainId: this.ctx.chain.id,
        otoken: this.otoken.address,
        timestamp: new Date(this.otoken.block.header.timestamp),
        blockNumber: this.otoken.block.header.height,
        txHash: trace.transaction!.hash,
        address,
        status: address.rebasingOption,
        delegatedTo: address.yieldTo ?? null,
      }),
    )
  }

  async afterDelegateYield(trace: Trace, from: string, to: string): Promise<void> {
    await this.getOrCreateAddress(from)
    await this.getOrCreateAddress(to)
    await this.createRebasingOption(trace, from)
    await this.createRebasingOption(trace, to)
  }

  async afterUndelegateYield(trace: Trace, from: string, to: string): Promise<void> {
    await this.getOrCreateAddress(from)
    await this.getOrCreateAddress(to)
    await this.createRebasingOption(trace, from)
    await this.createRebasingOption(trace, to)
  }

  async afterRebaseOptIn(trace: Trace, account: string): Promise<void> {
    await this.getOrCreateOTokenEntity()
    await this.getOrCreateAddress(account)
    await this.createRebasingOption(trace, account)
  }

  async afterRebaseOptOut(trace: Trace, account: string): Promise<void> {
    await this.getOrCreateOTokenEntity()
    await this.getOrCreateAddress(account)
    await this.createRebasingOption(trace, account)
  }

  async afterBlock() {
    if (!this.otoken) return

    await getOTokenDailyStat(this.ctx, this.block, this.otoken.address, this.dailyStats)

    for (const info of this.yieldForwardInfo.values()) {
      this.yieldForwarded.push(
        new OTokenYieldForwarded({
          id: `${this.ctx.chain.id}-${this.otoken.address}-${this.otoken.block.header.height}-${info.from}-${info.to}`,
          chainId: this.ctx.chain.id,
          otoken: this.otoken.address,
          timestamp: new Date(this.otoken.block.header.timestamp),
          blockNumber: this.otoken.block.header.height,
          from: info.from,
          to: info.to,
          fromBalance: info.forwardedBalance,
          amount: info.yieldEarned,
        }),
      )
    }
  }

  async afterContext(params: Parameters<typeof createOTokenProcessor2>[0]) {
    if (!this.otoken) return
    await processOTokenDailyStats(this.ctx, {
      ...params,
      balances: new Map(Array.from(this.addressMap.values()).map((address) => [address.address, address.balance])),
      otokens: Array.from(this.otokenMap.values()),
      apies: Array.from(this.apyMap.values()),
      rebases: Array.from(this.rebaseMap.values()),
      dailyStats: this.dailyStats,
      forceUpdate: this.hasChanges(),
    })
  }

  async processHarvesterYieldSent(ctx: Context, block: Block, log: Log) {
    const data = otokenHarvester.events.YieldSent.decode(log)
    this.harvesterYieldSent.push(
      new OTokenHarvesterYieldSent({
        id: log.id,
        chainId: ctx.chain.id,
        blockNumber: block.header.height,
        timestamp: new Date(block.header.timestamp),
        otoken: this.otoken.address,
        txHash: log.transactionHash,
        yield: data.yield,
        fee: data.fee,
      }),
    )
  }

  async save(): Promise<void> {
    if (!this.otoken) return

    const [erc20s] = await Promise.all([
      // ERC20
      processOTokenERC20(this.ctx, {
        name: this.name,
        symbol: this.symbol,
        otokenAddress: this.otoken.address,
        otokens: Array.from(this.otokenMap.values()),
        addresses: Array.from(this.changedAddressMap.values()),
        history: Array.from(this.histories.values()),
        transfers: this.transfers,
      }).then((erc20s) =>
        Promise.all([
          this.ctx.store.insert([...erc20s.states.values()]),
          this.ctx.store.upsert([...erc20s.statesByDay.values()]),
          this.ctx.store.upsert([...erc20s.holders.values()]),
          this.ctx.store.upsert([...erc20s.balances.values()]),
          this.ctx.store.insert(erc20s.transfers),
          this.ctx.store.remove(
            [...erc20s.removedHolders.values()].map(
              (account) => new ERC20Holder({ id: `${this.ctx.chain.id}-${this.otoken.address}-${account}` }),
            ),
          ),
        ]).then(() => erc20s),
      ),
      // OToken Entity Saving,
      Promise.all([
        // These must be saved first.
        this.ctx.store.upsert([...this.apyMap.values()]),
        this.ctx.store.upsert([...this.changedAddressMap.values()]),
      ]).then(() =>
        Promise.all([
          this.ctx.store.insert([...this.otokenMap.values()]),
          this.ctx.store.upsert([...this.rebaseMap.values()]),
          this.ctx.store.upsert([...this.histories.values()]),
          this.ctx.store.insert(this.rebaseOptions),
          this.ctx.store.insert(this.harvesterYieldSent),
          this.ctx.store.upsert([...this.dailyStats.values()].map((ds) => ds.entity)),
          this.ctx.store.upsert([...this.yieldForwarded.values()]),
        ]),
      ),
    ])

    if (process.env.DEBUG_PERF === 'true') {
      // Log the quantity of items saved
      const totalItemsSaved =
        this.changedAddressMap.size +
        this.otokenMap.size +
        this.apyMap.size +
        this.rebaseMap.size +
        this.histories.size +
        this.rebaseOptions.length +
        this.harvesterYieldSent.length +
        [...this.dailyStats.values()].length +
        this.yieldForwarded.length +
        erc20s.states.size +
        erc20s.statesByDay.size +
        erc20s.holders.size +
        erc20s.balances.size +
        erc20s.transfers.length +
        erc20s.removedHolders.size

      this.ctx.log.info(
        {
          addresses: this.changedAddressMap.size,
          otokens: this.otokenMap.size,
          apy: this.apyMap.size,
          rebases: this.rebaseMap.size,
          histories: this.histories.size,
          rebaseOptions: this.rebaseOptions.length,
          harvesterYieldSent: this.harvesterYieldSent.length,
          dailyStats: [...this.dailyStats.values()].length,
          yieldForwarded: this.yieldForwarded.length,
          erc20States: erc20s.states.size,
          erc20StatesByDay: erc20s.statesByDay.size,
          erc20Holders: erc20s.holders.size,
          erc20Balances: erc20s.balances.size,
          erc20Transfers: erc20s.transfers.length,
          erc20RemovedHolders: erc20s.removedHolders.size,
          totalItemsSaved: totalItemsSaved,
        },
        'OToken entity producer saved items',
      )
    }

    // Reset the entity storage.
    this.otokenMap = new Map()
    // We don't reset `this.addressMap` - keep it in memory for performance.
    this.changedAddressMap = new Map()
    this.histories = new Map()
    this.apyMap = new Map()
    this.rebaseMap = new Map()
    this.rebaseOptions = []
    this.harvesterYieldSent = []
    this.yieldForwarded = []
    const dayString = new Date(this.ctx.blocks.at(-1)!.header.timestamp).toISOString().substring(0, 10)
    this.dailyStats = new Map([...this.dailyStats.entries()].filter(([_key, value]) => value.entity.date === dayString))
    this.transfers = []
  }

  hasChanges() {
    return (
      this.otokenMap.size > 0 ||
      this.changedAddressMap.size > 0 ||
      this.histories.size > 0 ||
      this.apyMap.size > 0 ||
      this.rebaseMap.size > 0 ||
      this.rebaseOptions.length > 0 ||
      this.harvesterYieldSent.length > 0 ||
      this.yieldForwarded.length > 0 ||
      this.transfers.length > 0
    )
  }
}
