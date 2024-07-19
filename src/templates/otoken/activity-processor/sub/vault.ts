import { uniq } from 'lodash'

import * as otokenVaultAbi from '@abi/otoken-vault'
import * as wotokenAbi from '@abi/woeth'
import { ActivityProcessor } from '@templates/otoken/activity-processor/types'
import { createActivity } from '@templates/otoken/activity-processor/utils'
import { MintActivity, RedeemActivity } from '@templates/otoken/activity-types'
import { ETH_ADDRESS } from '@utils/addresses'
import { logFilter } from '@utils/logFilter'

export const vaultActivityProcessor = ({
  otokenAddress,
  vaultAddress,
}: {
  otokenAddress: string
  vaultAddress: string
}): ActivityProcessor<MintActivity | RedeemActivity> => {
  const mintFilter = logFilter({ address: [vaultAddress], topic0: [otokenVaultAbi.events.Mint.topic] })
  const redeemFilter = logFilter({ address: [vaultAddress], topic0: [otokenVaultAbi.events.Redeem.topic] })
  const transferInFilter = logFilter({ topic0: [wotokenAbi.events.Transfer.topic], topic2: [vaultAddress] })
  const transferOutFilter = logFilter({ topic0: [wotokenAbi.events.Transfer.topic], topic1: [vaultAddress] })
  return {
    name: 'Vault Processor',
    filters: [mintFilter, redeemFilter, transferInFilter, transferOutFilter],
    process: async (ctx, block, logs) => {
      const result: (MintActivity | RedeemActivity)[] = []
      // Mint
      const mintLogs = logs.filter((l) => mintFilter.matches(l))
      if (mintLogs.length) {
        const transferInLogs = logs.filter((l) => transferInFilter.matches(l))
        const tokenIn = transferInLogs[0]?.address ?? ETH_ADDRESS
        const amountIn = mintLogs.reduce((sum, l) => sum + otokenVaultAbi.events.Mint.decode(l)._value, 0n)
        result.push(
          ...mintLogs.map((log) => {
            const data = otokenVaultAbi.events.Mint.decode(log)
            return createActivity<MintActivity>(
              { ctx, block, log },
              {
                processor: 'vault',
                type: 'Mint',
                contract: log.address,
                account: data._addr,
                tokenIn,
                amountIn: amountIn.toString(),
                tokenOut: otokenAddress,
                amountOut: data._value.toString(),
              },
            )
          }),
        )
      }
      // Redeem
      const redeemLogs = logs.filter((l) => redeemFilter.matches(l))
      if (redeemLogs.length) {
        const transferOutLogs = logs.filter((l) => transferOutFilter.matches(l))
        const tokensOut = uniq(transferOutLogs.map((l) => l.address))
        const amountOut = redeemLogs.reduce((sum, l) => sum + otokenVaultAbi.events.Redeem.decode(l)._value, 0n)
        result.push(
          ...redeemLogs.map((log) => {
            const data = otokenVaultAbi.events.Redeem.decode(log)
            return createActivity<RedeemActivity>(
              { ctx, block, log },
              {
                processor: 'vault',
                type: 'Redeem',
                contract: log.address,
                account: data._addr,
                tokenIn: otokenAddress,
                amountIn: data._value.toString(),
                tokenOut: tokensOut.length > 1 ? 'MIX' : tokensOut[0] ?? ETH_ADDRESS,
                amountOut: amountOut.toString(),
              },
            )
          }),
        )
      }
      return result
    },
  }
}
