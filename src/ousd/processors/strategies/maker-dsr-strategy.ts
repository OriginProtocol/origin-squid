import { currencies } from '../../../shared/post-processors/exchange-rates/currencies'
import { IStrategyData } from '../../../shared/processor-templates/strategy'
import { OUSD_ADDRESS } from '../../../utils/addresses'
import { DAI, USDC, USDT } from './const'

export const makerDsrStrategy: IStrategyData = {
  from: 17883037,
  oTokenAddress: OUSD_ADDRESS,
  kind: 'Generic',
  name: 'OUSD Maker DSR',
  contractName: 'Generalized4626Strategy',
  address: '0x6b69B755C629590eD59618A2712d8a2957CA98FC'.toLowerCase(),
  base: { address: currencies.USD, decimals: 18 },
  assets: [DAI],
  earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
}
