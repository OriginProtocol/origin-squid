import { parseEther } from 'viem'

import * as erc20 from '@abi/erc20'
import * as initializableAbstractStrategyAbi from '@abi/initializable-abstract-strategy'
import { createOTokenActivityProcessor } from '@templates/otoken/activity-processor/activity-processor'
import { createOTokenProcessor2 } from '@templates/otoken/otoken-2'
import { createOTokenWithdrawalsProcessor } from '@templates/withdrawals'
import { sonicAddresses } from '@utils/addresses-sonic'

const otokenProcessor = createOTokenProcessor2({
  name: 'OS',
  symbol: 'OS',
  from: sonicAddresses.OS.initializeBlock,
  otokenVaultAddress: sonicAddresses.OS.vault,
  vaultFrom: 3884318,
  feeStructure: [{ fee: 10n, from: 3884286 }],
  otokenAddress: sonicAddresses.OS.address,
  wotoken: {
    address: sonicAddresses.OS.wrapped,
    from: 4025393,
  },
  dripper: [
    {
      address: sonicAddresses.OS.dripper,
      token: sonicAddresses.tokens.wS,
      from: 3884406,
      to: 20754935,
      vaultDripper: false,
    },
    {
      address: sonicAddresses.OS.vault,
      token: sonicAddresses.tokens.wS,
      from: 20754935,
      vaultDripper: true,
    },
  ],
  harvester: {
    address: sonicAddresses.OS.harvester,
    from: sonicAddresses.OS.initializeBlock,
    yieldSent: true,
  },
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
  getAmoSupply: async (ctx, height) => {
    if (height < sonicAddresses.OS.amoSwapX.strategy.from) return 0n
    const contract = new initializableAbstractStrategyAbi.Contract(
      ctx,
      { height },
      sonicAddresses.OS.amoSwapX.strategy.address,
    )
    const balance = await contract.checkBalance(sonicAddresses.tokens.wS)
    const ws = new erc20.Contract(ctx, { height }, sonicAddresses.tokens.wS)
    const os = new erc20.Contract(ctx, { height }, sonicAddresses.tokens.OS)
    const wsBalance = await ws.balanceOf(sonicAddresses.OS.amoSwapX.pool)
    const osBalance = await os.balanceOf(sonicAddresses.OS.amoSwapX.pool)
    const ratio = (osBalance * 10n ** 18n) / (osBalance + wsBalance)
    return (balance * ratio) / 10n ** 18n
  },
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
