import * as ousd from './ousd/processors/ousd'
import * as strategies from './ousd/processors/strategies/strategies'
import { run } from './processor'
import * as exchangeRates from './shared/post-processors/exchange-rates'

run({
  stateSchema: 'ousd-processor',
  processors: [
    // ousd,
    strategies,
  ],
  postProcessors: [exchangeRates],
  validators: [],
})
