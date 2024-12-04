import * as otoken from '@abi/otoken'
import { createERC20Tracker } from '@templates/erc20'
import { createERC20SimpleTracker } from '@templates/erc20-simple'
import { createRebasingERC20Tracker, getErc20RebasingParams } from '@templates/erc20/erc20-rebasing'
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
  createRebasingERC20Tracker({
    from: 17819702,
    address: baseAddresses.tokens.superOETHb,
    rebasing: {
      rebaseEventFilter: logFilter({
        address: [baseAddresses.tokens.superOETHb],
        topic0: [otoken.events.TotalSupplyUpdatedHighres.topic],
        transaction: true,
        range: { from: 17819702 },
      }),
      getCredits: async (ctx, block, address) => {
        const oToken = new otoken.Contract(ctx, block.header, baseAddresses.tokens.superOETHb)
        return oToken.creditsBalanceOfHighres(address).then((credits) => credits._0)
      },
      getCreditsPerToken: async (ctx, block) => {
        const oToken = new otoken.Contract(ctx, block.header, baseAddresses.tokens.superOETHb)
        return oToken.rebasingCreditsPerTokenHighres()
      },
      ...getErc20RebasingParams({
        from: 17819702,
        yieldDelegationFrom: 23192884,
        address: baseAddresses.tokens.superOETHb,
      }),
    },
  }),
  // wsuperOETHb
  createERC20SimpleTracker({
    from: 17819702,
    address: baseAddresses.tokens.wsuperOETHb,
  }),
  // bridgedWOETH
  createERC20SimpleTracker({
    from: 13327014,
    address: baseAddresses.tokens.bridgedWOETH,
  }),
  // AERO (limited)
  createERC20Tracker({
    from: 18689558,
    address: baseAddresses.tokens.AERO,
    accountFilter: [baseAddresses.superOETHb.strategies.amo, baseAddresses.multisig.reservoir],
    intervalTracking: true,
  }),
  // WETH (limited)
  createERC20Tracker({
    from: 18689558,
    address: baseAddresses.tokens.WETH,
    accountFilter: [baseAddresses.superOETHb.dripper, baseAddresses.superOETHb.vault, baseAddresses.multisig.reservoir],
    intervalTracking: true,
  }),
]
