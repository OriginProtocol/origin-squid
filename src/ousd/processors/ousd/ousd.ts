import { parseEther } from 'viem'
import { mainnet } from 'viem/chains'

import * as erc20Abi from '@abi/erc20'
import { createOTokenProcessor2 } from '@templates/otoken/otoken-2'
import {
  DAI_ADDRESS,
  OUSD_ADDRESS,
  OUSD_DRIPPER_ADDRESS,
  OUSD_VAULT_ADDRESS,
  USDC_ADDRESS,
  USDS_ADDRESS,
  USDT_ADDRESS,
  WOUSD_ADDRESS,
  addresses,
} from '@utils/addresses'
import { tokensByChain } from '@utils/tokensByChain'

// export const from = 10884563 // https://etherscan.io/tx/0x9141921f5ebf072e58c00fe56332b6bee0c02f0ae4f54c42999b8a3a88662681
// export const from = 11585978 // OUSDReset
// export const from = 13533937 // https://etherscan.io/tx/0xc9b6fc6a4fad18dad197ff7d0636f74bf066671d75656849a1c45122e00d54cf

export const ousdProcessor = createOTokenProcessor2({
  name: 'OUSD',
  symbol: 'OUSD',
  from: 11590995, // OUSDReset~
  vaultFrom: 11596942,
  feeStructure: [],
  Upgrade_CreditsBalanceOfHighRes: 13533937, // https://etherscan.io/tx/0xc9b6fc6a4fad18dad197ff7d0636f74bf066671d75656849a1c45122e00d54cf
  otokenAddress: OUSD_ADDRESS,
  wotoken: {
    address: WOUSD_ADDRESS,
    from: 14566215, // https://etherscan.io/tx/0x5b16078d43861bf0e7a08aa3f061dbfce1c76bc5fc7cedaa96e2156d15651df1
  },
  dripper: [
    {
      address: OUSD_DRIPPER_ADDRESS,
      token: tokensByChain[mainnet.id].WETH,
      from: 14250273,
      to: 22380819,
      vaultDripper: false,
    },
    {
      address: OUSD_VAULT_ADDRESS,
      token: tokensByChain[mainnet.id].WETH,
      from: 22380819,
      vaultDripper: true,
    },
  ],
  otokenVaultAddress: OUSD_VAULT_ADDRESS,
  oTokenAssets: [
    { asset: USDC_ADDRESS, symbol: 'USDC' },
    { asset: USDT_ADDRESS, symbol: 'USDT' },
    { asset: DAI_ADDRESS, symbol: 'DAI' },
    { asset: USDS_ADDRESS, symbol: 'USDS' },
  ],
  getAmoSupply: async (ctx, height) => {
    // get balance of 0x87650D7bbfC3A9F10587d7778206671719d9910D
    // gauge is 0x25f0cE4E2F8dbA112D9b115710AC297F816087CD
    // figure out our % owned of that
    // valid since 12860905

    // get balance of 0x6d18E1a7faeB1F0467A77C0d293872ab685426dc
    // gauge is 0x1ef8b6ea6434e722c916314caf8bf16c81caf2f9

    // figure out our % owned of that
    // valid since 22224255

    if (height <= 15896475) return 0n

    const ousdContract = new erc20Abi.Contract(ctx, { height }, OUSD_ADDRESS)
    const threeCrvPoolContract = new erc20Abi.Contract(ctx, { height }, '0x87650d7bbfc3a9f10587d7778206671719d9910d')
    const threeCrvGaugeContract = new erc20Abi.Contract(ctx, { height }, '0x25f0ce4e2f8dba112d9b115710ac297f816087cd')
    const threeCrvRewardPoolContract = new erc20Abi.Contract(
      ctx,
      { height },
      '0x7d536a737c13561e0d2decf1152a653b4e615158',
    )
    const usdcPoolContract = new erc20Abi.Contract(ctx, { height }, '0x6d18e1a7faeb1f0467a77c0d293872ab685426dc')
    const usdcGaugeContract = new erc20Abi.Contract(ctx, { height }, '0x1ef8b6ea6434e722c916314caf8bf16c81caf2f9')

    const [
      amo1_heldByPool,
      amo1_heldByGauge,
      amo1_poolSupply,
      amo1_heldByVoterProxy,
      amo1_gaugeSupply,
      amo1_heldByStrategy,
      amo1_rewardPoolSupply,
      amo1_heldByStrategyOnGauge,
    ] = await Promise.all([
      // Get ousd held by pool, pool held by gauge, gauge held by strategy
      ousdContract.balanceOf('0x87650d7bbfc3a9f10587d7778206671719d9910d'),
      threeCrvPoolContract.balanceOf('0x25f0ce4e2f8dba112d9b115710ac297f816087cd'),
      threeCrvPoolContract.totalSupply(),
      threeCrvGaugeContract.balanceOf('0x989aeb4d175e16225e39e87d0d97a3360524ad80'),
      threeCrvGaugeContract.totalSupply(),
      threeCrvRewardPoolContract.balanceOf(addresses.strategies.ousd.ConvexOUSDMetaStrategy),
      threeCrvRewardPoolContract.totalSupply(),
      threeCrvGaugeContract.balanceOf(addresses.strategies.ousd.ConvexOUSDMetaStrategy),
    ])
    const amo1_gaugeOwnershipPercentage = (amo1_heldByGauge * 10n ** 18n) / amo1_poolSupply
    const amo1_voterOwnershipPercentage = (amo1_heldByVoterProxy * 10n ** 18n) / amo1_gaugeSupply
    const amo1_strategyOwnershipPercentage = (amo1_heldByStrategy * 10n ** 18n) / amo1_rewardPoolSupply
    const amo1_strategyOwnershipPercentageOnGauge = (amo1_heldByStrategyOnGauge * 10n ** 18n) / amo1_gaugeSupply

    const amo1_overallOwnershipPercentage =
      (amo1_gaugeOwnershipPercentage * amo1_strategyOwnershipPercentage * amo1_voterOwnershipPercentage) / 10n ** 36n
    const amo1_overallOwnershipPercentageOnGauge =
      (amo1_gaugeOwnershipPercentage * amo1_strategyOwnershipPercentageOnGauge) / 10n ** 18n
    const amo1_supply =
      (amo1_heldByPool * (amo1_overallOwnershipPercentage + amo1_overallOwnershipPercentageOnGauge)) / 10n ** 18n

    if (height <= 22224255) return amo1_supply

    const [amo2_heldByPool, amo2_heldByGauge, amo2_poolSupply, amo2_heldByStrategy, amo2_gaugeSupply] =
      await Promise.all([
        // Get ousd held by pool, pool held by gauge, gauge held by strategy
        ousdContract.balanceOf('0x6d18e1a7faeb1f0467a77c0d293872ab685426dc'),
        usdcPoolContract.balanceOf('0x1ef8b6ea6434e722c916314caf8bf16c81caf2f9'),
        usdcPoolContract.totalSupply(),
        usdcGaugeContract.balanceOf(addresses.strategies.ousd.CurveUSDCAMOStrategy),
        usdcGaugeContract.totalSupply(),
      ])

    const amo2_gaugeOwnershipPercentage = (amo2_heldByGauge * 10n ** 18n) / amo2_poolSupply
    const amo2_strategyOwnershipPercentage =
      amo2_gaugeSupply > 0n ? (amo2_heldByStrategy * 10n ** 18n) / amo2_gaugeSupply : 0n
    const amo2_overallOwnershipPercentage =
      (amo2_gaugeOwnershipPercentage * amo2_strategyOwnershipPercentage) / 10n ** 18n
    const amo2_supply = (amo2_heldByPool * amo2_overallOwnershipPercentage) / 10n ** 18n

    return amo1_supply + amo2_supply
  },
  accountsOverThresholdMinimum: parseEther('100'),
})
