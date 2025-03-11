import dayjs from 'dayjs'
import { findLast } from 'lodash'

import {
  ERC20Balance,
  ERC20Holder,
  ERC20State,
  ERC20StateByDay,
  ERC20Transfer,
  OToken,
  OTokenAddress,
  OTokenHistory,
} from '@model'
import { Block, Context } from '@originprotocol/squid-utils'

export const processOTokenERC20 = async (
  ctx: Context,
  params: {
    otokenAddress: string
    otokens: OToken[]
    addresses: OTokenAddress[]
    history: OTokenHistory[]
    transfers: {
      block: Block
      transactionHash: string
      from: string
      fromBalance: bigint
      to: string
      toBalance: bigint
      value: bigint
    }[]
  },
) => {
  const result = {
    states: new Map<string, ERC20State>(),
    statesByDay: new Map<string, ERC20StateByDay>(),
    balances: new Map<string, ERC20Balance>(),
    transfers: [] as ERC20Transfer[],
    holders: new Map<string, ERC20Holder>(),
    removedHolders: new Set<string>(),
  }
  // Create ERC20 entities based on OToken entities
  for (const otoken of params.otokens) {
    const erc20State = new ERC20State({
      id: `${ctx.chain.id}-${otoken.blockNumber}-${otoken.otoken}`,
      chainId: ctx.chain.id,
      address: otoken.otoken,
      timestamp: otoken.timestamp,
      blockNumber: otoken.blockNumber,
      totalSupply: otoken.totalSupply,
      holderCount: otoken.holderCount,
    })
    result.states.set(erc20State.id, erc20State)
  }
  const ownersToUpdate = params.addresses
  for (const owner of ownersToUpdate) {
    if (owner.balance === 0n) {
      result.removedHolders.add(owner.address)
    } else {
      const erc20Holder = new ERC20Holder({
        id: `${ctx.chain.id}-${owner.otoken}-${owner.address}`,
        chainId: ctx.chain.id,
        address: owner.otoken,
        account: owner.address,
        since: owner.since!,
        balance: owner.balance,
      })
      if (!erc20Holder.since) {
        debugger
      }
      result.holders.set(erc20Holder.id, erc20Holder)
    }
  }
  for (const history of params.history) {
    const id = `${ctx.chain.id}-${history.blockNumber}-${history.otoken}-${history.address.address}`
    result.balances.set(
      id,
      new ERC20Balance({
        id,
        chainId: ctx.chain.id,
        address: history.otoken,
        account: history.address.address,
        timestamp: history.timestamp,
        blockNumber: history.blockNumber,
        balance: history.balance,
      }),
    )
  }
  // Generate ERC20StateByDay entities.
  let lastStateByDay = await ctx.store.findOne(ERC20StateByDay, {
    where: { chainId: ctx.chain.id, address: params.otokenAddress },
    order: { timestamp: 'DESC' },
  })

  const states = [...result.states.values()]
  const startDate = lastStateByDay
    ? dayjs.utc(lastStateByDay.timestamp).endOf('day')
    : states[0]
    ? dayjs.utc(states[0].timestamp).endOf('day')
    : null
  if (startDate) {
    const endDate = dayjs.utc(ctx.blocks[ctx.blocks.length - 1].header.timestamp).endOf('day')

    // Ensure we create an entry for every day
    for (let day = startDate; day.isBefore(endDate) || day.isSame(endDate, 'day'); day = day.add(1, 'day')) {
      const date = day.format('YYYY-MM-DD')
      const dayEnd = day.endOf('day')
      const mostRecentState = findLast(
        states,
        (s) => dayjs.utc(s.timestamp).isBefore(dayEnd) || dayjs.utc(s.timestamp).isSame(dayEnd),
      )
      const stateByDay = new ERC20StateByDay({
        ...(mostRecentState ?? lastStateByDay ?? states[0]), // Fallback to first state if no previous state exists
        id: `${ctx.chain.id}-${date}-${params.otokenAddress}`,
        date,
      })
      result.statesByDay.set(stateByDay.id, stateByDay)
      lastStateByDay = stateByDay
    }
  }

  let transactionCounts = new Map<string, number>()
  for (const transfer of params.transfers) {
    const transferCount = (transactionCounts.get(transfer.transactionHash) ?? 0) + 1
    transactionCounts.set(transfer.transactionHash, transferCount)
    const erc20Id = `${ctx.chain.id}-${transfer.transactionHash}-${transferCount}`
    result.transfers.push(
      new ERC20Transfer({
        id: erc20Id,
        chainId: ctx.chain.id,
        txHash: transfer.transactionHash,
        blockNumber: transfer.block.header.height,
        timestamp: new Date(transfer.block.header.timestamp),
        address: params.otokenAddress,
        from: transfer.from,
        fromBalance: transfer.fromBalance,
        to: transfer.to,
        toBalance: transfer.toBalance,
        value: transfer.value,
      }),
    )
  }

  return result
}
