import { lookupArchive } from '@subsquid/archive-registry';
import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';

import * as oeth from './abi/oeth';

export const OETH_ADDRESS =
  '0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3'.toLocaleLowerCase();

export const processor = new EvmBatchProcessor()
  .setDataSource({
    // Change the Archive endpoints for run the squid
    // against the other EVM networks
    // For a full list of supported networks and config options
    // see https://docs.subsquid.io/evm-indexing/
    archive: lookupArchive('eth-mainnet'),

    // Must be set for RPC ingestion (https://docs.subsquid.io/evm-indexing/evm-processor/)
    // OR to enable contract state queries (https://docs.subsquid.io/evm-indexing/query-state/)
    // chain: 'https://rpc.ankr.com/eth',
    // chain: "https://mainnet.infura.io/v3/03b96dfbb4904c5c89c04680dd480064",
    chain: process.env.RPC_ENDPOINT || 'http://localhost:8545',
  })
  .setFinalityConfirmation(10)
  .setFields({
    transaction: {
      from: true,
      value: true,
      hash: true,
    },
    log: {
      topics: true,
      data: true,
    },
  })
  .setBlockRange({
    from: 16933090, // https://etherscan.io/tx/0x3b4ece4f5fef04bf7ceaec4f6c6edf700540d7597589f8da0e3a8c94264a3b50
  })
  .setFields({
    log: {
      transactionHash: true,
    },
    transaction: {
      hash: true,
      gasUsed: true,
      gas: true,
      value: true,
    },
  })
  .addLog({
    address: [OETH_ADDRESS],
    topic0: [
      oeth.events.Transfer.topic,
      oeth.events.TotalSupplyUpdatedHighres.topic,
    ],
    transaction: true,
  });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Context = DataHandlerContext<Store, Fields>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
