import 'tsconfig-paths/register';



import { defineSquidProcessor } from '@originprotocol/squid-utils';
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates';
import { processStatus } from '@templates/processor-status';
import { addresses } from '@utils/addresses';
import { DEFAULT_FIELDS } from '@utils/batch-proccesor-fields';
import { initProcessorFromDump } from '@utils/dumps';



import { oethProcessor } from './oeth/processors';
import { oethExchangeRatesProcessor } from './oeth/processors/exchange-rates';
import { oethStrategiesProcessor } from './oeth/processors/strategies';
import { createOTokenWithdrawalsProcessor } from './templates/withdrawals';


export const processor = defineSquidProcessor({
  stateSchema: 'oeth-processor',
  processors: [
    oethProcessor,
    oethStrategiesProcessor,
    oethExchangeRatesProcessor,
    createOTokenWithdrawalsProcessor({
      name: 'OETH',
      oTokenAddress: addresses.oeth.address,
      oTokenVaultAddress: addresses.oeth.vault,
      from: 20428558,
    }),
  ],
  postProcessors: [exchangeRatesPostProcessor, processStatus('oeth')],
  validators: [],
  fields: DEFAULT_FIELDS,
})
export default processor

if (require.main === module) {
  initProcessorFromDump(processor).catch((error) => {
    throw error
  })
}