import { Context, LogFilter, blockFrequencyUpdater } from '@originprotocol/squid-utils'
import { ensureExchangeRates } from '@shared/post-processors/exchange-rates'
import { MainnetCurrencyAddress } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
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
  rewardsPoolAddress: string
}

export type IStrategyData = {
  chainId: number
  from: number
  oTokenAddress: OTokenContractAddress
  name: string
  contractName: string
  address: string
  kind: 'Generic' | 'Vault' | 'CurveAMO' | 'BalancerMetaStablePool' | 'NativeStaking'
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
  balanceUpdateTraceFilters?: TraceFilter[]
  aaveInfo?: {
    lendingPool: string
    pTokens: string[]
  }
  balancerPoolInfo?: IBalancerPoolInfo
  curvePoolInfo?: ICurveAMOInfo
  earnings?: {
    rewardTokenCollected?: boolean
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
