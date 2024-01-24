import * as otoken from '../../abi/otoken'
import {
  OETH_ADDRESS,
  OETH_DRIPPER_ADDRESS,
  OETH_VAULT_ADDRESS,
  OUSD_VAULT_ADDRESS,
  TokenSymbol,
  oethStrategyArray,
  ousdStrategyArray,
  tokens,
} from '../../utils/addresses'
import { logFilter } from '../../utils/logFilter'
import { createERC20Tracker } from '../processor-templates/erc20'

// TODO: Would be nice if interested parties could register their desires here from other parts of the code,
//  allowing multiple declarations of need without issue.

let initialized = false

const tracks: Record<string, Parameters<typeof createERC20Tracker>[0]> = {
  // Origin Specific
  OGN: {
    from: 15350225, // 6436154,
    address: tokens.OGN,
    accountFilter: [
      '0x2eae0cae2323167abf78462e0c0686865c67a655', // Origin: Team Distribution (starts at block 15350225)
    ],
    intervalTracking: true,
  },
  OGV: {
    from: 15350225, // 14439231,
    address: tokens.OGV,
    accountFilter: [
      '0x2eae0cae2323167abf78462e0c0686865c67a655', // Origin: Team Distribution (starts at block 15350225)
    ],
    intervalTracking: true,
  },
  OETH: {
    from: 16935276,
    address: tokens.OETH,
    rebaseFilters: [
      logFilter({
        address: [OETH_ADDRESS],
        topic0: [otoken.events.TotalSupplyUpdatedHighres.topic],
        transaction: true,
        range: { from: 16935276 },
      }),
    ],
  },
  // OUSD Related
  USDT: {
    from: 11362821,
    address: tokens.USDT,
    accountFilter: [
      ...ousdStrategyArray,
      OUSD_VAULT_ADDRESS,
      '0x3ed3b47dd13ec9a98b44e6204a523e766b225811', // aUSDT
      '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9', // cUSDT
    ],
    intervalTracking: true,
  },
  USDC: {
    from: 11367200,
    address: tokens.USDC,
    accountFilter: [
      ...ousdStrategyArray,
      OUSD_VAULT_ADDRESS,
      '0xbcca60bb61934080951369a648fb03df4f96263c', // aUSDC
      '0x39aa39c021dfbae8fac545936693ac917d5e7563', // cUSDC
    ],
    intervalTracking: true,
  },
  DAI: {
    from: 11367184,
    address: tokens.DAI,
    accountFilter: [
      ...ousdStrategyArray,
      OUSD_VAULT_ADDRESS,
      '0x028171bca77440897b824ca71d1c56cac55b68a3', // aDAI
      '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643', // cDAI
    ],
    intervalTracking: true,
  },
  // OETH Related
  WETH: {
    from: 16933090, // oeth deploy date
    address: tokens.WETH,
    accountFilter: [
      ...oethStrategyArray,
      OETH_VAULT_ADDRESS,
      OETH_DRIPPER_ADDRESS,
      '0xa4e0faA58465A2D369aa21B3e42d43374c6F9613', // Uniswap wstETH/WETH
      '0x109830a1aaad605bbf02a9dfa7b0b92ec2fb7daa', // Uniswap rETH/WETH
    ],
    intervalTracking: true,
  },
  rETH: {
    from: 16933090, // oeth deploy date
    address: tokens.rETH,
    accountFilter: [
      ...oethStrategyArray,
      OETH_VAULT_ADDRESS,
      '0xa4e0faA58465A2D369aa21B3e42d43374c6F9613', // Uniswap rETH/WETH
      '0x553e9c493678d8606d6a5ba284643db2110df823', // Uniswap rETH/WETH
    ],
    intervalTracking: true,
  },
  wstETH: {
    from: 16933090, // oeth deploy date
    address: tokens.wstETH,
    accountFilter: [
      ...oethStrategyArray,
      OETH_VAULT_ADDRESS,
      '0x109830a1aaad605bbf02a9dfa7b0b92ec2fb7daa', // Uniswap wstETH/WETH
    ],
    intervalTracking: true,
  },
  stETH: {
    from: 16933090, // oeth deploy date
    address: tokens.stETH,
    accountFilter: [...oethStrategyArray, OETH_VAULT_ADDRESS],
    intervalTracking: true,
  },
  frxETH: {
    from: 16933090, // oeth deploy date
    address: tokens.frxETH,
    accountFilter: [...oethStrategyArray, OETH_VAULT_ADDRESS],
    intervalTracking: true,
  },
}

// This is a function to allow others to subscribe to balance tracking
export const erc20s = () => {
  initialized = true
  return Object.values(tracks).map(createERC20Tracker)
}

export const addERC20Processing = (symbol: TokenSymbol, account: string) => {
  if (initialized) {
    throw new Error('erc20s already initialized, check load order')
  }
  const track = tracks[symbol]
  if (track) {
    // If there is no `accountFilter` then it is OK to have this as a noop. (we already want everything)
    track.accountFilter?.push(account)
  } else {
    throw new Error(`Symbol ${symbol} not added to \`tracks\``)
  }
}
