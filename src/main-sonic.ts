import { sonicErc20s } from 'sonic/erc20'
import { sonicArmProcessors } from 'sonic/origin-sonic-arm'
import { OS } from 'sonic/os'
import { sfcProcessor } from 'sonic/sfc'
import { sonicStrategiesProcessor } from 'sonic/strategies'
import 'tsconfig-paths/register'
import { sonic } from 'viem/chains'

import { defineSquidProcessor } from '@originprotocol/squid-utils'
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates'
import { createPoolBoosterProcessor } from '@templates/otoken/pool-booster'
import { createPoolsProcessor } from '@templates/pools/pools'
import { processStatus } from '@templates/processor-status'
import { DEFAULT_FIELDS } from '@utils/batch-proccesor-fields'
import { initProcessorFromDump } from '@utils/dumps'

import * as validate from './sonic/validate'

export const processor = defineSquidProcessor({
  chainId: sonic.id,
  stateSchema: 'sonic-processor',
  processors: [
    ...OS,
    ...sonicErc20s,
    sonicStrategiesProcessor,
    sfcProcessor,
    createPoolBoosterProcessor({ registryAddress: '0x4f3b656aa5fb5e708bf7b63d6ff71623eb4a218a', from: 9219718 }),
    createPoolsProcessor(sonic.id),
    ...sonicArmProcessors,
  ],
  postProcessors: [exchangeRatesPostProcessor, processStatus('sonic')],
  validators: [validate],
  fields: DEFAULT_FIELDS,
})

export default processor

if (require.main === module) {
  initProcessorFromDump(processor).catch((error) => {
    throw error
  })
}
