import { IStrategyData } from '../../../processor-templates/strategy'
import { currencies } from '../../../shared/post-processors/exchange-rates/currencies'
import { OUSD_ADDRESS } from '../../../utils/addresses'
import { DAI, USDC, USDT } from './const'

export const morphoAave: IStrategyData = {
  from: 16331911,
  oTokenAddress: OUSD_ADDRESS,
  kind: 'Generic',
  name: 'OUSD Morpho Aave',
  contractName: 'MorphoAaveStrategy',
  address: '0x79f2188ef9350a1dc11a062cca0abe90684b0197',
  base: { address: currencies.USD, decimals: 18 },
  assets: [DAI, USDT, USDC],
  earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
}
