import 'tsconfig-paths/register'

import { run } from '@processor'
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates'
import { processStatus } from '@templates/processor-status'

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
  ],
  postProcessors: [
    exchangeRatesPostProcessor,
    dailyStats,
    processStatus('oeth'),
  ],
  validators: [],
}
export default processor

if (require.main === module) {
  run(processor)
}
