import * as ousd from './ousd/processors/ousd'
import { run } from './processor'
import * as ogv from './processors/ogv/ogv'
import * as exchangeRates from './shared/post-processors/exchange-rates'

run({
  stateSchema: 'ogv-processor',
  processors: [ogv],
  postProcessors: [],
  validators: [],
})
