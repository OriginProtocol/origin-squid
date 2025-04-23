import { coingeckoProcessor } from 'mainnet/processors/coingecko'
import { notionProcessor } from 'mainnet/processors/notion'
import { originArmProcessors } from 'mainnet/processors/origin-arm'
import { protocolProcessor } from 'mainnet/processors/protocol'
import 'tsconfig-paths/register'
import { mainnet } from 'viem/chains'

import { defineSquidProcessor, run } from '@originprotocol/squid-utils'
import * as exchangeRates from '@shared/post-processors/exchange-rates'
import { createESTracker } from '@templates/exponential-staking'
import { createFRRSProcessor } from '@templates/fixed-rate-rewards-source'
import { createGovernanceProcessor } from '@templates/governance'
import { createCurvePoolBoosterProcessor } from '@templates/otoken/curve-pool-booster'
import { createPoolsProcessor } from '@templates/pools/pools'
import { processStatus } from '@templates/processor-status'
import { createTransactionProcessor } from '@templates/transactions'
import {
  OGN_ADDRESS,
  OGN_GOVERNANCE_ADDRESS,
  OGN_REWARDS_SOURCE_ADDRESS,
  OGV_GOVERNANCE_ADDRESS,
  XOGN_ADDRESS,
} from '@utils/addresses'
import { FIELDS_WITH_RECEIPTS_INFO } from '@utils/batch-proccesor-fields'

import * as dailyStats from './mainnet/post-processors/ogn-daily-stats'
import * as curve from './mainnet/processors/curve'
import { erc20s } from './mainnet/processors/erc20s'
import * as mainnetExchangeRates from './mainnet/processors/exchange-rates'
import * as legacyStaking from './mainnet/processors/legacy-staking'
import * as nativeStaking from './mainnet/processors/native-staking'
import * as validate from './mainnet/validators/validate-mainnet'

export const processor = defineSquidProcessor({
  stateSchema: 'mainnet-processor',
  processors: [
    mainnetExchangeRates,
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
    ...originArmProcessors,
    // Defender Relayer for Lido ARM
    createTransactionProcessor({ from: 18744591, address: ['0x39878253374355dbcc15c86458f084fb6f2d6de7'] }),
    createCurvePoolBoosterProcessor({ from: 21000000 }),
    createPoolsProcessor(mainnet.id),
    notionProcessor,
  ],
  postProcessors: [exchangeRates, dailyStats, processStatus('mainnet'), protocolProcessor],
  validators: [validate],
  fields: FIELDS_WITH_RECEIPTS_INFO,
})
export default processor

if (require.main === module) {
  run(processor).catch((error) => {
    throw error
  })
}
