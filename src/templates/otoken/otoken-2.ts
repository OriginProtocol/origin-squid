import crypto from 'crypto'

import * as proxyAbi from '@abi/governed-upgradeability-proxy'
import * as otokenAbi from '@abi/otoken'
import * as otokenAbi20241221 from '@abi/otoken-2024-12-21'
import { Block, Context, multicall, traceFilter } from '@originprotocol/squid-utils'
import { CurrencyAddress, CurrencySymbol } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { EvmBatchProcessor, Trace } from '@subsquid/evm-processor'

import { OTokenContractAddress } from './otoken'
import { OToken_2023_12_21 } from './otoken-2023-12-21'
import { OToken_2025_03_04 } from './otoken-2025-03-04'

export const createOTokenProcessor2 = (params: {
  name: string
  symbol: string
  from: number
  vaultFrom: number
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

  // Create trace filter for rebase opt events
  const generalTraceParams = {
    transaction: true,
    parents: true,
    // subtraces: true,
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

  let otoken: OToken_2025_03_04 | OToken_2023_12_21

  return {
    name: `otoken2-${otokenAddress}`,
    from,
    setup: (processor: EvmBatchProcessor) => {
      // Proxy
      processor.addTrace(proxyInitializeTraceFilter.value)
      processor.addTrace(proxyUpgradeToTraceFilter.value)
      processor.addTrace(proxyUpgradeToAndCallTraceFilter.value)

      // Implementation
      processor.addTrace(initializeTraceFilter.value)
      processor.addTrace(initialize20241221TraceFilter.value)
      processor.addTrace(rebaseOptInTraceFilter.value)
      processor.addTrace(rebaseOptOutTraceFilter.value)
      processor.addTrace(governanceRebaseOptInTraceFilter.value)
      processor.addTrace(mintTraceFilter.value)
      processor.addTrace(burnTraceFilter.value)
      processor.addTrace(transferTraceFilter.value)
      processor.addTrace(transferFromTraceFilter.value)
      processor.addTrace(approveTraceFilter.value)
      processor.addTrace(changeSupplyTraceFilter.value)
      processor.addTrace(delegateYieldTraceFilter.value)
      processor.addTrace(undelegateYieldTraceFilter.value)
    },
    /**
     * Process events from logs and traces to update the OToken state
     * @param ctx The context containing logs and traces
     */
    async process(ctx: Context): Promise<void> {
      if (otoken) {
        otoken.ctx = ctx
      }

      const updateOToken = (block: Block, implementationHash: string) => {
        const implementations: Record<string, typeof OToken_2023_12_21 | typeof OToken_2025_03_04 | undefined> = {
          ['9ad3a9e43e4bdd6a974ef5db2c3fe9da590cbc6ad6709000f524896422abd5b8']: OToken_2023_12_21,
          ['0x0000000000000000000000000000000000000000000000000000000000000000']: OToken_2025_03_04,
        }
        const OTokenClass = implementations[implementationHash]
        if (OTokenClass) {
          const newImplementation = new OTokenClass(ctx, block, otokenAddress)
          if (otoken instanceof OToken_2023_12_21 && newImplementation instanceof OToken_2025_03_04) {
            newImplementation.copyState(otoken)
          }
          otoken = newImplementation
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

      // Process logs from all blocks
      for (const block of ctx.blocks) {
        if (otoken) {
          otoken.block = block
        }
        // Process traces
        for (const transaction of block.transactions) {
          if (transaction.status !== 1) {
            continue // skip failed transactions
          }
          if (transaction.hash === '0x0e3ac28945d45993e3d8e1f716b6e9ec17bfc000418a1091a845b7a00c7e3280') debugger
          for (const trace of transaction.traces) {
            if (trace.type === 'call') {
              if (errorLineage(trace)) {
                ctx.log.info({ block: block.header.height, hash: trace.transaction?.hash }, 'errorLineage')
                continue // skip traces with error parents
              }
              const sender = trace.action.from.toLowerCase()

              if (proxyInitializeTraceFilter.matches(trace)) {
                const data = proxyAbi.functions.initialize.decode(trace.action.input)
                const hash = await hashImplementation(block, data._logic.toLowerCase())
                updateOToken(block, hash)
                ctx.log.info(data, 'proxyInitialize')
              } else if (proxyUpgradeToTraceFilter.matches(trace)) {
                const data = proxyAbi.functions.upgradeTo.decode(trace.action.input)
                const hash = await hashImplementation(block, data.newImplementation.toLowerCase())
                updateOToken(block, hash)
                ctx.log.info(data, 'proxyUpgradeTo')
              } else if (proxyUpgradeToAndCallTraceFilter.matches(trace)) {
                const data = proxyAbi.functions.upgradeToAndCall.decode(trace.action.input)
                const hash = await hashImplementation(block, data.newImplementation.toLowerCase())
                updateOToken(block, hash)
                ctx.log.info(data, 'proxyUpgradeToAndCall')
              } else if (initializeTraceFilter.matches(trace)) {
                // ctx.log.info(trace, 'initialize')
                const data = otokenAbi.functions.initialize.decode(trace.action.input)
                otoken.initialize(sender, data._vaultAddress, data._initialCreditsPerToken)
              } else if (initialize20241221TraceFilter.matches(trace)) {
                // ctx.log.info(trace, 'initialize20241221')
                const data = otokenAbi20241221.functions.initialize.decode(trace.action.input)
                otoken.initialize(sender, data._vaultAddress, data._initialCreditsPerToken)
              } else if (rebaseOptInTraceFilter.matches(trace)) {
                // ctx.log.info(trace, 'rebaseOptIn')
                await otoken.rebaseOptIn(sender)
              } else if (rebaseOptOutTraceFilter.matches(trace)) {
                // ctx.log.info(trace, 'rebaseOptOut')
                await otoken.rebaseOptOut(sender)
              } else if (governanceRebaseOptInTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.governanceRebaseOptIn.decode(trace.action.input)
                // ctx.log.info(trace, 'governanceRebaseOptIn')
                await otoken.governanceRebaseOptIn(sender, data._account)
              } else if (mintTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.mint.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'mint')
                await otoken.mint(otoken.vaultAddress, data._account.toLowerCase(), data._amount)
              } else if (burnTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.burn.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'burn')
                await otoken.burn(otoken.vaultAddress, data._account.toLowerCase(), data._amount)
              } else if (transferTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.transfer.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'transfer')
                await otoken.transfer(sender, data._to.toLowerCase(), data._value)
              } else if (transferFromTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.transferFrom.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'transferFrom')
                await otoken.transferFrom(sender, data._from, data._to, data._value)
              } else if (approveTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.approve.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'approve')
                otoken.approve(sender, data._spender.toLowerCase(), data._value)
              } else if (changeSupplyTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.changeSupply.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'changeSupply')
                otoken.changeSupply(sender, data._newTotalSupply)
              } else if (delegateYieldTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.delegateYield.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'delegateYield')
                if (!(otoken instanceof OToken_2025_03_04)) throw new Error('Invalid contract version')
                otoken.delegateYield(sender, data._from.toLowerCase(), data._to.toLowerCase())
              } else if (undelegateYieldTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.undelegateYield.decode(trace.action.input)
                // ctx.log.info({ data, hash: trace.transaction?.hash }, 'undelegateYield')
                if (!(otoken instanceof OToken_2025_03_04)) throw new Error('Invalid contract version')
                otoken.undelegateYield(sender, data._from.toLowerCase())
              }
            }
          }
        }
        await checkState(ctx, block, otoken)
      }
      // ctx.log.info(`tracking ${otoken.creditBalances.size} accounts`)
    },
  }
}

let lastCheck = Date.now()
const checkState = async (ctx: Context, block: Block, otoken: OToken_2023_12_21 | OToken_2025_03_04) => {
  if (Date.now() - lastCheck < 30000) return
  ctx.log.info(`checking state at height ${block.header.height}`)
  let wrongCount = 0
  let totalCount = 0

  const accounts = [...otoken.creditBalances.keys()]
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
      const percentOff = Number((difference * 100n) / (contractBalance === 0n ? 1n : contractBalance))
      console.log(
        `${account} ${
          otoken.rebaseState.get(account)?.toString() ?? 'NotSet'
        } has ${contractBalance} contract balance and ${localBalance} local balance (${percentOff.toFixed(2)}% off)`,
      )
    }
    totalCount++
  }

  const wrongPercentage = totalCount > 0 ? (wrongCount / totalCount) * 100 : 0
  console.log(`${wrongCount} out of ${totalCount} addresses (${wrongPercentage.toFixed(2)}%) have incorrect balances`)
  lastCheck = Date.now()
}

const errorLineage = (trace: Trace): boolean => {
  if (trace.error) {
    console.log('errorLineage', trace.error)
    return true
  }
  if (trace.parent) return errorLineage(trace.parent)
  return false
}
