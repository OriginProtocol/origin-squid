import { currencies } from '../../../shared/post-processors/exchange-rates/currencies'
import { IStrategyData } from '../../../shared/processor-templates/strategy'
import { OUSD_ADDRESS } from '../../../utils/addresses'
import { DAI, USDC, USDT } from './const'

export const morphoAave: IStrategyData = {
  from: 16331911,
  oTokenAddress: OUSD_ADDRESS,
  kind: 'Generic',
  name: 'OUSD Morpho Aave',
  contractName: 'MorphoAaveStrategy',
  address: '0x79F2188EF9350A1dC11A062cca0abE90684b0197'.toLowerCase(),
  base: { address: currencies.USD, decimals: 18 },
  assets: [DAI, USDT, USDC],
  earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
}
