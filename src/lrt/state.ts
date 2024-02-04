import { sortBy, uniqBy } from 'lodash'
import { IsNull, LessThanOrEqual, MoreThan } from 'typeorm'

import {
  LRTBalanceData,
  LRTDeposit,
  LRTNodeDelegator,
  LRTNodeDelegatorHoldings,
  LRTPointRecipient,
} from '../model'
import { Block, Context } from '../processor'
import { useProcessorState } from '../utils/state'
import { addresses } from './config'

export const useLrtState = (ctx: Context) =>
  useProcessorState(ctx, 'lrt-processor', {
    deposits: new Map<string, LRTDeposit>(),
    recipients: new Map<string, LRTPointRecipient>(),
    balanceData: new Map<string, LRTBalanceData>(),
    nodeDelegators: new Map<string, LRTNodeDelegator>(),
    nodeDelegatorHoldings: new Map<string, LRTNodeDelegatorHoldings>(),
  })[0]

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
  })
  const state = useLrtState(ctx)
  const localResults = Array.from(state.balanceData.values()).filter((d) => {
    return d.recipient.id === recipient && d.balance > 0n
  })
  return sortBy(uniqBy([...localResults, ...dbResults], 'id'), 'id') // order pref for local
}

export const getRecipient = async (ctx: Context, id: string) => {
  const state = useLrtState(ctx)
  let depositor = state.recipients.get(id)
  if (!depositor) {
    depositor = await ctx.store.get(LRTPointRecipient, {
      where: { id },
      relations: { balanceData: true },
    })
    if (!depositor) {
      depositor = new LRTPointRecipient({
        id,
        balance: 0n,
        points: 0n,
        pointsDate: new Date(0),
        balanceData: [],
      })
    }
    state.recipients.set(id, depositor)
  }
  return depositor
}

export const getLatestNodeDelegators = async (ctx: Context) => {
  return await Promise.all(
    addresses.nodeDelegators.map((node) => getLatestNodeDelegator(ctx, node)),
  )
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
