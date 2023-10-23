import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { pad } from 'viem'

import * as erc20 from '../../abi/erc20'
import * as lido from '../../abi/lido'
import * as otokenVault from '../../abi/otoken-vault'
import { OETHVault } from '../../model'
import { ensureExchangeRates } from '../../post-processors/exchange-rates'
import { Context } from '../../processor'
import {
  FRXETH_ADDRESS,
  OETH_VAULT_ADDRESS,
  RETH_ADDRESS,
  STETH_ADDRESS,
  VAULT_ERC20_ADDRESSES,
  WETH_ADDRESS,
} from '../../utils/addresses'
import { getLatestEntity } from '../utils'

interface ProcessResult {
  vaults: OETHVault[]
  promises: Promise<unknown>[]
}

export const from = 17067001 // https://etherscan.io/tx/0x0b81a0e2b7d824ce493465221218b9c79b4a9478c0bb7760b386be240f5985b8

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: VAULT_ERC20_ADDRESSES,
    topic0: [erc20.events.Transfer.topic],
    topic1: [pad(OETH_VAULT_ADDRESS)],
    range: { from },
    transaction: false,
  })
  processor.addLog({
    address: VAULT_ERC20_ADDRESSES,
    topic0: [erc20.events.Transfer.topic],
    topic2: [pad(OETH_VAULT_ADDRESS)],
    range: { from },
    transaction: false,
  })
  processor.addLog({
    address: [STETH_ADDRESS],
    topic0: [lido.events.TokenRebased.topic],
    range: { from },
    transaction: false,
  })
}

const addresses = new Set(VAULT_ERC20_ADDRESSES.map((a) => a.toLowerCase()))

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    vaults: [],
    promises: [], // Anything async we can wait for at the end of our loop.
  }

  for (const block of ctx.blocks) {
    const haveTransfer = block.logs.find(
      (log) =>
        log.topics[0] === erc20.events.Transfer.topic &&
        addresses.has(log.address as `0x${string}`) &&
        (log.topics[1] === pad(OETH_VAULT_ADDRESS) ||
          log.topics[2] === pad(OETH_VAULT_ADDRESS)),
    )
    if (haveTransfer) {
      await processTransfer(ctx, result, block)
    }
    const haveStRebase = block.logs.find(
      (log) =>
        log.address === STETH_ADDRESS &&
        log.topics[0] === lido.events.TokenRebased.topic,
    )
    if (haveStRebase) {
      await processStEthRebase(ctx, result, block)
    }
  }

  await ctx.store.insert(result.vaults)
}

const processStEthRebase = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
) => {
  const { vault } = await getLatestOETHVault(ctx, result, block)
  const contract = new lido.Contract(ctx, block.header, STETH_ADDRESS)
  vault.stETH = await contract.balanceOf(OETH_VAULT_ADDRESS)
}

const processTransfer = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
) => {
  const { vault } = await getLatestOETHVault(ctx, result, block)
  const vaultContract = new otokenVault.Contract(
    ctx,
    block.header,
    OETH_VAULT_ADDRESS,
  )
  vault.weth = await vaultContract.checkBalance(WETH_ADDRESS)
  vault.rETH = await vaultContract.checkBalance(RETH_ADDRESS)
  vault.stETH = await vaultContract.checkBalance(STETH_ADDRESS)
  vault.frxETH = await vaultContract.checkBalance(FRXETH_ADDRESS)
  console.log('Header', block.header)
  console.log('Vault frxEth', vault.frxETH.toString())
}

const getLatestOETHVault = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
) => {
  let isNew = false
  const timestampId = new Date(block.header.timestamp).toISOString()
  const { latest, current } = await getLatestEntity(
    ctx,
    OETHVault,
    result.vaults,
    timestampId,
  )
  let vault = current
  if (!vault) {
    result.promises.push(
      ensureExchangeRates(ctx, block, [
        ['ETH', 'USD'],
        ['ETH', 'WETH'],
        ['ETH', 'rETH'],
        ['ETH', 'stETH'],
        ['ETH', 'frxETH'],
      ]),
    )
    vault = new OETHVault({
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
