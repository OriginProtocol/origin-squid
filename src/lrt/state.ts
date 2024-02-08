import {
  Entity,
  EntityClass,
  FindManyOptions,
  FindOneOptions,
} from '@subsquid/typeorm-store/src/store'
import { sortBy, uniqBy } from 'lodash'
import { EntityManager, In, IsNull, MoreThan, Not, Repository } from 'typeorm'

import {
  LRTBalanceData,
  LRTDeposit,
  LRTNodeDelegator,
  LRTNodeDelegatorHoldings,
  LRTPointRecipient,
  LRTSummary,
} from '../model'
import { Context } from '../processor'
import { encodeAddress } from './encoding'
import { referrerList } from './referals'

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
    relations: { recipient: true },
  })
  const state = useLrtState()
  const localResults = Array.from(state.balanceData.values()).filter((d) => {
    return d.recipient.id === recipient && d.balance > 0n
  })
  return sortBy(uniqBy([...localResults, ...dbResults], 'id'), 'id') // order pref for local
}

export const find = <E extends Entity>(
  ctxOrEm: Context | EntityManager,
  entityClass: EntityClass<E>,
  options?: FindManyOptions<E>,
) => {
  return 'store' in ctxOrEm
    ? ctxOrEm.store.find(entityClass, options)
    : ctxOrEm.find(entityClass, options)
}

export const findOne = <E extends Entity>(
  ctxOrEm: Context | EntityManager,
  entityClass: EntityClass<E>,
  options: FindOneOptions<E>,
) => {
  return 'store' in ctxOrEm
    ? ctxOrEm.store.findOne(entityClass, options)
    : ctxOrEm.findOne(entityClass, options)
}

export const getRecipient = async (
  ctxOrEm: Context | EntityManager,
  id: string,
) => {
  const state = useLrtState()
  let recipient = state.recipients.get(id)
  if (!recipient) {
    if ('store' in ctxOrEm) {
      recipient = await ctxOrEm.store.get(LRTPointRecipient, {
        where: { id },
        relations: { balanceData: true },
      })
    } else {
      recipient =
        (await ctxOrEm.findOne(LRTPointRecipient, {
          where: { id },
          relations: { balanceData: true },
        })) ?? undefined
    }
    if (!recipient) {
      recipient = new LRTPointRecipient({
        id,
        balance: 0n,
        points: 0n,
        pointsDate: new Date(0),
        referralPoints: 0n,
        elPoints: 0n,
        balanceData: [],
        referrerCount: 0,
        referralCount: 0,
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
