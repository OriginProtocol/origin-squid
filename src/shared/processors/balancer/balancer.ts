import { EvmBatchProcessor } from '@subsquid/evm-processor'

import { Context } from '../../../processor'
import { tokens } from '../../../utils/addresses'
import { CurrencyAddress } from '../../post-processors/exchange-rates/currencies'
import {
  createBalancerInitializer,
  createBalancerProcessor,
  createBalancerSetup,
} from '../../processor-templates/balancer'

const ousdResetFrom = 11585978
const oethDeployFrom = 16933090

const pools: {
  name: string
  poolSymbol: string
  poolType: 'MetaStable' | 'ComposableStable' | 'Weighted' | 'Gyroscope'
  poolAddress: string
  poolId: string
  from: number
  tokens:
    | [string, string]
    | [string, string, string]
    | [string, string, string, string]
  rates?: [CurrencyAddress, CurrencyAddress][]
}[] = [
  {
    name: 'Balancer rETH Stable Pool',
    poolSymbol: 'B-rETH-STABLE',
    poolType: 'MetaStable',
    poolAddress: '0x1e19cf2d73a72ef1332c882f20534b6519be0276',
    poolId:
      '0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112',
    tokens: [tokens.rETH, tokens.WETH],
    from: Math.max(13850000, oethDeployFrom),
  },
  {
    name: 'wstETH-rETH-sfrxETH-BPT',
    poolSymbol: 'wstETH-rETH-sfrxETH-BPT',
    poolType: 'ComposableStable',
    poolAddress: '0x42ed016f826165c2e5976fe5bc3df540c5ad0af7',
    poolId:
      '0x42ed016f826165c2e5976fe5bc3df540c5ad0af700000000000000000000058b',
    tokens: [
      '0x42ed016f826165c2e5976fe5bc3df540c5ad0af7',
      tokens.wstETH,
      tokens.sfrxETH,
      tokens.rETH,
    ],
    from: Math.max(17680000, oethDeployFrom),
  },
  {
    name: 'Balancer wstETH-WETH Stable Pool',
    poolSymbol: 'wstETH-WETH-BPT',
    poolType: 'ComposableStable',
    poolAddress: '0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd',
    poolId:
      '0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2',
    tokens: [
      tokens.wstETH,
      '0x93d199263632a4EF4Bb438F1feB99e57b4b5f0BD',
      tokens.WETH,
    ],
    from: Math.max(17920000, oethDeployFrom),
  },
  {
    name: 'Balancer 80 BAL 20 WETH',
    poolSymbol: 'B-80BAL-20WETH',
    poolType: 'Weighted',
    poolAddress: '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56',
    poolId:
      '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014',
    from: Math.max(12370000, oethDeployFrom),
    tokens: [tokens.BAL, tokens.WETH],
    rates: [[tokens.BAL, tokens.ETH] as [CurrencyAddress, CurrencyAddress]],
  },
  {
    name: 'Gyroscope ECLP wstETH/wETH',
    poolSymbol: 'ECLP-wstETH-wETH',
    poolAddress: '0xf01b0684c98cd7ada480bfdf6e43876422fa1fc1',
    poolId:
      '0xf01b0684c98cd7ada480bfdf6e43876422fa1fc10002000000000000000005de',
    poolType: 'Gyroscope',
    from: Math.max(18015100, oethDeployFrom),
    tokens: [tokens.wstETH, tokens.WETH],
  },
]

export const from = Math.min(...pools.map((p) => p.from))

export const setup = (processor: EvmBatchProcessor) => {
  for (const pool of pools) {
    createBalancerSetup(pool.from, processor)
  }
}

const initializers = pools.map((pool) => createBalancerInitializer(pool))

export const initialize = async (ctx: Context) => {
  await Promise.all(initializers.map((p) => p(ctx)))
}

const processors = pools.map((pool) =>
  createBalancerProcessor(
    pool.poolAddress.toLowerCase(),
    pool.poolId.toLowerCase(),
    pool.poolType,
    pool.from,
    pool.rates,
  ),
)

export const process = async (ctx: Context) => {
  await Promise.all(processors.map((p) => p(ctx)))
}
