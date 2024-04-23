import 'tsconfig-paths/register'

import { run } from '@processor'
import * as exchangeRates from '@shared/post-processors/exchange-rates'
import { processStatus } from '@templates/processor-status'

import * as dailyStats from './ousd/post-processors/daily-stats'
import * as curve from './ousd/processors/curve'
import { erc20s } from './ousd/processors/erc20s'
import * as ousd from './ousd/processors/ousd'
import * as strategies from './ousd/processors/strategies/strategies'
import * as validateOusd from './ousd/validators/validate-ousd'

export const processor = {
  stateSchema: 'ousd-processor',
  processors: [ousd, strategies, curve, ...erc20s],
  postProcessors: [exchangeRates, dailyStats, processStatus('ousd')],
  validators: [],
}
export default processor

if (require.main === module) {
  run(processor)
}
