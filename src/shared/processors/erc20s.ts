import * as otoken from '../../abi/otoken'
import { OETH_ADDRESS } from '../../utils/addresses'
import { logFilter } from '../../utils/logFilter'
import { createERC20Tracker } from '../processor-templates/erc20'

const tracks: Parameters<typeof createERC20Tracker>[0][] = [
  {
    from: 11362821,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
    accountFilter: [
      '0x3ed3b47dd13ec9a98b44e6204a523e766b225811', // aUSDT
      '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9', // aUSDT
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
