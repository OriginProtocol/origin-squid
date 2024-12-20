import { Context } from '@processor'

export const processingStats = {
  rpcCalls: 0,
  rpcCallTime: 0,
}

export const printStats = (ctx: Context) => {
  if (process.env.DEBUG_PERF === 'true') {
    ctx.log.info({
      ...processingStats,
      averageRpcCallTime: processingStats.rpcCallTime / processingStats.rpcCalls,
      blockCount: ctx.blocks.length,
      blockCountWithContent: ctx.blocksWithContent.length,
      frequencyBlockCount: ctx.frequencyBlocks.length,
      logCount: ctx.blocks.reduce((sum, block) => sum + block.logs.length, 0),
      traceCount: ctx.blocks.reduce((sum, block) => sum + block.traces.length, 0),
      transactionCount: ctx.blocks.reduce((sum, block) => sum + block.transactions.length, 0),
    })
  }
  processingStats.rpcCalls = 0
  processingStats.rpcCallTime = 0
}
