import * as otokenAbi from '@abi/otoken'
import { OTokenActivity } from '@model'
import { ActivityProcessor } from '@templates/otoken/activity-processor/types'
import { createActivity } from '@templates/otoken/activity-processor/utils'
import { ApprovalActivity } from '@templates/otoken/activity-types'
import { logFilter } from '@utils/logFilter'

export const approvalActivityProcessor = ({ otokenAddress }: { otokenAddress: string }): ActivityProcessor => {
  const approvalFilter = logFilter({ address: [otokenAddress], topic0: [otokenAbi.events.Approval.topic] })
  return {
    name: 'Approval Processor',
    filters: [approvalFilter],
    process: async (ctx, block, logs) => {
      const result: OTokenActivity[] = []
      const approvalLogs = logs.filter((l) => approvalFilter.matches(l))
      result.push(
        ...approvalLogs.map((log) => {
          const data = otokenAbi.events.Approval.decode(log)
          return createActivity<ApprovalActivity>(
            { ctx, block, log, otokenAddress },
            {
              processor: 'approval',
              type: 'Approval',
              owner: data.owner,
              spender: data.spender,
              token: otokenAddress,
              value: data.value.toString(),
            },
          )
        }),
      )
      return result
    },
  }
}
