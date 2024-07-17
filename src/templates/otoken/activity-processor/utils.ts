import { Block, Context, Log } from '@processor'
import { Activity } from '@templates/otoken/activity-types'

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
  partial: Omit<T, 'id' | 'chainId' | 'blockNumber' | 'timestamp' | 'status' | 'txHash'>,
) =>
  ({
    id: id ?? `${ctx.chain.id}:${log.id}`,
    chainId: ctx.chain.id,
    blockNumber: block.header.height,
    timestamp: block.header.timestamp,
    status: 'success',
    txHash: log.transactionHash,
    ...partial,
  }) as T
