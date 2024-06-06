import 'tsconfig-paths/register'

import { run } from '@processor'
import * as exchangeRates from '@shared/post-processors/exchange-rates'
import { createESTracker } from '@templates/exponential-staking'
import { createFRRSProcessor } from '@templates/fixed-rate-rewards-source'
import { createGovernanceProcessor } from '@templates/governance'
import { processStatus } from '@templates/processor-status'
import { OGN_ADDRESS, OGN_REWARDS_SOURCE_ADDRESS, XOGN_ADDRESS } from '@utils/addresses'

import * as curve from './mainnet/processors/curve'
import { erc20s } from './mainnet/processors/erc20s'
import * as nativeStaking from './mainnet/processors/native-staking'
import * as validate from './mainnet/validators/validate-mainnet'

export const processor = {
  stateSchema: 'mainnet-processor',
  processors: [
    nativeStaking,
    curve,
    ...erc20s(),
    // createGovernanceProcessor({ from: 0000000000, address: OGN_GOVERNANCE_ADDRESS }),
    createESTracker({
      from: 19919745,
      address: XOGN_ADDRESS,
      assetAddress: OGN_ADDRESS,
      rewardsAddress: '0x7609c88e5880e934dd3a75bcfef44e31b1badb8b',
      yieldType: 'fixed',
    }),
    createFRRSProcessor({ from: 19917521, address: OGN_REWARDS_SOURCE_ADDRESS }),
  ],
  postProcessors: [exchangeRates, processStatus('mainnet')],
  validators: [validate],
}
export default processor

if (require.main === module) {
  run(processor)
}
