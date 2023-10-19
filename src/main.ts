import * as exchangeRates from './post-processors/exchange-rates'
import { run } from './processor'
import * as aaveCompound from './processors/aave-compound'
import * as curve from './processors/curve'
import * as oeth from './processors/oeth'
import * as balancerMetaPoolStrategy from './processors/oeth/balancer-meta-pool'
import * as curveLp from './processors/oeth/curve-lp'
import * as dripper from './processors/oeth/dripper'
import * as fraxStaking from './processors/oeth/frax-staking'
import * as morphoAave from './processors/oeth/morpho-aave'
import * as vault from './processors/oeth/vault'
import * as ousd from './processors/ousd'
import * as strategies from './processors/strategies'

run([
  {
    name: 'block-frequency-updates',
    processors: [aaveCompound, curve, strategies],
  },
  {
    name: 'oeth',
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
    name: 'ousd',
    processors: [ousd],
  },
])
