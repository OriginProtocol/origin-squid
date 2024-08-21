import * as otoken from '@abi/otoken'
import { createERC20Tracker } from '@templates/erc20'
import { createERC20SimpleTracker } from '@templates/erc20-simple'
import { OGN_BASE_ADDRESS } from '@utils/addresses'
import { baseAddresses } from '@utils/addresses-base'
import { logFilter } from '@utils/logFilter'

export const baseERC20s = [
  // OGN
  createERC20SimpleTracker({
    from: 15676145,
    address: OGN_BASE_ADDRESS,
  }),
  // superOETHb
  createERC20Tracker({
    from: 17819702,
    address: baseAddresses.tokens.superOETHb,
    rebaseFilters: [
      logFilter({
        address: [baseAddresses.tokens.superOETHb],
        topic0: [otoken.events.TotalSupplyUpdatedHighres.topic],
        transaction: true,
        range: { from: 17819702 },
      }),
    ],
  }),
  // wsuperOETHb
  createERC20SimpleTracker({
    from: 17819702,
    address: baseAddresses.tokens.wsuperOETHb,
  }),
  // WETH (limited)
  createERC20Tracker({
    from: 18689558,
    address: baseAddresses.tokens.WETH,
    accountFilter: [baseAddresses.superOETHb.dripper],
    intervalTracking: true,
  }),
]
