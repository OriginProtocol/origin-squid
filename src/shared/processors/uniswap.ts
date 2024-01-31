import { LiquiditySourceType } from '../../model'
import { addresses } from '../../utils/addresses'
import { registerLiquiditySource } from '../liquidity'
import { addERC20Processing } from './erc20s'

const pools = [
  {
    address: '0xa4e0faA58465A2D369aa21B3e42d43374c6F9613',
    tokens: ['rETH', 'WETH'],
  },
  {
    address: '0x553e9c493678d8606d6a5ba284643db2110df823',
    tokens: ['rETH', 'WETH'],
  },
  {
    address: '0x109830a1aaad605bbf02a9dfa7b0b92ec2fb7daa',
    tokens: ['wstETH', 'WETH'],
  },
  {
    address: '0x52299416c469843f4e0d54688099966a6c7d720f',
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
