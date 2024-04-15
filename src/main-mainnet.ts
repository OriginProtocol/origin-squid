import { run } from './processor'
import * as exchangeRates from './shared/post-processors/exchange-rates'
import { processStatus } from './shared/processor-templates/processor-status'
import { erc20s } from './shared/processors/erc20s'
import * as validate from './shared/validators/validate-shared'

export const processor = {
  stateSchema: 'mainnet-processor',
  processors: [...erc20s()],
  postProcessors: [exchangeRates, processStatus('other')],
  validators: [validate],
}
export default processor

if (require.main === module) {
  run(processor)
}
