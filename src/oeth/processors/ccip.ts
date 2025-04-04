import * as ccipOffRampAbi from '@abi/ccip-evm2evmofframp'
import * as ccipOnRampAbi from '@abi/ccip-evm2evmonramp'
import * as ccipRouter from '@abi/ccip-router'
import * as erc20Abi from '@abi/erc20'
import { BridgeTransfer, BridgeTransferState } from '@model'
import { Block, Context, Log, logFilter, publishProcessorState } from '@originprotocol/squid-utils'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { WOETH_ADDRESS, WOETH_ARBITRUM_ADDRESS } from '@utils/addresses'
import { traceFilter } from '@utils/traceFilter'

// Code Reference: https://github.com/smartcontractkit/smart-contract-examples/tree/main/ccip-offchain
// https://github.com/smartcontractkit/smart-contract-examples/blob/main/ccip-offchain/typescript/src/get-status.ts
// Detect state changes on the off-ramp:
//   - Arb off-ramp from Mainnet: 0x542ba1902044069330e8c5b36a84ec503863722f
//   - Mainnet off-ramp from Arb: 0xeFC4a18af59398FF23bfe7325F2401aD44286F4d
// These can be retrieved using the chain selector id on the router function `getOffRamps`
// States: https://github.com/smartcontractkit/smart-contract-examples/blob/main/ccip-offchain/config/messageState.json

export interface CCIPProcessorResult {
  transfers: Map<string, BridgeTransfer>
  transfersWithLogs: Map<string, { block: Block; log: Log; transfer: BridgeTransfer }>
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
    tokens: [WOETH_ADDRESS],
    tokenMappings: {
      [WOETH_ADDRESS]: WOETH_ARBITRUM_ADDRESS,
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
    tokens: [WOETH_ARBITRUM_ADDRESS],
    tokenMappings: {
      [WOETH_ARBITRUM_ADDRESS]: WOETH_ADDRESS,
    } as Record<string, string>,
  },
}

export const ccip = (params: { chainId: 1 | 42161 }) => {
  const { from, tokens, tokenMappings, tokenPoolAddress, ccipRouterAddress, onRampAddress, offRampAddresses } =
    ccipConfig[params.chainId]
  const transfersToLockReleasePool = logFilter({
    address: tokens,
    topic0: [erc20Abi.events.Transfer.topic],
    topic2: [tokenPoolAddress],
    range: { from },
  })

  const ccipSendRequested = logFilter({
    address: [onRampAddress],
    topic0: [ccipOnRampAbi.events.CCIPSendRequested.topic],
    transaction: true,
    transactionTraces: true,
  })

  const executionStateChanged = logFilter({
    address: Object.values(offRampAddresses),
    topic0: [ccipOffRampAbi.events.ExecutionStateChanged.topic],
    range: { from },
  })

  const ccipSendFunction = traceFilter({
    callTo: [ccipRouterAddress],
    type: ['call'],
    callSighash: [ccipRouter.functions.ccipSend.selector],
    range: { from },
    transaction: true,
  })

  const setup = (processor: EvmBatchProcessor) => {
    processor.addLog(executionStateChanged.value)
    processor.addLog(transfersToLockReleasePool.value)
    processor.addLog(ccipSendRequested.value)
  }

  const process = async (ctx: Context) => {
    const result: CCIPProcessorResult = {
      transfers: new Map<string, BridgeTransfer>(),
      transfersWithLogs: new Map<string, { block: Block; log: Log; transfer: BridgeTransfer }>(),
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
            txHash: log.transactionHash,
            state: data.state,
          })
          result.bridgeTransferStates.set(state.id, state)

          // A `BridgeTransfer` may already exist. If so, we should update it.
          const bridgeTransfer = await ctx.store.findOneBy(BridgeTransfer, {
            messageId: data.messageId,
          })
          if (bridgeTransfer) {
            bridgeTransfer.txHashOut = log.transactionHash
            bridgeTransfer.state = data.state
            result.transfers.set(state.id, bridgeTransfer)
            result.transfersWithLogs.set(state.id, { block, log, transfer: bridgeTransfer })
          }
          // console.log(state)
        }
        if (transfersToLockReleasePool.matches(log)) {
          // console.log('match transfersToOnramp')
          const logSendRequested = block.logs.find(
            (l) => log.transactionHash === l.transactionHash && ccipSendRequested.matches(l),
          )
          const traceSendRequested = block.traces.find(
            (t) => log.transactionHash === t.transaction?.hash && ccipSendFunction.matches(t),
          )
          if (logSendRequested && traceSendRequested && traceSendRequested.type === 'call') {
            // console.log('match ccipSendRequested')
            const logData = ccipOnRampAbi.events.CCIPSendRequested.decode(logSendRequested)
            const message = logData.message
            const functionData = ccipRouter.functions.ccipSend.decode(traceSendRequested.action.input)
            // A `BridgeTransferState` may already exist.
            //  If so, we should pull the `state` for it.
            const bridgeTransferState = await ctx.store.get(BridgeTransferState, message.messageId)

            for (let i = 0; i < message.tokenAmounts.length; i++) {
              const tokenAmount = message.tokenAmounts[i]
              const transfer = new BridgeTransfer({
                id: `${message.messageId}-${i}`,
                blockNumber: block.header.height,
                timestamp: new Date(block.header.timestamp),
                txHashIn: log.transactionHash,
                txHashOut: null,
                messageId: message.messageId,
                bridge: 'ccip',
                chainIn: params.chainId,
                chainOut: chainSelectorIdMappings[functionData.destinationChainSelector.toString()],
                tokenIn: tokenAmount.token.toLowerCase(),
                tokenOut: tokenMappings[tokenAmount.token.toLowerCase()],
                amountIn: tokenAmount.amount,
                amountOut: tokenAmount.amount,
                transactor: log.transaction!.from.toLowerCase(),
                sender: message.sender.toLowerCase(),
                receiver: message.receiver.toLowerCase(),
                state: bridgeTransferState?.state ?? 0,
              })
              // console.log(transfer)
              result.transfers.set(transfer.id, transfer)
              result.transfersWithLogs.set(transfer.id, { block, log, transfer })
            }
          }
        }
      }
    }

    publishProcessorState<CCIPProcessorResult>(ctx, 'ccip', result)
    await ctx.store.upsert([...result.transfers.values()])
    await ctx.store.upsert([...result.bridgeTransferStates.values()])
  }

  return { name: `ccip-${params.chainId}`, from, setup, process }
}
