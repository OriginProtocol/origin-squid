import * as otokenAbi from '@abi/otoken'
import * as wotokenAbi from '@abi/woeth'
import { Block, Context, Log } from '@processor'
import { ActivityProcessor } from '@templates/otoken/activity-processor/types'
import { createActivity } from '@templates/otoken/activity-processor/utils'
import { SwapActivity, TransferActivity } from '@templates/otoken/activity-types'
import { ONEINCH_AGGREGATION_ROUTER_ADDRESS } from '@utils/addresses'
import { logFilter } from '@utils/logFilter'

export const transferActivityProcessor = ({
  otokenAddress,
}: {
  otokenAddress: string
}): ActivityProcessor<TransferActivity | SwapActivity> => {
  const transferFilter = logFilter({
    address: [otokenAddress],
    topic0: [otokenAbi.events.Transfer.topic],
  })
  return {
    name: 'Transfer Activity',
    filters: [transferFilter],
    process: async (ctx, block, logs) => {
      const transferLogs = logs
        .filter((l) => transferFilter.matches(l))
        .map((log) => ({
          log,
          data: otokenAbi.events.Transfer.decode(log),
        }))

      const swapActivity = calculateTransferActivityAsSwap(ctx, block, transferLogs)
      if (swapActivity) return swapActivity

      return transferLogs.map(({ log, data }) => {
        return createActivity<TransferActivity>(
          { ctx, block, log },
          {
            processor: 'transfer',
            type: 'Transfer',
            token: log.address,
            from: data.from.toLowerCase(),
            to: data.to.toLowerCase(),
            amount: data.value.toString(),
          },
        )
      })
    },
  }
}

const getExchangeName = (
  logs: {
    log: Log
    data: ReturnType<typeof wotokenAbi.events.Transfer.decode>
  }[],
) => {
  if (logs[0].log.transaction?.to === '0x6131b5fae19ea4f9d964eac0408e4408b66337b5') return 'Kyber Swap'
  return logs.find((l) => l.log.address === ONEINCH_AGGREGATION_ROUTER_ADDRESS) ? '1inch' : 'other'
}

const calculateTransferActivityAsSwap = (
  ctx: Context,
  block: Block,
  logs: {
    log: Log
    data: ReturnType<typeof wotokenAbi.events.Transfer.decode>
  }[],
) => {
  if (logs.length === 1) return undefined
  const resultMap: Record<string, SwapActivity> = {}
  const tokens = new Set<string>()
  const exchange = getExchangeName(logs)
  for (const { log, data } of logs) {
    tokens.add(log.address)
    // To
    resultMap[data.to.toLowerCase()] =
      resultMap[data.to.toLowerCase()] ??
      createActivity<SwapActivity>(
        { ctx, block, log: logs[0].log, id: `${ctx.chain.id}:${log.id}:${data.to.toLowerCase()}` },
        {
          processor: 'transfer',
          type: 'Swap',
          exchange,
          contract: log.address,
          account: data.to.toLowerCase(),
          tokensOut: [],
          tokensIn: [],
        },
      )
    resultMap[data.to.toLowerCase()].tokensIn.push({ token: log.address, amount: data.value.toString() })

    // From
    resultMap[data.from.toLowerCase()] =
      resultMap[data.from.toLowerCase()] ??
      createActivity<SwapActivity>(
        { ctx, block, log: logs[0].log, id: `${ctx.chain.id}:${log.id}:${data.from.toLowerCase()}` },
        {
          processor: 'transfer',
          type: 'Swap',
          exchange,
          contract: log.address,
          account: data.to.toLowerCase(),
          tokensOut: [],
          tokensIn: [],
        },
      )
    resultMap[data.from.toLowerCase()].tokensOut.push({ token: log.address, amount: data.value.toString() })
  }
  if (tokens.size <= 1) return undefined
  // We are a swap if we sent and received more than one token
  const results = Object.values(resultMap).filter((r) => r.tokensIn.length > 0 && r.tokensOut.length > 0)
  if (results.length > 0) return results
  return undefined
}
