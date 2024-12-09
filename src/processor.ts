import assert from 'assert'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import { compact } from 'lodash'
import { Chain } from 'viem'
import { arbitrum, base, mainnet } from 'viem/chains'

import { KnownArchivesEVM, lookupArchive } from '@subsquid/archive-registry'
import { DataHandlerContext, EvmBatchProcessor, EvmBatchProcessorFields } from '@subsquid/evm-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { calculateBlockRate } from '@utils/calculateBlockRate'

import './rpc-issues'

dayjs.extend(duration)
dayjs.extend(utc)

export const createEvmBatchProcessor = (config: ChainConfig) => {
  const url = config.endpoints[0] || 'http://localhost:8545'
  console.log('rpc url', url)
  const processor = new EvmBatchProcessor()
    .setRpcEndpoint({
      url,
      maxBatchCallSize: url.includes('alchemy.com') ? 1 : 100,
    })
    .setRpcDataIngestionSettings({
      disabled: process.env.ARCHIVE_ONLY === 'true',
      headPollInterval: 5000,
    })
    .setFinalityConfirmation(10)
    .setFields({
      transaction: {
        from: true,
        to: true,
        hash: true,
        gasUsed: true,
        effectiveGasPrice: true,
        // gas: true,
        // gasPrice: true,
        // value: true,
        // sighash: true,
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
      },
    })

  if (process.env.DISABLE_ARCHIVE !== 'true') {
    console.log(`Archive: ${config.archive}`)
    processor.setGateway(lookupArchive(config.archive))
  } else {
    console.log(`Archive disabled`)
  }

  return processor
}

export interface SquidProcessor {
  chainId?: 1 | 42161 | 8453
  stateSchema?: string
  processors: Processor[]
  postProcessors?: Processor[]
  validators?: Pick<Processor, 'process' | 'name'>[]
}

export interface Processor {
  name?: string
  from?: number
  initialize?: (ctx: Context) => Promise<void> // To only be run once per `sqd process`.
  setup?: (p: ReturnType<typeof createEvmBatchProcessor>, chain?: Chain) => void
  process: (ctx: Context) => Promise<void>
}

export const defineSquidProcessor = (p: SquidProcessor) => p
export const defineProcessor = (p: Processor) => p

let initialized = false

export interface ChainConfig {
  chain: Chain
  archive: KnownArchivesEVM
  endpoints: string[]
}

export const chainConfigs = {
  [mainnet.id]: {
    chain: mainnet,
    archive: 'eth-mainnet',
    endpoints: compact([
      process.env[process.env.RPC_ENV ?? 'RPC_ENDPOINT'],
      process.env[process.env.RPC_ENV_BACKUP ?? 'RPC_ETH_HTTP'],
    ]),
  },
  [arbitrum.id]: {
    chain: arbitrum,
    archive: 'arbitrum',
    endpoints: compact([
      process.env[process.env.RPC_ARBITRUM_ENV ?? 'RPC_ARBITRUM_ENDPOINT'],
      process.env[process.env.RPC_ARBITRUM_ENV_BACKUP ?? 'RPC_ARBITRUM_ONE_HTTP'],
    ]),
  },
  [base.id]: {
    chain: base,
    archive: 'base-mainnet',
    endpoints: compact([
      process.env[process.env.RPC_BASE_ENV ?? 'RPC_BASE_ENDPOINT'],
      process.env[process.env.RPC_BASE_ENV_BACKUP ?? 'RPC_BASE_HTTP'],
    ]),
  },
} as const

export const run = ({ chainId = 1, stateSchema, processors, postProcessors, validators }: SquidProcessor) => {
  assert(!processors.find((p) => p.from === undefined), 'All processors must have a `from` defined')

  if (process.env.PROCESSOR) {
    processors = processors.filter((p) => p.name?.includes(process.env.PROCESSOR!))
  }

  console.log('Processors:\n  - ', processors.map((p) => p.name).join('\n  - '))

  const config = chainConfigs[chainId]
  if (!config) throw new Error('No chain configuration found.')
  // console.log('env', JSON.stringify(process.env, null, 2))
  // console.log('config', JSON.stringify(config, null, 2))
  const evmBatchProcessor = createEvmBatchProcessor(config)

  evmBatchProcessor.setBlockRange({
    from: process.env.BLOCK_FROM
      ? Number(process.env.BLOCK_FROM)
      : Math.min(
          ...(processors.map((p) => p.from).filter((x) => x) as number[]),
          ...((postProcessors ?? []).map((p) => p.from).filter((x) => x) as number[]),
        ),
    to: process.env.BLOCK_TO ? Number(process.env.BLOCK_TO) : undefined,
  })
  processors.forEach((p) => p.setup?.(evmBatchProcessor, config.chain))
  postProcessors?.forEach((p) => p.setup?.(evmBatchProcessor, config.chain))
  evmBatchProcessor.run(
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
              .map((p, index) => p.initialize!(ctx).then(time(p.name ?? `initializing processor-${index}`))),
            ...(postProcessors ?? [])
              .filter((p) => p.initialize)
              .map((p, index) => p.initialize!(ctx).then(time(p.name ?? `initializing postProcessors-${index}`))),
          ])
          times.forEach((t) => t())
        }

        // Main Processing Run
        start = Date.now()
        const times = await Promise.all(
          processors.map((p, index) => p.process(ctx).then(time(p.name ?? `processor-${index}`))),
        )
        if (process.env.DEBUG_PERF === 'true') {
          times.forEach((t) => t())
        }

        if (postProcessors) {
          // Post Processing Run
          start = Date.now()
          const postTimes = await Promise.all(
            postProcessors.map((p, index) => p.process(ctx).then(time(p.name ?? `postProcessor-${index}`))),
          )
          if (process.env.DEBUG_PERF === 'true') {
            postTimes.forEach((t) => t())
          }
        }

        if (validators) {
          // Validation Run
          start = Date.now()
          const validatorTimes = await Promise.all(
            validators.map((p, index) => p.process(ctx).then(time(p.name ?? `validator-${index}`))),
          )
          if (process.env.DEBUG_PERF === 'true') {
            validatorTimes.forEach((t) => t())
          }
        }
      } catch (err) {
        ctx.log.info({
          blocks: ctx.blocks.length,
          logs: ctx.blocks.reduce((sum, block) => sum + block.logs.length, 0),
          traces: ctx.blocks.reduce((sum, block) => sum + block.traces.length, 0),
          transactions: ctx.blocks.reduce((sum, block) => sum + block.transactions.length, 0),
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

export type Fields = EvmBatchProcessorFields<ReturnType<typeof createEvmBatchProcessor>>
export type Context = DataHandlerContext<Store, Fields> & {
  chain: Chain
  blockRate: number
  __state: Map<string, unknown>
}
export type Block = Context['blocks']['0']
export type Log = Context['blocks']['0']['logs']['0']
export type Transaction = Context['blocks']['0']['transactions']['0']
export type Trace = Context['blocks']['0']['traces']['0']
