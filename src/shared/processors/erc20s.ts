import * as otoken from '../../abi/otoken'
import { LiquiditySourceType } from '../../model'
import { OETH_ADDRESS } from '../../utils/addresses'
import { logFilter } from '../../utils/logFilter'
import { createERC20Tracker } from '../processor-templates/erc20'
import { registerLiquiditySource } from './liquidity-sources'

// TODO: Would be nice if interested parties could register their desires here from other parts of the code,
//  allowing multiple declarations of need without issue.

const tracks: Parameters<typeof createERC20Tracker>[0][] = [
  // Origin Specific
  {
    from: 15350225, // 6436154,
    address: '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26', // OGN
    accountFilter: [
      '0x2eae0cae2323167abf78462e0c0686865c67a655', // Origin: Team Distribution (starts at block 15350225)
    ],
    intervalTracking: true,
  },
  {
    from: 15350225, // 14439231,
    address: '0x9c354503c38481a7a7a51629142963f98ecc12d0', // OGV
    accountFilter: [
      '0x2eae0cae2323167abf78462e0c0686865c67a655', // Origin: Team Distribution (starts at block 15350225)
    ],
    intervalTracking: true,
  },
  // OUSD Related
  {
    from: 11362821,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
    accountFilter: [
      '0x3ed3b47dd13ec9a98b44e6204a523e766b225811', // aUSDT
      '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9', // cUSDT
    ],
    intervalTracking: true,
  },
  {
    from: 11367200,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    accountFilter: [
      '0xbcca60bb61934080951369a648fb03df4f96263c', // aUSDC
      '0x39aa39c021dfbae8fac545936693ac917d5e7563', // cUSDC
    ],
    intervalTracking: true,
  },
  {
    from: 11367184,
    address: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    accountFilter: [
      '0x028171bca77440897b824ca71d1c56cac55b68a3', // aDAI
      '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643', // cDAI
    ],
    intervalTracking: true,
  },
  // OETH Related
  {
    from: 16933090, // oeth deploy date
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
    accountFilter: [
      '0xa4e0faA58465A2D369aa21B3e42d43374c6F9613', // Uniswap wstETH/WETH
      '0x109830a1aaad605bbf02a9dfa7b0b92ec2fb7daa', // Uniswap rETH/WETH
    ],
    intervalTracking: true,
  },
  {
    from: 16933090, // oeth deploy date
    address: '0xae78736cd615f374d3085123a210448e74fc6393', // rETH
    accountFilter: [
      '0xa4e0faA58465A2D369aa21B3e42d43374c6F9613', // Uniswap rETH/WETH
    ],
    intervalTracking: true,
  },
  {
    from: 16933090, // oeth deploy date
    address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0', // wstETH
    accountFilter: [
      '0x109830a1aaad605bbf02a9dfa7b0b92ec2fb7daa', // Uniswap wstETH/WETH
    ],
    intervalTracking: true,
  },
]

export const erc20s = [
  ...tracks.map(createERC20Tracker),
  createERC20Tracker({
    from: 16935276,
    address: OETH_ADDRESS,
    rebaseFilters: [
      logFilter({
        address: [OETH_ADDRESS],
        topic0: [otoken.events.TotalSupplyUpdatedHighres.topic],
        transaction: true,
        range: { from: 16935276 },
      }),
    ],
  }),
]
