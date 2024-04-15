import { currencies } from '@shared/post-processors/exchange-rates/currencies'
import { IStrategyData } from '@templates/strategy'
import { OUSD_ADDRESS } from '@utils/addresses'

import { DAI, USDC, USDT } from './const'

export const fluxStrategy: IStrategyData = {
  from: 17877308,
  oTokenAddress: OUSD_ADDRESS,
  kind: 'Generic',
  name: 'OUSD Flux',
  contractName: 'FluxStrategy',
  address: '0x76bf500b6305dc4ea851384d3d5502f1c7a0ed44',
  base: { address: currencies.USD, decimals: 18 },
  assets: [DAI, USDT, USDC],
  earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
}
