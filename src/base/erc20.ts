import * as otoken from '@abi/otoken'
import { createERC20Tracker } from '@templates/erc20'
import { createERC20SimpleTracker } from '@templates/erc20-simple'
import { OGN_BASE_ADDRESS } from '@utils/addresses'
import { baseAddresses } from '@utils/addresses-base'
import { logFilter } from '@utils/logFilter'

export const baseERC20s = [
  createERC20SimpleTracker({
    from: 15676145,
    address: OGN_BASE_ADDRESS,
  }),
  // vAMM-WETH/OGN
  createERC20SimpleTracker(baseAddresses.aerodrome['vAMM-WETH/OGN'].pool),
  createERC20SimpleTracker(baseAddresses.aerodrome['vAMM-WETH/OGN'].gauge),
  createERC20SimpleTracker(baseAddresses.aerodrome['CL1-WETH/superOETHb'].pool),
  // createERC20SimpleTracker(baseAddresses.aerodrome['CL1-WETH/superOETHb'].gauge),
  createERC20SimpleTracker(baseAddresses.aerodrome['vAMM-OGN/superOETHb'].pool),
  // createERC20SimpleTracker(baseAddresses.aerodrome['vAMM-OGN/superOETHb'].gauge),
  createERC20SimpleTracker(baseAddresses.aerodrome['CL1-cbETH/WETH'].pool),
  createERC20SimpleTracker(baseAddresses.aerodrome['CL1-cbETH/WETH'].gauge),
  createERC20Tracker({
    from: 17819702,
    address: baseAddresses.superOETHb,
    rebaseFilters: [
      logFilter({
        address: [baseAddresses.superOETHb],
        topic0: [otoken.events.TotalSupplyUpdatedHighres.topic],
        transaction: true,
        range: { from: 17819702 },
      }),
    ],
  }),
  createERC20SimpleTracker({
    from: 17819702,
    address: baseAddresses.wsuperOETHb,
  }),
]
