import { run } from './processor'

import * as oethProcessor from './processors/oeth'
import * as vaultProcessor from './processors/vault'
import * as fraxStakingProcessor from './processors/frax-staking'
import * as morphoAaveProcessor from './processors/morpho-aave'
import * as dripperProcessor from './processors/dripper'

// The idea is that these processors have zero dependencies on one another and can be processed asynchronously.
run([
  oethProcessor,
  vaultProcessor,
  fraxStakingProcessor,
  morphoAaveProcessor,
  dripperProcessor,
])
