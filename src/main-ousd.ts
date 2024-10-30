import 'tsconfig-paths/register'

import { run } from '@processor'
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates'
import { processStatus } from '@templates/processor-status'

import * as dailyStats from './ousd/post-processors/daily-stats'
import * as curve from './ousd/processors/curve'
import { erc20s } from './ousd/processors/erc20s'
import { morphoMarketStatesProcessor } from './ousd/processors/morpho-market-states'
import * as ousd from './ousd/processors/ousd'
import * as strategies from './ousd/processors/strategies/strategies'
import * as validateOusd from './ousd/validators/validate-ousd'

export const processor = {
  stateSchema: 'ousd-processor',
  processors: [ousd, strategies, curve, morphoMarketStatesProcessor, ...erc20s()],
  postProcessors: [exchangeRatesPostProcessor, dailyStats, processStatus('ousd')],
  validators: [validateOusd],
}
export default processor

if (require.main === module) {
  run(processor)
}
