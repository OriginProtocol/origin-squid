import crypto from 'crypto'
import { compact } from 'lodash'

import { Block, Context, Trace } from '@originprotocol/squid-utils'
import { isContract } from '@utils/isContract'

import { HistoryType, OToken, OTokenAddress, OTokenHistory } from '../../model'
import { RebasingOption } from '../../model/generated/_rebasingOption'
import { OToken_2023_12_21 } from './otoken-2023-12-21'
import { OToken_2025_03_04 } from './otoken-2025-03-04'

export class OTokenEntityProducer {
  otoken: OToken_2023_12_21 | OToken_2025_03_04
  private ctx: Context
  private block: Block
  private otokenMap: Map<string, OToken> = new Map()
  private addressMap: Map<string, OTokenAddress> = new Map()
  private histories: OTokenHistory[] = []

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

    address.balance = balance
    address.credits = credits
    address.alternativeCreditsPerToken = creditsPerToken
    address.blockNumber = this.otoken.block.header.height
    address.lastUpdated = new Date(this.otoken.block.header.timestamp)
    address.yieldFrom = otoken.yieldFrom[account] ? await this.getOrCreateAddress(otoken.yieldFrom[account]) : null
    address.yieldTo = otoken.yieldTo[account] ? await this.getOrCreateAddress(otoken.yieldTo[account]) : null
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
    const id = `${this.ctx.chain.id}:${this.otoken.address}:${this.otoken.block.header.height}:${crypto
      .createHash('sha256')
      .update(JSON.stringify({ hash: trace.transaction?.hash, id: trace.traceAddress, from, to, value }))
      .digest('hex')
      .substring(0, 8)}`

    const entries = compact([
      from
        ? new OTokenHistory({
            id,
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
            id,
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

  async afterApprove(trace: Trace, owner: string, spender: string, value: bigint): Promise<void> {
    await this.getOrCreateTokenEntity()
    await this.createHistory(trace, owner, spender, value)
  }

  async afterChangeSupply(): Promise<void> {
    await this.getOrCreateTokenEntity()
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
    await this.ctx.store.insert(this.histories)

    this.otokenMap.clear()
    this.addressMap.clear()
    this.histories = []
  }
}
