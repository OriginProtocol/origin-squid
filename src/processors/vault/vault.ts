import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { pad } from 'viem'

import * as erc20 from '../../abi/erc20'
import * as lido from '../../abi/lido'
import { Vault } from '../../model'
import { Context } from '../../processor'
import {
  FRXETH_ADDRESS,
  OETH_VAULT_ADDRESS,
  RETH_ADDRESS,
  STETH_ADDRESS,
  VAULT_ERC20_ADDRESSES,
  WETH_ADDRESS,
} from '../../utils/addresses'
import { getLatestEntity, trackAddressBalances } from '../utils'

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
  processor.addLog({
    address: [STETH_ADDRESS],
    topic0: [lido.events.TokenRebased.topic],
  })
}

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    vaults: [],
  }

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      await processTransfer(ctx, result, block, log)
      await processStEthRebase(ctx, result, block, log)
    }
  }

  await ctx.store.insert(result.vaults)
}

const processStEthRebase = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
  log: Context['blocks']['0']['logs']['0'],
) => {
  if (
    log.address === STETH_ADDRESS &&
    log.topics[0] === lido.events.TokenRebased.topic
  ) {
    ctx.log.info('vault: updating stETH balance')
    const { vault } = await getLatestVault(ctx, result, block)
    const contract = new lido.Contract(ctx, block.header, STETH_ADDRESS)
    vault.stETH = await contract.balanceOf(OETH_VAULT_ADDRESS)
  }
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
      address: OETH_VAULT_ADDRESS,
      tokens: VAULT_ERC20_ADDRESSES,
      fn: async ({ token, change }) => {
        const { vault } = await getLatestVault(ctx, result, block)
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
  let isNew = false
  const timestampId = new Date(block.header.timestamp).toISOString()
  const { latest, current } = await getLatestEntity(
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
      weth: latest?.weth ?? 0n,
      rETH: latest?.rETH ?? 0n,
      stETH: latest?.stETH ?? 0n,
      frxETH: latest?.frxETH ?? 0n,
    })
    isNew = true
    result.vaults.push(vault)
  }
  return { vault, isNew }
}
