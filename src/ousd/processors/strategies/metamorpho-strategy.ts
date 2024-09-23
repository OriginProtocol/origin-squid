import { mainnetCurrencies } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { IStrategyData } from '@templates/strategy'
import { OUSD_ADDRESS, addresses } from '@utils/addresses'

import { USDC } from './const'

export const metamorphoStrategy: IStrategyData = {
  from: 20685100,
  oTokenAddress: OUSD_ADDRESS,
  kind: 'Generic',
  name: 'OUSD MetaMorpho',
  contractName: 'MetaMorphoStrategy',
  address: addresses.strategies.ousd.MetaMorphoStrategy,
  base: { address: mainnetCurrencies.USD, decimals: 18 },
  assets: [USDC],
  earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
}
