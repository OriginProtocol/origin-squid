import 'tsconfig-paths/register'

import { run } from '@processor'
import { processStatus } from '@templates/processor-status'

import * as dailyStats from './ogn/post-processors/daily-stats'
import * as governance from './ogn/post-processors/governance'
import * as ogn from './ogn/processors/ogn'
import * as ognSupply from './ogn/processors/ogn-supply'

export const processor = {
  stateSchema: 'ogn-processor',
  processors: [ognSupply, ogn],
  postProcessors: [governance, dailyStats, processStatus('ogn')],
  validators: [],
}
export default processor

if (require.main === module) {
  run(processor)
}
