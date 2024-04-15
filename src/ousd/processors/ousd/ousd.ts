import {
  OUSD,
  OUSDAPY,
  OUSDActivity,
  OUSDAddress,
  OUSDAsset,
  OUSDHistory,
  OUSDRebase,
  OUSDRebaseOption,
} from '../../../model'
import {
  createOTokenProcessor,
  createOTokenSetup,
} from '../../../processor-templates/otoken'
import {
  DAI_ADDRESS,
  OUSD_ADDRESS,
  OUSD_VAULT_ADDRESS,
  USDC_ADDRESS,
  USDT_ADDRESS,
} from '../../../utils/addresses'

// export const from = 10884563 // https://etherscan.io/tx/0x9141921f5ebf072e58c00fe56332b6bee0c02f0ae4f54c42999b8a3a88662681
export const from = 11585978 // OUSDReset
// export const from = 13533937 // https://etherscan.io/tx/0xc9b6fc6a4fad18dad197ff7d0636f74bf066671d75656849a1c45122e00d54cf

export const setup = createOTokenSetup({
  address: OUSD_ADDRESS,
  vaultAddress: OUSD_VAULT_ADDRESS,
  from,
})

export const process = createOTokenProcessor({
  Upgrade_CreditsBalanceOfHighRes: 13533937, // https://etherscan.io/tx/0xc9b6fc6a4fad18dad197ff7d0636f74bf066671d75656849a1c45122e00d54cf
  OTOKEN_ADDRESS: OUSD_ADDRESS,
  OTOKEN_VAULT_ADDRESS: OUSD_VAULT_ADDRESS,
  oTokenAssets: [
    { asset: USDC_ADDRESS, symbol: 'USDC' },
    { asset: USDT_ADDRESS, symbol: 'USDT' },
    { asset: DAI_ADDRESS, symbol: 'DAI' },
  ],
  OToken: OUSD,
  OTokenAsset: OUSDAsset,
  OTokenAddress: OUSDAddress,
  OTokenHistory: OUSDHistory,
  OTokenAPY: OUSDAPY,
  OTokenRebase: OUSDRebase,
  OTokenRebaseOption: OUSDRebaseOption,
  OTokenActivity: OUSDActivity,
})
