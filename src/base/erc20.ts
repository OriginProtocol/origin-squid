import { createERC20EventTracker } from '@templates/erc20/erc20-event'
import { createERC20PollingTracker } from '@templates/erc20/erc20-polling'
import { OGN_BASE_ADDRESS } from '@utils/addresses'
import { baseAddresses } from '@utils/addresses-base'

export const baseERC20s = [
  // OGN
  createERC20EventTracker({
    from: 15676145,
    address: OGN_BASE_ADDRESS,
  }),
  // wsuperOETHb
  createERC20EventTracker({
    from: 17819702,
    address: baseAddresses.tokens.wsuperOETHb,
  }),
  // bridgedWOETH
  createERC20EventTracker({
    from: 13327014,
    address: baseAddresses.tokens.bridgedWOETH,
  }),
  // AERO (limited)
  createERC20PollingTracker({
    from: 18689558,
    address: baseAddresses.tokens.AERO,
    accountFilter: [baseAddresses.superOETHb.strategies.aerodromeAMO, baseAddresses.multisig.reservoir],
    intervalTracking: true,
  }),
  // WETH (limited)
  createERC20PollingTracker({
    from: 18689558,
    address: baseAddresses.tokens.WETH,
    accountFilter: [baseAddresses.superOETHb.dripper, baseAddresses.superOETHb.vault, baseAddresses.multisig.reservoir],
    intervalTracking: true,
  }),
]
