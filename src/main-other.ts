import * as dailyStats from './oeth/post-processors/daily-stats'
import * as oeth from './oeth/processors'
import * as balancerMetaPoolStrategy from './oeth/processors/balancer-meta-pool'
import * as curveLp from './oeth/processors/curve-lp'
import * as dripper from './oeth/processors/dripper'
import * as fraxStaking from './oeth/processors/frax-staking'
import * as morphoAave from './oeth/processors/morpho-aave'
import * as strategies from './oeth/processors/strategies'
import * as vault from './oeth/processors/vault'
import * as validateOeth from './oeth/validators/validate-oeth'
import { run } from './processor'
import * as exchangeRates from './shared/post-processors/exchange-rates'
import * as aaveCompound from './shared/processors/aave-compound'
import * as curve from './shared/processors/curve'

run({
  stateSchema: 'other-processor',
  processors: [aaveCompound, curve],
  postProcessors: [exchangeRates],
  validators: [],
})
