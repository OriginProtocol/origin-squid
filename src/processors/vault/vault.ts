import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { pad } from 'viem'

import * as erc20 from '../../abi/erc20'
import { Vault } from '../../model'
import { Context } from '../../processor'
import {
  ADDRESS_ZERO,
  FRXETH_ADDRESS,
  OETH_VAULT_ADDRESS,
  RETH_ADDRESS,
  STETH_ADDRESS,
  VAULT_HOLDINGS_ADDRESSES,
  WETH_ADDRESS,
} from '../../utils/addresses'
import { getLatest, trackAddressBalances } from '../utils'

interface ProcessResult {
  vaults: Vault[]
}

export const from = 17067001 // https://etherscan.io/tx/0x0b81a0e2b7d824ce493465221218b9c79b4a9478c0bb7760b386be240f5985b8

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: VAULT_HOLDINGS_ADDRESSES,
    topic0: [erc20.events.Transfer.topic],
    topic1: [pad(OETH_VAULT_ADDRESS)],
  })
  processor.addLog({
    address: VAULT_HOLDINGS_ADDRESSES,
    topic0: [erc20.events.Transfer.topic],
    topic2: [pad(OETH_VAULT_ADDRESS)],
  })
}

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    vaults: [],
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
      address: OETH_VAULT_ADDRESS,
      tokens: VAULT_HOLDINGS_ADDRESSES,
      fn: async ({ log, token, change }) => {
        const dateId = new Date(block.header.timestamp).toISOString()
        const { latest, current } = await getLatest(
          ctx,
          Vault,
          result.vaults,
          dateId,
        )

        let vault = current
        if (!vault) {
          vault = new Vault({
            id: dateId,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            txHash: log.transactionHash,
            eth: latest?.eth ?? 0n,
            weth: latest?.weth ?? 0n,
            rETH: latest?.rETH ?? 0n,
            stETH: latest?.stETH ?? 0n,
            frxETH: latest?.frxETH ?? 0n,
          })
          result.vaults.push(vault)
        }

        if (token === ADDRESS_ZERO) {
          vault.eth += change
        } else if (token === WETH_ADDRESS) {
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
