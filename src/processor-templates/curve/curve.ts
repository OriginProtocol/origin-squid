import { EvmBatchProcessor } from '@subsquid/evm-processor'
import dayjs from 'dayjs'
import { LessThanOrEqual } from 'typeorm'

import * as curveLpToken from '../../abi/curve-lp-token'
import { CurvePoolBalance } from '../../model'
import { Context, Log } from '../../processor'

interface ProcessResult {
  curvePoolBalances: CurvePoolBalance[]
}

const historicUpdateFrequency = 24 * 60 * 60000 // Frequency of updates for historical data.

const logsToListenFor = new Set([
  curveLpToken.events.AddLiquidity.topic,
  curveLpToken.events.RemoveLiquidity.topic,
  curveLpToken.events.RemoveLiquidityImbalance.topic,
  curveLpToken.events.RemoveLiquidityOne.topic,
  curveLpToken.events.TokenExchange.topic,
  curveLpToken.events.Transfer.topic,
])

export const createCurveSetup = (
  poolAddress: string,
  from: number,
  processor: EvmBatchProcessor,
) => {
  processor.addLog({
    address: [poolAddress],
    topic0: [...logsToListenFor.values()],
    range: { from },
    transaction: false,
  })
}

export const createCurveProcessor =
  (poolAddress: string, count: number) => async (ctx: Context) => {
    let last: CurvePoolBalance | undefined = undefined
    const result: ProcessResult = {
      curvePoolBalances: [],
    }

    for (const block of ctx.blocks) {
      const timestamp = new Date(block.header.timestamp)
      const timestampId = timestamp.toISOString()
      if (!last) {
        last = await ctx.store.findOne(CurvePoolBalance, {
          where: { id: LessThanOrEqual(timestampId) },
          order: {
            id: 'desc',
          },
        })
      }
      if (
        last &&
        !ctx.isHead &&
        timestamp < dayjs(last.timestamp).add(1, 'day').toDate()
      ) {
        continue
      }
      const match = block.logs.find(
        (log: Log) =>
          log.address === poolAddress && logsToListenFor.has(log.topics[0]),
      )
      if (match) {
        const contract = new curveLpToken.Contract(
          ctx,
          block.header,
          poolAddress,
        )

        const balances = await Promise.all(
          new Array(count)
            .fill(0)
            .map((_, index) => contract.balances(BigInt(index))),
        )
        const curve = new CurvePoolBalance({
          id: timestampId,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          address: poolAddress,
          balance0: balances[0] ?? 0n,
          balance1: balances[1] ?? 0n,
          balance2: balances[2] ?? 0n,
        })
        result.curvePoolBalances.push(curve)
        last = curve
        // for (const log of block.logs) {
        //   if (filterFn(log)) {
        //     if (log.topics[0] === curveLpToken.events.AddLiquidity.topic) {
        //       const data = curveLpToken.events.AddLiquidity.decode(log)
        //       curve.balance0 += data.token_amounts[0] ?? 0n
        //       curve.balance1 += data.token_amounts[1] ?? 0n
        //       curve.balance2 += data.token_amounts[2] ?? 0n
        //     } else if (
        //       log.topics[0] === curveLpToken.events.RemoveLiquidity.topic
        //     ) {
        //       const data = curveLpToken.events.RemoveLiquidity.decode(log)
        //       curve.balance0 -= data.token_amounts[0] ?? 0n
        //       curve.balance1 -= data.token_amounts[1] ?? 0n
        //       curve.balance2 -= data.token_amounts[2] ?? 0n
        //     } else if (
        //       log.topics[0] ===
        //       curveLpToken.events.RemoveLiquidityImbalance.topic
        //     ) {
        //       const data =
        //         curveLpToken.events.RemoveLiquidityImbalance.decode(log)
        //       curve.balance0 -= data.token_amounts[0] ?? 0n
        //       curve.balance1 -= data.token_amounts[1] ?? 0n
        //       curve.balance2 -= data.token_amounts[2] ?? 0n
        //     } else if (
        //       log.topics[0] === curveLpToken.events.TokenExchange.topic
        //     ) {
        //       const data = curveLpToken.events.TokenExchange.decode(log)
        //       if (data.bought_id > 2n || data.sold_id > 2n) {
        //         ctx.log.error(data, 'Unexpected id greater than 1')
        //         throw new Error('Unexpected id greater than 1')
        //       }
        //       if (data.bought_id === 0n) {
        //         curve.balance0 -= data.tokens_bought
        //       } else if (data.bought_id === 1n) {
        //         curve.balance1 -= data.tokens_bought
        //       } else if (data.bought_id === 2n) {
        //         curve.balance2 -= data.tokens_bought
        //       }
        //       if (data.sold_id === 0n) {
        //         curve.balance0 += data.tokens_sold
        //       } else if (data.sold_id === 1n) {
        //         curve.balance1 += data.tokens_sold
        //       } else if (data.sold_id === 2n) {
        //         curve.balance2 += data.tokens_sold
        //       }
        //     }
        //     // TODO: log.topics[0] === curveLpToken.events.RemoveLiquidityOne.topic
        //   }
        // }
      }
    }
    await ctx.store.insert(result.curvePoolBalances)
  }
