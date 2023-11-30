import * as dailyStats from './ousd/post-processors/daily-stats'
import * as ousd from './ousd/processors/ousd'
import * as strategies from './ousd/processors/strategies/strategies'
import * as validateOusd from './ousd/validators/validate-ousd'
import { run } from './processor'
import * as exchangeRates from './shared/post-processors/exchange-rates'

export const processor = {
  stateSchema: 'ousd-processor',
  processors: [ousd, strategies],
  postProcessors: [exchangeRates, dailyStats],
  validators: [validateOusd],
}
export default processor

if (require.main === module) {
  run(processor)
}
