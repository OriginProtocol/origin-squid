import 'tsconfig-paths/register'

import { defineSquidProcessor, run } from '@originprotocol/squid-utils'
import { processStatus } from '@templates/processor-status'
import { DEFAULT_FIELDS } from '@utils/batch-proccesor-fields'

import * as dailyStats from './ogv/post-processors/daily-stats'
import * as governance from './ogv/post-processors/governance'
import * as ogv from './ogv/processors/ogv'
import * as ogvSupply from './ogv/processors/ogv-supply'

export const processor = defineSquidProcessor({
  stateSchema: 'ogv-processor',
  processors: [ogvSupply, ogv],
  postProcessors: [governance, dailyStats, processStatus('ogv')],
  validators: [],
  fields: DEFAULT_FIELDS,
})
export default processor

if (require.main === module) {
  run(processor).catch((error) => {
    throw error
  })
}
