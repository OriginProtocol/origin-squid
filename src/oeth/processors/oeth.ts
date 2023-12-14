import {
  OETH,
  OETHAPY,
  OETHActivity,
  OETHAddress,
  OETHAsset,
  OETHHistory,
  OETHRebase,
  OETHRebaseOption,
} from '../../model'
import {
  createOTokenProcessor,
  createOTokenSetup,
} from '../../shared/processor-templates/otoken'
import {
  ETH_ADDRESS,
  FRXETH_ADDRESS,
  OETH_ADDRESS,
  OETH_VAULT_ADDRESS,
  RETH_ADDRESS,
  SFRXETH_ADDRESS,
  STETH_ADDRESS,
  WETH_ADDRESS,
  WSTETH_ADDRESS,
} from '../../utils/addresses'

export const from = 16933090 // https://etherscan.io/tx/0x3b4ece4f5fef04bf7ceaec4f6c6edf700540d7597589f8da0e3a8c94264a3b50

export const setup = createOTokenSetup({
  address: OETH_ADDRESS,
  vaultAddress: OETH_VAULT_ADDRESS,
  from,
})

export const process = createOTokenProcessor({
  OTOKEN_ADDRESS: OETH_ADDRESS,
  OTOKEN_VAULT_ADDRESS: OETH_VAULT_ADDRESS,
  oTokenAssets: [
    { asset: ETH_ADDRESS, symbol: 'ETH' },
    { asset: WETH_ADDRESS, symbol: 'WETH' },
    { asset: FRXETH_ADDRESS, symbol: 'frxETH' },
    { asset: SFRXETH_ADDRESS, symbol: 'sfrxETH' },
    { asset: RETH_ADDRESS, symbol: 'rETH' },
    { asset: STETH_ADDRESS, symbol: 'stETH' },
    { asset: WSTETH_ADDRESS, symbol: 'wstETH' },
  ],
  OToken: OETH,
  OTokenAsset: OETHAsset,
  OTokenAddress: OETHAddress,
  OTokenHistory: OETHHistory,
  OTokenAPY: OETHAPY,
  OTokenRebase: OETHRebase,
  OTokenRebaseOption: OETHRebaseOption,
  OTokenActivity: OETHActivity,
})
