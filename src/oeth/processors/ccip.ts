import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as ccipOffRampAbi from '../../abi/ccip-evm2evmofframp'
import * as ccipOnRampAbi from '../../abi/ccip-evm2evmonramp'
import * as ccipRouter from '../../abi/ccip-router'
import * as erc20Abi from '../../abi/erc20'
import { BridgeTransfer, BridgeTransferState } from '../../model'
import { Context } from '../../processor'
import { logFilter } from '../../utils/logFilter'

// Code Reference: https://github.com/smartcontractkit/smart-contract-examples/tree/main/ccip-offchain
// https://github.com/smartcontractkit/smart-contract-examples/blob/main/ccip-offchain/typescript/src/get-status.ts
// Detect state changes on the off-ramp:
//   - Arb off-ramp from Mainnet: 0x542ba1902044069330e8c5b36a84ec503863722f
//   - Mainnet off-ramp from Arb: 0xeFC4a18af59398FF23bfe7325F2401aD44286F4d
// These can be retrieved using the chain selector id on the router function `getOffRamps`
// States: https://github.com/smartcontractkit/smart-contract-examples/blob/main/ccip-offchain/config/messageState.json

interface ProcessResult {
  transfers: Map<string, BridgeTransfer>
  bridgeTransferStates: Map<string, BridgeTransferState>
}

const chainSelectorIdMappings: Record<string, number> = {
  '5009297550715157269': 1,
  '4949039107694359620': 42161,
}

const ccipConfig = {
  '1': {
    from: 19200000,
    chainSelectorId: '5009297550715157269',
    ccipRouterAddress: '0x80226fc0ee2b096224eeac085bb9a8cba1146f7d',
    tokenPoolAddress: '0xdca0a2341ed5438e06b9982243808a76b9add6d0',
    onRampAddress: '0x925228d7b82d883dde340a55fe8e6da56244a22c',
    offRampAddresses: {
      '42161': '0xefc4a18af59398ff23bfe7325f2401ad44286f4d',
    },
    tokens: ['0xdcee70654261af21c44c093c300ed3bb97b78192'],
    tokenMappings: {
      '0xdcee70654261af21c44c093c300ed3bb97b78192':
        '0xd8724322f44e5c58d7a815f542036fb17dbbf839', // wOETH
    } as Record<string, string>,
  },
  '42161': {
    from: 178662968,
    chainSelectorId: '4949039107694359620',
    ccipRouterAddress: '0x141fa059441e0ca23ce184b6a78bafd2a517dde8',
    tokenPoolAddress: '0x7765bdd506662543469c3a65938cae3a791aef33',
    onRampAddress: '0xce11020d56e5fdbfe46d9fc3021641ffbbb5adee',
    offRampAddresses: {
      '1': '0x542ba1902044069330e8c5b36a84ec503863722f',
    },
    tokens: ['0xd8724322f44e5c58d7a815f542036fb17dbbf839'],
    tokenMappings: {
      '0xd8724322f44e5c58d7a815f542036fb17dbbf839':
        '0xdcee70654261af21c44c093c300ed3bb97b78192', // wOETH
    } as Record<string, string>,
  },
}

export const ccip = (params: { chainId: 1 | 42161 }) => {
  const {
    from,
    tokens,
    tokenMappings,
    tokenPoolAddress,
    onRampAddress,
    offRampAddresses,
  } = ccipConfig[params.chainId]
  const transfersToLockReleasePool = logFilter({
    address: tokens,
    topic0: [erc20Abi.events.Transfer.topic],
    topic2: [tokenPoolAddress],
  })

  const ccipSendRequested = logFilter({
    address: [onRampAddress],
    topic0: [ccipOnRampAbi.events.CCIPSendRequested.topic],
    transaction: true,
  })

  const executionStateChanged = logFilter({
    address: Object.values(offRampAddresses),
    topic0: [ccipOffRampAbi.events.ExecutionStateChanged.topic],
  })

  const setup = (processor: EvmBatchProcessor) => {
    processor.addLog(executionStateChanged.value)
    processor.addLog(transfersToLockReleasePool.value)
    processor.addLog(ccipSendRequested.value)
  }

  const process = async (ctx: Context) => {
    const result: ProcessResult = {
      transfers: new Map<string, BridgeTransfer>(),
      bridgeTransferStates: new Map<string, BridgeTransferState>(),
    }

    for (const block of ctx.blocks) {
      for (const log of block.logs) {
        if (executionStateChanged.matches(log)) {
          const data = ccipOffRampAbi.events.ExecutionStateChanged.decode(log)
          const state = new BridgeTransferState({
            id: data.messageId,
            blockNumber: block.header.height,
            timestamp: new Date(block.header.timestamp),
            state: data.state,
          })
          result.bridgeTransferStates.set(state.id, state)
          // console.log(state)
        }
        if (transfersToLockReleasePool.matches(log)) {
          // console.log('match transfersToOnramp')
          const logSendRequested = block.logs.find(
            (l) =>
              log.transactionHash === l.transactionHash &&
              ccipSendRequested.matches(l),
          )
          if (logSendRequested) {
            // console.log('match ccipSendRequested')
            const data =
              ccipOnRampAbi.events.CCIPSendRequested.decode(logSendRequested)
            const message = data.message
            const decodedTxInput = ccipRouter.functions.ccipSend.decode(
              logSendRequested.transaction!.input,
            )

            for (const tokenAmount of message.tokenAmounts) {
              const transfer = new BridgeTransfer({
                id: `${params.chainId}-${log.id}`,
                blockNumber: block.header.height,
                timestamp: new Date(block.header.timestamp),
                txHash: log.transactionHash,
                messageId: message.messageId,
                bridge: 'ccip',
                chainIn: params.chainId,
                chainOut:
                  chainSelectorIdMappings[
                    decodedTxInput.destinationChainSelector.toString()
                  ],
                tokenIn: tokenAmount.token.toLowerCase(),
                tokenOut: tokenMappings[tokenAmount.token.toLowerCase()],
                amountIn: tokenAmount.amount,
                amountOut: tokenAmount.amount,
                sender: message.sender.toLowerCase(),
                receiver: message.receiver.toLowerCase(),
              })
              // console.log(transfer)
              result.transfers.set(transfer.id, transfer)
            }
          }
        }
      }
    }

    await ctx.store.insert([...result.transfers.values()])
    await ctx.store.upsert([...result.bridgeTransferStates.values()])
  }

  return { from, setup, process }
}
