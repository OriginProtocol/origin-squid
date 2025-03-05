import { Block, Context, multicall, traceFilter } from '@originprotocol/squid-utils'
import { CurrencyAddress, CurrencySymbol } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as otokenAbi from '../../abi/otoken'
import { OTokenContractAddress } from './otoken'
import { OToken_2023_12_21 } from './otoken-2023-12-21'
import { OToken_2025_03_04 } from './otoken-2025-03-04'

export const createOTokenProcessor2 = (params: {
  name: string
  symbol: string
  from: number
  vaultFrom: number
  initialRebasingCreditsPerToken: bigint
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
  const rebaseOptInTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.rebaseOptIn.selector],
    transaction: true,
    range: { from },
  })
  const rebaseOptOutTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.rebaseOptOut.selector],
    transaction: true,
    range: { from },
  })
  const mintTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.mint.selector],
    transaction: true,
    range: { from },
  })
  const burnTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.burn.selector],
    transaction: true,
    range: { from },
  })
  const transferTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.transfer.selector],
    transaction: true,
    range: { from },
  })
  const transferFromTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.transferFrom.selector],
    transaction: true,
    range: { from },
  })
  const approveTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.approve.selector],
    range: { from },
  })
  const changeSupplyTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.changeSupply.selector],
    transaction: true,
    range: { from },
  })
  const delegateYieldTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.delegateYield.selector],
    transaction: true,
    range: { from },
  })
  const undelegateYieldTraceFilter = traceFilter({
    type: ['call'],
    callTo: [otokenAddress],
    callSighash: [otokenAbi.functions.undelegateYield.selector],
    transaction: true,
    range: { from },
  })

  let otoken: OToken_2025_03_04 | OToken_2023_12_21

  return {
    name: `otoken2-${otokenAddress}`,
    from,
    setup: (processor: EvmBatchProcessor) => {
      processor.addTrace(rebaseOptInTraceFilter.value)
      processor.addTrace(rebaseOptOutTraceFilter.value)
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
      if (!otoken) {
        otoken = new OToken_2023_12_21(ctx, ctx.blocks[0], otokenAddress)
        otoken.initialize('', params.otokenVaultAddress, params.initialRebasingCreditsPerToken)
        // otoken.loadState(ctx) // TODO: I will have to set state on process restart.
      }
      otoken.ctx = ctx

      // Process logs from all blocks
      for (const block of ctx.blocks) {
        otoken.block = block
        if (block.header.height === 17272838) debugger
        // Process traces
        for (const transaction of block.transactions) {
          for (const trace of transaction.traces) {
            if (trace.type === 'call' && trace.transaction?.status === 1) {
              if (rebaseOptInTraceFilter.matches(trace)) {
                ctx.log.info(trace, 'rebaseOptIn')
                await otoken.rebaseOptIn(trace.action.from.toLowerCase())
              } else if (rebaseOptOutTraceFilter.matches(trace)) {
                ctx.log.info(trace, 'rebaseOptOut')
                await otoken.rebaseOptOut(trace.action.from.toLowerCase())
              } else if (mintTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.mint.decode(trace.action.input)
                ctx.log.info({ data, hash: trace.transaction?.hash }, 'mint')
                await otoken.mint(otoken.vaultAddress, data._account, data._amount)
              } else if (burnTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.burn.decode(trace.action.input)
                ctx.log.info({ data, hash: trace.transaction?.hash }, 'burn')
                await otoken.burn(otoken.vaultAddress, data._account, data._amount)
              } else if (transferTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.transfer.decode(trace.action.input)
                ctx.log.info({ data, hash: trace.transaction?.hash }, 'transfer')
                await otoken.transfer(trace.action.from, data._to, data._value)
              } else if (transferFromTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.transferFrom.decode(trace.action.input)
                ctx.log.info({ data, hash: trace.transaction?.hash }, 'transferFrom')
                await otoken.transferFrom(trace.action.from, data._from, data._to, data._value)
              } else if (approveTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.approve.decode(trace.action.input)
                ctx.log.info({ data, hash: trace.transaction?.hash }, 'approve')
                otoken.approve(trace.action.from, data._spender, data._value)
              } else if (changeSupplyTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.changeSupply.decode(trace.action.input)
                ctx.log.info({ data, hash: trace.transaction?.hash }, 'changeSupply')
                otoken.changeSupply(trace.action.from, data._newTotalSupply)
              } else if (delegateYieldTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.delegateYield.decode(trace.action.input)
                ctx.log.info({ data, hash: trace.transaction?.hash }, 'delegateYield')
                if (!(otoken instanceof OToken_2025_03_04)) throw new Error('Invalid contract version')
                otoken.delegateYield(trace.action.from, data._from, data._to)
              } else if (undelegateYieldTraceFilter.matches(trace)) {
                const data = otokenAbi.functions.undelegateYield.decode(trace.action.input)
                ctx.log.info({ data, hash: trace.transaction?.hash }, 'undelegateYield')
                if (!(otoken instanceof OToken_2025_03_04)) throw new Error('Invalid contract version')
                otoken.undelegateYield(trace.action.from, data._from)
              }
            }
          }
        }
        // try {
        //   const contract = new otokenAbi.Contract(ctx, block.header, params.otokenAddress)
        //   const rebasingCredits = await contract.rebasingCredits()
        //   if (rebasingCredits !== otoken.rebasingCredits) {
        //     ctx.log.warn(`rebasingCredits mismatch: ${rebasingCredits} !== ${otoken.rebasingCredits}`)
        //     debugger
        //   }
        // } catch (err) {
        //   console.log(err)
        // }
        await checkState(ctx, block, otoken)
      }
      ctx.log.info(`tracking ${otoken.creditBalances.size} accounts`)
      // await checkState(ctx, otoken)
    },
  }
}

let lastCheck = Date.now()
const checkState = async (ctx: Context, block: Block, otoken: OToken_2023_12_21 | OToken_2025_03_04) => {
  if (block.header.height < 17271819) return
  ctx.log.info(`checking state at height ${block.header.height}`)
  let wrongCount = 0
  let totalCount = 0

  const accounts = [...otoken.creditBalances.keys()].filter(
    (address) => address === '0x0546af2f351e70a9e2a43d81f8098b6a572eef0c',
  )
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
