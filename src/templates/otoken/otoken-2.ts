import crypto from 'crypto'
import { pick } from 'lodash'

import * as proxyAbi from '@abi/governed-upgradeability-proxy'
import * as otokenAbi from '@abi/otoken'
import * as otokenAbi20241221 from '@abi/otoken-2024-12-21'
import * as otokenHarvester from '@abi/otoken-base-harvester'
import { OTokenAsset, OTokenRawData } from '@model'
import { Block, Context, Processor, logFilter, multicall, traceFilter } from '@originprotocol/squid-utils'
import { CurrencyAddress, CurrencySymbol } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { EvmBatchProcessor, Trace } from '@subsquid/evm-processor'
import { bigintJsonParse, bigintJsonStringify } from '@utils/bigintJson'

import { loadIsContractCache, saveIsContractCache } from '../../utils/isContract'
import { OTokenContractAddress } from './otoken'
import { OToken_2023_12_21 } from './otoken-2023-12-21'
import { OToken_2025_03_04 } from './otoken-2025-03-04'
import { OTokenEntityProducer } from './otoken-entity-producer'
import { otokenFrequencyProcessor } from './otoken-frequency'

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
}): Processor => {
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

  return {
    name: `otoken2-${otokenAddress}`,
    from,
    setup: (processor: EvmBatchProcessor) => {
      // Proxy
      processor.addTrace(proxyInitializeTraceFilter.value)
      processor.addTrace(proxyUpgradeToTraceFilter.value)
      processor.addTrace(proxyUpgradeToAndCallTraceFilter.value)

      // Implementation Related
      // We want to receive all trace calls to the otoken contract
      processor.addLog({
        address: [otokenAddress],
        transaction: true,
        range: { from },
      })
      processor.addTrace({
        type: ['call'],
        callTo: [otokenAddress],
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

      if (otoken) {
        otoken.ctx = ctx
      }
      if (!producer) {
        producer = new OTokenEntityProducer(otoken, { ctx, block: ctx.blocks[0], fee: params.fee, from: params.from })
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
          if (entity.type === 'OToken_2023_12_21') {
            otoken = new OToken_2023_12_21(ctx, ctx.blocks[0], otokenAddress)
            Object.assign(otoken, bigintJsonParse(JSON.stringify(entity.data)))
          } else if (entity.type === 'OToken_2025_03_04') {
            otoken = new OToken_2025_03_04(ctx, ctx.blocks[0], otokenAddress)
            Object.assign(otoken, bigintJsonParse(JSON.stringify(entity.data)))
          }
          producer.otoken = otoken
        }
      }

      let justUpgraded = false

      // Process logs from all blocks
      for (const block of ctx.blocks) {
        if (otoken) {
          otoken.block = block
          producer.block = block
        }
        const addressesToCheck = new Set<string>()
        // Process traces
        for (const transaction of block.transactions) {
          // if (transaction.status !== 1) {
          //   continue // skip failed transactions
          // }
          for (const trace of transaction.traces) {
            if (trace.type === 'call') {
              if (errorParent(trace)) {
                // ctx.log.info({ block: block.header.height, hash: trace.transaction?.hash }, 'errorLineage')
                continue // skip traces with error parents
              }
              const sender = trace.action.from.toLowerCase()

              if (proxyInitializeTraceFilter.matches(trace)) {
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
                ///////////////////////////////
              } else if (proxyUpgradeToTraceFilter.matches(trace)) {
                const data = proxyAbi.functions.upgradeTo.decode(trace.action.input)
                ctx.log.info({ data, hash: trace.transaction?.hash }, 'proxyUpgradeTo')
                const hash = await hashImplementation(block, data.newImplementation.toLowerCase())
                updateOToken(block, hash)
                ///////////////////////////////
              } else if (proxyUpgradeToAndCallTraceFilter.matches(trace)) {
                const data = proxyAbi.functions.upgradeToAndCall.decode(trace.action.input)
                ctx.log.info({ data, hash: trace.transaction?.hash }, 'proxyUpgradeToAndCall')
                const hash = await hashImplementation(block, data.newImplementation.toLowerCase())
                updateOToken(block, hash)
                ///////////////////////////////
              } else if (initializeTraceFilter.matches(trace)) {
                ctx.log.info(trace, 'initialize')
                const data = otokenAbi.functions.initialize.decode(trace.action.input)
                otoken.initialize(sender, data._vaultAddress, data._initialCreditsPerToken)
                ///////////////////////////////
              } else if (initialize20241221TraceFilter.matches(trace)) {
                ctx.log.info(trace, 'initialize20241221')
                const data = otokenAbi20241221.functions.initialize.decode(trace.action.input)
                otoken.initialize(sender, data._vaultAddress, data._initialCreditsPerToken)
                ///////////////////////////////
              } else if (rebaseOptInTraceFilter.matches(trace)) {
                // ctx.log.info(trace, 'rebaseOptIn')
                await otoken.rebaseOptIn(sender)
                await producer.afterRebaseOptIn(trace, sender)
                addressesToCheck.add(sender)
                ///////////////////////////////
              } else if (rebaseOptOutTraceFilter.matches(trace)) {
                // ctx.log.info(trace, 'rebaseOptOut')
                await otoken.rebaseOptOut(sender)
                await producer.afterRebaseOptOut(trace, sender)
                addressesToCheck.add(sender)
                ///////////////////////////////
              } else if (governanceRebaseOptInTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.governanceRebaseOptIn.decode(trace.action.input)
                // ctx.log.info(trace, 'governanceRebaseOptIn')
                await otoken.governanceRebaseOptIn(sender, data._account)
                await producer.afterRebaseOptIn(trace, data._account)
                addressesToCheck.add(sender)
                addressesToCheck.add(data._account)
                ///////////////////////////////
              } else if (mintTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.mint.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'mint')
                await otoken.mint(otoken.vaultAddress, data._account.toLowerCase(), data._amount)
                await producer.afterMint(trace, data._account, data._amount)
                addressesToCheck.add(data._account)
                ///////////////////////////////
              } else if (burnTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.burn.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'burn')
                await otoken.burn(otoken.vaultAddress, data._account.toLowerCase(), data._amount)
                await producer.afterBurn(trace, data._account, data._amount)
                addressesToCheck.add(data._account)
                ///////////////////////////////
              } else if (transferTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.transfer.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'transfer')
                await otoken.transfer(sender, data._to.toLowerCase(), data._value)
                await producer.afterTransfer(trace, sender, data._to.toLowerCase(), data._value)
                addressesToCheck.add(data._to)
                addressesToCheck.add(sender)
                ///////////////////////////////
              } else if (transferFromTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.transferFrom.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'transferFrom')
                await otoken.transferFrom(sender, data._from.toLowerCase(), data._to.toLowerCase(), data._value)
                await producer.afterTransferFrom(trace, data._from.toLowerCase(), data._to.toLowerCase(), data._value)
                addressesToCheck.add(data._from)
                addressesToCheck.add(data._to)
                addressesToCheck.add(sender)
                ///////////////////////////////
              } else if (approveTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.approve.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'approve')
                otoken.approve(sender, data._spender.toLowerCase(), data._value)
                addressesToCheck.add(data._spender)
                addressesToCheck.add(sender)
                ///////////////////////////////
              } else if (increaseAllowanceTraceFilter.matches(trace)) {
                const data = otokenAbi20241221.functions.increaseAllowance.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'increaseAllowance')
                const otoken20231221 = otoken as OToken_2023_12_21
                otoken20231221.increaseAllowance(sender, data._spender.toLowerCase(), data._addedValue)
                addressesToCheck.add(data._spender)
                addressesToCheck.add(sender)
                ///////////////////////////////
              } else if (decreaseAllowanceTraceFilter.matches(trace)) {
                const data = otokenAbi20241221.functions.decreaseAllowance.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'decreaseAllowance')
                const otoken20231221 = otoken as OToken_2023_12_21
                otoken20231221.decreaseAllowance(sender, data._spender.toLowerCase(), data._subtractedValue)
                addressesToCheck.add(data._spender)
                addressesToCheck.add(sender)
                ///////////////////////////////
              } else if (changeSupplyTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.changeSupply.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'changeSupply')
                const totalSupplyDiff = data._newTotalSupply - otoken.totalSupply
                otoken.changeSupply(sender, data._newTotalSupply)
                await producer.afterChangeSupply(trace, data._newTotalSupply, totalSupplyDiff)
                addressesToCheck.add(sender)
                ///////////////////////////////
              } else if (delegateYieldTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.delegateYield.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'delegateYield')
                if (!(otoken instanceof OToken_2025_03_04)) throw new Error('Invalid contract version')
                otoken.delegateYield(sender, data._from.toLowerCase(), data._to.toLowerCase())
                await producer.afterDelegateYield(trace, data._from.toLowerCase(), data._to.toLowerCase())
                addressesToCheck.add(sender)
                addressesToCheck.add(data._from)
                addressesToCheck.add(data._to)
                ///////////////////////////////
              } else if (undelegateYieldTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.undelegateYield.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'undelegateYield')
                if (!(otoken instanceof OToken_2025_03_04)) throw new Error('Invalid contract version')
                otoken.undelegateYield(sender, data._from.toLowerCase())
                await producer.afterUndelegateYield(trace, sender, data._from.toLowerCase())
                addressesToCheck.add(sender)
                addressesToCheck.add(data._from)
                ///////////////////////////////
              } else if (transferGovernanceTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.transferGovernance.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'transferGovernance')
                // otoken.transferGovernance(sender, data._newGovernor)
                addressesToCheck.add(sender)
                addressesToCheck.add(data._newGovernor)
                ///////////////////////////////
              } else if (claimGovernanceTraceFilter.matches(trace)) {
                // ctx.log.info(trace, 'claimGovernance')
                // await otoken.claimGovernance()
                addressesToCheck.add(sender)
                ///////////////////////////////
              } else if (trace.action.to === otokenAddress) {
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
              }
            }
          }
        }
        for (const log of block.logs) {
          if (harvesterYieldSentFilter?.matches(log)) {
            await producer.processHarvesterYieldSent(ctx, block, log)
          }
        }
        await producer.afterBlock()
        if (otoken) {
          if (justUpgraded) {
            await checkState(ctx, block, otoken, new Set([...Object.keys(otoken.creditBalances)]))
            justUpgraded = false
          }
          // await checkState(ctx, block, otoken, new Set())
          // await checkState(ctx, block, otoken, addressesToCheck)
        }
      }

      await producer.afterContext(params)

      if (otoken) {
        const lastBlock = ctx.blocks[ctx.blocks.length - 1]
        await ctx.store.save(
          new OTokenRawData({
            id: `${ctx.chain.id}-${otokenAddress}`,
            chainId: ctx.chain.id,
            otoken: otokenAddress,
            timestamp: new Date(lastBlock.header.timestamp),
            blockNumber: lastBlock.header.height,
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
          }),
        )
        if (ctx.isHead) {
          // await checkState(ctx, lastBlock, otoken, new Set([...Object.keys(otoken.creditBalances)]))
        }
      }
      const frequencyUpdateResults = await frequencyUpdatePromise
      await Promise.all([
        saveIsContractCache(ctx),
        producer.save(),
        ctx.store.insert(frequencyUpdateResults.vaults),
        ctx.store.insert(frequencyUpdateResults.wotokens),
        ctx.store.insert(frequencyUpdateResults.dripperStates),
      ])
    },
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
