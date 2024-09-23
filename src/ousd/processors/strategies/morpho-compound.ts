import { mainnetCurrencies } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { IStrategyData } from '@templates/strategy'
import { OUSD_ADDRESS } from '@utils/addresses'

import { DAI, USDC, USDT } from './const'

export const morphoCompound: IStrategyData = {
  chainId: 1,
  from: 15949661,
  oTokenAddress: OUSD_ADDRESS,
  kind: 'Generic',
  name: 'OUSD Morpho Compound',
  contractName: 'MorphoCompoundStrategy',
  address: '0x5a4eee58744d1430876d5ca93cab5ccb763c037d',
  base: { address: mainnetCurrencies.USD, decimals: 18 },
  assets: [DAI, USDT, USDC],
  earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
}
