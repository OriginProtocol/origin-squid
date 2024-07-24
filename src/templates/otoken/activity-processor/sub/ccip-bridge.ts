import { Context } from '@processor'
import { ActivityProcessor } from '@templates/otoken/activity-processor/types'
import { createActivity } from '@templates/otoken/activity-processor/utils'
import { ActivityStatus, BridgeActivity } from '@templates/otoken/activity-types'
import { waitForProcessorState } from '@utils/state'

import { CCIPProcessorResult } from '../../../../oeth/processors/ccip'

export const ccipBridgeActivityProcessor = (params: { wotokenAddresses: string[] }): ActivityProcessor => {
  return {
    name: 'CCIP Bridge Processor',
    filters: [],
    async process(ctx: Context): Promise<BridgeActivity[]> {
      const results: BridgeActivity[] = []
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
            { ctx, block, log },
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
