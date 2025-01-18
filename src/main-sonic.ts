import { OS } from 'sonic/os'
import { sonicStrategies } from 'sonic/strategies'
import 'tsconfig-paths/register'

import { defineSquidProcessor, run } from '@processor'
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates'
import { processStatus } from '@templates/processor-status'
import { sonic } from '@utils/chains'

import * as validate from './sonic/validate'

export const processor = defineSquidProcessor({
  chainId: sonic.id,
  stateSchema: 'sonic-processor',
  processors: [...OS, sonicStrategies],
  postProcessors: [exchangeRatesPostProcessor, processStatus('sonic')],
  validators: [validate],
})

export default processor

if (require.main === module) {
  run(processor)
}
