import { Context } from '@originprotocol/squid-utils'
import { Entity, EntityClass } from '@subsquid/typeorm-store/lib/store'
import { validateBlocks } from '@validation/validate'

export const name = 'validate-sonic'

const expectationSets: {
  entity: EntityClass<any>
  expectations: (Entity & {
    timestamp: string
    blockNumber: number
  })[]
}[] = []

export const process = async (ctx: Context) => {
  await validateBlocks(ctx, expectationSets)
}
