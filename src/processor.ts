import {lookupArchive} from '@subsquid/archive-registry'
import {
    BlockHeader,
    DataHandlerContext,
    EvmBatchProcessor,
    EvmBatchProcessorFields,
    Log as _Log,
    Transaction as _Transaction,
} from '@subsquid/evm-processor'

import * as oeth from "./abi/oeth"

export const OETH_ADDRESS = "0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3"

export const processor = new EvmBatchProcessor()
    .setDataSource({
        // Change the Archive endpoints for run the squid
        // against the other EVM networks
        // For a full list of supported networks and config options
        // see https://docs.subsquid.io/evm-indexing/
        archive: lookupArchive('eth-mainnet'),

        // Must be set for RPC ingestion (https://docs.subsquid.io/evm-indexing/evm-processor/)
        // OR to enable contract state queries (https://docs.subsquid.io/evm-indexing/query-state/)
        chain: 'https://rpc.ankr.com/eth',
    })
    .setFinalityConfirmation(75)
    .setFields({
        transaction: {
            from: true,
            value: true,
            hash: true,
        },
    })
    .setBlockRange({
        from: 16933090, // https://etherscan.io/tx/0x3b4ece4f5fef04bf7ceaec4f6c6edf700540d7597589f8da0e3a8c94264a3b50
    })
    .addLog({
        address: [OETH_ADDRESS],
        topic0: [oeth.events.Transfer.topic],
    })
    .setFields({
        log: {
            transactionHash: true
        },
        transaction: {
            hash: true,
            gasUsed: true,
            gas: true,
            value: true,
        }
    })
    // .addTransaction({
    //     to: ['0x0000000000000000000000000000000000000000'],
    // })

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
