import { ensureExchangeRate } from '@shared/post-processors/exchange-rates'
import { createOriginARMProcessors } from '@templates/origin-arm'
import { addresses } from '@utils/addresses'

export const originArmProcessors = [
  // Lido ARM
  ...createOriginARMProcessors({
    chainId: 1,
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
    chainId: 1,
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
    chainId: 1,
    name: 'ARM-USDe-sUSDe',
    from: 23924654,
    armAddress: addresses.arms['ARM-USDe-sUSDe'].address,
    token0: 'USDe',
    token1: 'sUSDe',
    getRate1: async (ctx, block) => {
      // The same standard exists on sUSDe to determine it's rate to USDe
      const rate = await ensureExchangeRate(ctx, block, 'sUSDe', 'USDe')
      return rate?.rate ?? 10n ** 18n
    },
    capManagerAddress: addresses.arms['ARM-USDe-sUSDe'].capManager,
    armType: 'ethena',
    marketFrom: 23924654,
    // History cleanup: a since-resolved contract bug corrupted assetsPerShare from 2026-04-23 to
    // 2026-05-13 (it crashed ~1.0134 -> 0.8615, then recovered), injecting ~1116 phantom fees and
    // ±4500 yield swings into every yield series. Anchor at the 2026-05-13 post-recovery snapshot
    // (block 25089644): all yield (ArmDailyStat, ArmDailyAssetYield, ArmAddressYield) starts clean
    // from the next day, cumulative counters rebased by the on-chain baseline below. Holder share
    // balances / cost basis are untouched. Funds here are small; the early data is not material.
    yieldBaseline: {
      block: 25089644,
      cumulativeYield: 235834455255935430654n,
      cumulativeFees: 1195643896382772555709n,
    },
  }),

  // Multi-asset WETH ARM
  ...createOriginARMProcessors({
    chainId: 1,
    name: 'ARM-WETH',
    from: 25588390,
    armAddress: addresses.arms['ARM-WETH'].address,
    token0: 'WETH',
    capManagerAddress: addresses.arms['ARM-WETH'].capManager,
    armType: 'multi-asset',
    marketFrom: 25588390,
  }),

  // Multi-asset USDC ARM
  ...createOriginARMProcessors({
    chainId: 1,
    name: 'ARM-USDC',
    from: 25588390,
    armAddress: addresses.arms['ARM-USDC'].address,
    token0: 'USDC',
    capManagerAddress: addresses.arms['ARM-USDC'].capManager,
    armType: 'multi-asset',
    marketFrom: 25588390,
  }),
]
