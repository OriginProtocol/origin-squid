import { run } from './processor'
import * as exchangeRates from './shared/post-processors/exchange-rates'
import * as liquidity from './shared/post-processors/liquidity'
import { processStatus } from './shared/processor-templates/processor-status'
import * as balancer from './shared/processors/balancer'
import * as curve from './shared/processors/curve'
import { erc20s } from './shared/processors/erc20s'
import * as liquiditySources from './shared/processors/liquidity-sources'
import * as maverick from './shared/processors/maverick'
import * as native from './shared/processors/native'

export const processor = {
  stateSchema: 'other-processor',
  processors: [
    balancer,
    curve,
    maverick,
    native,
    ...erc20s(),
    liquiditySources,
  ],
  postProcessors: [exchangeRates, liquidity, processStatus('other')],
  validators: [],
}
export default processor

if (require.main === module) {
  run(processor)
}
