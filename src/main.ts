import * as oeth_dailyStats from './oeth/post-processors/daily-stats'
import * as oeth from './oeth/processors'
import * as oeth_balancerMetaPoolStrategy from './oeth/processors/balancer-meta-pool'
import * as oeth_curveLp from './oeth/processors/curve-lp'
import * as oeth_dripper from './oeth/processors/dripper'
import * as oeth_exchangeRates from './oeth/processors/exchange-rates'
import * as oeth_fraxStaking from './oeth/processors/frax-staking'
import * as oeth_morphoAave from './oeth/processors/morpho-aave'
import * as oeth_strategies from './oeth/processors/strategies'
import * as oeth_vault from './oeth/processors/vault'
import * as oeth_validate from './oeth/validators/validate-oeth'
import * as ousd from './ousd/processors/ousd'
import * as ousd_strategies from './ousd/processors/strategies'
import * as ousd_validate from './ousd/validators/validate-ousd'
import { run } from './processor'
import * as exchangeRatesPostProcessor from './shared/post-processors/exchange-rates'
import * as shared_aaveCompound from './shared/processors/aave-compound'
import * as shared_curve from './shared/processors/curve'

run({
  processors: [
    // OETH
    oeth,
    oeth_vault,
    oeth_fraxStaking,
    oeth_morphoAave,
    oeth_dripper,
    oeth_curveLp,
    oeth_balancerMetaPoolStrategy,
    oeth_strategies,
    oeth_exchangeRates,

    // OUSD
    ousd,
    ousd_strategies,

    // Shared
    shared_aaveCompound,
    shared_curve,
  ],
  postProcessors: [exchangeRatesPostProcessor, oeth_dailyStats],
  validators: [oeth_validate, ousd_validate],
})
