import { LiquiditySourceType } from '@model'
import { addresses } from '@utils/addresses'

import { addERC20Processing } from './erc20s'
import { registerLiquiditySource } from './liquidity-sources'

const pools = [
  {
    address: '0xf3e920bd7665d5e8e408dc4a3a765ade52314aaf',
    tokens: ['OETH', 'WETH'],
  },
] as const

export const initialize = () => {
  for (const pool of pools) {
    for (const token of pool.tokens) {
      registerLiquiditySource(
        pool.address,
        LiquiditySourceType.UniswapPool,
        addresses.tokens[token],
      )
      addERC20Processing(token, pool.address)
    }
  }
}
