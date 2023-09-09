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
import * as veogv from './abi/veogv';
import * as governance from './abi/governance';
import { GOVERNANCE_ADDRESS, OETH_ADDRESS, VEOGV_ADDRESS } from './addresses';
import { START_OF_OUSD_GOVERNANCE } from './constants';

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
      hash: true,
      gasUsed: true,
      gas: true,
      value: true,
    },
    log: {
      transactionHash: true,
      topics: true,
      data: true,
    },
  })
  .setBlockRange({
    from: START_OF_OUSD_GOVERNANCE,
  })
  .addLog({
    address: [OETH_ADDRESS],
    topic0: [
      oeth.events.Transfer.topic,
      oeth.events.TotalSupplyUpdatedHighres.topic,
    ],
    transaction: true,
  })
  .addLog({
    address: [VEOGV_ADDRESS],
    topic0: Object.values(veogv.events).map(x => x.topic),
    transaction: true
  })
  .addLog({
    address: [GOVERNANCE_ADDRESS],
    topic0: Object.values(governance.events).map(x => x.topic),
    transaction: true
  });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Context = DataHandlerContext<Store, Fields>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
