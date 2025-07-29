import { createERC20EventTracker, createERC20PollingTracker } from '@templates/erc20'
import { sonicAddresses } from '@utils/addresses-sonic'

export const sonicErc20s = [
  createERC20EventTracker({ address: sonicAddresses.tokens.wOS, from: sonicAddresses.OS.initializeBlock }),
  createERC20PollingTracker({
    from: 3884286,
    address: sonicAddresses.tokens.wS,
    accountFilter: [sonicAddresses.OS.vault],
    intervalTracking: true,
  }),
]
