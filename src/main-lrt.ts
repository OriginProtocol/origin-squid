import * as lrt from './lrt'
import * as validate from './lrt/validate'
import { run } from './processor'

export const processor = {
  processors: [lrt],
  postProcessors: [],
  validators: [validate],
}
export default processor

if (require.main === module) {
  run(processor)
}

// EL Asset Balances
// https://github.com/oplabs/primestaked-eth/blob/58083291108fe34b169275872aa8c86320758e68/contracts/NodeDelegator.sol#L122
