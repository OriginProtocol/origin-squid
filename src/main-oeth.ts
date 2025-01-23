import 'tsconfig-paths/register'

import { defineSquidProcessor, run } from '@originprotocol/squid-utils'
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates'
import { processStatus } from '@templates/processor-status'
import { addresses } from '@utils/addresses'

import * as oeth from './oeth/processors'
import { ccip } from './oeth/processors/ccip'
import * as exchangeRates from './oeth/processors/exchange-rates'
import * as strategies from './oeth/processors/strategies'
import * as validateOeth from './oeth/validators/validate-oeth'
import { createOTokenWithdrawalsProcessor } from './templates/withdrawals'

export const processor = defineSquidProcessor({
  stateSchema: 'oeth-processor',
  processors: [
    ccip({ chainId: 1 }),
    oeth,
    strategies,
    exchangeRates,
    createOTokenWithdrawalsProcessor({
      oTokenAddress: addresses.oeth.address,
      oTokenVaultAddress: addresses.oeth.vault,
      from: 20428558,
    }),
  ],
  postProcessors: [exchangeRatesPostProcessor, processStatus('oeth')],
  validators: [validateOeth],
})
export default processor

if (require.main === module) {
  run(processor)
}
