import * as oethVault from '@abi/otoken-vault'
import { OTokenWithdrawalRequest } from '@model'
import { Context, EvmBatchProcessor, logFilter } from '@originprotocol/squid-utils'

// export const from = 20428558

interface ProcessResult {
  withdrawalRequests: Map<string, OTokenWithdrawalRequest>
}

export const createOTokenWithdrawalsProcessor = ({
  oTokenAddress,
  oTokenVaultAddress,
  from,
}: {
  oTokenAddress: string
  oTokenVaultAddress: string
  from: number
}) => {
  const withdrawalRequestedFilter = logFilter({
    address: [oTokenVaultAddress],
    topic0: [oethVault.events.WithdrawalRequested.topic],
    range: { from },
  })
  const withdrawalClaimedFilter = logFilter({
    address: [oTokenVaultAddress],
    topic0: [oethVault.events.WithdrawalClaimed.topic],
    range: { from },
  })

  const setup = (processor: EvmBatchProcessor) => {
    processor.addLog(withdrawalRequestedFilter.value)
    processor.addLog(withdrawalClaimedFilter.value)
  }

  const process = async (ctx: Context) => {
    const result: ProcessResult = {
      withdrawalRequests: new Map<string, OTokenWithdrawalRequest>(),
    }

    for (const block of ctx.blocksWithContent) {
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
    const id = `${ctx.chain.id}:${oTokenAddress}:${data._withdrawer.toLowerCase()}:${data._requestId}`
    const withdrawalRequest = new OTokenWithdrawalRequest({
      id,
      chainId: ctx.chain.id,
      blockNumber: block.header.height,
      timestamp: new Date(block.header.timestamp),
      otoken: oTokenAddress,
      requestId: data._requestId,
      amount: data._amount,
      claimed: false,
      queued: data._queued,
      withdrawer: data._withdrawer.toLowerCase(),
      txHash: log.transactionHash,
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
    const id = `${ctx.chain.id}:${oTokenAddress}:${data._withdrawer.toLowerCase()}:${data._requestId}`
    let updated
    if (result.withdrawalRequests.has(id)) {
      updated = result.withdrawalRequests.get(id)
    } else {
      updated = await ctx.store.findOneBy(OTokenWithdrawalRequest, { id })
    }
    if (updated) {
      updated.claimed = true
      result.withdrawalRequests.set(id, updated)
    }
  }

  return {
    from,
    setup,
    process,
  }
}
