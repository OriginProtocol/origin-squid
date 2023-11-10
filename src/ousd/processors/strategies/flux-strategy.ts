import { currencies } from '../../../shared/post-processors/exchange-rates/currencies'
import { IStrategyData } from '../../../shared/processor-templates/strategy'
import { OUSD_ADDRESS } from '../../../utils/addresses'
import { DAI, USDC, USDT } from './const'

export const fluxStrategy: IStrategyData = {
  from: 17877308,
  oTokenAddress: OUSD_ADDRESS,
  kind: 'Generic',
  name: 'OUSD Flux',
  contractName: 'FluxStrategy',
  address: '0x76Bf500B6305Dc4ea851384D3d5502f1C7a0ED44'.toLowerCase(),
  base: { address: currencies.USD, decimals: 18 },
  assets: [DAI, USDT, USDC],
  earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
}
