import { run } from './processor'
import * as exchangeRates from './shared/post-processors/exchange-rates'
import * as aaveCompound from './shared/processors/aave-compound'
import * as curve from './shared/processors/curve'

export const processor = {
  stateSchema: 'other-processor',
  processors: [aaveCompound, curve],
  postProcessors: [exchangeRates],
  validators: [],
}
export default processor

if (require.main === module) {
  run(processor)
}
