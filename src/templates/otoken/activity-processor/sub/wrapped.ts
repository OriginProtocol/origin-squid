import * as wotokenAbi from '@abi/woeth'
import { OTokenActivity } from '@model'
import { Block, Context, Log } from '@processor'
import { ActivityProcessor } from '@templates/otoken/activity-processor/types'
import { createActivity, useActivityState } from '@templates/otoken/activity-processor/utils'
import { UnwrapActivity, WrapActivity } from '@templates/otoken/activity-types'
import { logFilter } from '@utils/logFilter'

export const wrappedActivityProcessor = ({
  otokenAddress,
  wotokenAddress,
}: {
  otokenAddress: string
  wotokenAddress: string
}): ActivityProcessor => {
  const depositFilter = logFilter({ address: [wotokenAddress], topic0: [wotokenAbi.events.Deposit.topic] })
  const withdrawFilter = logFilter({ address: [wotokenAddress], topic0: [wotokenAbi.events.Withdraw.topic] })
  const transferInFilter = logFilter({ topic0: [wotokenAbi.events.Transfer.topic], topic2: [wotokenAddress] })
  const transferOutFilter = logFilter({ topic0: [wotokenAbi.events.Transfer.topic], topic1: [wotokenAddress] })
  return {
    name: 'Wrapped Processor',
    filters: [depositFilter, withdrawFilter, transferInFilter, transferOutFilter],
    async process(ctx: Context, block: Block, logs: Log[]) {
      const result: OTokenActivity[] = []
      // Wrap
      const depositLogs = logs.filter((l) => depositFilter.matches(l))
      if (depositLogs.length) {
        const transferInLog = logs.find((l) => transferInFilter.matches(l))
        result.push(
          ...depositLogs.map((log) => {
            const data = wotokenAbi.events.Deposit.decode(log)
            const tokenIn = transferInLog?.address ?? 'unknown'
            return createActivity<WrapActivity>(
              { ctx, block, log, otokenAddress },
              {
                processor: 'wrapped',
                type: 'Wrap',
                contract: wotokenAddress,
                account: data.owner,
                tokenIn,
                tokenOut: wotokenAddress,
                amountIn: data.assets.toString(),
                amountOut: data.shares.toString(),
              },
            )
          }),
        )
      }
      // Unwrap
      const withdrawLogs = logs.filter((l) => withdrawFilter.matches(l))
      if (withdrawLogs.length) {
        const transferOutLog = logs.find((l) => transferOutFilter.matches(l))
        result.push(
          ...withdrawLogs.map((log) => {
            const data = wotokenAbi.events.Withdraw.decode(log)
            const tokenOut = transferOutLog?.address ?? 'unknown'
            return createActivity<UnwrapActivity>(
              { ctx, block, log, otokenAddress },
              {
                processor: 'wrapped',
                type: 'Unwrap',
                contract: wotokenAddress,
                account: data.owner,
                tokenIn: wotokenAddress,
                tokenOut,
                amountIn: data.shares.toString(),
                amountOut: data.assets.toString(),
              },
            )
          }),
        )
      }
      return result
    },
  }
}
