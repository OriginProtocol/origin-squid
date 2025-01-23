import * as balancerVaultAbi from '@abi/balancer-vault'
import { OTokenActivity } from '@model'
import { Block, Context, Log, logFilter } from '@originprotocol/squid-utils'
import { ActivityProcessor } from '@templates/otoken/activity-processor/types'
import { createActivity } from '@templates/otoken/activity-processor/utils'
import { SwapActivity } from '@templates/otoken/activity-types'
import { BALANCER_VAULT_ADDRESS } from '@utils/addresses'

export const balancerActivityProcessor = ({
  otokenAddress,
  pools,
}: {
  otokenAddress: string
  pools: string[]
}): ActivityProcessor => {
  return {
    name: 'Balancer Pool Processor',
    filters: [
      logFilter({
        address: [BALANCER_VAULT_ADDRESS],
        topic0: [balancerVaultAbi.events.Swap.topic],
        topic1: pools,
        transaction: true,
      }),
    ],
    async process(ctx: Context, block: Block, logs: Log[]): Promise<OTokenActivity[]> {
      const [swapFilter] = this.filters
      return logs
        .filter((l) => swapFilter.matches(l))
        .map((log) => {
          const swap = balancerVaultAbi.events.Swap.decode(log)
          return createActivity<SwapActivity>(
            { ctx, block, log, otokenAddress },
            {
              processor: 'balancer',
              type: 'Swap',
              account: log.transaction!.from,
              exchange: 'Balancer',
              contract: swap.poolId,
              tokensIn: [{ token: swap.tokenIn, amount: swap.amountIn.toString() }],
              tokensOut: [{ token: swap.tokenOut, amount: swap.amountOut.toString() }],
            },
          )
        })
    },
  }
}
