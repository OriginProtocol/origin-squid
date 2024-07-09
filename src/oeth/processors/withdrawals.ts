import * as oethVault from '@abi/oeth-vault'
import { OETHWithdrawalRequest } from '@model'
import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { OETH_VAULT_ADDRESS } from '@utils/addresses'
import { logFilter } from '@utils/logFilter'

export const from = 20264539 // TODO update with actual update blocknumber

interface ProcessResult {
  withdrawalRequests: Map<string, OETHWithdrawalRequest>
}

const withdrawalRequestedFilter = logFilter({
  address: [OETH_VAULT_ADDRESS],
  topic0: [oethVault.events.WithdrawalRequested.topic],
  range: { from },
})
const withdrawalClaimedFilter = logFilter({
  address: [OETH_VAULT_ADDRESS],
  topic0: [oethVault.events.WithdrawalClaimed.topic],
  range: { from },
})

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog(withdrawalRequestedFilter.value)
  processor.addLog(withdrawalClaimedFilter.value)
}

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    withdrawalRequests: new Map<string, OETHWithdrawalRequest>(),
  }

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      if (withdrawalRequestedFilter.matches(log)) {
        await processWithdrawalRequested(ctx, result, block, log)
      } else if (withdrawalClaimedFilter.matches(log)) {
        await processWithdrawalClaimed(ctx, result, block, log)
      }
    }
  }

  await ctx.store.upsert([...result.withdrawalRequests.values()])
}

const processWithdrawalRequested = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks'][number],
  log: Context['blocks'][number]['logs'][number],
) => {
  const data = oethVault.events.WithdrawalRequested.decode(log)

  const withdrawalRequest = new OETHWithdrawalRequest({
    id: `${data._withdrawer.toLowerCase()}:${data._requestId}`,
    blockNumber: block.header.height,
    timestamp: new Date(block.header.timestamp),
    requestId: data._requestId,
    amount: data._amount,
    claimed: false,
    queued: data._queued,
    withdrawer: data._withdrawer.toLowerCase(),
  })
  result.withdrawalRequests.set(withdrawalRequest.id, withdrawalRequest)
}

const processWithdrawalClaimed = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks'][number],
  log: Context['blocks'][number]['logs'][number],
) => {
  const data = oethVault.events.WithdrawalClaimed.decode(log)
  const id = `${data._withdrawer.toLowerCase()}:${data._requestId}`
  let updated
  if (result.withdrawalRequests.has(id)) {
    updated = result.withdrawalRequests.get(id)
  } else {
    updated = await ctx.store.findOneBy(OETHWithdrawalRequest, {
      requestId: data._requestId,
      withdrawer: data._withdrawer.toLowerCase(),
    })
  }
  if (updated) {
    result.withdrawalRequests.set(id, { ...updated, claimed: true })
  }
}
