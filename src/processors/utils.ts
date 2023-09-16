import { Context } from '../processor'
import * as erc20 from '../abi/erc20'
import { Entity, EntityClass } from '@subsquid/typeorm-store'
import { LessThanOrEqual } from 'typeorm'

export const trackAddressBalances = async ({
  log,
  data,
  address,
  tokens,
  fn,
}: {
  log: Context['blocks']['0']['logs']['0']
  data: ReturnType<typeof erc20.events.Transfer.decode>
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
  if (
    data.value > 0n &&
    (data.from.toLowerCase() === address ||
      data.to.toLowerCase() === address) &&
    tokens.includes(log.address)
  ) {
    const change = data.from === address ? -data.value : data.value
    await fn({ address, token: log.address, change, log, data })
  }
}

export const getLatest = async <T extends Entity>(
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
