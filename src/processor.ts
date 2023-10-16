import { lookupArchive } from '@subsquid/archive-registry'
import {
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
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
  initialize?: (ctx: Context) => Promise<void> // To only be run once per `sqd process`.
  setup?: (p: typeof processor) => void
  process: (ctx: Context) => Promise<void>
}

let initialized = false

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
      try {
        resetProcessorState()
        let start: number
        const time = (name: string) => () => {
          const message = `${name} ${Date.now() - start}ms`
          return () => ctx.log.info(message)
        }

        // Initialization Run
        if (!initialized) {
          ctx.log.info(`=== initializing`)
          start = Date.now()
          const times = await Promise.all(
            processors
              .filter((p) => p.initialize)
              .map((p, index) =>
                p.initialize!(ctx).then(
                  time(p.name ?? `initializing processor-${index}`),
                ),
              ),
          )
          times.forEach((t) => t())
        }

        // Main Processing Run
        ctx.log.info(`=== processing from ${ctx.blocks[0].header.height}`)
        start = Date.now()
        const times = await Promise.all(
          processors.map((p, index) =>
            p.process(ctx).then(time(p.name ?? `processor-${index}`)),
          ),
        )
        times.forEach((t) => t())

        // Post Processing Run
        start = Date.now()
        const postTimes = await Promise.all(
          postProcessors.map((p, index) =>
            p.process(ctx).then(time(p.name ?? `postProcessor-${index}`)),
          ),
        )
        postTimes.forEach((t) => t())
      } catch (err) {
        ctx.log.info({
          blocks: ctx.blocks.length,
          logs: ctx.blocks.reduce((sum, block) => sum + block.logs.length, 0),
          traces: ctx.blocks.reduce(
            (sum, block) => sum + block.traces.length,
            0,
          ),
          transactions: ctx.blocks.reduce(
            (sum, block) => sum + block.transactions.length,
            0,
          ),
          logArray: ctx.blocks.reduce(
            (logs, block) => [...logs, ...block.logs],
            [] as Log[],
          ),
        })
        throw err
      }
    },
  )
}

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Context = DataHandlerContext<Store, Fields>
export type Block = Context['blocks']['0']
export type Log = Context['blocks']['0']['logs']['0']
export type Transaction = Context['blocks']['0']['transactions']['0']
export type Trace = Context['blocks']['0']['traces']['0']
