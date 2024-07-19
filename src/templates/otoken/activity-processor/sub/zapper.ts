import * as zapperAbi from '@abi/oeth-zapper'
import { Block, Context, Log } from '@processor'
import { ActivityProcessor } from '@templates/otoken/activity-processor/types'
import { createActivity } from '@templates/otoken/activity-processor/utils'
import { ZapActivity } from '@templates/otoken/activity-types'
import { logFilter } from '@utils/logFilter'

export const zapperActivityProcessor = ({
  zapperAddress,
  otokenAddress,
}: {
  zapperAddress: string
  otokenAddress: string
}): ActivityProcessor => {
  return {
    name: 'Zapper Processor',
    filters: [
      logFilter({
        address: [zapperAddress],
        topic0: [zapperAbi.events.Zap.topic],
        transaction: true,
      }),
    ],
    async process(ctx: Context, block: Block, logs: Log[]): Promise<ZapActivity[]> {
      const [zapFilter] = this.filters
      return logs
        .filter((l) => zapFilter.matches(l))
        .map((log) => {
          const zap = zapperAbi.events.Zap.decode(log)
          return createActivity<ZapActivity>(
            { ctx, block, log },
            {
              processor: 'zapper',
              type: 'Zap',
              account: zap.minter,
              contract: zapperAddress,
              tokenIn: zap.asset,
              amountIn: zap.amount.toString(),
              tokenOut: otokenAddress,
              amountOut: zap.amount.toString(),
            },
          )
        })
    },
  }
}
