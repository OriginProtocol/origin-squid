import crypto from 'crypto'

import { Block, Context, Log } from '@processor'
import { Activity } from '@templates/otoken/activity-types'
import { useProcessorState } from '@utils/state'

export const useActivityState = (ctx: Context) =>
  useProcessorState(ctx, 'activity-state', {
    processedLogs: new Set<string>(),
  })

export const createActivity = <T extends Activity>(
  {
    ctx,
    block,
    log,
    id,
  }: {
    ctx: Context
    block: Block
    log: Log
    id?: string
  },
  partial: { processor: string } & Omit<T, 'id' | 'chainId' | 'blockNumber' | 'timestamp' | 'status' | 'txHash'>,
) => {
  const activity = {
    id: id ?? `${partial.processor}:${ctx.chain.id}:${log.id}`,
    chainId: ctx.chain.id,
    blockNumber: block.header.height,
    timestamp: block.header.timestamp,
    status: 'success',
    txHash: log.transactionHash,
    ...partial,
  } as T
  activity.id += `:${crypto.createHash('sha256').update(JSON.stringify(activity)).digest('hex').substring(0, 8)}`
  return activity
}
