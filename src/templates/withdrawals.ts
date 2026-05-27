import { In, IsNull, LessThanOrEqual, Not } from 'typeorm'

import * as oethVault from '@abi/otoken-vault'
import { OTokenWithdrawalRequest } from '@model'
import { Block, Context, EvmBatchProcessor, logFilter } from '@originprotocol/squid-utils'

// Minimum time-to-claimable per spec. Even if the vault's claimable pointer
// already covers a request, the request cannot have been claimed sooner than
// this floor relative to the request's own block timestamp.
const CLAIMABLE_FLOOR_MS = 10 * 60 * 1000

interface ProcessResult {
  withdrawalRequests: Map<string, OTokenWithdrawalRequest>
}

export const createOTokenWithdrawalsProcessor = ({
  name,
  oTokenAddress,
  oTokenVaultAddress,
  from,
}: {
  name: string
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
  const withdrawalClaimableFilter = logFilter({
    address: [oTokenVaultAddress],
    topic0: [oethVault.events.WithdrawalClaimable.topic],
    range: { from },
  })

  const setup = (processor: EvmBatchProcessor) => {
    processor.addLog(withdrawalRequestedFilter.value)
    processor.addLog(withdrawalClaimedFilter.value)
    processor.addLog(withdrawalClaimableFilter.value)
  }

  // Running claimable pointer for this vault. Lazy-loaded from chain on the
  // first WithdrawalRequested encountered with unknown state, then advanced by
  // every WithdrawalClaimable event we observe. Persisted across batches.
  let currentClaimable: bigint | undefined

  const computeClaimableAt = (requestTimestampMs: number, blockTimestampMs: number): Date => {
    const floor = requestTimestampMs + CLAIMABLE_FLOOR_MS
    return new Date(blockTimestampMs > floor ? blockTimestampMs : floor)
  }

  const resolvePending = async (ctx: Context, result: ProcessResult, block: Block, claimable: bigint) => {
    // In-batch entries first; they take precedence over any DB row with the same id.
    for (const req of result.withdrawalRequests.values()) {
      if (req.claimableAt == null && !req.claimed && req.queued <= claimable) {
        req.claimableAt = computeClaimableAt(req.timestamp.getTime(), block.header.timestamp)
      }
    }
    // Update any records we don't have in memory. Exclude already-claimed rows:
    // their claimableAt must be set at claim time, not stamped here much later
    // when an unrelated WithdrawalClaimable advances the pointer.
    const inBatchIds = [...result.withdrawalRequests.keys()]
    const rows = await ctx.store.find(OTokenWithdrawalRequest, {
      where: {
        chainId: ctx.chain.id,
        otoken: oTokenAddress,
        claimableAt: IsNull(),
        claimed: false,
        queued: LessThanOrEqual(claimable),
        ...(inBatchIds.length > 0 ? { id: Not(In(inBatchIds)) } : {}),
      },
    })
    for (const row of rows) {
      row.claimableAt = computeClaimableAt(row.timestamp.getTime(), block.header.timestamp)
      result.withdrawalRequests.set(row.id, row)
    }
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
        } else if (withdrawalClaimableFilter.matches(log)) {
          const data = oethVault.events.WithdrawalClaimable.decode(log)
          // The event params are misleadingly named: `_claimable` is the new
          // cumulative claimable pointer, `_newClaimable` is the delta added by
          // this event. We need the cumulative to compare against `queued`.
          currentClaimable = data._claimable
          await resolvePending(ctx, result, block, data._claimable)
        }
      }
    }

    await ctx.store.upsert([...result.withdrawalRequests.values()])
  }

  const processWithdrawalRequested = async (
    ctx: Context,
    result: ProcessResult,
    block: Block,
    log: Context['blocks'][number]['logs'][number],
  ) => {
    const data = oethVault.events.WithdrawalRequested.decode(log)
    const id = `${ctx.chain.id}:${oTokenAddress}:${data._withdrawer.toLowerCase()}:${data._requestId}`
    const input = log.transaction?.input
    let queueWait: bigint | null = null
    if (input?.startsWith(oethVault.functions.requestWithdrawal.sighash)) {
      const extraBytes = input.slice(74)
      if (extraBytes.length > 0) {
        queueWait = BigInt('0x' + extraBytes)
      }
    }
    if (currentClaimable === undefined) {
      // First request we've seen; sync the running pointer from chain so we
      // can decide whether this request is born claimable.
      const meta = await new oethVault.Contract(ctx, block.header, oTokenVaultAddress).withdrawalQueueMetadata()
      currentClaimable = meta.claimable
    }
    const claimableAt =
      data._queued <= currentClaimable ? computeClaimableAt(block.header.timestamp, block.header.timestamp) : null
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
      queueWait,
      claimableAt,
    })
    result.withdrawalRequests.set(withdrawalRequest.id, withdrawalRequest)
  }

  const processWithdrawalClaimed = async (
    ctx: Context,
    result: ProcessResult,
    block: Block,
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
      updated.claimedAt = new Date(block.header.timestamp)
      // Safety net: if some edge case left claimableAt null, anchor it at
      // claim time. A claim proves the row was claimable by then. With the
      // event-cumulative fix above this should rarely fire, but it prevents
      // a future unrelated WithdrawalClaimable from stamping a wrong date.
      if (updated.claimableAt == null) {
        updated.claimableAt = computeClaimableAt(updated.timestamp.getTime(), block.header.timestamp)
      }
      result.withdrawalRequests.set(id, updated)
    }
  }

  return {
    name: `${name} withdrawals`,
    from,
    setup,
    process,
  }
}
