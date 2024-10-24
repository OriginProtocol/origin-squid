import { coingeckoProcessor } from 'mainnet/processors/coingecko'
import 'tsconfig-paths/register'

import { run } from '@processor'
import * as exchangeRates from '@shared/post-processors/exchange-rates'
import { createESTracker } from '@templates/exponential-staking'
import { createFRRSProcessor } from '@templates/fixed-rate-rewards-source'
import { createGovernanceProcessor } from '@templates/governance'
import { createOriginARMProcessors } from '@templates/origin-arm'
import { processStatus } from '@templates/processor-status'
import {
  OGN_ADDRESS,
  OGN_GOVERNANCE_ADDRESS,
  OGN_REWARDS_SOURCE_ADDRESS,
  OGV_GOVERNANCE_ADDRESS,
  XOGN_ADDRESS,
  addresses,
} from '@utils/addresses'

import * as dailyStats from './mainnet/post-processors/daily-stats'
import * as curve from './mainnet/processors/curve'
import { erc20s } from './mainnet/processors/erc20s'
import * as legacyStaking from './mainnet/processors/legacy-staking'
import * as nativeStaking from './mainnet/processors/native-staking'
import * as validate from './mainnet/validators/validate-mainnet'

export const processor = {
  stateSchema: 'mainnet-processor',
  processors: [
    nativeStaking,
    legacyStaking,
    curve,
    ...erc20s(),
    createGovernanceProcessor({ from: 15491391, address: OGV_GOVERNANCE_ADDRESS }),
    createGovernanceProcessor({ from: 20117923, address: OGN_GOVERNANCE_ADDRESS }),
    createESTracker({
      from: 19919745,
      address: XOGN_ADDRESS,
      assetAddress: OGN_ADDRESS,
      rewardsAddress: '0x7609c88e5880e934dd3a75bcfef44e31b1badb8b',
      yieldType: 'fixed',
    }),
    createFRRSProcessor({ from: 19917521, address: OGN_REWARDS_SOURCE_ADDRESS }),
    coingeckoProcessor,
    ...createOriginARMProcessors({
      name: 'origin-arm',
      from: 20987226,
      armAddress: addresses.arm.address,
      capManagerAddress: addresses.arm.capManager,
    }),
  ],
  postProcessors: [exchangeRates, dailyStats, processStatus('mainnet')],
  validators: [validate],
}
export default processor

if (require.main === module) {
  run(processor)
}
