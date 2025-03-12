import { UtilCache } from '@model'
import { Block, Context } from '@originprotocol/squid-utils'

let time = 0
let count = 0

let cache: Map<string, boolean>

/**
 * I've found we cannot cache this because it may change.
 */
export const isContract = async (ctx: Context, block: Block, account: string): Promise<boolean> => {
  if (account === '0x0000000000000000000000000000000000000000') return false
  if (!ctx.isHead && cache.has(account)) {
    return cache.get(account)!
  }
  const start = Date.now()

  let codeAtBlock
  let codeAtLatest

  if (ctx.isHead) {
    codeAtBlock = await ctx._chain.client.call('eth_getCode', [account, `0x${block.header.height.toString(16)}`])
  } else {
    const batchResult = await ctx._chain.client.batchCall([
      {
        method: 'eth_getCode',
        params: [account, `latest`],
      },
      {
        method: 'eth_getCode',
        params: [account, `0x${block.header.height.toString(16)}`],
      },
    ])
    codeAtLatest = batchResult[0]
    codeAtBlock = batchResult[1]
    if (codeAtBlock === codeAtLatest) {
      cache.set(account, codeAtLatest !== '0x')
    }
  }

  time += Date.now() - start
  count++
  if (process.env.DEBUG_PERF === 'true') {
    ctx.log.info(`isContract ${count} ${time / count}`)
  }
  return codeAtBlock !== '0x'
}

export const loadIsContractCache = async (ctx: Context) => {
  if (cache) return
  const entity = await ctx.store.get(UtilCache, `${ctx.chain.id}-isContract`)
  if (entity) {
    cache = new Map<string, boolean>(Object.entries(entity.data as Record<string, boolean>))
  } else {
    cache = new Map<string, boolean>()
  }
}

export const saveIsContractCache = async (ctx: Context) => {
  await ctx.store.save(
    new UtilCache({
      id: `${ctx.chain.id}-isContract`,
      data: Object.fromEntries(cache),
    }),
  )
}
