import * as exchangeRates from './post-processors/exchange-rates'
import { run } from './processor'
import * as curve from './processors/curve'
import * as curveLp from './processors/curve-lp'
import * as dripper from './processors/dripper'
import * as fraxStaking from './processors/frax-staking'
import * as morphoAave from './processors/morpho-aave'
import * as oeth from './processors/oeth'
import * as ousd from './processors/ousd'
import * as balancerMetaPoolStrategy from './processors/strategies/balancer-meta-pool'
import * as vault from './processors/vault'

run([
  {
    stateSchema: 'curve-processing',
    processors: [curve],
  },
  {
    stateSchema: 'oeth-processing',
    processors: [
      oeth,
      vault,
      fraxStaking,
      morphoAave,
      dripper,
      curveLp,
      balancerMetaPoolStrategy,
    ],
    postProcessors: [exchangeRates],
  },
  {
    stateSchema: 'ousd-processing',
    processors: [ousd],
  },
])
