import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { createOTokenProcessor } from '@templates/otoken'
import { createOTokenActivityProcessor } from '@templates/otoken/activity-processor/activity-processor'
import {
  CURVE_ETH_OETH_POOL_ADDRESS,
  CURVE_FRXETH_OETH_POOL_ADDRESS,
  ETH_ADDRESS,
  FRXETH_ADDRESS,
  OETH_ADDRESS,
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
} from '@utils/addresses'

const otokenProcessor = createOTokenProcessor({
  from: 16933090, // https://etherscan.io/tx/0x3b4ece4f5fef04bf7ceaec4f6c6edf700540d7597589f8da0e3a8c94264a3b50
  vaultFrom: 17084107,
  otokenAddress: OETH_ADDRESS,
  wotokenAddress: WOETH_ADDRESS,
  otokenVaultAddress: OETH_VAULT_ADDRESS,
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

export const from = Math.min(otokenProcessor.from, otokenActivityProcessor.from)
export const setup = (processor: EvmBatchProcessor) => {
  otokenProcessor.setup(processor)
  otokenActivityProcessor.setup(processor)
}
export const process = async (ctx: Context) => {
  await Promise.all([otokenProcessor.process(ctx), otokenActivityProcessor.process(ctx)])
}
