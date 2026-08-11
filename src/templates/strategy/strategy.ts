import { Block, Context, EvmBatchProcessor, Log, LogFilter, blockFrequencyUpdater } from '@originprotocol/squid-utils'
import { ensureExchangeRates } from '@shared/post-processors/exchange-rates'
import { MainnetCurrencyAddress } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { OTokenContractAddress } from '@templates/otoken'
import { OETH_ADDRESS } from '@utils/addresses'
import { TraceFilter } from '@utils/traceFilter'

import * as strategyBalancer from './strategy-balancer'
import * as strategyCurveAMO from './strategy-curve-amo'
import * as strategyGeneric from './strategy-generic'
import * as strategyNativeStaking from './strategy-native-staking'
import * as strategyVault from './strategy-vault'

export type IBalancerPoolInfo = {
  poolId: string
  poolAddress: string
  rewardPoolAddress: string
}

export type ICurveAMOInfo = {
  poolAddress: string
  gaugeAddress?: string
  rewardsPoolAddress?: string
}

export type IStrategyData = {
  chainId: number
  from: number
  to?: number
  oTokenAddress: OTokenContractAddress
  name: string
  contractName: string
  address: string
  kind:
    | 'Generic'
    | 'Vault'
    | 'CurveAMO'
    | 'BalancerMetaStablePool'
    | 'NativeStaking'
    | 'CompoundingStakingSSV'
    | 'CompoundingStaking'
  base: {
    address: string
    decimals: number
  }
  assets: {
    address: string
    decimals: number
    checkBalance?: boolean // default is true
    convertTo?: {
      address: string
      decimals: number
    }
  }[]
  balanceUpdateLogFilters?: LogFilter[]
  /**
   * Logs signalling that the reported balance just moved to recognize accrued yield,
   * rather than to reflect capital entering or leaving. Unlike `balanceUpdateLogFilters`,
   * the balance change *at* these blocks is counted as earnings.
   *
   * Needed when `checkBalance` is a step function that only moves on these events, since
   * the usual `block - 1` comparison would see a flat balance and report zero earnings.
   */
  yieldRecognitionLogFilters?: LogFilter[]
  /**
   * Capital arriving from *another* strategy without passing through this one's deposit
   * path, so nothing here marks it as principal and a `yieldRecognitionLogFilters` block
   * would otherwise book all of it as yield.
   *
   * The case this exists for is an EIP-7251 validator consolidation: the source strategy
   * emits `ConsolidationConfirmed` and drops its nominal balance, while the destination
   * only ever sees a larger proven validator balance at its next verification — no event,
   * no new verified validator, no change in `totalDepositsWei`. Sharing a transaction is
   * what identifies the destination: the controller calls the target's `verifyBalances`
   * inside `confirmConsolidation`, and `onlyRegistrator` makes that the only reachable
   * verification while a consolidation is pending.
   *
   * `getAmount` returns the principal to remove from that block's recognized yield.
   */
  consolidationInflowLogFilters?: {
    filter: LogFilter
    getAmount: (ctx: Context, block: Block, log: Log) => Promise<bigint>
  }[]
  balanceUpdateTraceFilters?: TraceFilter[]
  aaveInfo?: {
    lendingPool: string
    pTokens: string[]
  }
  balancerPoolInfo?: IBalancerPoolInfo
  curvePoolInfo?: ICurveAMOInfo
  earnings?: {
    rewardTokenCollected?: boolean
    rewardTokenCollectedSimple?: boolean
    passiveByDepositWithdrawal?: boolean
    passiveByDepositWithdrawalByTrace?: boolean
  }
}

const processors: Record<
  IStrategyData['kind'],
  {
    setup: (processor: EvmBatchProcessor, strategyData: IStrategyData) => void
    process: (ctx: Context, strategyData: IStrategyData) => Promise<void>
  }
> = {
  Generic: strategyGeneric,
  Vault: strategyVault,
  CurveAMO: strategyCurveAMO,
  BalancerMetaStablePool: strategyBalancer,
  NativeStaking: strategyNativeStaking,
  CompoundingStakingSSV: strategyNativeStaking,
  CompoundingStaking: strategyNativeStaking,
}

export const createStrategySetup = (strategyData: IStrategyData) => {
  const { kind } = strategyData
  const processor = processors[kind]
  if (processor) {
    return (p: EvmBatchProcessor) => processor.setup(p, strategyData)
  } else {
    throw new Error(`Unsupported strategy kind: ${kind}`)
  }
}

// Used by `src/processors/strategies/strategies.ts`
export const createStrategyProcessor = (strategyData: IStrategyData) => {
  const { kind } = strategyData
  const processor = processors[kind]
  if (processor) {
    const exchangeRateUpdate = blockFrequencyUpdater(strategyData)
    return async (ctx: Context) => {
      await Promise.all([
        exchangeRateUpdate(ctx, async (ctx, block) => {
          await ensureExchangeRates(
            ctx,
            block,
            strategyData.assets.map((asset) =>
              strategyData.oTokenAddress === OETH_ADDRESS
                ? ['ETH', asset.address as MainnetCurrencyAddress]
                : [asset.address as MainnetCurrencyAddress, 'USD'],
            ),
          )
        }),
        processor.process(ctx, strategyData),
      ])
    }
  } else {
    throw new Error(`Unsupported strategy kind: ${kind}`)
  }
}
