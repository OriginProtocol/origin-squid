import * as uniswapV3Abi from '@abi/uniswap-v3'
import { OTokenActivity } from '@model'
import { Block, Context, Log } from '@processor'
import { ActivityProcessor } from '@templates/otoken/activity-processor/types'
import { createActivity } from '@templates/otoken/activity-processor/utils'
import { SwapActivity } from '@templates/otoken/activity-types'
import { logFilter } from '@utils/logFilter'

export const uniswapV3ActivityProcessor = ({
  otokenAddress,
  address,
  tokens,
}: {
  otokenAddress: string
  address: string
  tokens: [string, string]
}): ActivityProcessor => {
  const tradeFilter = logFilter({
    address: [address],
    topic0: [uniswapV3Abi.events.Swap.topic],
    transaction: true,
  })
  return {
    name: 'UniswapV3 Activity Processor',
    filters: [tradeFilter],
    async process(ctx: Context, block: Block, logs: Log[]): Promise<OTokenActivity[]> {
      const tradeLogs = logs
        .filter((l) => tradeFilter.matches(l))
        .map((log) => ({
          log,
          data: uniswapV3Abi.events.Swap.decode(log),
        }))
      return tradeLogs.flatMap(({ log, data }) => {
        const senderTokens0 = { token: tokens[0], amount: data.amount0.toString() }
        const senderTokens1 = { token: tokens[1], amount: data.amount1.toString() }
        return [
          createActivity<SwapActivity>(
            { ctx, block, log, otokenAddress },
            {
              processor: 'uniswap-v3',
              type: 'Swap',
              account: data.sender.toLowerCase(),
              exchange: 'UniswapV3',
              contract: address,
              tokensIn: [data.amount0 < 0n ? senderTokens0 : senderTokens1],
              tokensOut: [data.amount0 > 0n ? senderTokens0 : senderTokens1],
            },
          ),
          createActivity<SwapActivity>(
            { ctx, block, log, otokenAddress },
            {
              processor: 'cow-swap',
              type: 'Swap',
              account: data.recipient.toLowerCase(),
              exchange: 'Balancer',
              contract: address,
              tokensIn: [data.amount0 > 0n ? senderTokens0 : senderTokens1],
              tokensOut: [data.amount0 < 0n ? senderTokens0 : senderTokens1],
            },
          ),
        ]
      })
    },
  }
}
