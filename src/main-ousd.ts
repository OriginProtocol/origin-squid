import { ousdProcessor } from 'ousd/processors/ousd';
import 'tsconfig-paths/register';



import { defineSquidProcessor } from '@originprotocol/squid-utils';
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates';
import { processStatus } from '@templates/processor-status'
import { createOTokenWithdrawalsProcessor } from '@templates/withdrawals'
import { addresses } from '@utils/addresses'
import { DEFAULT_FIELDS } from '@utils/batch-proccesor-fields'
import { initProcessorFromDump } from '@utils/dumps'

import { ousdCurveProcessor } from './ousd/processors/curve'
import { erc20s } from './ousd/processors/erc20s'
import { morphoMarketStatesProcessor } from './ousd/processors/morpho-market-states'
import { ousdStrategiesProcessor } from './ousd/processors/strategies/strategies'

export const processor = defineSquidProcessor({
  stateSchema: 'ousd-processor',
  processors: [
    ousdProcessor,
    ousdStrategiesProcessor,
    createOTokenWithdrawalsProcessor({
      name: 'OUSD',
      oTokenAddress: addresses.ousd.address,
      oTokenVaultAddress: addresses.ousd.vault,
      from: 24426857,
    }),
    ousdCurveProcessor,
    morphoMarketStatesProcessor,
    ...erc20s(),
  ],
  postProcessors: [exchangeRatesPostProcessor, processStatus('ousd')],
  validators: [],
  fields: DEFAULT_FIELDS,
})
export default processor

if (require.main === module) {
  initProcessorFromDump(processor).catch((error) => {
    throw error
  })
}