import { run } from './processor'
import * as curveLp from './processors/curve-lp'
import * as dripper from './processors/dripper'
import * as financialStatement from './processors/financial-statement'
import * as fraxStaking from './processors/frax-staking'
import * as morphoAave from './processors/morpho-aave'
import * as oeth from './processors/oeth'
import * as vault from './processors/vault'

run({
  // The idea is that these processors have zero dependencies on one another and can be processed asynchronously.
  processors: [oeth, vault, fraxStaking, morphoAave, dripper, curveLp],
  // For processors which depend on results from other processors, post processors run after all processors have finished.
  postProcessors: [financialStatement],
})
