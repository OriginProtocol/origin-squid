import { pad as viemPad } from 'viem'

import * as aaveLendingPool from '../../../abi/aave-lending-pool'
import { currencies } from '../../../shared/post-processors/exchange-rates/currencies'
import { IStrategyData } from '../../../shared/processor-templates/strategy'
import { OUSD_ADDRESS } from '../../../utils/addresses'
import { logFilter } from '../../../utils/logFilter'
import { DAI, USDT } from './const'

export const aaveStrategy: IStrategyData = {
  from: 14206832, // 13369326, Initial Deploy
  oTokenAddress: OUSD_ADDRESS,
  kind: 'Generic',
  name: 'OUSD Aave',
  contractName: 'AaveStrategy',
  address: '0x5e3646a1db86993f73e6b74a57d8640b69f7e259',
  base: { address: currencies.USD, decimals: 18 },
  assets: [DAI, USDT],
  earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
}

const balanceUpdateFilters: IStrategyData['balanceUpdateLogFilters'] = []
aaveStrategy.balanceUpdateLogFilters = balanceUpdateFilters

const lendingPoolAddress =
  '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9'.toLowerCase()

const pad = (hex: string) => viemPad(hex as `0x${string}`)

balanceUpdateFilters.push(
  logFilter({
    address: [lendingPoolAddress],
    topic0: [
      aaveLendingPool.events.Deposit.topic,
      aaveLendingPool.events.Withdraw.topic,
    ],
    topic1: [DAI, USDT].map((a) => pad(a.address)),
    topic2: [pad(aaveStrategy.address)],
    range: { from: aaveStrategy.from },
  }),
)
