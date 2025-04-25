import { parseEther } from 'viem'
import { mainnet } from 'viem/chains'

import * as strategyAbi from '@abi/initializable-abstract-strategy'
import { createOTokenProcessor2 } from '@templates/otoken/otoken-2'
import {
  DAI_ADDRESS,
  OUSD_ADDRESS,
  OUSD_DRIPPER_ADDRESS,
  OUSD_VAULT_ADDRESS,
  USDC_ADDRESS,
  USDS_ADDRESS,
  USDT_ADDRESS,
  WOUSD_ADDRESS,
  strategies,
} from '@utils/addresses'
import { tokensByChain } from '@utils/tokensByChain'

// export const from = 10884563 // https://etherscan.io/tx/0x9141921f5ebf072e58c00fe56332b6bee0c02f0ae4f54c42999b8a3a88662681
// export const from = 11585978 // OUSDReset
// export const from = 13533937 // https://etherscan.io/tx/0xc9b6fc6a4fad18dad197ff7d0636f74bf066671d75656849a1c45122e00d54cf

export const { name, from, setup, process } = createOTokenProcessor2({
  name: 'OUSD',
  symbol: 'OUSD',
  from: 11590995, // OUSDReset~
  vaultFrom: 11596942,
  fee: 20n,
  Upgrade_CreditsBalanceOfHighRes: 13533937, // https://etherscan.io/tx/0xc9b6fc6a4fad18dad197ff7d0636f74bf066671d75656849a1c45122e00d54cf
  otokenAddress: OUSD_ADDRESS,
  wotoken: {
    address: WOUSD_ADDRESS,
    from: 14566215, // https://etherscan.io/tx/0x5b16078d43861bf0e7a08aa3f061dbfce1c76bc5fc7cedaa96e2156d15651df1
  },
  dripper: [
    {
      address: OUSD_DRIPPER_ADDRESS,
      token: tokensByChain[mainnet.id].WETH,
      from: 14250273,
    },
  ],
  otokenVaultAddress: OUSD_VAULT_ADDRESS,
  oTokenAssets: [
    { asset: USDC_ADDRESS, symbol: 'USDC' },
    { asset: USDT_ADDRESS, symbol: 'USDT' },
    { asset: DAI_ADDRESS, symbol: 'DAI' },
    { asset: USDS_ADDRESS, symbol: 'USDS' },
  ],
  getAmoSupply: async (ctx, height) => {
    const contract = new strategyAbi.Contract(ctx, { height }, strategies.ousd.OUSDCurveAMOStrategy)
    return contract.checkBalance(USDC_ADDRESS)
  },
  accountsOverThresholdMinimum: parseEther('100'),
})
