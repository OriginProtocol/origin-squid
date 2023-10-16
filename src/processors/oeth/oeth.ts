import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as otoken from '../../abi/otoken'
import * as otokenVault from '../../abi/otoken-vault'
import {
  HistoryType,
  OETH,
  OETHAPY,
  OETHAddress,
  OETHHistory,
  OETHRebase,
  OETHRebaseOption,
} from '../../model'
import { createOTokenProcessor } from '../../processor-templates/otoken'
import { OETH_ADDRESS, OETH_VAULT_ADDRESS } from '../../utils/addresses'

export const from = 16933090 // https://etherscan.io/tx/0x3b4ece4f5fef04bf7ceaec4f6c6edf700540d7597589f8da0e3a8c94264a3b50

export const setup = (processor: EvmBatchProcessor) => {
  processor.addTrace({
    type: ['call'],
    callSighash: [
      otoken.functions.rebaseOptOut.sighash,
      otoken.functions.rebaseOptIn.sighash,
    ],
    transaction: true,
    range: { from },
  })
  processor.addLog({
    address: [OETH_ADDRESS],
    topic0: [
      otoken.events.Transfer.topic,
      otoken.events.TotalSupplyUpdatedHighres.topic,
    ],
    transaction: true,
    range: { from },
  })
  processor.addLog({
    address: [OETH_VAULT_ADDRESS],
    topic0: [otokenVault.events.YieldDistribution.topic],
    range: { from },
  })
}

export const process = createOTokenProcessor({
  OTOKEN_ADDRESS: OETH_ADDRESS,
  OTOKEN_VAULT_ADDRESS: OETH_VAULT_ADDRESS,
  OToken: OETH,
  OTokenAddress: OETHAddress,
  OTokenHistory: OETHHistory,
  OTokenAPY: OETHAPY,
  OTokenRebase: OETHRebase,
  OTokenRebaseOption: OETHRebaseOption,
})
