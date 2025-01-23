import { OTokenActivity } from '@model'
import { Context, waitForProcessorState } from '@originprotocol/squid-utils'
import { ActivityProcessor } from '@templates/otoken/activity-processor/types'
import { createActivity } from '@templates/otoken/activity-processor/utils'
import { BridgeActivity } from '@templates/otoken/activity-types'

import { CCIPProcessorResult } from '../../../../oeth/processors/ccip'

export const ccipBridgeActivityProcessor = (params: {
  otokenAddress: string
  wotokenAddresses: string[]
}): ActivityProcessor => {
  return {
    name: 'CCIP Bridge Processor',
    filters: [],
    async process(ctx: Context): Promise<OTokenActivity[]> {
      const results: OTokenActivity[] = []
      const ccipResult = await waitForProcessorState<CCIPProcessorResult>(ctx, 'ccip')
      for (const { block, log, transfer } of ccipResult.transfersWithLogs.values()) {
        if (
          !params.wotokenAddresses.includes(transfer.tokenIn) &&
          !params.wotokenAddresses.includes(transfer.tokenOut)
        ) {
          // Skip the transfer if it is not one of our wotoken addresses.
          continue
        }
        results.push(
          createActivity<BridgeActivity>(
            { ctx, block, log, otokenAddress: params.otokenAddress },
            {
              processor: 'ccip-bridge',
              type: 'Bridge',
              status: (['signed', 'signed', 'success', 'error'] as const)[transfer.state],
              txHashIn: transfer.txHashIn,
              txHashOut: transfer.txHashOut,
              messageId: transfer.messageId,
              bridge: transfer.bridge,
              transactor: transfer.transactor,
              sender: transfer.sender,
              receiver: transfer.receiver,
              chainIn: transfer.chainIn,
              chainOut: transfer.chainOut,
              tokenIn: transfer.tokenIn,
              tokenOut: transfer.tokenOut,
              amountIn: transfer.amountIn.toString(),
              amountOut: transfer.amountOut.toString(),
              state: transfer.state,
            },
          ),
        )
      }

      return results
    },
  }
}
