import 'tsconfig-paths/register'

import { defineSquidProcessor, run } from '@processor'
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates'
import { processStatus } from '@templates/processor-status'

import * as curve from './ousd/processors/curve'
import { erc20s } from './ousd/processors/erc20s'
import { morphoMarketStatesProcessor } from './ousd/processors/morpho-market-states'
import * as ousd from './ousd/processors/ousd'
import * as strategies from './ousd/processors/strategies/strategies'
import * as validateOusd from './ousd/validators/validate-ousd'

export const processor = defineSquidProcessor({
  stateSchema: 'ousd-processor',
  processors: [ousd, strategies, curve, morphoMarketStatesProcessor, ...erc20s()],
  postProcessors: [exchangeRatesPostProcessor, processStatus('ousd')],
  validators: [validateOusd],
})
export default processor

if (require.main === module) {
  run(processor)
}
