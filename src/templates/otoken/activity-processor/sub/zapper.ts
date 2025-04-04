import * as zapperAbi from '@abi/oeth-zapper'
import { OTokenActivity } from '@model'
import { Block, Context, Log, logFilter } from '@originprotocol/squid-utils'
import { ActivityProcessor } from '@templates/otoken/activity-processor/types'
import { createActivity } from '@templates/otoken/activity-processor/utils'
import { ZapActivity } from '@templates/otoken/activity-types'

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
    async process(ctx: Context, block: Block, logs: Log[]): Promise<OTokenActivity[]> {
      const [zapFilter] = this.filters
      return logs
        .filter((l) => zapFilter.matches(l))
        .map((log) => {
          const zap = zapperAbi.events.Zap.decode(log)
          return createActivity<ZapActivity>(
            { ctx, block, log, otokenAddress },
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
