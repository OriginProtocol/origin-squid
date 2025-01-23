import { OS } from 'sonic/os'
import { sonicStrategies } from 'sonic/strategies'
import 'tsconfig-paths/register'
import { sonic } from 'viem/chains'

import { defineSquidProcessor, run } from '@originprotocol/squid-utils'
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates'
import { processStatus } from '@templates/processor-status'

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
