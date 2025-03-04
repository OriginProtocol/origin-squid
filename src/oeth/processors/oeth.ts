import { parseEther } from 'viem'
import { mainnet } from 'viem/chains'

import * as baseRewardPool from '@abi/base-reward-pool'
import * as erc20 from '@abi/erc20'
import { Context } from '@originprotocol/squid-utils'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { createOTokenActivityProcessor } from '@templates/otoken/activity-processor/activity-processor'
import { createOTokenProcessor2 } from '@templates/otoken/otoken2'
import {
  CURVE_ETH_OETH_POOL_ADDRESS,
  CURVE_FRXETH_OETH_POOL_ADDRESS,
  ETH_ADDRESS,
  FRXETH_ADDRESS,
  OETH_ADDRESS,
  OETH_CURVE_REWARD_LP_ADDRESS,
  OETH_DRIPPER_ADDRESS,
  OETH_VAULT_ADDRESS,
  OETH_ZAPPER_ADDRESS,
  RETH_ADDRESS,
  SFRXETH_ADDRESS,
  STETH_ADDRESS,
  UNISWAP_V3_OETH_WEH_ADDRESS,
  WETH_ADDRESS,
  WOETH_ADDRESS,
  WOETH_ARBITRUM_ADDRESS,
  WSTETH_ADDRESS,
  strategies,
} from '@utils/addresses'
import { tokensByChain } from '@utils/tokensByChain'

const otokenProcessor = createOTokenProcessor2({
  name: 'OETH',
  symbol: 'OETH',
  // from: 16933090, // https://etherscan.io/tx/0x3b4ece4f5fef04bf7ceaec4f6c6edf700540d7597589f8da0e3a8c94264a3b50
  from: 17058299, // Block soon before first transfers are seen.
  vaultFrom: 17084107,
  otokenAddress: OETH_ADDRESS,
  initialRebasingCreditsPerToken: 1000000000000000000n,
  wotoken: {
    address: WOETH_ADDRESS,
    from: 17080507,
  },
  dripper: {
    address: OETH_DRIPPER_ADDRESS,
    token: tokensByChain[mainnet.id].WETH,
    from: 17067707,
  },
  otokenVaultAddress: OETH_VAULT_ADDRESS,
  redemptionAsset: { asset: WETH_ADDRESS, symbol: 'WETH' },
  oTokenAssets: [
    { asset: ETH_ADDRESS, symbol: 'ETH' },
    { asset: WETH_ADDRESS, symbol: 'WETH' },
    { asset: FRXETH_ADDRESS, symbol: 'frxETH' },
    { asset: SFRXETH_ADDRESS, symbol: 'sfrxETH' },
    { asset: RETH_ADDRESS, symbol: 'rETH' },
    { asset: STETH_ADDRESS, symbol: 'stETH' },
    { asset: WSTETH_ADDRESS, symbol: 'wstETH' },
    { asset: OETH_ADDRESS, symbol: 'OETH' },
  ],
  upgrades: {
    rebaseOptEvents: 18872285,
  },
  getAmoSupply: async (ctx, height) => {
    if (height < 17297479) return 0n
    const oethContract = new erc20.Contract(ctx, { height }, OETH_ADDRESS)
    const rewardPoolContract = new baseRewardPool.Contract(ctx, { height }, OETH_CURVE_REWARD_LP_ADDRESS)
    const [poolBalance, rewardBalance, rewardTotal] = await Promise.all([
      oethContract.balanceOf(CURVE_ETH_OETH_POOL_ADDRESS),
      rewardPoolContract.balanceOf(strategies.oeth.ConvexEthMetaStrategy),
      rewardPoolContract.totalSupply(),
    ])
    return (poolBalance * rewardBalance) / rewardTotal
  },
  accountsOverThresholdMinimum: parseEther('.1'),
})

const otokenActivityProcessor = createOTokenActivityProcessor({
  from: 16933090,
  otokenAddress: OETH_ADDRESS,
  vaultAddress: OETH_VAULT_ADDRESS,
  wotokenAddress: WOETH_ADDRESS,
  wotokenArbitrumAddress: WOETH_ARBITRUM_ADDRESS,
  zapperAddress: OETH_ZAPPER_ADDRESS,
  cowSwap: true,
  curvePools: [
    {
      address: CURVE_ETH_OETH_POOL_ADDRESS,
      tokens: [ETH_ADDRESS, OETH_ADDRESS],
    },
    {
      address: CURVE_FRXETH_OETH_POOL_ADDRESS,
      tokens: [FRXETH_ADDRESS, OETH_ADDRESS],
    },
  ],
  balancerPools: ['0x7056c8dfa8182859ed0d4fb0ef0886fdf3d2edcf000200000000000000000623'],
  uniswapV3: {
    address: UNISWAP_V3_OETH_WEH_ADDRESS,
    tokens: [WETH_ADDRESS, OETH_ADDRESS],
  },
})

export const name = 'otoken'
export const from = Math.min(otokenProcessor.from, otokenActivityProcessor.from)
export const setup = (processor: EvmBatchProcessor) => {
  otokenProcessor.setup(processor)
  otokenActivityProcessor.setup(processor)
}
export const process = async (ctx: Context) => {
  await Promise.all([otokenProcessor.process(ctx), otokenActivityProcessor.process(ctx)])
}
