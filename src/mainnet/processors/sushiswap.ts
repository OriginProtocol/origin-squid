import { addERC20Processing } from './erc20s'

const pools = [
  {
    address: '0xf3e920bd7665d5e8e408dc4a3a765ade52314aaf',
    tokens: ['OETH', 'WETH'],
  },
] as const

export const initialize = () => {
  for (const pool of pools) {
    for (const token of pool.tokens) {
      addERC20Processing(token, pool.address)
    }
  }
}
