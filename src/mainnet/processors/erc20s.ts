import { createERC20EventTracker } from '@templates/erc20/erc20-event'
import { createERC20PollingTracker } from '@templates/erc20/erc20-polling'
import {
  OETH_DRIPPER_ADDRESS,
  OETH_DRIPPER_ADDRESS_OLD,
  OETH_NATIVE_STRATEGIES,
  OETH_VAULT_ADDRESS,
  WOETH_ADDRESS,
  oethStrategyArray,
  tokens,
} from '@utils/addresses'
import { TokenSymbol } from '@utils/symbols'

// TODO: Would be nice if interested parties could register their desires here from other parts of the code,
//  allowing multiple declarations of need without issue.

let initialized = false

const simpleTracks: Record<string, Parameters<typeof createERC20EventTracker>[0]> = {
  // Origin Specific
  OGN: {
    from: 6436154,
    address: tokens.OGN,
  },
  xOGN: {
    from: 19919745,
    address: tokens.xOGN,
  },
  OGV: {
    from: 14439231,
    address: tokens.OGV,
  },
  veOGV: {
    from: 15089596,
    address: tokens.veOGV,
  },
  primeETH: {
    from: 19138973,
    address: tokens.primeETH,
  },
}

const tracks: Record<string, Parameters<typeof createERC20PollingTracker>[0]> = {
  wOETH: {
    from: 16933090,
    address: WOETH_ADDRESS,
  },
  // OETH Related
  WETH: {
    from: 16933090, // oeth deploy date
    address: tokens.WETH,
    accountFilter: [
      ...oethStrategyArray,
      OETH_VAULT_ADDRESS,
      OETH_DRIPPER_ADDRESS,
      OETH_DRIPPER_ADDRESS_OLD,
      ...OETH_NATIVE_STRATEGIES.map((s) => s.address),
      // '0xa4e0faA58465A2D369aa21B3e42d43374c6F9613', // Uniswap wstETH/WETH
      // '0x109830a1aaad605bbf02a9dfa7b0b92ec2fb7daa', // Uniswap rETH/WETH
    ],
    intervalTracking: true,
  },
  // rETH: {
  //   from: 16933090, // oeth deploy date
  //   address: tokens.rETH,
  //   accountFilter: [
  //     ...oethStrategyArray,
  //     OETH_VAULT_ADDRESS,
  //     '0xa4e0faA58465A2D369aa21B3e42d43374c6F9613', // Uniswap rETH/WETH
  //     '0x553e9c493678d8606d6a5ba284643db2110df823', // Uniswap rETH/WETH
  //   ],
  //   intervalTracking: true,
  // },
  // wstETH: {
  //   from: 16933090, // oeth deploy date
  //   address: tokens.wstETH,
  //   accountFilter: [
  //     ...oethStrategyArray,
  //     OETH_VAULT_ADDRESS,
  //     '0x109830a1aaad605bbf02a9dfa7b0b92ec2fb7daa', // Uniswap wstETH/WETH
  //   ],
  //   intervalTracking: true,
  // },
  // stETH: {
  //   from: 16933090, // oeth deploy date
  //   address: tokens.stETH,
  //   accountFilter: [...oethStrategyArray, OETH_VAULT_ADDRESS],
  //   intervalTracking: true,
  // },
  // frxETH: {
  //   from: 16933090, // oeth deploy date
  //   address: tokens.frxETH,
  //   accountFilter: [...oethStrategyArray, OETH_VAULT_ADDRESS],
  //   intervalTracking: true,
  // },
}

// This is a function to allow others to subscribe to balance tracking
export const erc20s = () => {
  initialized = true
  return [
    ...Object.values(simpleTracks).map(createERC20EventTracker),
    ...Object.values(tracks).map(createERC20PollingTracker),
  ]
}

export const addERC20Processing = (symbol: TokenSymbol, account: string) => {
  if (initialized) {
    throw new Error('erc20s already initialized, check load order')
  }
  const track = tracks[symbol]
  if ('accountFilter' in track) {
    // If there is no `accountFilter` then it is OK to have this as a noop. (we already want everything)
    track.accountFilter?.push(account)
  } else if (!track) {
    throw new Error(`Symbol ${symbol} not added to \`tracks\``)
  }
}
