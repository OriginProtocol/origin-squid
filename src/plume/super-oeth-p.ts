import { parseEther } from 'viem'

import { createOTokenActivityProcessor } from '@templates/otoken/activity-processor/activity-processor'
import { createOTokenProcessor2 } from '@templates/otoken/otoken-2'
import { createOTokenWithdrawalsProcessor } from '@templates/withdrawals'
import { plumeAddresses } from '@utils/addresses-plume'

const otokenProcessor = createOTokenProcessor2({
  name: 'Super OETHp',
  symbol: 'superOETHp',
  from: 535166,
  vaultFrom: 878332,
  fee: 20n,
  otokenAddress: plumeAddresses.superOETHp.address,
  wotoken: {
    address: plumeAddresses.superOETHp.wrapped,
    from: 535170,
  },
  dripper: [
    {
      address: plumeAddresses.superOETHp.dripper,
      token: plumeAddresses.tokens.WETH,
      from: 552662,
    },
  ],
  harvester: undefined,
  otokenVaultAddress: plumeAddresses.superOETHp.vault,
  redemptionAsset: { asset: plumeAddresses.tokens.WETH, symbol: 'WETH' },
  oTokenAssets: [
    { asset: plumeAddresses.superOETHp.address, symbol: 'superOETHp' },
    {
      asset: plumeAddresses.tokens.WETH,
      symbol: 'WETH',
    },
  ],
  getAmoSupply: async (_ctx, _height) => 0n,
  upgrades: {
    rebaseOptEvents: false,
  },
  accountsOverThresholdMinimum: parseEther('.1'),
  feeOverride: 20n,
})

const otokenActivityProcessor = createOTokenActivityProcessor({
  from: 535166,
  otokenAddress: plumeAddresses.superOETHp.address,
  wotokenAddress: plumeAddresses.superOETHp.wrapped,
  vaultAddress: plumeAddresses.superOETHp.vault,
  cowSwap: false,
})

const otokenWithdrawalsProcessor = createOTokenWithdrawalsProcessor({
  oTokenAddress: plumeAddresses.superOETHp.address,
  oTokenVaultAddress: plumeAddresses.superOETHp.vault,
  from: 878332,
})

export const superOETHp = [otokenProcessor, otokenActivityProcessor, otokenWithdrawalsProcessor]
