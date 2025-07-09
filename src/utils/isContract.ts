import { existsSync, readFileSync, writeFileSync } from 'fs'

import { UtilCache } from '@model'
import { Block, Context } from '@originprotocol/squid-utils'

let time = 0
let count = 0

const localStoragePath = './data'
let cache: Map<string, { value: boolean; expiresAt: number; validFrom: number }>

/**
 * I've found we cannot cache this because it may change.
 */
export const isContract = async (ctx: Context, block: Block, account: string): Promise<boolean> => {
  if (account === '0x0000000000000000000000000000000000000000') return false
  if (cache.has(account)) {
    const entry = cache.get(account)!
    if (entry.expiresAt > block.header.timestamp && entry.validFrom <= block.header.timestamp) {
      return entry.value
    }
  }
  const start = Date.now()

  let codeAtBlock
  let codeAtLatest

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

  // EIP-7702: https://eips.ethereum.org/EIPS/eip-7702
  // Check if code length is 23 bytes and starts with 0xef0100
  const eip7702 = codeAtBlock.length === 23 * 2 + 2 && codeAtBlock.startsWith('0xef0100')
  const isEOA = codeAtBlock === '0x' || eip7702
  if (codeAtBlock === codeAtLatest) {
    cache.set(account, {
      value: !isEOA,
      expiresAt: Date.now(),
      validFrom: block.header.timestamp,
    })
  }

  time += Date.now() - start
  count++
  if (process.env.DEBUG_PERF === 'true') {
    ctx.log.info(`isContract ${count} ${time / count}`)
  }
  return !isEOA
}

/**
 * Batch check if multiple accounts are contracts
 * @param ctx Context
 * @param block Block
 * @param accounts Array of account addresses to check
 * @returns Map of account addresses to boolean indicating if they are contracts
 */
export const areContracts = async (ctx: Context, block: Block, accounts: string[]): Promise<Map<string, boolean>> => {
  if (!accounts.length) return new Map()

  const result = new Map<string, boolean>()
  const accountsToCheck: string[] = []

  // First check cache and filter out zero address
  for (const account of accounts) {
    if (account === '0x0000000000000000000000000000000000000000') {
      result.set(account, false)
      continue
    }

    if (cache.has(account)) {
      const entry = cache.get(account)!
      if (entry.expiresAt > block.header.timestamp && entry.validFrom <= block.header.timestamp) {
        result.set(account, entry.value)
        continue
      }
    }

    accountsToCheck.push(account)
  }

  if (!accountsToCheck.length) return result

  const start = Date.now()

  // For historical blocks, we can check both latest and at block
  const batchCalls = accountsToCheck.flatMap((account) => [
    {
      method: 'eth_getCode',
      params: [account, 'latest'],
    },
    {
      method: 'eth_getCode',
      params: [account, `0x${block.header.height.toString(16)}`],
    },
  ])

  const batchResults = await ctx._chain.client.batchCall(batchCalls)

  for (let i = 0; i < accountsToCheck.length; i++) {
    const account = accountsToCheck[i]
    const codeAtLatest = batchResults[i * 2]
    const codeAtBlock = batchResults[i * 2 + 1]

    const isContractValue = codeAtBlock !== '0x'
    result.set(account, isContractValue)

    // Update cache if the code is the same at latest and at block
    if (codeAtBlock === codeAtLatest) {
      cache.set(account, {
        value: isContractValue,
        expiresAt: Date.now(),
        validFrom: block.header.timestamp,
      })
    }
  }

  time += Date.now() - start
  count++
  if (process.env.DEBUG_PERF === 'true') {
    ctx.log.info(
      `areContracts batch of ${accountsToCheck.length}: ${Date.now() - start}ms, avg total: ${time / count}ms`,
    )
  }

  return result
}

export const loadIsContractCache = async (ctx: Context) => {
  if (cache) return
  const id = `${ctx.chain.id}-isContract`
  const entity = await ctx.store.get(UtilCache, id)
  if (entity) {
    const data = entity.data as Record<string, { value: boolean; expiresAt: number; validFrom?: number }>
    cache = new Map(
      Object.entries(data).map(([key, value]) => {
        return [key, { ...value, validFrom: value.validFrom ?? 0 }]
      }),
    )
    ctx.log.info('Loaded isContract cache from database: ' + cache.size + ' entries')
  } else if (existsSync(`${localStoragePath}/${id}.json`)) {
    try {
      const fileData = JSON.parse(readFileSync(`${localStoragePath}/${id}.json`, 'utf8'))
      cache = new Map(
        Object.entries(fileData).map(([key, value]: [string, any]) => {
          return [key, { ...value, validFrom: value.validFrom ?? 0 }]
        }),
      )
      ctx.log.info('Loaded isContract cache from file: ' + cache.size + ' entries')
    } catch (e) {
      console.error('Error loading isContract cache from file:', e)
      cache = new Map()
    }
  } else {
    cache = new Map()
  }
}

// save once every ~5 minutes
let lastSave = 0
export const saveIsContractCache = async (ctx: Context) => {
  if (!cache) return
  if (Date.now() - lastSave < 5 * 60 * 1000) return
  const id = `${ctx.chain.id}-isContract`
  if (process.env.NODE_ENV === 'development') {
    writeFileSync(`${localStoragePath}/${id}.json`, JSON.stringify(Object.fromEntries(cache)))
  }
  for (const [key, value] of cache) {
    if (value.expiresAt < Date.now()) {
      cache.delete(key)
    }
  }
  await ctx.store.save(
    new UtilCache({
      id,
      data: Object.fromEntries(cache),
    }),
  )
  lastSave = Date.now()
}
