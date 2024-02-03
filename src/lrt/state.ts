import { sortBy, uniqBy } from 'lodash'
import { IsNull, LessThanOrEqual, MoreThan } from 'typeorm'

import {
  LRTBalanceCondition,
  LRTBalanceData,
  LRTDeposit,
  LRTNodeDelegator,
  LRTPointRecipient,
} from '../model'
import { Context } from '../processor'
import { useProcessorState } from '../utils/state'

export const useLrtState = (ctx: Context) =>
  useProcessorState(ctx, 'lrt-processor', {
    deposits: new Map<string, LRTDeposit>(),
    recipients: new Map<string, LRTPointRecipient>(),
    balanceData: new Map<string, LRTBalanceData>(),
    balanceCondition: new Map<string, LRTBalanceCondition>(),
    nodeDelegators: new Map<string, LRTNodeDelegator>(),
  })[0]

export const getBalanceDataForRecipient = async (
  ctx: Context,
  timestamp: Date,
  recipient: string,
) => {
  const dbResults = await ctx.store.find(LRTBalanceData, {
    relations: { conditions: true },
    where: [
      {
        recipient: { id: recipient },
        balance: MoreThan(0n),
        conditions: {
          startDate: LessThanOrEqual(timestamp),
          endDate: IsNull(),
        },
      },
      {
        recipient: { id: recipient },
        balance: MoreThan(0n),
        conditions: {
          startDate: LessThanOrEqual(timestamp),
          endDate: MoreThan(timestamp),
        },
      },
    ],
  })
  const state = useLrtState(ctx)
  const localResults = Array.from(state.balanceData.values()).filter((d) => {
    return (
      d.recipient.id === recipient &&
      d.balance > 0n &&
      d.conditions.find((c) => {
        return c.startDate <= timestamp && (!c.endDate || c.endDate > timestamp)
      })
    )
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
