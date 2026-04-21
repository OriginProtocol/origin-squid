import crypto from 'crypto'

import { OTokenActivity, OTokenActivityType } from '@model'
import { Block, Context, Log, useProcessorState } from '@originprotocol/squid-utils'
import { Activity } from '@templates/otoken/activity-types'

export const useActivityState = (ctx: Context) =>
  useProcessorState(ctx, 'activity-state', {
    processedLogs: new Set<string>(),
  })

export const createActivity = <T extends Activity>(
  {
    ctx,
    block,
    log,
    otokenAddress,
  }: {
    ctx: Context
    block: Block
    log: Log
    otokenAddress: string
  },
  partial: {
    processor: string
    status?: T['status']
  } & Omit<T, 'id' | 'chainId' | 'blockNumber' | 'timestamp' | 'status' | 'txHash'>,
) => {
  const { account, counterparty } = extractParticipants(partial)

  const activity = new OTokenActivity({
    chainId: ctx.chain.id,
    blockNumber: block.header.height,
    timestamp: new Date(block.header.timestamp),
    txHash: log.transactionHash,
    type: OTokenActivityType[partial.type],
    otoken: otokenAddress,
    account,
    counterparty,
    data: {
      status: 'success',
      ...partial,
    } as T,
  })

  activity.id = `${partial.processor}:${ctx.chain.id}:${log.id}:${crypto
    .createHash('sha256')
    .update(JSON.stringify(activity))
    .digest('hex')
    .substring(0, 8)}`

  return activity
}

const extractParticipants = (partial: Record<string, unknown>) => {
  const account = firstAddress([
    partial.account,
    partial.sender,
    partial.from,
    partial.owner,
    partial.transactor,
    partial.delegator,
    partial.voter,
  ])

  const counterparty = firstAddress([
    partial.to,
    partial.receiver,
    partial.spender,
    partial.delegateTo,
  ])

  return { account, counterparty }
}

const firstAddress = (values: unknown[]) => {
  for (const value of values) {
    if (typeof value === 'string' && value.startsWith('0x') && value.length === 42) {
      return value.toLowerCase()
    }
  }

  return null
}
