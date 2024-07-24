import crypto from 'crypto'

import { OTokenActivity, OTokenActivityType } from '@model'
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
  const activity = new OTokenActivity({
    chainId: ctx.chain.id,
    blockNumber: block.header.height,
    timestamp: new Date(block.header.timestamp),
    txHash: log.transactionHash,
    type: OTokenActivityType[partial.type],
    otoken: otokenAddress,
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
