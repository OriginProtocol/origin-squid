import { sortBy, uniqBy } from 'lodash'
import { MoreThan } from 'typeorm'

import {
  LRTBalanceData,
  LRTDeposit,
  LRTNodeDelegator,
  LRTNodeDelegatorHoldings,
  LRTPointRecipient,
  LRTSummary,
} from '../model'
import { Context } from '../processor'

const state = {
  deposits: new Map<string, LRTDeposit>(),
  recipients: new Map<string, LRTPointRecipient>(),
  balanceData: new Map<string, LRTBalanceData>(),
  nodeDelegators: new Map<string, LRTNodeDelegator>(),
  nodeDelegatorHoldings: new Map<string, LRTNodeDelegatorHoldings>(),
}

export const useLrtState = () => state

export const getBalanceDataForRecipient = async (
  ctx: Context,
  recipient: string,
) => {
  const dbResults = await ctx.store.find(LRTBalanceData, {
    where: [
      {
        recipient: { id: recipient },
        balance: MoreThan(0n),
      },
    ],
    order: { id: 'asc' },
    relations: { recipient: true },
  })
  const state = useLrtState()
  const localResults = Array.from(state.balanceData.values()).filter((d) => {
    return d.recipient.id === recipient && d.balance > 0n
  })
  return sortBy(uniqBy([...localResults, ...dbResults], 'id'), 'id') // order pref for local
}

export const getRecipient = async (ctx: Context, id: string) => {
  const state = useLrtState()
  let recipient = state.recipients.get(id)
  if (!recipient) {
    recipient = await ctx.store.get(LRTPointRecipient, {
      where: { id },
      relations: { balanceData: true },
    })
    if (!recipient) {
      recipient = new LRTPointRecipient({
        id,
        balance: 0n,
        points: 0n,
        elPoints: 0n,
        pointsDate: new Date(0),
        balanceData: [],
      })
    }
    state.recipients.set(id, recipient)
  }
  return recipient
}

export const getLatestNodeDelegator = async (ctx: Context, node: string) => {
  return await ctx.store.findOne(LRTNodeDelegator, {
    order: { id: 'desc' },
    where: { node },
    relations: {
      holdings: true,
    },
  })
}

export const getLastSummary = async (ctx: Context) => {
  return await ctx.store
    .find(LRTSummary, {
      take: 1,
      order: { id: 'desc' },
    })
    .then((r) => r[0])
}
