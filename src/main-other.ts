import { run } from './processor'
import * as exchangeRates from './shared/post-processors/exchange-rates'
import * as aaveCompound from './shared/processors/aave-compound'
import * as curve from './shared/processors/curve'
import { erc20s } from './shared/processors/erc20s'

export const processor = {
  stateSchema: 'other-processor',
  processors: [aaveCompound, curve, ...erc20s],
  postProcessors: [exchangeRates],
  validators: [],
}
export default processor

if (require.main === module) {
  run(processor)
}
