import 'tsconfig-paths/register'

import { run } from '@processor'
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates'
import { processStatus } from '@templates/processor-status'
import { addresses } from '@utils/addresses'

import * as dailyStats from './oeth/post-processors/daily-stats'
import * as oeth from './oeth/processors'
import * as balancerMetaPoolStrategy from './oeth/processors/balancer-meta-pool'
import { ccip } from './oeth/processors/ccip'
import * as curveLp from './oeth/processors/curve-lp'
import * as dripper from './oeth/processors/dripper'
import * as exchangeRates from './oeth/processors/exchange-rates'
import * as fraxStaking from './oeth/processors/frax-staking'
import * as morphoAave from './oeth/processors/morpho-aave'
import * as strategies from './oeth/processors/strategies'
import * as vault from './oeth/processors/vault'
import * as validateOeth from './oeth/validators/validate-oeth'
import { createOTokenWithdrawalsProcessor } from './templates/withdrawals'

export const processor = {
  stateSchema: 'oeth-processor',
  processors: [
    ccip({ chainId: 1 }),
    oeth,
    vault,
    fraxStaking,
    morphoAave,
    dripper,
    curveLp,
    balancerMetaPoolStrategy,
    strategies,
    exchangeRates,
    createOTokenWithdrawalsProcessor({ oTokenAddress: addresses.oeth.address, from: 20428558 }),
  ],
  postProcessors: [exchangeRatesPostProcessor, dailyStats, processStatus('oeth')],
  validators: [validateOeth],
}
export default processor

if (require.main === module) {
  run(processor)
}
