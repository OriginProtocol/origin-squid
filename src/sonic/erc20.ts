import { createERC20EventTracker } from '@templates/erc20'
import { sonicAddresses } from '@utils/addresses-sonic'

export const sonicErc20s = [
  createERC20EventTracker({ address: sonicAddresses.tokens.wOS, from: sonicAddresses.OS.initializeBlock }),
]
