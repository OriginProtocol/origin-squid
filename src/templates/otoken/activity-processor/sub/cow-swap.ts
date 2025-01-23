import * as cowswapSettlementAbi from '@abi/cow-swap-settlement'
import { OTokenActivity } from '@model'
import { Block, Context, Log, logFilter } from '@originprotocol/squid-utils'
import { ActivityProcessor } from '@templates/otoken/activity-processor/types'
import { createActivity } from '@templates/otoken/activity-processor/utils'
import { SwapActivity } from '@templates/otoken/activity-types'
import { COWSWAP_SETTLEMENT_ADDRESS } from '@utils/addresses'

export const cowSwapActivityProcessor = ({
  otokenAddress,
  address,
}: {
  otokenAddress: string
  address: string
}): ActivityProcessor => {
  const tradeFilter = logFilter({
    address: [COWSWAP_SETTLEMENT_ADDRESS],
    topic0: [cowswapSettlementAbi.events.Trade.topic],
    transaction: true,
  })
  return {
    name: 'Cowswap Activity Processor',
    filters: [tradeFilter],
    async process(ctx: Context, block: Block, logs: Log[]): Promise<OTokenActivity[]> {
      const tradeLogs = logs
        .filter((l) => tradeFilter.matches(l))
        .map((log) => ({
          log,
          data: cowswapSettlementAbi.events.Trade.decode(log),
        }))
      return tradeLogs
        .filter(({ data }) => data.buyToken.toLowerCase() === address || data.sellToken.toLowerCase() === address)
        .map(({ log, data }) => {
          return createActivity<SwapActivity>(
            { ctx, block, log, otokenAddress },
            {
              processor: 'cow-swap',
              type: 'Swap',
              account: log.transaction!.from,
              exchange: 'Balancer',
              contract: COWSWAP_SETTLEMENT_ADDRESS,
              tokensIn: [{ token: data.sellToken, amount: data.sellAmount.toString() }],
              tokensOut: [{ token: data.buyToken, amount: data.buyAmount.toString() }],
            },
          )
        })
    },
  }
}
