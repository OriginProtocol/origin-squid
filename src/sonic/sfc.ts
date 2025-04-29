import { SFCWithdrawal } from '@model'
import { defineProcessor, logFilter } from '@originprotocol/squid-utils'
import { sonicAddresses } from '@utils/addresses-sonic'

import { events } from '../abi/sonic-sfc'

const from = sonicAddresses.OS.nativeStrategies.reduce(
  (acc, s) => (acc < s.from ? acc : s.from),
  Number.MAX_SAFE_INTEGER,
)

const undelegateFilter = logFilter({
  address: [sonicAddresses.contracts.SFC],
  topic0: [events.Undelegated.topic],
  topic1: sonicAddresses.OS.nativeStrategies.map((s) => s.address),
  range: { from },
})

const withdrawnFilter = logFilter({
  address: [sonicAddresses.contracts.SFC],
  topic0: [events.Withdrawn.topic],
  topic1: sonicAddresses.OS.nativeStrategies.map((s) => s.address),
  range: { from },
})

export const sfcProcessor = defineProcessor({
  name: 'sfc',
  from,
  setup: (p) => {
    p.addLog(undelegateFilter.value)
    p.addLog(withdrawnFilter.value)
  },
  process: async (ctx) => {
    const withdrawals = new Map<string, SFCWithdrawal>()
    for (const block of ctx.blocks) {
      for (const log of block.logs) {
        if (undelegateFilter.matches(log)) {
          const data = events.Undelegated.decode(log)
          const id = `${log.address}-${data.delegator}-${data.toValidatorID}-${data.wrID}`
          withdrawals.set(
            id,
            new SFCWithdrawal({
              id,
              chainId: ctx.chain.id,
              createdAt: new Date(block.header.timestamp),
              createdAtBlock: block.header.height,
              delegator: data.delegator,
              toValidatorID: data.toValidatorID.toString(),
              wrID: data.wrID.toString(),
              amount: data.amount,
              penalty: null,
              withdrawnAt: null,
              withdrawnAtBlock: null,
            }),
          )
        }
        if (withdrawnFilter.matches(log)) {
          const data = events.Withdrawn.decode(log)
          const id = `${log.address}-${data.delegator}-${data.toValidatorID}-${data.wrID}`
          const withdrawal = withdrawals.get(id) ?? (await ctx.store.get(SFCWithdrawal, id))
          if (!withdrawal) throw new Error(`Withdrawal ${id} not found`)
          withdrawals.set(id, withdrawal)
          withdrawal.withdrawnAt = new Date(block.header.timestamp)
          withdrawal.withdrawnAtBlock = block.header.height
          withdrawal.penalty = data.penalty
        }
      }
    }
    await ctx.store.save([...withdrawals.values()])
  },
})
