import crypto from 'crypto'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { pick } from 'lodash'
import { getAddress } from 'viem'

import * as proxyAbi from '@abi/governed-upgradeability-proxy'
import * as otokenAbi from '@abi/otoken'
import * as otokenAbi20241221 from '@abi/otoken-2024-12-21'
import * as otokenHarvester from '@abi/otoken-base-harvester'
import { OTokenAsset, OTokenRawData } from '@model'
import { Block, Context, defineProcessor, env, logFilter, multicall, traceFilter } from '@originprotocol/squid-utils'
import { CurrencyAddress, CurrencySymbol } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { EvmBatchProcessor, Trace } from '@subsquid/evm-processor'
import { bigintJsonParse, bigintJsonStringify } from '@utils/bigintJson'

import { areContracts, loadIsContractCache, saveIsContractCache } from '../../utils/isContract'
import { OTokenContractAddress } from './otoken'
import { OToken_2023_12_21 } from './otoken-2023-12-21'
import { OToken_2025_03_04 } from './otoken-2025-03-04'
import { OTokenEntityProducer } from './otoken-entity-producer'
import { otokenFrequencyProcessor } from './otoken-frequency'

const DEBUG_PERF = process.env.DEBUG_PERF === 'true'

// Performance tracking
interface PerformanceStats {
  totalTime: number
  calls: number
  lastStart?: number
}

const performanceStats = new Map<string, PerformanceStats>()

// TODO: Remove later
const startSection = (section: string) => {
  if (!DEBUG_PERF) return
  const stats = performanceStats.get(section) || { totalTime: 0, calls: 0 }
  stats.lastStart = performance.now()
  performanceStats.set(section, stats)
}

const endSection = (section: string) => {
  if (!DEBUG_PERF) return
  const stats = performanceStats.get(section)
  if (!stats || typeof stats.lastStart !== 'number') return

  const duration = performance.now() - stats.lastStart
  stats.totalTime += duration
  stats.calls += 1
  delete stats.lastStart
}

const logPerformanceStats = () => {
  if (!DEBUG_PERF) return
  let totalTime = 0
  for (const [_, stats] of performanceStats) {
    totalTime += stats.totalTime
  }

  console.log('\nPerformance Statistics:')
  console.log('=======================')
  const sortedStats = [...performanceStats.entries()].sort((a, b) => b[1].totalTime - a[1].totalTime)

  for (const [section, stats] of sortedStats) {
    const percentage = ((stats.totalTime / totalTime) * 100).toFixed(2)
    const avgTime = (stats.totalTime / stats.calls).toFixed(2)
    console.log(`${section}: ${stats.totalTime.toFixed(2)}ms (${percentage}%) ${stats.calls}x ${avgTime}ms avg`)
  }
  console.log('=======================\n')
}

