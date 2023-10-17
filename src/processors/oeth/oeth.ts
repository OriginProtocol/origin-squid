import {
  OETH,
  OETHAPY,
  OETHAddress,
  OETHHistory,
  OETHRebase,
  OETHRebaseOption,
} from '../../model'
import {
  createOTokenProcessor,
  createOTokenSetup,
} from '../../processor-templates/otoken'
import { OETH_ADDRESS, OETH_VAULT_ADDRESS } from '../../utils/addresses'

export const from = 16933090 // https://etherscan.io/tx/0x3b4ece4f5fef04bf7ceaec4f6c6edf700540d7597589f8da0e3a8c94264a3b50

export const setup = createOTokenSetup({
  address: OETH_ADDRESS,
  vaultAddress: OETH_VAULT_ADDRESS,
  from,
})

export const process = createOTokenProcessor({
  OTOKEN_ADDRESS: OETH_ADDRESS,
  OTOKEN_VAULT_ADDRESS: OETH_VAULT_ADDRESS,
  OToken: OETH,
  OTokenAddress: OETHAddress,
  OTokenHistory: OETHHistory,
  OTokenAPY: OETHAPY,
  OTokenRebase: OETHRebase,
  OTokenRebaseOption: OETHRebaseOption,
})
