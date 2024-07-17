import * as wotokenAbi from '@abi/woeth'
import { Block, Context, Log } from '@processor'
import { ActivityProcessor } from '@templates/otoken/activity-processor/types'
import { createActivity } from '@templates/otoken/activity-processor/utils'
import { UnwrapActivity, WrapActivity } from '@templates/otoken/activity-types'
import { logFilter } from '@utils/logFilter'

export const wrappedActivityProcessor = (wrappedAddress: string): ActivityProcessor<WrapActivity | UnwrapActivity> => {
  const depositFilter = logFilter({ address: [wrappedAddress], topic0: [wotokenAbi.events.Deposit.topic] })
  const withdrawFilter = logFilter({ address: [wrappedAddress], topic0: [wotokenAbi.events.Withdraw.topic] })
  const transferInFilter = logFilter({ topic0: [wotokenAbi.events.Transfer.topic], topic2: [wrappedAddress] })
  const transferOutFilter = logFilter({ topic0: [wotokenAbi.events.Transfer.topic], topic1: [wrappedAddress] })
  return {
    name: 'Wrapped Processor',
    filters: [depositFilter, withdrawFilter, transferInFilter, transferOutFilter],
    async process(ctx: Context, block: Block, logs: Log[]) {
      const result: (WrapActivity | UnwrapActivity)[] = []
      // Wrap
      const depositLogs = logs.filter((l) => depositFilter.matches(l))
      if (depositLogs.length) {
        const transferInLog = logs.find((l) => transferInFilter.matches(l))
        result.push(
          ...depositLogs.map((log) => {
            const data = wotokenAbi.events.Deposit.decode(log)
            const tokenIn = transferInLog?.address ?? 'unknown'
            return createActivity<WrapActivity>(
              { ctx, block, log },
              {
                type: 'Wrap',
                contract: wrappedAddress,
                account: data.owner,
                tokenIn,
                tokenOut: wrappedAddress,
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
              { ctx, block, log },
              {
                type: 'Unwrap',
                contract: wrappedAddress,
                account: data.owner,
                tokenIn: wrappedAddress,
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
