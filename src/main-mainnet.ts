import 'tsconfig-paths/register'

import { run } from '@processor'
import * as exchangeRates from '@shared/post-processors/exchange-rates'
import { createOriginARMProcessors } from '@templates/origin-arm'
import { processStatus } from '@templates/processor-status'

import * as dailyStats from './mainnet/post-processors/daily-stats'
import * as validate from './mainnet/validators/validate-mainnet'

export const processor = {
  stateSchema: 'mainnet-processor',
  processors: [
    // nativeStaking,
    // legacyStaking,
    // curve,
    // ...erc20s(),
    // createGovernanceProcessor({ from: 15491391, address: OGV_GOVERNANCE_ADDRESS }),
    // createGovernanceProcessor({ from: 20117923, address: OGN_GOVERNANCE_ADDRESS }),
    // createESTracker({
    //   from: 19919745,
    //   address: XOGN_ADDRESS,
    //   assetAddress: OGN_ADDRESS,
    //   rewardsAddress: '0x7609c88e5880e934dd3a75bcfef44e31b1badb8b',
    //   yieldType: 'fixed',
    // }),
    // createFRRSProcessor({ from: 19917521, address: OGN_REWARDS_SOURCE_ADDRESS }),
    ...createOriginARMProcessors({
      name: 'origin-arm',
      from: 20933088,
      armAddress: '0x85b78aca6deae198fbf201c82daf6ca21942acc6',
      liquidityProviderControllerAddress: '0x3817e247023B4f489352758397040b1fd33b300a',
    }),
  ],
  postProcessors: [exchangeRates, dailyStats, processStatus('mainnet')],
  validators: [validate],
}
export default processor

if (require.main === module) {
  run(processor)
}
