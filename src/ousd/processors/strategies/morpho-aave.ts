import { mainnetCurrencies } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { IStrategyData } from '@templates/strategy'
import { OUSD_ADDRESS } from '@utils/addresses'

import { DAI, USDC, USDT } from './const'

export const morphoAave: IStrategyData = {
  chainId: 1,
  from: 16331911,
  oTokenAddress: OUSD_ADDRESS,
  kind: 'Generic',
  name: 'OUSD Morpho Aave',
  contractName: 'MorphoAaveStrategy',
  address: '0x79f2188ef9350a1dc11a062cca0abe90684b0197',
  base: { address: mainnetCurrencies.USD, decimals: 18 },
  assets: [DAI, USDT, USDC],
  earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
}
