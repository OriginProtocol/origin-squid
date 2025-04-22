import 'tsconfig-paths/register'
import { base } from 'viem/chains'

import { defineSquidProcessor, run } from '@originprotocol/squid-utils'
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates'
import { createCurvePoolBoosterProcessor } from '@templates/otoken/curve-pool-booster'
import { createPoolsProcessor } from '@templates/pools/pools'
import { processStatus } from '@templates/processor-status'
import { DEFAULT_FIELDS } from '@utils/batch-proccesor-fields'

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
    createCurvePoolBoosterProcessor({ from: 26255636 }),
    createPoolsProcessor(base.id),
  ],
  postProcessors: [exchangeRatesPostProcessor, processStatus('base')],
  validators: [validate],
  fields: DEFAULT_FIELDS,
})

export default processor

if (require.main === module) {
  run(processor).catch((error) => {
    throw error
  })
}
