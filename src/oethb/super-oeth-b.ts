import { parseEther } from 'viem';
import { base } from 'viem/chains';



import * as erc20Abi from '@abi/erc20';
import { getPositions } from '@templates/aerodrome/lp';
import { createOTokenActivityProcessor } from '@templates/otoken/activity-processor/activity-processor';
import { createOTokenProcessor2 } from '@templates/otoken/otoken-2';
import { createOTokenWithdrawalsProcessor } from '@templates/withdrawals';
import { aerodromePools, baseAddresses } from '@utils/addresses-base';
import { tokensByChain } from '@utils/tokensByChain';



import { baseCurveAMO } from '../base/strategies';


const otokenProcessor = createOTokenProcessor2({
  name: 'Super OETHb',
  symbol: 'superOETHb',
  from: 17819702,
  vaultFrom: 17819702,
  feeStructure: [{ fee: 20n, from: 17819702, to: 32657316 }],
  otokenAddress: baseAddresses.tokens.superOETHb,
  wotoken: {
    address: baseAddresses.tokens.wsuperOETHb,
    from: 18760018,
  },
  dripper: [
    {
      address: baseAddresses.superOETHb.dripper,
      token: tokensByChain[base.id].WETH,
      from: 18215706,
      to: 29358238,
      vaultDripper: false,
    },
    {
      address: baseAddresses.superOETHb.vault,
      token: tokensByChain[base.id].WETH,
      from: 29358238,
      vaultDripper: true,
    },
  ],
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
    // Aerodrome Calculation
    // =================
    const positions = await getPositions(
      ctx,
      height,
      aerodromePools['CL1-WETH/superOETHb'],
      baseAddresses.superOETHb.strategies.aerodromeAMO,
      1,
    )
    const aerodromeAMO = positions.reduce(
      (acc, position) => acc + BigInt(position.amount1) + BigInt(position.staked1),
      0n,
    )
    // =================

    if (height < baseCurveAMO.from) {
      return aerodromeAMO
    }

    // Curve Calculation
    // =================
    // Our OETHb AMO balance = Pool OETHb balance * Gauge Pool Ownership * AMO Gauge Ownership
    // Pool OETHb Balance
    const superOETHb = new erc20Abi.Contract(ctx, { height }, baseAddresses.superOETHb.address)
    const poolOETHbBalance = await superOETHb.balanceOf(baseCurveAMO.curvePoolInfo!.poolAddress)

    // Gauge Pool Ownership
    const curvePool = new erc20Abi.Contract(ctx, { height }, baseCurveAMO.curvePoolInfo!.poolAddress)
    const curvePoolSupply = await curvePool.totalSupply()
    const curveGauge = new erc20Abi.Contract(ctx, { height }, baseCurveAMO.curvePoolInfo!.gaugeAddress!)
    const curveGaugeSupply = await curveGauge.totalSupply()
    const gaugePoolOwnership = curvePoolSupply === 0n ? 0n : (curveGaugeSupply * 10n ** 18n) / curvePoolSupply

    // AMO Gauge Ownership
    const amoGaugeBalance = await curveGauge.balanceOf(baseCurveAMO.address)
    const amoGaugeOwnership = curveGaugeSupply === 0n ? 0n : (amoGaugeBalance * 10n ** 18n) / curveGaugeSupply

    // AMO Ownership
    const amoOwnership = (gaugePoolOwnership * amoGaugeOwnership) / 10n ** 18n

    // AMO OETHb Balance
    const curveAmoBalance = (poolOETHbBalance * amoOwnership) / 10n ** 18n
    // =================

    return aerodromeAMO + curveAmoBalance
  },
  upgrades: {
    rebaseOptEvents: false,
  },
  accountsOverThresholdMinimum: parseEther('.1'),
})

const otokenActivityProcessor = createOTokenActivityProcessor({
  from: 17819702,
  otokenAddress: baseAddresses.tokens.superOETHb,
  wotokenAddress: baseAddresses.tokens.wsuperOETHb,
  vaultAddress: baseAddresses.superOETHb.vault,
  cowSwap: false,
})

const otokenWithdrawalsProcessor = createOTokenWithdrawalsProcessor({
  name: 'Super OETHb',
  oTokenAddress: baseAddresses.superOETHb.address,
  oTokenVaultAddress: baseAddresses.superOETHb.vault,
  from: 21544908,
})

export const superOETHb = [otokenProcessor, otokenActivityProcessor, otokenWithdrawalsProcessor]