import { lookupArchive } from '@subsquid/archive-registry'
import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'

import { resetProcessorState } from './utils/state'

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
    chain: {
      url: process.env.RPC_ENDPOINT || 'http://localhost:8545',
      // Alchemy is deprecating `eth_getBlockReceipts` https://docs.alchemy.com/reference/eth-getblockreceipts
      // so we need to set `maxBatchCallSize` 1 to avoid using this method
      maxBatchCallSize: 1,
    },
  })
  .setFinalityConfirmation(10)
  .setFields({
    transaction: {
      from: true,
      to: true,
      hash: true,
      gasUsed: true,
      gas: true,
      value: true,
      sighash: true,
      input: true,
      status: true,
    },
    log: {
      transactionHash: true,
      topics: true,
      data: true,
    },
    trace: {
      callFrom: true,
      callTo: true,
      callSighash: true,
      callValue: true,
      callInput: true,
      createResultAddress: true,
      // action: true,
    },
  })

interface Processor {
  name?: string
  from?: number
  setup?: (p: typeof processor) => void
  process: (ctx: Context) => Promise<void>
}

export const run = ({
  processors,
  postProcessors = [],
}: {
  processors: Processor[]
  postProcessors: Processor[]
}) => {
  processor.setBlockRange({
    from: Math.min(
      ...(processors.map((p) => p.from).filter((x) => x) as number[]),
    ),
  })
  processors.forEach((p) => p.setup?.(processor))
  processor.run(
    new TypeormDatabase({ supportHotBlocks: true }),
    async (ctx) => {
      resetProcessorState()
      let start = Date.now()
      const time = (name: string) => () =>
        ctx.log.info(`${name} ${Date.now() - start}ms`)
      await Promise.all(
        processors.map((p, index) =>
          p.process(ctx).then(time(p.name ?? `processor-${index}`)),
        ),
      )
      start = Date.now()
      await Promise.all(
        postProcessors.map((p, index) =>
          p.process(ctx).then(time(p.name ?? `postProcessor-${index}`)),
        ),
      )
    },
  )
}

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Context = DataHandlerContext<Store, Fields>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
