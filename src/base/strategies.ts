import * as aerodromeStrategyAbi from '@abi/aerodrome-amo-strategy'
import * as crossChainV3MasterAbi from '@abi/strategy-crosschain-v3-master'
import { defineProcessor, logFilter } from '@originprotocol/squid-utils'
import { IStrategyData, createStrategyProcessor, createStrategySetup } from '@templates/strategy'
import { createStrategyRewardProcessor, createStrategyRewardSetup } from '@templates/strategy-rewards'
import { baseAddresses } from '@utils/addresses-base'

export const baseCurveAMO: IStrategyData = {
  chainId: 8453,
  from: 26212490,
  name: 'Curve AMO Strategy',
  contractName: 'OETHBaseCurveAMO',
  address: baseAddresses.superOETHb.strategies.curveAMO,
  oTokenAddress: baseAddresses.superOETHb.address,
  kind: 'CurveAMO',
  curvePoolInfo: {
    poolAddress: '0x302a94e3c28c290eaf2a4605fc52e11eb915f378',
    gaugeAddress: '0x9da8420dbeebdfc4902b356017610259ef7eedd8',
    rewardsPoolAddress: '0x9da8420dbeebdfc4902b356017610259ef7eedd8',
  },
  base: { address: baseAddresses.tokens.WETH, decimals: 18 },
  assets: [
    { address: baseAddresses.tokens.WETH, decimals: 18 },
    { address: baseAddresses.tokens.superOETHb, decimals: 18, checkBalance: false },
  ],
  earnings: { rewardTokenCollected: true, passiveByDepositWithdrawal: true },
}

// OETHb V3: superOETHb's wOETH moves from the Bridged WOETH Strategy to the cross-chain
// Master/Remote pair. Migrated wOETH reaches Remote with no message, so Master only learns of it
// at the next balance report (`RemoteStrategyBalanceUpdated`), in the same block the old
// strategy's in-flight term collapses. Both steps are capital, not yield.
//
// TODO(oethb-v3): once governance proposal 008 (removes the old strategy) executes on Base:
//  - set OETHB_V3_MIGRATION_END_BLOCK to its block,
//  - set OETHB_V3_MIGRATION_END_DATE in src/mainnet/processors/protocol/protocol.ts,
//  - stop processing the Bridged WOETH Strategy after that block (its in-flight term comes back
//    whenever Master withdraws, which would show as fake earnings),
//  - ship a new version.
// While undefined the migration window stays open and Master's report steps count as capital.
export const OETHB_V3_MIGRATION_END_BLOCK = undefined as number | undefined
const OETHB_V3_MASTER_FROM = 52847373 // proxy initialised; checkBalance reverts before this
const OETHB_V3_GOVERNANCE_BLOCK = 53110252 // migration impl + vault approval executed

const masterBalanceUpdated = (range: { from: number; to?: number }) =>
  logFilter({
    address: [baseAddresses.superOETHb.strategies.crossChainV3Master],
    topic0: [crossChainV3MasterAbi.events.RemoteStrategyBalanceUpdated.topic],
    range,
  })

export const baseCrossChainV3Master: IStrategyData = {
  chainId: 8453,
  from: OETHB_V3_MASTER_FROM,
  name: 'Cross-Chain wOETH Strategy',
  contractName: 'MasterWOTokenStrategy',
  address: baseAddresses.superOETHb.strategies.crossChainV3Master,
  oTokenAddress: baseAddresses.superOETHb.address,
  kind: 'Generic',
  base: { address: baseAddresses.tokens.WETH, decimals: 18 },
  assets: [{ address: baseAddresses.tokens.WETH, decimals: 18 }],
  earnings: { passiveByDepositWithdrawal: true },
  balanceUpdateLogFilters: [
    // Migration window: the report steps carry migrated wOETH, which is capital.
    masterBalanceUpdated({ from: OETHB_V3_MASTER_FROM, to: OETHB_V3_MIGRATION_END_BLOCK }),
    // WETH left on Master when a deposit is under the adapter minimum.
    logFilter({
      address: [baseAddresses.superOETHb.strategies.crossChainV3Master],
      topic0: [crossChainV3MasterAbi.events.DepositSkipped.topic],
      range: { from: OETHB_V3_MASTER_FROM },
    }),
  ],
  // After the migration the report steps are yield, like CompoundingStaking's BalancesVerified.
  yieldRecognitionLogFilters: OETHB_V3_MIGRATION_END_BLOCK
    ? [masterBalanceUpdated({ from: OETHB_V3_MIGRATION_END_BLOCK + 1 })]
    : [],
}

export const baseStrategies: readonly IStrategyData[] = [
  {
    chainId: 8453,
    from: 18689563,
    name: 'Bridged WOETH Strategy',
    contractName: 'BridgedWOETHStrategy',
    address: baseAddresses.superOETHb.strategies.bridgedWOETH,
    oTokenAddress: baseAddresses.superOETHb.address,
    kind: 'Generic',
    base: { address: baseAddresses.tokens.WETH, decimals: 18 },
    assets: [{ address: baseAddresses.tokens.WETH, decimals: 18 }],
    earnings: { rewardTokenCollected: true, passiveByDepositWithdrawal: true },
    // The old strategy drops when Master's report lands (its in-flight term collapses). That drop
    // is the same capital showing up on Master, not a loss.
    balanceUpdateLogFilters: [
      masterBalanceUpdated({ from: OETHB_V3_GOVERNANCE_BLOCK, to: OETHB_V3_MIGRATION_END_BLOCK }),
    ],
  },
  {
    chainId: 8453,
    from: 19046362,
    name: 'Aerodrome AMO Strategy',
    contractName: 'AerodromeAMOStrategy',
    address: baseAddresses.superOETHb.strategies.aerodromeAMO,
    oTokenAddress: baseAddresses.superOETHb.address,
    kind: 'Generic',
    base: { address: baseAddresses.tokens.WETH, decimals: 18 },
    assets: [{ address: baseAddresses.tokens.WETH, decimals: 18 }],
    earnings: { rewardTokenCollected: true, passiveByDepositWithdrawal: true },
    balanceUpdateLogFilters: [
      logFilter({
        address: [baseAddresses.superOETHb.strategies.aerodromeAMO],
        topic0: [aerodromeStrategyAbi.events.LiquidityAdded.topic, aerodromeStrategyAbi.events.LiquidityRemoved.topic],
      }),
    ],
  },
  baseCurveAMO,
  baseCrossChainV3Master,
]

export const baseStrategiesProcessors = [
  ...baseStrategies.map((s) => {
    return defineProcessor({
      name: s.name,
      from: s.from,
      setup: createStrategySetup(s),
      process: createStrategyProcessor(s),
    })
  }),
  ...baseStrategies
    .filter((s) => s.kind !== 'Vault')
    .map((s) => {
      return defineProcessor({
        name: s.name,
        from: s.from,
        setup: createStrategyRewardSetup(s),
        process: createStrategyRewardProcessor(s),
      })
    }),
]
