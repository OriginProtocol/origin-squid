import 'tsconfig-paths/register'
import { base } from 'viem/chains'

import { defineSquidProcessor, run } from '@originprotocol/squid-utils'
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates'
import { createPoolsProcessor } from '@templates/pools/pools'
import { processStatus } from '@templates/processor-status'
import { DEFAULT_FIELDS } from '@utils/batch-proccesor-fields'

import { baseERC20s, baseStrategiesProcessors, bridgedWoethStrategy } from './base'
import { aerodromeProcessors } from './base/aerodrome'
import * as exchangeRatesProcessor from './base/exchange-rates'
import { createMorphoVaultApyProcessor } from '@templates/morpho/processor'

const MORPHO_BASE_FROM = 43_839_000 // ~7 days before 2026-04-01

export const processor = defineSquidProcessor({
  chainId: base.id,
  stateSchema: 'base-processor',
  processors: [
    ...baseERC20s,
    ...baseStrategiesProcessors,
    ...aerodromeProcessors,
    bridgedWoethStrategy,
    exchangeRatesProcessor,
    createPoolsProcessor(base.id),
    createMorphoVaultApyProcessor({ name: 'Morpho Vault APY - Base', from: MORPHO_BASE_FROM, chainId: base.id }),
  ],
  postProcessors: [exchangeRatesPostProcessor, processStatus('base')],
  validators: [],
  fields: DEFAULT_FIELDS,
})

export default processor

if (require.main === module) {
  run(processor).catch((error) => {
    throw error
  })
}