export const createOTokenProcessor2 = (params: {
  name: string
  symbol: string
  from: number
  vaultFrom: number
  fee: bigint // out of 100
  Upgrade_CreditsBalanceOfHighRes?: number
  otokenAddress: OTokenContractAddress
  wotoken?: {
    address: string
    from: number
  }
  dripper?: {
    address: string
    from: number
    token: string
    perSecondStartingBlock?: number
  }
  harvester?: {
    address: string
    from: number
    yieldSent: boolean
  }
  otokenVaultAddress: string
  redemptionAsset?: { asset: CurrencyAddress; symbol: CurrencySymbol }
  oTokenAssets: { asset: CurrencyAddress; symbol: CurrencySymbol }[]
  getAmoSupply: (ctx: Context, height: number) => Promise<bigint>
  upgrades?: {
    rebaseOptEvents: number | false
  }
  accountsOverThresholdMinimum: bigint
  feeOverride?: bigint // out of 100
}) => {
  const { otokenAddress, from } = params

  const frequencyUpdater = otokenFrequencyProcessor(params)

  // Create trace filter for rebase opt events
  const generalTraceParams = {
    transaction: true,
    parents: true,
    range: { from },
  }
  // Proxy
  const proxyInitializeTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [proxyAbi.functions.initialize.selector],
    ...generalTraceParams,
  })
  const proxyUpgradeToTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [proxyAbi.functions.upgradeTo.selector],
    ...generalTraceParams,
  })
  const proxyUpgradeToAndCallTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [proxyAbi.functions.upgradeToAndCall.selector],
    ...generalTraceParams,
  })
  // Implementation
  const initializeTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.initialize.selector],
    ...generalTraceParams,
  })
  const initialize20241221TraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi20241221.functions.initialize.selector],
    ...generalTraceParams,
  })
  const rebaseOptInTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.rebaseOptIn.selector],
    ...generalTraceParams,
  })
  const rebaseOptOutTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.rebaseOptOut.selector],
    ...generalTraceParams,
  })
  const governanceRebaseOptInTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.governanceRebaseOptIn.selector],
    ...generalTraceParams,
  })
  const mintTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.mint.selector],
    ...generalTraceParams,
  })
  const burnTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.burn.selector],
    ...generalTraceParams,
  })
  const transferTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.transfer.selector],
    ...generalTraceParams,
  })
  const transferFromTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.transferFrom.selector],
    ...generalTraceParams,
  })
  const approveTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.approve.selector],
    ...generalTraceParams,
  })
  const increaseAllowanceTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi20241221.functions.increaseAllowance.selector],
    ...generalTraceParams,
  })
  const decreaseAllowanceTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi20241221.functions.decreaseAllowance.selector],
    ...generalTraceParams,
  })
  const changeSupplyTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.changeSupply.selector],
    ...generalTraceParams,
  })
  const delegateYieldTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.delegateYield.selector],
    ...generalTraceParams,
  })
  const undelegateYieldTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.undelegateYield.selector],
    ...generalTraceParams,
  })
  const transferGovernanceTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.transferGovernance.selector],
    ...generalTraceParams,
  })
  const claimGovernanceTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.claimGovernance.selector],
    ...generalTraceParams,
  })
  const harvesterYieldSentFilter = params.harvester?.yieldSent
    ? logFilter({
        address: [params.harvester.address],
        topic0: [otokenHarvester.events.YieldSent.topic],
        range: { from: params.harvester.from },
      })
    : undefined

  let otoken: OToken_2025_03_04 | OToken_2023_12_21
  let producer: OTokenEntityProducer
  let hasUpgraded = false

  return defineProcessor({
    name: `otoken2-${otokenAddress}`,
    from,
    setup: (processor: EvmBatchProcessor) => {
      // Proxy
      processor.addTrace(proxyInitializeTraceFilter.value)
      processor.addTrace(proxyUpgradeToTraceFilter.value)
      processor.addTrace(proxyUpgradeToAndCallTraceFilter.value)

      // Implementation Related
      // We want to receive all trace calls to the otoken contract
      // processor.addLog({
      //   address: [otokenAddress],
      //   transaction: true,
      //   range: { from },
      // })

      // Monkeypatch Hack
      const originalAddTrace = processor.addTrace
      function modifiedMapRequest<T extends { range?: { from: number } }>(options: T): Omit<T, 'range'> {
        let { range, ...req } = options
        for (let key in req) {
          let val = (req as any)[key]
          if (Array.isArray(val)) {
            ;(req as any)[key] = val.map((s) => {
              return typeof s == 'string' ? s : s
            })
          }
        }
        return req
      }
      processor.addTrace = function (options: Parameters<typeof originalAddTrace>[0]): EvmBatchProcessor {
        const privateThis: any = this
        privateThis.assertNotRunning()
        privateThis.add(
          {
            traces: [modifiedMapRequest(options)],
          },
          options.range,
        )
        return this
      }

      processor.addTrace({
        type: ['call'],
        callTo: [otokenAddress, getAddress(otokenAddress)],
        ...generalTraceParams,
      })

      // Event
      if (harvesterYieldSentFilter) {
        processor.addLog(harvesterYieldSentFilter.value)
      }

      // For the frequency updater
      processor.includeAllBlocks({ from })
    },
    initialize: async (ctx: Context) => {
      const assetsCount = await ctx.store.count(OTokenAsset, {
        where: { chainId: ctx.chain.id, otoken: params.otokenAddress },
      })
      if (assetsCount === 0) {
        await ctx.store.insert(
          params.oTokenAssets.map(
            ({ asset, symbol }) =>
              new OTokenAsset({
                id: `${ctx.chain.id}-${params.otokenAddress}-${asset}`,
                chainId: ctx.chain.id,
                otoken: params.otokenAddress,
                address: asset,
                symbol: symbol,
              }),
          ),
        )
      }
    },

    /**
     * Process events from logs and traces to update the OToken state
     * @param ctx The context containing logs and traces
     */
    async process(ctx: Context): Promise<void> {
      await loadIsContractCache(ctx)
      const frequencyUpdatePromise = frequencyUpdater(ctx)

      if (!otoken) {
        if (process.env.BLOCK_FROM) {
          const filePath = `data/otoken/otoken-raw-data-${otokenAddress}-${process.env.BLOCK_FROM}.json`
          if (existsSync(filePath)) {
            const savedData = readFileSync(filePath, 'utf8')
            const savedDataEntity = bigintJsonParse(savedData) as OTokenRawData
            otoken = loadOTokenRawData(ctx, ctx.blocks[0], savedDataEntity)
          } else {
            ctx.log.error(`Raw data file not found: ${filePath}`)
          }
        }
      }

      if (otoken) {
        otoken.ctx = ctx
      }
      if (!producer) {
        producer = new OTokenEntityProducer(otoken, {
          ctx,
          block: ctx.blocks[0],
          fee: params.fee,
          from: params.from,
          name: params.name,
          symbol: params.symbol,
        })
      }
      producer.ctx = ctx

      const updateOToken = (block: Block, implementationHash: string) => {
        const implementations: Record<string, typeof OToken_2023_12_21 | typeof OToken_2025_03_04 | undefined> = {
          ['9ad3a9e43e4bdd6a974ef5db2c3fe9da590cbc6ad6709000f524896422abd5b8']: OToken_2023_12_21, // OETH
          ['eb5e67df57270fd5381abb6733ed1d61fc4afd08e1de9993f2f5b4ca95118f59']: OToken_2023_12_21, // OETH & superOETHb
          ['a6222a94f4fa7e48bb9acd1f7c484bc6f07d8a29269a34d0d9cd29af9d3fca28']: OToken_2023_12_21, // superOETHb
          ['6f0dcec1eda8cb66e295a41897ddd269bdb02cd241c7c5e30db58ffe31718748']: OToken_2023_12_21, // superOETHb (governanceRecover())
          ['337166fcadcf7a10878d5e055b0af8a2cd4129e039ad4b9b73c1adf3483c0908']: OToken_2025_03_04, // OETH
          ['219568b0baaa5c41831401e6b696c97b537a770244bce9ed091a7991c8fb64b9']: OToken_2025_03_04, // OETH
          ['ecd02b3be735b1e4f5fadf1bf46627cb6f79fdda5cd36de813ceaa9dd712a4e8']: OToken_2025_03_04, // OS
        }
        const OTokenClass = implementations[implementationHash]
        if (OTokenClass) {
          if (otoken instanceof OTokenClass) {
            ctx.log.info('New implementation processed by same class.')
            return
          }
          const newImplementation = new OTokenClass(ctx, block, otokenAddress)
          ctx.log.info('Instantiated new implementation now copying state: ' + newImplementation.constructor.name)
          if (otoken instanceof OToken_2023_12_21 && newImplementation instanceof OToken_2025_03_04) {
            newImplementation.copyState(otoken)
          }
          otoken = newImplementation
          producer.otoken = newImplementation
          justUpgraded = true
          hasUpgraded = true
        } else {
          throw new Error('Implementation hash not found.')
        }
      }

      const hashImplementation = async (block: Block, address: string) => {
        // Fetch the contract bytecode from the implementation address
        const implementationCode = await ctx._chain.client.call('eth_getCode', [
          address,
          `0x${block.header.height.toString(16)}`,
        ])

        // Calculate hash of the implementation bytecode
        const implementationCodeHash = crypto.createHash('sha256').update(implementationCode).digest('hex')

        // Log the implementation details
        ctx.log.info(
          {
            address,
            implementationCodeHash,
            blockNumber: block.header.height,
            timestamp: block.header.timestamp,
          },
          'Proxy implementation details',
        )
        return implementationCodeHash
      }

      if (!otoken) {
        const entity = await ctx.store.get(OTokenRawData, `${ctx.chain.id}-${otokenAddress}`)
        if (entity) {
          otoken = loadOTokenRawData(ctx, ctx.blocks[0], bigintJsonParse(JSON.stringify(entity)))
          producer.otoken = otoken
        }
      }

      let justUpgraded = false

      // Cache isContract results
      const transferRelated = ctx.blocks
        .flatMap((b) => b.transactions)
        .flatMap((t) => t.traces)
        .filter(
          (trace) =>
            (trace.type === 'call' && mintTraceFilter.matches(trace)) ||
            burnTraceFilter.matches(trace) ||
            transferTraceFilter.matches(trace) ||
            transferFromTraceFilter.matches(trace),
        )
      await areContracts(
        ctx,
        ctx.blocks[0],
        transferRelated.flatMap((trace) => {
          if (trace.type !== 'call') return []
          const sender = trace.action.from.toLowerCase()
          if (mintTraceFilter.matches(trace)) {
            const data = otokenAbi.functions.mint.decode(trace.action.input)
            return [data._account.toLowerCase()]
          } else if (burnTraceFilter.matches(trace)) {
            const data = otokenAbi.functions.burn.decode(trace.action.input)
            return [data._account.toLowerCase()]
          } else if (transferTraceFilter.matches(trace)) {
            const data = otokenAbi.functions.transfer.decode(trace.action.input)
            return [data._to.toLowerCase(), sender]
          } else if (transferFromTraceFilter.matches(trace)) {
            const data = otokenAbi.functions.transferFrom.decode(trace.action.input)
            return [data._to.toLowerCase(), data._from.toLowerCase()]
          }
          return []
        }),
      )

      if (otoken && !producer.initialized) {
        await producer.initialize()
      }

      // Process logs from all blocks
      for (const block of ctx.blocks) {
        if (otoken) {
          otoken.block = block
          producer.block = block
          producer.beforeBlock()
        }

        const addressesToCheck = new Set<string>()

        // Process traces
        for (const transaction of block.transactions) {
          for (const trace of transaction.traces) {
            if (trace.type === 'call') {
              if (errorParent(trace)) {
                continue // skip traces with error parents
              }

              const sender = trace.action.from.toLowerCase()

              if (proxyInitializeTraceFilter.matches(trace)) {
                startSection('trace_proxyInitialize')
                const data = proxyAbi.functions.initialize.decode(trace.action.input)
                ctx.log.info({ data, hash: trace.transaction?.hash }, 'proxyInitialize')
                const hash = await hashImplementation(block, data._logic.toLowerCase())
                updateOToken(block, hash)
                if (data._data) {
                  if (otoken instanceof OToken_2025_03_04) {
                    const initializeTrace = otokenAbi.functions.initialize.decode(data._data)
                    otoken.initialize(sender, initializeTrace._vaultAddress, initializeTrace._initialCreditsPerToken)
                  } else if (otoken instanceof OToken_2023_12_21) {
                    const initializeTrace = otokenAbi20241221.functions.initialize.decode(data._data)
                    otoken.initialize(sender, initializeTrace._vaultAddress, initializeTrace._initialCreditsPerToken)
                  }
                }
                endSection('trace_proxyInitialize')
              } else if (proxyUpgradeToTraceFilter.matches(trace)) {
                startSection('trace_proxyUpgradeTo')
                const data = proxyAbi.functions.upgradeTo.decode(trace.action.input)
                ctx.log.info({ data, hash: trace.transaction?.hash }, 'proxyUpgradeTo')
                const hash = await hashImplementation(block, data.newImplementation.toLowerCase())
                updateOToken(block, hash)
                endSection('trace_proxyUpgradeTo')
              } else if (proxyUpgradeToAndCallTraceFilter.matches(trace)) {
                startSection('trace_proxyUpgradeToAndCall')
                const data = proxyAbi.functions.upgradeToAndCall.decode(trace.action.input)
                ctx.log.info({ data, hash: trace.transaction?.hash }, 'proxyUpgradeToAndCall')
                const hash = await hashImplementation(block, data.newImplementation.toLowerCase())
                updateOToken(block, hash)
                endSection('trace_proxyUpgradeToAndCall')
              } else if (initializeTraceFilter.matches(trace)) {
                startSection('trace_initialize')
                ctx.log.info(trace, 'initialize')
                const data = otokenAbi.functions.initialize.decode(trace.action.input)
                otoken.initialize(sender, data._vaultAddress, data._initialCreditsPerToken)
                endSection('trace_initialize')
              } else if (initialize20241221TraceFilter.matches(trace)) {
                startSection('trace_initialize20241221')
                ctx.log.info(trace, 'initialize20241221')
                const data = otokenAbi20241221.functions.initialize.decode(trace.action.input)
                otoken.initialize(sender, data._vaultAddress, data._initialCreditsPerToken)
                endSection('trace_initialize20241221')
              } else if (rebaseOptInTraceFilter.matches(trace)) {
                startSection('trace_rebaseOptIn')
                await otoken.rebaseOptIn(sender)
                await producer.afterRebaseOptIn(trace, sender)
                addressesToCheck.add(sender)
                endSection('trace_rebaseOptIn')
              } else if (rebaseOptOutTraceFilter.matches(trace)) {
                startSection('trace_rebaseOptOut')
                await otoken.rebaseOptOut(sender)
                await producer.afterRebaseOptOut(trace, sender)
                addressesToCheck.add(sender)
                endSection('trace_rebaseOptOut')
              } else if (governanceRebaseOptInTraceFilter.matches(trace)) {
                startSection('trace_governanceRebaseOptIn')
                const data = otokenAbi.functions.governanceRebaseOptIn.decode(trace.action.input)
                await otoken.governanceRebaseOptIn(sender, data._account)
                await producer.afterRebaseOptIn(trace, data._account)
                addressesToCheck.add(sender)
                addressesToCheck.add(data._account)
                endSection('trace_governanceRebaseOptIn')
              } else if (mintTraceFilter.matches(trace)) {
                startSection('trace_mint')
                const data = otokenAbi.functions.mint.decode(trace.action.input)
                await otoken.mint(otoken.vaultAddress, data._account.toLowerCase(), data._amount)
                await producer.afterMint(trace, data._account, data._amount)
                addressesToCheck.add(data._account)
                endSection('trace_mint')
              } else if (burnTraceFilter.matches(trace)) {
                startSection('trace_burn')
                const data = otokenAbi.functions.burn.decode(trace.action.input)
                await otoken.burn(otoken.vaultAddress, data._account.toLowerCase(), data._amount)
                await producer.afterBurn(trace, data._account, data._amount)
                addressesToCheck.add(data._account)
                endSection('trace_burn')
              } else if (transferTraceFilter.matches(trace)) {
                startSection('trace_transfer')
                const data = otokenAbi.functions.transfer.decode(trace.action.input)
                await otoken.transfer(sender, data._to.toLowerCase(), data._value)
                await producer.afterTransfer(trace, sender, data._to.toLowerCase(), data._value)
                addressesToCheck.add(data._to)
                addressesToCheck.add(sender)
                endSection('trace_transfer')
              } else if (transferFromTraceFilter.matches(trace)) {
                startSection('trace_transferFrom')
                const data = otokenAbi.functions.transferFrom.decode(trace.action.input)
                await otoken.transferFrom(sender, data._from.toLowerCase(), data._to.toLowerCase(), data._value)
                await producer.afterTransferFrom(trace, data._from.toLowerCase(), data._to.toLowerCase(), data._value)
                addressesToCheck.add(data._from)
                addressesToCheck.add(data._to)
                addressesToCheck.add(sender)
                endSection('trace_transferFrom')
              } else if (approveTraceFilter.matches(trace)) {
                startSection('trace_approve')
                const data = otokenAbi.functions.approve.decode(trace.action.input)
                otoken.approve(sender, data._spender.toLowerCase(), data._value)
                addressesToCheck.add(data._spender)
                addressesToCheck.add(sender)
                endSection('trace_approve')
              } else if (increaseAllowanceTraceFilter.matches(trace)) {
                startSection('trace_increaseAllowance')
                const data = otokenAbi20241221.functions.increaseAllowance.decode(trace.action.input)
                const otoken20231221 = otoken as OToken_2023_12_21
                otoken20231221.increaseAllowance(sender, data._spender.toLowerCase(), data._addedValue)
                addressesToCheck.add(data._spender)
                addressesToCheck.add(sender)
                endSection('trace_increaseAllowance')
              } else if (decreaseAllowanceTraceFilter.matches(trace)) {
                startSection('trace_decreaseAllowance')
                const data = otokenAbi20241221.functions.decreaseAllowance.decode(trace.action.input)
                const otoken20231221 = otoken as OToken_2023_12_21
                otoken20231221.decreaseAllowance(sender, data._spender.toLowerCase(), data._subtractedValue)
                addressesToCheck.add(data._spender)
                addressesToCheck.add(sender)
                endSection('trace_decreaseAllowance')
              } else if (changeSupplyTraceFilter.matches(trace)) {
                startSection('trace_changeSupply')
                await producer.beforeChangeSupply()
                const data = otokenAbi.functions.changeSupply.decode(trace.action.input)
                const totalSupplyDiff = data._newTotalSupply - otoken.totalSupply
                otoken.changeSupply(sender, data._newTotalSupply)
                await producer.afterChangeSupply(trace, data._newTotalSupply, totalSupplyDiff)
                addressesToCheck.add(sender)
                endSection('trace_changeSupply')
              } else if (delegateYieldTraceFilter.matches(trace)) {
                startSection('trace_delegateYield')
                const data = otokenAbi.functions.delegateYield.decode(trace.action.input)
                if (!(otoken instanceof OToken_2025_03_04)) throw new Error('Invalid contract version')
                otoken.delegateYield(sender, data._from.toLowerCase(), data._to.toLowerCase())
                await producer.afterDelegateYield(trace, data._from.toLowerCase(), data._to.toLowerCase())
                addressesToCheck.add(sender)
                addressesToCheck.add(data._from)
                addressesToCheck.add(data._to)
                endSection('trace_delegateYield')
              } else if (undelegateYieldTraceFilter.matches(trace)) {
                startSection('trace_undelegateYield')
                const data = otokenAbi.functions.undelegateYield.decode(trace.action.input)
                if (!(otoken instanceof OToken_2025_03_04)) throw new Error('Invalid contract version')
                otoken.undelegateYield(sender, data._from.toLowerCase())
                await producer.afterUndelegateYield(trace, sender, data._from.toLowerCase())
                addressesToCheck.add(sender)
                addressesToCheck.add(data._from)
                endSection('trace_undelegateYield')
              } else if (transferGovernanceTraceFilter.matches(trace)) {
                startSection('trace_transferGovernance')
                const data = otokenAbi.functions.transferGovernance.decode(trace.action.input)
                addressesToCheck.add(sender)
                addressesToCheck.add(data._newGovernor)
                endSection('trace_transferGovernance')
              } else if (claimGovernanceTraceFilter.matches(trace)) {
                startSection('trace_claimGovernance')
                addressesToCheck.add(sender)
                endSection('trace_claimGovernance')
              } else if (trace.action.to === otokenAddress && trace.action.input.startsWith('0xc6f10ba3')) {
                startSection('trace_governanceRecover')
                ctx.log.info('SPECIAL CASE FOR superOETHb - governanceRecover()')
                const _from = '0x685ce0e36ca4b81f13b7551c76143d962568f6dd'
                const _to = '0x28bce2ee5775b652d92bb7c2891a89f036619703'
                const _value = 38692983174128797556n
                await otoken.transfer(_from, _to, _value)
                await producer.afterTransfer(trace, _from, _to, _value)
                addressesToCheck.add(_from)
                addressesToCheck.add(_to)
                endSection('trace_governanceRecover')
              } else if (trace.action.to === otokenAddress) {
                startSection('trace_unknown')
                let fun
                fun = Object.values(otokenAbi20241221.functions).find((value) =>
                  trace.action.input.startsWith(value.selector),
                )
                if (fun) {
                  if (!fun.isView) {
                    ctx.log.info({ data: trace.action.input, hash: trace.transaction?.hash }, fun.signature)
                  }
                } else {
                  ctx.log.info({ data: trace.action.input, hash: trace.transaction?.hash }, 'unknown')
                }

                if (!fun?.isView) {
                  ctx.log.error(
                    { data: trace.action.input, hash: trace.transaction?.hash },
                    'write function not being processed',
                  )
                }
                endSection('trace_unknown')
              }
            }
          }
        }

        for (const log of block.logs) {
          if (harvesterYieldSentFilter?.matches(log)) {
            await producer.processHarvesterYieldSent(ctx, block, log)
          }
        }

        startSection('afterBlock')
        await producer.afterBlock()
        endSection('afterBlock')
      }

      startSection('afterContext')
      await producer.afterContext(params)
      endSection('afterContext')

      if (otoken) {
        startSection('saveOTokenRawData')
        const lastBlock = ctx.blocks[ctx.blocks.length - 1]
        await saveOTokenRawData(ctx, lastBlock, otoken)
        endSection('saveOTokenRawData')
      }

      const frequencyUpdateResults = await frequencyUpdatePromise

      startSection('finalSave')
      await Promise.all([
        saveIsContractCache(ctx),
        producer.save(),
        ctx.store.insert(frequencyUpdateResults.vaults),
        ctx.store.insert(frequencyUpdateResults.wotokens),
        ctx.store.insert(frequencyUpdateResults.dripperStates),
      ])
      endSection('finalSave')

      // Log performance stats at the end of context processing
      logPerformanceStats()
    },
  })
}

