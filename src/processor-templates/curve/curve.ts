import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as curveLpToken from '../../abi/curve-lp-token'
import { CurvePoolBalance } from '../../model'
import { Context } from '../../processor'

interface ProcessResult {
  curvePoolBalances: CurvePoolBalance[]
}

const logsToListenFor = new Set([
  curveLpToken.events.AddLiquidity.topic,
  curveLpToken.events.RemoveLiquidity.topic,
  curveLpToken.events.RemoveLiquidityImbalance.topic,
  curveLpToken.events.RemoveLiquidityOne.topic,
  curveLpToken.events.TokenExchange.topic, // Not sure if including this helps get up-to-date eth balances.
])

export const createCurveSetup =
  (poolAddress: string, from: number) => (processor: EvmBatchProcessor) => {
    processor.addLog({
      address: [poolAddress],
      topic0: [...logsToListenFor.values()],
      range: { from },
    })
  }

export const process = (poolAddress: string) => async (ctx: Context) => {
  const result: ProcessResult = {
    curvePoolBalances: [],
  }

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      if (logsToListenFor.has(log.topics[0])) {
        const contract = new curveLpToken.Contract(
          ctx,
          block.header,
          poolAddress,
        )
        const timestampId = new Date(block.header.timestamp).toISOString()
        const [balance0, balance1] = await contract.get_balances()
        result.curvePoolBalances.push(
          new CurvePoolBalance({
            id: timestampId,
            blockNumber: block.header.height,
            timestamp: new Date(block.header.timestamp),
            address: poolAddress,
            balance0,
            balance1,
          }),
        )
      }
    }
  }

  await ctx.store.insert(result.curvePoolBalances)
}
