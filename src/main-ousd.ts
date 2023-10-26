import * as ousd from './ousd/processors/ousd'
import { run } from './processor'
import * as exchangeRates from './shared/post-processors/exchange-rates'

run({
  stateSchema: 'ousd-processor',
  processors: [ousd],
  postProcessors: [exchangeRates],
  validators: [],
})
