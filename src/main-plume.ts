import { plumeErc20s } from 'plume/erc20'
import { plumeStrategyProcessors } from 'plume/strategies'
import { superOETHp } from 'plume/super-oeth-p'
import 'tsconfig-paths/register'
import { plumeMainnet } from 'viem/chains'

import { defineSquidProcessor, run } from '@originprotocol/squid-utils'
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates'
import { createPoolsProcessor } from '@templates/pools'
import { processStatus } from '@templates/processor-status'
import { DEFAULT_FIELDS } from '@utils/batch-proccesor-fields'

export const processor = defineSquidProcessor({
  chainId: plumeMainnet.id,
  stateSchema: 'plume-processor',
  processors: [
    ...plumeErc20s,
    ...superOETHp,
    ...plumeStrategyProcessors,
    // createPoolBoosterProcessor({ registryAddress: '0x4f3b656aa5fb5e708bf7b63d6ff71623eb4a218a', from: 9219718 }),
    createPoolsProcessor(plumeMainnet.id),
  ],
  postProcessors: [exchangeRatesPostProcessor, processStatus('plume')],
  validators: [],
  fields: DEFAULT_FIELDS,
})

export default processor

if (require.main === module) {
  run(processor).catch((error) => {
    throw error
  })
}