const loadOTokenRawData = (ctx: Context, block: Block, entity: OTokenRawData) => {
  const otoken =
    entity.type === 'OToken_2023_12_21'
      ? new OToken_2023_12_21(ctx, block, entity.otoken)
      : new OToken_2025_03_04(ctx, block, entity.otoken)
  Object.assign(otoken, entity.data)
  return otoken
}

const saveOTokenRawData = async (ctx: Context, block: Block, otoken: OToken_2023_12_21 | OToken_2025_03_04) => {
  const rawDataEntity = new OTokenRawData({
    id: `${ctx.chain.id}-${otoken.address}`,
    chainId: ctx.chain.id,
    otoken: otoken.address,
    timestamp: new Date(block.header.timestamp),
    blockNumber: block.header.height,
    type: otoken.constructor.name,
    data: JSON.parse(
      bigintJsonStringify(
        pick(
          otoken,
          otoken instanceof OToken_2023_12_21
            ? [
                'totalSupply',
                '_allowances',
                'vaultAddress',
                'creditBalances',
                '_rebasingCredits',
                '_rebasingCreditsPerToken',
                'nonRebasingSupply',
                'nonRebasingCreditsPerToken',
                'rebaseState',
                'isUpgraded',
                'governor',
              ]
            : [
                // OToken_2025_03_04
                'totalSupply',
                'allowances',
                'vaultAddress',
                'creditBalances',
                'rebasingCredits',
                'rebasingCreditsPerToken',
                'nonRebasingSupply',
                'rebasingSupply',
                'alternativeCreditsPerToken',
                'rebaseState',
                'yieldTo',
                'yieldFrom',
                'governor',
              ],
        ),
      ),
    ),
  })
  await ctx.store.save(rawDataEntity)

  if (env.NODE_ENV === 'development') {
    writeFileSync(
      `data/otoken/otoken-raw-data-${otoken.address}-${block.header.height}.json`,
      bigintJsonStringify(rawDataEntity, 2),
    )
  }
}

