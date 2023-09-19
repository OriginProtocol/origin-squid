import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { pad } from 'viem'

import * as erc20 from '../../abi/erc20'
import { Vault } from '../../model'
import { Context } from '../../processor'
import {
  ADDRESS_ZERO,
  FRXETH_ADDRESS,
  OETH_CURVE_LP_ADDRESS,
  OETH_VAULT_ADDRESS,
  RETH_ADDRESS,
  STETH_ADDRESS,
  VAULT_ERC20_ADDRESSES,
  WETH_ADDRESS,
} from '../../utils/addresses'
import {
  updateFinancialStatement,
  useFinancialStatements,
} from '../financial-statement'
import { getLatest, trackAddressBalances } from '../utils'

interface ProcessResult {
  vaults: Vault[]
}

export const from = 17067001 // https://etherscan.io/tx/0x0b81a0e2b7d824ce493465221218b9c79b4a9478c0bb7760b386be240f5985b8

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: VAULT_ERC20_ADDRESSES,
    topic0: [erc20.events.Transfer.topic],
    topic1: [pad(OETH_VAULT_ADDRESS)],
  })
  processor.addLog({
    address: VAULT_ERC20_ADDRESSES,
    topic0: [erc20.events.Transfer.topic],
    topic2: [pad(OETH_VAULT_ADDRESS)],
  })
}

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    vaults: [],
  }

  for (const block of ctx.blocks) {
    for (const transaction of block.transactions) {
      await processNativeTransfers(ctx, result, block, transaction)
    }
    for (const log of block.logs) {
      await processTransfer(ctx, result, block, log)
    }
  }

  await ctx.store.insert(result.vaults)
}

const processNativeTransfers = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
  transaction: Context['blocks']['0']['transactions']['0'],
) => {
  if (transaction.value > 0n) {
    if (
      transaction.from.toLowerCase() === OETH_CURVE_LP_ADDRESS &&
      transaction.to?.toLowerCase() !== OETH_CURVE_LP_ADDRESS
    ) {
      const vault = await getLatestVault(ctx, result, block)
      vault.eth -= transaction.value
    } else if (transaction.to?.toLowerCase() === OETH_CURVE_LP_ADDRESS) {
      const vault = await getLatestVault(ctx, result, block)
      vault.eth += transaction.value
    }
  }
}

const processTransfer = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
  log: Context['blocks']['0']['logs']['0'],
) => {
  if (log.transaction) {
    if (log.transaction.value > 0) {
      if (
        log.transaction.from === OETH_VAULT_ADDRESS &&
        log.transaction.to !== OETH_VAULT_ADDRESS
      ) {
        const vault = await getLatestVault(ctx, result, block)
        vault.eth -= log.transaction.value
      } else if (log.transaction.to === OETH_VAULT_ADDRESS) {
        const vault = await getLatestVault(ctx, result, block)
        vault.eth += log.transaction.value
      }
    }
  }

  if (log.topics[0] === erc20.events.Transfer.topic) {
    await trackAddressBalances({
      log,
      address: OETH_VAULT_ADDRESS,
      tokens: VAULT_ERC20_ADDRESSES,
      fn: async ({ log, token, change }) => {
        const vault = await getLatestVault(ctx, result, block)
        if (token === WETH_ADDRESS) {
          vault.weth += change
        } else if (token === RETH_ADDRESS) {
          vault.rETH += change
        } else if (token === STETH_ADDRESS) {
          vault.stETH += change
        } else if (token === FRXETH_ADDRESS) {
          vault.frxETH += change
        }
      },
    })
  }
}

const getLatestVault = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
) => {
  const timestampId = new Date(block.header.timestamp).toISOString()
  const { latest, current } = await getLatest(
    ctx,
    Vault,
    result.vaults,
    timestampId,
  )
  let vault = current
  if (!vault) {
    vault = new Vault({
      id: timestampId,
      timestamp: new Date(block.header.timestamp),
      blockNumber: block.header.height,
      eth: latest?.eth ?? 0n,
      weth: latest?.weth ?? 0n,
      rETH: latest?.rETH ?? 0n,
      stETH: latest?.stETH ?? 0n,
      frxETH: latest?.frxETH ?? 0n,
    })
    result.vaults.push(vault)
    await updateFinancialStatement(ctx, block, { vault })
  }
  return vault
}
