import { createERC20PollingTracker } from '@templates/erc20'
import { plumeAddresses } from '@utils/addresses-plume'

export const sonicErc20s = [
  createERC20PollingTracker({
    from: 878332, // Vault Deploy
    address: plumeAddresses.tokens.WETH,
    accountFilter: [plumeAddresses.superOETHp.vault],
    intervalTracking: true,
  }),
]
