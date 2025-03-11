import { parseEther } from 'viem'

import { createOTokenProcessor } from '@templates/otoken'
import { createOTokenActivityProcessor } from '@templates/otoken/activity-processor/activity-processor'
import { createOTokenWithdrawalsProcessor } from '@templates/withdrawals'
import { sonicAddresses } from '@utils/addresses-sonic'

const otokenProcessor = createOTokenProcessor({
  name: 'OS',
  symbol: 'OS',
  from: sonicAddresses.OS.initializeBlock,
  vaultFrom: 3884318,
  otokenAddress: sonicAddresses.OS.address,
  wotoken: {
    address: sonicAddresses.OS.wrapped,
    from: 4025393,
  },
  dripper: {
    address: sonicAddresses.OS.dripper,
    token: sonicAddresses.tokens.wS,
    from: 3884406,
  },
  harvester: {
    address: sonicAddresses.OS.harvester,
    from: sonicAddresses.OS.initializeBlock,
    yieldSent: true,
  },
  otokenVaultAddress: sonicAddresses.OS.vault,
  redemptionAsset: { asset: sonicAddresses.tokens.wS, symbol: 'wS' },
  oTokenAssets: [
    { asset: sonicAddresses.OS.address, symbol: 'OS' },
    {
      asset: sonicAddresses.tokens.wS,
      symbol: 'wS',
    },
  ],
  upgrades: {
    rebaseOptEvents: false,
  },
  accountsOverThresholdMinimum: parseEther('.01'),
  getAmoSupply: async () => 0n,
})

const otokenActivityProcessor = createOTokenActivityProcessor({
  from: sonicAddresses.OS.initializeBlock,
  otokenAddress: sonicAddresses.tokens.OS,
  wotokenAddress: sonicAddresses.tokens.wOS,
  vaultAddress: sonicAddresses.OS.vault,
  cowSwap: false,
})

const otokenWithdrawalsProcessor = createOTokenWithdrawalsProcessor({
  oTokenAddress: sonicAddresses.OS.address,
  oTokenVaultAddress: sonicAddresses.OS.vault,
  from: sonicAddresses.OS.initializeBlock,
})

export const OS = [otokenProcessor, otokenActivityProcessor, otokenWithdrawalsProcessor]
