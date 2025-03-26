import { sonicErc20s } from 'sonic/erc20'
import { OS } from 'sonic/os'
import { sonicStrategies } from 'sonic/strategies'
import 'tsconfig-paths/register'
import { sonic } from 'viem/chains'

import { defineSquidProcessor, run } from '@originprotocol/squid-utils'
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates'
import { createCurvePoolBoosterProcessor } from '@templates/otoken/curve-pool-booster'
import { createPoolBoosterProcessor } from '@templates/otoken/pool-booster'
import { createPoolsProcessor } from '@templates/pools/pools'
import { processStatus } from '@templates/processor-status'

import * as validate from './sonic/validate'

export const processor = defineSquidProcessor({
  chainId: sonic.id,
  stateSchema: 'sonic-processor',
  processors: [
    ...OS,
    ...sonicErc20s,
    sonicStrategies,
    createCurvePoolBoosterProcessor({ from: 7436660 }),
    createPoolBoosterProcessor({ registryAddress: '0x4f3b656aa5fb5e708bf7b63d6ff71623eb4a218a', from: 9219718 }),
    createPoolsProcessor(sonic.id),
  ],
  postProcessors: [exchangeRatesPostProcessor, processStatus('sonic')],
  validators: [validate],
})

export default processor

if (require.main === module) {
  run(processor).catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
