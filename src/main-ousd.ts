import * as exchangeRates from './post-processors/exchange-rates'
import { run } from './processor'
import * as ousd from './processors/ousd'

run({
  stateSchema: 'ousd-processor',
  processors: [ousd],
  postProcessors: [exchangeRates],
  validators: [],
})
