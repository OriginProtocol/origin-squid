import assert from 'assert'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import { Chain } from 'viem'
import { arbitrum, mainnet } from 'viem/chains'

import { lookupArchive } from '@subsquid/archive-registry'
import { KnownArchives } from '@subsquid/archive-registry/lib/chains'
import {
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
} from '@subsquid/evm-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { calculateBlockRate } from '@utils/calculateBlockRate'

dayjs.extend(duration)
dayjs.extend(utc)

export const createSquidProcessor = (
  archive: KnownArchives = 'eth-mainnet',
  rpc_env = process.env.RPC_ENV ?? 'RPC_ENDPOINT',
) => {
  const url = process.env[rpc_env] || 'http://localhost:8545'
  console.log(`RPC URL: ${url}`)
  return new EvmBatchProcessor()
    .setGateway(lookupArchive(archive))
    .setRpcEndpoint({
      url,
      maxBatchCallSize: url.includes('alchemy.com') ? 1 : 10,
    })
    .setRpcDataIngestionSettings({
      disabled: process.env.ARCHIVE_ONLY === 'true',
      headPollInterval: 30000,
    })
    .setFinalityConfirmation(10)
    .setFields({
      transaction: {
        // from: true,
        to: true,
        hash: true,
        // gasUsed: true,
        // gas: true,
        // value: true,
        // sighash: true,
        input: true,
        // status: true,
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
      },
    })
}

interface Processor {
  name?: string
  from?: number
  initialize?: (ctx: Context) => Promise<void> // To only be run once per `sqd process`.
  setup?: (p: ReturnType<typeof createSquidProcessor>, chain: Chain) => void
  process: (ctx: Context) => Promise<void>
}

let initialized = false

const chainConfigs: Record<
  number,
  { chain: Chain; archive: KnownArchives; rpcEnv: string } | undefined
> = {
  [mainnet.id]: {
    chain: mainnet,
    archive: 'eth-mainnet',
    rpcEnv: process.env.RPC_ENV ?? 'RPC_ENDPOINT',
  },
  [arbitrum.id]: {
    chain: arbitrum,
    archive: 'arbitrum',
    rpcEnv: process.env.RPC_ARBITRUM_ENV ?? 'RPC_ARBITRUM_ENDPOINT',
  },
}

export const run = ({
  chainId = 1,
  stateSchema,
  processors,
  postProcessors,
  validators,
}: {
  chainId?: number
  stateSchema?: string
  processors: Processor[]
  postProcessors?: Processor[]
  validators?: Pick<Processor, 'process' | 'name'>[]
}) => {
  assert(
    !processors.find((p) => p.from === undefined),
    'All processors must have a `from` defined',
  )

  const config = chainConfigs[chainId]
  if (!config) throw new Error('No chain configuration found.')
  const processor = createSquidProcessor(config.archive, config.rpcEnv)

  processor.setBlockRange({
    from: process.env.BLOCK_FROM
      ? Number(process.env.BLOCK_FROM)
      : Math.min(
          ...(processors.map((p) => p.from).filter((x) => x) as number[]),
          ...((postProcessors ?? [])
            .map((p) => p.from)
            .filter((x) => x) as number[]),
        ),
    to: process.env.BLOCK_TO ? Number(process.env.BLOCK_TO) : undefined,
  })
  processors.forEach((p) => p.setup?.(processor, config.chain))
  postProcessors?.forEach((p) => p.setup?.(processor, config.chain))
  processor.run(
    new TypeormDatabase({
      stateSchema,
      supportHotBlocks: true,
      isolationLevel: 'READ COMMITTED',
    }),
    async (_ctx) => {
      const ctx = _ctx as Context
      try {
        ctx.chain = config.chain
        ctx.__state = new Map<string, unknown>()
        if (ctx.blocks.length >= 1) {
          ctx.blockRate = await calculateBlockRate(ctx)
          // ctx.log.info({ bps: ctx.bps, length: ctx.blocks.length })
        }

        let start: number
        const time = (name: string) => () => {
          const message = `${name} ${Date.now() - start}ms`
          return () => ctx.log.info(message)
        }

        // Initialization Run
        if (!initialized) {
          initialized = true
          ctx.log.info(`initializing`)
          start = Date.now()
          const times = await Promise.all([
            ...processors
              .filter((p) => p.initialize)
              .map((p, index) =>
                p.initialize!(ctx).then(
                  time(p.name ?? `initializing processor-${index}`),
                ),
              ),
            ...(postProcessors ?? [])
              .filter((p) => p.initialize)
              .map((p, index) =>
                p.initialize!(ctx).then(
                  time(p.name ?? `initializing postProcessors-${index}`),
                ),
              ),
          ])
          times.forEach((t) => t())
        }

        // Main Processing Run
        start = Date.now()
        const times = await Promise.all(
          processors.map((p, index) =>
            p.process(ctx).then(time(p.name ?? `processor-${index}`)),
          ),
        )
        if (process.env.DEBUG_PERF === 'true') {
          times.forEach((t) => t())
        }

        if (postProcessors) {
          // Post Processing Run
          start = Date.now()
          const postTimes = await Promise.all(
            postProcessors.map((p, index) =>
              p.process(ctx).then(time(p.name ?? `postProcessor-${index}`)),
            ),
          )
          if (process.env.DEBUG_PERF === 'true') {
            postTimes.forEach((t) => t())
          }
        }

        if (validators) {
          // Validation Run
          start = Date.now()
          const validatorTimes = await Promise.all(
            validators.map((p, index) =>
              p.process(ctx).then(time(p.name ?? `validator-${index}`)),
            ),
          )
          if (process.env.DEBUG_PERF === 'true') {
            validatorTimes.forEach((t) => t())
          }
        }
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
          // logArray: ctx.blocks.reduce(
          //   (logs, block) => [...logs, ...block.logs],
          //   [] as Log[],
          // ),
        })
        throw err
      }
    },
  )
}

export type Fields = EvmBatchProcessorFields<
  ReturnType<typeof createSquidProcessor>
>
export type Context = DataHandlerContext<Store, Fields> & {
  chain: Chain
  blockRate: number
  __state: Map<string, unknown>
}
export type Block = Context['blocks']['0']
export type Log = Context['blocks']['0']['logs']['0']
export type Transaction = Context['blocks']['0']['transactions']['0']
export type Trace = Context['blocks']['0']['traces']['0']
