import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as otoken from '../../abi/otoken'
import * as otokenVault from '../../abi/otoken-vault'
import {
  OUSD,
  OUSDAPY,
  OUSDAddress,
  OUSDHistory,
  OUSDRebase,
  OUSDRebaseOption,
} from '../../model'
import { createOTokenProcessor } from '../../processor-templates/otoken'
import { OUSD_ADDRESS, OUSD_VAULT_ADDRESS } from '../../utils/addresses'

// V1 which we aren't coded for yet.
// export const from = 10884563 // https://etherscan.io/tx/0x9141921f5ebf072e58c00fe56332b6bee0c02f0ae4f54c42999b8a3a88662681

// Current version which we work with.
export const from = 13533937 // https://etherscan.io/tx/0xc9b6fc6a4fad18dad197ff7d0636f74bf066671d75656849a1c45122e00d54cf

export const setup = (processor: EvmBatchProcessor) => {
  processor.addTrace({
    type: ['call'],
    callSighash: [
      otoken.functions.rebaseOptOut.sighash,
      otoken.functions.rebaseOptIn.sighash,
    ],
    transaction: true,
  })
  processor.addLog({
    address: [OUSD_ADDRESS],
    topic0: [
      otoken.events.Transfer.topic,
      otoken.events.TotalSupplyUpdatedHighres.topic,
    ],
    transaction: true,
  })
  processor.addLog({
    address: [OUSD_VAULT_ADDRESS],
    topic0: [otokenVault.events.YieldDistribution.topic],
  })
}

// TODO: Handle the version upgrade gracefully so we have accurate numbers.

export const process = createOTokenProcessor({
  OTOKEN_ADDRESS: OUSD_ADDRESS,
  OTOKEN_VAULT_ADDRESS: OUSD_VAULT_ADDRESS,
  OToken: OUSD,
  OTokenAddress: OUSDAddress,
  OTokenHistory: OUSDHistory,
  OTokenAPY: OUSDAPY,
  OTokenRebase: OUSDRebase,
  OTokenRebaseOption: OUSDRebaseOption,
})