const checkState = async (
  ctx: Context,
  block: Block,
  otoken: OToken_2023_12_21 | OToken_2025_03_04,
  addressesToCheck: Set<string>,
) => {
  ctx.log.info(`checking state at height ${block.header.height}`)
  let wrongCount = 0
  let totalCount = 0

  // Check contract-level state variables
  const contract = new otokenAbi20241221.Contract(ctx, block.header, otoken.address)

  // Check totalSupply
  const contractTotalSupply = await contract.totalSupply()
  const localTotalSupply = otoken.totalSupply

  if (contractTotalSupply !== localTotalSupply) {
    console.log(
      `Total supply mismatch: contract=${contractTotalSupply}, local=${localTotalSupply}, diff=${
        contractTotalSupply - localTotalSupply
      }`,
    )
  }

  // Check rebasingCredits and rebasingCreditsPerToken
  const contractRebasingCredits = await contract.rebasingCreditsHighres()
  const contractRebasingCreditsPerToken = await contract.rebasingCreditsPerTokenHighres()

  if (
    contractRebasingCredits !==
    (typeof otoken.rebasingCreditsHighres === 'function'
      ? otoken.rebasingCreditsHighres()
      : otoken.rebasingCreditsHighres)
  ) {
    console.log(
      `Rebasing credits mismatch: contract=${contractRebasingCredits}, local=${
        typeof otoken.rebasingCreditsHighres === 'function'
          ? otoken.rebasingCreditsHighres()
          : otoken.rebasingCreditsHighres
      }`,
    )
  }

  if (
    contractRebasingCreditsPerToken !==
    (typeof otoken.rebasingCreditsPerTokenHighres === 'function'
      ? otoken.rebasingCreditsPerTokenHighres()
      : otoken.rebasingCreditsPerTokenHighres)
  ) {
    console.log(
      `Rebasing credits per token mismatch: contract=${contractRebasingCreditsPerToken}, local=${
        typeof otoken.rebasingCreditsPerTokenHighres === 'function'
          ? otoken.rebasingCreditsPerTokenHighres()
          : otoken.rebasingCreditsPerTokenHighres
      }`,
    )
  }

  if (addressesToCheck.size === 0) return
  const accounts = [...addressesToCheck]

  // Check Balances
  const balanceMap = await multicall(
    ctx,
    block.header,
    otokenAbi.functions.balanceOf,
    otoken.address,
    accounts.map((address) => ({ _account: address })),
  ).then((balances) => {
    return new Map(balances.map((balance, index) => [accounts[index], balance]))
  })

  for (const account of accounts) {
    const contractBalance = balanceMap.get(account)!
    const localBalance = otoken.balanceOf(account)
    if (contractBalance !== localBalance) {
      wrongCount++
      const difference =
        contractBalance > localBalance ? contractBalance - localBalance : localBalance - contractBalance
      const percentOff = Number((difference * 10000n) / (contractBalance === 0n ? 1n : contractBalance)) / 100
      console.log(
        `${account} ${
          otoken instanceof OToken_2025_03_04
            ? otoken.alternativeCreditsPerToken[account] > 0n
            : otoken.nonRebasingCreditsPerToken[account] > 0n
        } has ${contractBalance} contract balance and ${localBalance} local balance (${percentOff.toFixed(2)}% off)`,
      )
    }
    totalCount++
  }

  const wrongPercentage = totalCount > 0 ? (wrongCount / totalCount) * 100 : 0
  console.log(`${wrongCount} out of ${totalCount} addresses (${wrongPercentage.toFixed(2)}%) have incorrect balances`)
}

const errorParent = (trace: Trace): boolean => {
  if (trace.error) {
    // console.log('errorLineage', trace.error)
    return true
  }
  if (trace.parent) return errorParent(trace.parent)
  return false
}
