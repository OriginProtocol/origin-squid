import { createOriginARMProcessors } from '@templates/origin-arm'
import { addresses } from '@utils/addresses'

export const originArmProcessors = [
  // Lido ARM
  ...createOriginARMProcessors({
    name: 'ARM-WETH-stETH',
    from: 20987226,
    armAddress: addresses.arms['ARM-WETH-stETH'].address,
    underlyingToken: 'WETH',
    capManagerAddress: addresses.arms['ARM-WETH-stETH'].capManager,
    armType: 'lido',
    marketFrom: 23130294,
  }),

  // Ether.fi ARM
  ...createOriginARMProcessors({
    name: 'ARM-WETH-eETH',
    from: 23689028,
    armAddress: addresses.arms['ARM-WETH-eETH'].address,
    underlyingToken: 'WETH',
    capManagerAddress: addresses.arms['ARM-WETH-eETH'].capManager,
    armType: 'etherfi',
    marketFrom: 23689033,
  }),

  // Ethena ARM
  ...createOriginARMProcessors({
    name: 'ARM-USDe-sUSDe',
    from: 23924639,
    armAddress: addresses.arms['ARM-USDe-sUSDe'].address,
    underlyingToken: 'USDe',
    capManagerAddress: addresses.arms['ARM-USDe-sUSDe'].capManager,
    armType: 'ethena',
    marketFrom: 23924639,
  }),
]
