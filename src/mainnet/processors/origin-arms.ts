import * as originEthenaArmAbi from '@abi/origin-ethena-arm'
import { createOriginARMProcessors } from '@templates/origin-arm'
import { addresses } from '@utils/addresses'

export const originArmProcessors = [
  // Lido ARM
  ...createOriginARMProcessors({
    name: 'ARM-WETH-stETH',
    from: 20987226,
    armAddress: addresses.arms['ARM-WETH-stETH'].address,
    token0: 'WETH',
    token1: 'stETH',
    capManagerAddress: addresses.arms['ARM-WETH-stETH'].capManager,
    armType: 'lido',
    marketFrom: 23130294,
  }),

  // Ether.fi ARM
  ...createOriginARMProcessors({
    name: 'ARM-WETH-eETH',
    from: 23689028,
    armAddress: addresses.arms['ARM-WETH-eETH'].address,
    token0: 'WETH',
    token1: 'eETH',
    capManagerAddress: addresses.arms['ARM-WETH-eETH'].capManager,
    armType: 'etherfi',
    marketFrom: 23689033,
  }),

  // Ethena ARM
  ...createOriginARMProcessors({
    name: 'ARM-USDe-sUSDe',
    from: 23924654,
    armAddress: addresses.arms['ARM-USDe-sUSDe'].address,
    token0: 'USDe',
    token1: 'sUSDe',
    getRate1: async (ctx, block) => {
      // The same standard exists on sUSDe to determine it's rate to USDe
      const contract = new originEthenaArmAbi.Contract(ctx, block.header, addresses.tokens.sUSDe)
      return await contract.convertToAssets(10n ** 18n)
    },
    capManagerAddress: addresses.arms['ARM-USDe-sUSDe'].capManager,
    armType: 'ethena',
    marketFrom: 23924654,
  }),
]
