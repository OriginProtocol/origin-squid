import { pad } from 'viem'

import * as erc20 from '@abi/erc20'
import { OUSDVault } from '@model'
import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import {
  DAI_ADDRESS,
  OUSD_VAULT_ADDRESS,
  OUSD_VAULT_ERC20_ADDRESSES,
  USDC_ADDRESS,
  USDT_ADDRESS,
} from '@utils/addresses'
import { getLatestEntity, trackAddressBalances } from '@utils/utils'

interface ProcessResult {
  vaults: OUSDVault[]
  promises: Promise<unknown>[]
}

export const from = 11551793 // https://etherscan.io/tx/0x797a2dfb970903521b963b45df61063ed67e95e0069abbc62d92241ca6e9b531

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: OUSD_VAULT_ERC20_ADDRESSES,
    topic0: [erc20.events.Transfer.topic],
    topic1: [pad(OUSD_VAULT_ADDRESS)],
    range: { from },
  })
  processor.addLog({
    address: OUSD_VAULT_ERC20_ADDRESSES,
    topic0: [erc20.events.Transfer.topic],
    topic2: [pad(OUSD_VAULT_ADDRESS)],
    range: { from },
  })
}

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    vaults: [],
    promises: [], // Anything async we can wait for at the end of our loop.
  }

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      await processTransfer(ctx, result, block, log)
    }
  }

  await ctx.store.insert(result.vaults)
}

const processTransfer = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
  log: Context['blocks']['0']['logs']['0'],
) => {
  if (log.topics[0] === erc20.events.Transfer.topic) {
    await trackAddressBalances({
      log,
      address: OUSD_VAULT_ADDRESS,
      tokens: OUSD_VAULT_ERC20_ADDRESSES,
      fn: async ({ token, change }) => {
        const { vault } = await getLatestOUSDVault(ctx, result, block)
        if (token === DAI_ADDRESS) {
          vault.dai += change
        } else if (token === USDC_ADDRESS) {
          vault.usdc += change
        } else if (token === USDT_ADDRESS) {
          vault.usdt += change
        }
      },
    })
  }
}

const getLatestOUSDVault = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
) => {
  let isNew = false
  const timestampId = new Date(block.header.timestamp).toISOString()
  const { latest, current } = await getLatestEntity(
    ctx,
    OUSDVault,
    result.vaults,
    timestampId,
  )
  let vault = current
  if (!vault) {
    // result.promises.push(
    //   ensureExchangeRates(ctx, block, []),
    // )
    vault = new OUSDVault({
      id: timestampId,
      timestamp: new Date(block.header.timestamp),
      blockNumber: block.header.height,
      dai: latest?.dai ?? 0n,
      usdc: latest?.usdc ?? 0n,
      usdt: latest?.usdt ?? 0n,
    })
    isNew = true
    result.vaults.push(vault)
  }
  return { vault, isNew }
}
