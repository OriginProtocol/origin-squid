import { run } from './processor'
import * as exchangeRates from './shared/post-processors/exchange-rates'
import * as liquidity from './shared/post-processors/liquidity'
import { processStatus } from './shared/processor-templates/processor-status'
import * as balancer from './shared/processors/balancer'
import * as curve from './shared/processors/curve'
import { erc20s } from './shared/processors/erc20s'
import * as maverick from './shared/processors/maverick'
import * as native from './shared/processors/native'
import * as validate from './shared/validators/validate-shared'
import { WOETH_ADDRESS } from './utils/addresses'

export const processor = {
  stateSchema: 'mainnet-processor',
  processors: [balancer, curve, maverick, native, ...erc20s()],
  postProcessors: [exchangeRates, liquidity, processStatus('other')],
  validators: [validate],
}
export default processor

if (require.main === module) {
  run(processor)
}
