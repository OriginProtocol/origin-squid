import 'tsconfig-paths/register'

import { run } from '@processor'
import * as exchangeRates from '@shared/post-processors/exchange-rates'
import { createExponentialStakingTracker } from '@templates/exponential-staking'
import { createFixedRewardsSourceProcessor } from '@templates/fixed-rate-rewards-source'
import { createGovernanceProcessor } from '@templates/governance'
import { processStatus } from '@templates/processor-status'
import { GOVERNANCE_ADDRESS, OGN_REWARDS_SOURCE_ADDRESS, VEOGV_ADDRESS, XOGN_ADDRESS } from '@utils/addresses'

import * as curve from './mainnet/processors/curve'
import { erc20s } from './mainnet/processors/erc20s'
import * as validate from './mainnet/validators/validate-mainnet'

export const processor = {
  stateSchema: 'mainnet-processor',
  processors: [
    curve,
    ...erc20s(),
    createGovernanceProcessor({ from: 15491391, address: GOVERNANCE_ADDRESS }),
    createExponentialStakingTracker({ from: 15089597, address: VEOGV_ADDRESS }),
    createExponentialStakingTracker({ from: 19919745, address: XOGN_ADDRESS }),
    createFixedRewardsSourceProcessor({ from: 19917521, address: OGN_REWARDS_SOURCE_ADDRESS }),
  ],
  postProcessors: [exchangeRates, processStatus('mainnet')],
  validators: [validate],
}
export default processor

if (require.main === module) {
  run(processor)
}
