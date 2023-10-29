import { run } from './processor'
import * as ogv from './ogv/processors/ogv'
import * as ogvSupply from './ogv/processors/ogv-supply'
import * as governance from './ogv/post-processors/governance'

run({
  stateSchema: 'ogv-processor',
  processors: [ogvSupply, ogv],
  postProcessors: [governance],
  validators: [],
})
