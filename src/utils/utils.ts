import { Entity, EntityClass } from '@subsquid/typeorm-store'
import { LessThanOrEqual } from 'typeorm'
import { pad } from 'viem'

import * as erc20 from '../abi/erc20'
import { Context } from '../processor'

export const max = (values: bigint[], start = 0n) => {
  return values.reduce((max, v) => (max > v ? max : v), start)
}

export const lastExcept = <
  T extends {
    id: string
  },
>(
  arr: T[] | undefined,
  id: string,
) =>
  arr
    ? arr[arr.length - 1]?.id === id
      ? arr[arr.length - 2]
      : arr[arr.length - 1]
    : undefined

export const trackAddressBalances = async ({
  log,
  address,
  tokens,
  fn,
}: {
  log: Context['blocks']['0']['logs']['0']
  address: string
  tokens: string[]
  fn: (params: {
    address: string
    token: string
    change: bigint
    log: Context['blocks']['0']['logs']['0']
    data: ReturnType<typeof erc20.events.Transfer.decode>
  }) => Promise<void>
}) => {
  const paddedAddress = pad(address as `0x${string}`)
  if (
    (log.topics[1]?.toLowerCase() === paddedAddress ||
      log.topics[2]?.toLowerCase() === paddedAddress) &&
    tokens.includes(log.address.toLowerCase())
  ) {
    const data = erc20.events.Transfer.decode(log)
    if (data.value > 0n) {
      const change =
        data.from.toLowerCase() === address ? -data.value : data.value
      await fn({ address, token: log.address, change, log, data })
    }
  }
}

export const getLatestEntity = async <T extends Entity>(
  ctx: Context,
  entity: EntityClass<T>,
  memory: T[],
  id: string,
) => {
  const current = memory.slice(memory.length - 1).find((v) => v.id === id)
  const latest =
    memory[memory.length - 1] ??
    (await ctx.store.findOne(entity as EntityClass<Entity>, {
      where: { id: LessThanOrEqual(id) },
      order: { id: 'desc' },
    }))
  return { current, latest }
}

export const getOrCreate = async <T extends Entity>(
  ctx: Context,
  entity: EntityClass<T>,
  memory: T[],
  id: string,
  createNew: (latest: T | undefined) => T,
) => {
  const current = memory.slice(memory.length - 1).find((v) => v.id === id)
  if (current) return current
  const latest =
    memory[memory.length - 1] ??
    (await ctx.store.findOne(entity as EntityClass<Entity>, {
      where: { id: LessThanOrEqual(id) },
      order: { id: 'desc' },
    }))

  const value = createNew(latest)
  memory.push(value)

  return value
}

export const convertDecimals = (from: number, to: number, value: bigint) => {
  const fromFactor = 10n ** BigInt(from)
  const toFactor = 10n ** BigInt(to)
  return (value * toFactor) / fromFactor
}
