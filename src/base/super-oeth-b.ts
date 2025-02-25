import { parseEther } from 'viem'
import { base } from 'viem/chains'

import { getPositions } from '@templates/aerodrome/lp'
import { createOTokenProcessor } from '@templates/otoken'
import { createOTokenActivityProcessor } from '@templates/otoken/activity-processor/activity-processor'
import { createOTokenWithdrawalsProcessor } from '@templates/withdrawals'
import { aerodromePools, baseAddresses } from '@utils/addresses-base'
import { tokensByChain } from '@utils/tokensByChain'

const otokenProcessor = createOTokenProcessor({
  name: 'Super OETHb',
  symbol: 'superOETHb',
  from: 17819702,
  vaultFrom: 17819702,
  otokenAddress: baseAddresses.tokens.superOETHb,
  wotoken: {
    address: baseAddresses.tokens.wsuperOETHb,
    from: 18760018,
  },
  dripper: {
    address: baseAddresses.superOETHb.dripper,
    token: tokensByChain[base.id].WETH,
    from: 18215706,
  },
  harvester: {
    address: baseAddresses.superOETHb.harvester,
    from: 20464482,
    yieldSent: true,
  },
  otokenVaultAddress: baseAddresses.superOETHb.vault,
  redemptionAsset: { asset: baseAddresses.tokens.WETH, symbol: 'WETH' },
  oTokenAssets: [
    { asset: baseAddresses.tokens.superOETHb, symbol: 'superOETHb' },
    {
      asset: baseAddresses.tokens.WETH,
      symbol: 'WETH',
    },
  ],
  getAmoSupply: async (ctx, height) => {
    const positions = await getPositions(
      ctx,
      height,
      aerodromePools['CL1-WETH/superOETHb'],
      baseAddresses.superOETHb.strategies.amo,
      1,
    )
    return positions.reduce((acc, position) => acc + BigInt(position.amount1) + BigInt(position.staked1), 0n)
  },
  upgrades: {
    rebaseOptEvents: false,
  },
  accountsOverThresholdMinimum: parseEther('.1'),
  feeOverride: 20n,
})

const otokenActivityProcessor = createOTokenActivityProcessor({
  from: 17819702,
  otokenAddress: baseAddresses.tokens.superOETHb,
  wotokenAddress: baseAddresses.tokens.wsuperOETHb,
  vaultAddress: baseAddresses.superOETHb.vault,
  cowSwap: false,
})

const otokenWithdrawalsProcessor = createOTokenWithdrawalsProcessor({
  oTokenAddress: baseAddresses.superOETHb.address,
  oTokenVaultAddress: baseAddresses.superOETHb.vault,
  from: 21544908,
})

export const superOETHb = [otokenProcessor, otokenActivityProcessor, otokenWithdrawalsProcessor]
