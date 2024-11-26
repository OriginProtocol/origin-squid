import 'tsconfig-paths/register'
import { base } from 'viem/chains'

import { defineSquidProcessor, run } from '@processor'
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates'
import { processStatus } from '@templates/processor-status'

import { baseERC20s, baseStrategies, bridgedWoethStrategy, superOETHb } from './base'
import { aerodromeProcessors } from './base/aerodrome'
import * as exchangeRatesProcessor from './base/exchange-rates'
import * as validate from './base/validate'

export const processor = defineSquidProcessor({
  chainId: base.id,
  stateSchema: 'base-processor',
  processors: [
    ...baseERC20s,
    ...superOETHb,
    ...baseStrategies,
    ...aerodromeProcessors,
    bridgedWoethStrategy,
    exchangeRatesProcessor,
  ],
  postProcessors: [exchangeRatesPostProcessor, processStatus('base')],
  validators: [validate],
})

export default processor

if (require.main === module) {
  run(processor)
}
