import * as curvePoolAbi from '@abi/curve-lp-token'
import { OTokenActivity } from '@model'
import { Block, Context, Log } from '@processor'
import { ActivityProcessor } from '@templates/otoken/activity-processor/types'
import { createActivity } from '@templates/otoken/activity-processor/utils'
import { SwapActivity } from '@templates/otoken/activity-types'
import { logFilter } from '@utils/logFilter'

export const curveActivityProcessor = ({
  otokenAddress,
  address,
  tokens,
}: {
  otokenAddress: string
  address: string
  tokens: string[]
}): ActivityProcessor => {
  return {
    name: 'Curve Pool Processor',
    filters: [logFilter({ address: [address], topic0: [curvePoolAbi.events.TokenExchange.topic] })],
    async process(ctx: Context, block: Block, logs: Log[]): Promise<OTokenActivity[]> {
      const [tokenExchangeFilter] = this.filters
      return logs
        .filter((l) => tokenExchangeFilter.matches(l))
        .map((log) => {
          const tokenExchange = curvePoolAbi.events.TokenExchange.decode(log)
          return createActivity<SwapActivity>(
            { ctx, block, log, otokenAddress },
            {
              processor: 'curve',
              type: 'Swap',
              account: tokenExchange.buyer,
              exchange: 'Curve',
              contract: log.address,
              tokensIn: [
                { token: tokens[Number(tokenExchange.sold_id)], amount: tokenExchange.tokens_sold.toString() },
              ],
              tokensOut: [
                {
                  token: tokens[Number(tokenExchange.bought_id)],
                  amount: tokenExchange.tokens_bought.toString(),
                },
              ],
            },
          )
        })
    },
  }
}
