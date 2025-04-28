import dayjs from 'dayjs'
import { compact } from 'lodash'
import { LessThan } from 'typeorm'
import { formatEther } from 'viem'

import * as baseRewardPool from '@abi/base-reward-pool'
import * as erc20 from '@abi/erc20'
import * as abstractStrategyAbi from '@abi/initializable-abstract-strategy'
import { StrategyYield } from '@model'
import { Block, Context, EvmBatchProcessor, blockFrequencyTracker, logFilter } from '@originprotocol/squid-utils'
import { convertRate, ensureExchangeRates } from '@shared/post-processors/exchange-rates'
import { CurrencyAddress, MainnetCurrency } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import {
  OETH_ADDRESS,
  OETH_DRIPPER_ADDRESS,
  OETH_DRIPPER_ADDRESS_OLD,
  OETH_HARVESTER_ADDRESS,
  OETH_HARVESTER_SIMPLE_ADDRESS,
  OETH_HARVESTER_SIMPLE_ADDRESS_2,
  OUSD_ADDRESS,
  OUSD_DRIPPER_ADDRESS,
  OUSD_HARVESTER_ADDRESS,
  USDT_ADDRESS,
  WETH_ADDRESS,
  addresses,
  mainnetTokens,
} from '@utils/addresses'
import { baseAddresses } from '@utils/addresses-base'
import { plumeAddresses } from '@utils/addresses-plume'
import { sonicAddresses } from '@utils/addresses-sonic'
import { convertDecimals, lastExcept } from '@utils/utils'

import { IStrategyData } from './strategy'
import { processStrategyDailyEarnings } from './strategy-daily-earnings'

const eth1 = 1000000000000000000n

const depositWithdrawalFilter = (strategyData: IStrategyData) =>
  logFilter({
    address: [strategyData.address],
    topic0: [abstractStrategyAbi.events.Deposit.topic, abstractStrategyAbi.events.Withdrawal.topic],
    range: { from: strategyData.from },
  })

const curvePoolFilter = (strategyData: IStrategyData) =>
  logFilter({
    address: [strategyData.curvePoolInfo!.rewardsPoolAddress],
    topic0: [baseRewardPool.events.Staked.topic, baseRewardPool.events.Withdrawn.topic],
    topic1: [strategyData.address],
    range: { from: strategyData.from },
  })

const balancerPoolFilter = (strategyData: IStrategyData) =>
  logFilter({
    address: [strategyData.balancerPoolInfo!.rewardPoolAddress],
    topic0: [baseRewardPool.events.Staked.topic, baseRewardPool.events.Withdrawn.topic],
    topic1: [strategyData.address],
    range: { from: strategyData.from },
  })

const rewardTokenCollectedFilter = (strategyData: IStrategyData) =>
  logFilter({
    address: [strategyData.address],
    topic0: [abstractStrategyAbi.events.RewardTokenCollected.topic],
    range: { from: strategyData.from },
  })

const rewardTokenCollectedTransfersFilter = (strategyData: IStrategyData) =>
  logFilter({
    address: [...oTokenValues[strategyData.oTokenAddress].rewardConversionToken],
    topic0: [erc20.events.Transfer.topic],
    topic1: [...oTokenValues[strategyData.oTokenAddress].harvester],
    topic2: [...oTokenValues[strategyData.oTokenAddress].harvesterTargets],
    range: { from: strategyData.from },
  })

const oTokenValues = {
  [OUSD_ADDRESS]: {
    rewardConversionToken: [USDT_ADDRESS],
    rewardConversionTokenDecimals: 6,
    harvester: [OUSD_HARVESTER_ADDRESS],
    harvesterTargets: [OUSD_DRIPPER_ADDRESS, addresses.multisig['multichain-guardian']],
  },
  [OETH_ADDRESS]: {
    rewardConversionToken: [WETH_ADDRESS, mainnetTokens.CRV, mainnetTokens.CVX],
    rewardConversionTokenDecimals: 18,
    saveAsAsset: WETH_ADDRESS,
    harvester: [OETH_HARVESTER_ADDRESS, OETH_HARVESTER_SIMPLE_ADDRESS, OETH_HARVESTER_SIMPLE_ADDRESS_2],
    harvesterTargets: [OETH_DRIPPER_ADDRESS, OETH_DRIPPER_ADDRESS_OLD, addresses.multisig['multichain-guardian']],
  },
  [baseAddresses.superOETHb.address]: {
    rewardConversionToken: [baseAddresses.tokens.WETH],
    rewardConversionTokenDecimals: 18,
    harvester: [baseAddresses.multisig['2/8'], baseAddresses.multisig['multichain-guardian']],
    harvesterTargets: [baseAddresses.superOETHb.dripper, baseAddresses.multisig['multichain-guardian']],
  },
  [sonicAddresses.OS.address]: {
    rewardConversionToken: [sonicAddresses.tokens.wS],
    rewardConversionTokenDecimals: 18,
    harvester: [sonicAddresses.OS.harvester],
    harvesterTargets: [sonicAddresses.OS.dripper, sonicAddresses.multisig['multichain-guardian']],
  },
  [plumeAddresses.superOETHp.address]: {
    rewardConversionToken: [sonicAddresses.tokens.WETH],
    rewardConversionTokenDecimals: 18,
    harvester: compact<string>([plumeAddresses.superOETHp.harvester]),
    harvesterTargets: [plumeAddresses.superOETHp.dripper, sonicAddresses.multisig['multichain-guardian']],
  },
} as const

export const setupStrategyEarnings = (processor: EvmBatchProcessor, strategyData: IStrategyData) => {
  if (!oTokenValues[strategyData.oTokenAddress]) {
    throw new Error(`\`oTokenValues\` is not set up for ${strategyData.oTokenAddress}`)
  }

  processor.includeAllBlocks({ from: strategyData.from })
  const balanceUpdateFilters = strategyData.balanceUpdateLogFilters ?? []
  strategyData.balanceUpdateLogFilters = balanceUpdateFilters

  // Detect Deposit/Withdraw events
  // To help us understand when balances change passively vs from activity.
  if (strategyData.earnings?.passiveByDepositWithdrawal) {
    processor.addLog(depositWithdrawalFilter(strategyData).value)

    // Detect Staked/Withdrawn events
    // The curve incident caused us to fully withdraw from our pool and these logs contain that.
    if (strategyData.kind === 'CurveAMO') {
      balanceUpdateFilters.push(curvePoolFilter(strategyData))
    }
  }
  for (const filter of strategyData.balanceUpdateTraceFilters ?? []) {
    processor.addTrace(filter.value)
  }

  if (strategyData.kind === 'BalancerMetaStablePool') {
    processor.addLog(balancerPoolFilter(strategyData).value)
  }

  // Listen for RewardTokenCollected events and their associated logs
  //  showing how much WETH Harvester sent to Dripper.
  if (strategyData.earnings?.rewardTokenCollected) {
    processor.addLog(rewardTokenCollectedFilter(strategyData).value)
    processor.addLog(rewardTokenCollectedTransfersFilter(strategyData).value)
  }

  if (strategyData.kind === 'Vault') {
    balanceUpdateFilters.push(
      logFilter({
        address: strategyData.assets.map((asset) => asset.address),
        topic0: [erc20.events.Transfer.topic],
        topic1: [strategyData.address],
        range: { from: strategyData.from },
      }),
      logFilter({
        address: strategyData.assets.map((asset) => asset.address),
        topic0: [erc20.events.Transfer.topic],
        topic2: [strategyData.address],
        range: { from: strategyData.from },
      }),
    )
  }

  for (const filter of balanceUpdateFilters) {
    processor.addLog(filter.value)
  }
}

const trackers = new Map<string, ReturnType<typeof blockFrequencyTracker>>()
export const processStrategyEarnings = async (
  ctx: Context,
  strategyData: IStrategyData,
  getStrategyBalances: (
    ctx: Context,
    block: {
      height: number
    },
    strategyData: IStrategyData,
  ) => Promise<
    {
      address: string
      asset: string
      balance: bigint
    }[]
  >,
) => {
  const days = new Map<string, Block>()
  const strategyYields = new Map<string, StrategyYield[]>()
  for (const block of ctx.blocks) {
    let didUpdate = false
    days.set(dayjs.utc(block.header.timestamp).format('YYYY-MM-DD'), block)
    const txIgnore = new Set<string>()
    const getBalances = async (
      {
        compare,
      }: {
        compare: number
      } = { compare: -1 },
    ) => {
      const compareBalances = await getStrategyBalances(ctx, { height: block.header.height + compare }, strategyData)
      const balances = compare === 0 ? compareBalances : await getStrategyBalances(ctx, block.header, strategyData)
      return balances
        .map((balance, i) => {
          return {
            asset: balance.asset,
            balance: balance.balance,
            compareBalance: compareBalances[i].balance,
          }
        })
        .map((b) => {
          b.balance = convertDecimals(
            strategyData.assets.find((a) => a.address.toLowerCase() === b.asset.toLowerCase())!.decimals,
            strategyData.base.decimals,
            b.balance,
          )
          b.compareBalance = convertDecimals(
            strategyData.assets.find((a) => a.address.toLowerCase() === b.asset.toLowerCase())!.decimals,
            strategyData.base.decimals,
            b.compareBalance,
          )
          return b
        })
    }
    const balanceTrackingUpdate = async () => {
      // ctx.log.info(`balanceTrackingUpdate`)
      didUpdate = true
      const balances = await getBalances()
      await processDepositWithdrawal(ctx, strategyData, block, strategyYields, balances)
    }

    if (strategyData.balanceUpdateTraceFilters && strategyData.balanceUpdateTraceFilters.length > 0) {
      for (const trace of block.traces) {
        if (strategyData.balanceUpdateTraceFilters.find((f) => f.matches(trace))) {
          await balanceTrackingUpdate()
        }
      }
    }

    for (const log of block.logs) {
      const rewardTokenCollectedUpdate = async () => {
        // ctx.log.info(`rewardTokenCollectedUpdate`)
        didUpdate = true
        txIgnore.add(log.transactionHash)

        // Example for OETH: Pull all WETH transfers from harvester to the dripper.
        const earningsTransferLogs = block.logs.filter(
          (l) =>
            l.transactionHash === log.transactionHash && rewardTokenCollectedTransfersFilter(strategyData).matches(l),
        )

        const values = oTokenValues[strategyData.oTokenAddress]
        const saveAsAsset = 'saveAsAsset' in values ? values.saveAsAsset : null
        let amount = 0n
        for (const log of earningsTransferLogs) {
          const data = erc20.events.Transfer.decode(log)
          amount += await convertRate(
            ctx,
            block,
            log.address as CurrencyAddress,
            saveAsAsset ?? (log.address as CurrencyAddress),
            data.value,
          )
        }

        await processRewardTokenCollected(ctx, strategyData, block, strategyYields, {
          token: strategyData.base.address,
          amount: convertDecimals(
            oTokenValues[strategyData.oTokenAddress].rewardConversionTokenDecimals,
            strategyData.base.decimals,
            amount,
          ),
        })
      }

      if (strategyData.kind === 'BalancerMetaStablePool' && balancerPoolFilter(strategyData).matches(log)) {
        await balanceTrackingUpdate()
      } else if (strategyData.balanceUpdateLogFilters?.find((f) => f.matches(log))) {
        await balanceTrackingUpdate()
      } else if (
        strategyData.earnings?.passiveByDepositWithdrawal &&
        depositWithdrawalFilter(strategyData).matches(log)
      ) {
        await balanceTrackingUpdate()
      } else if (rewardTokenCollectedFilter(strategyData).matches(log) && !txIgnore.has(log.transactionHash)) {
        await rewardTokenCollectedUpdate()
      }
    }

    if (!didUpdate) {
      let tracker = trackers.get(strategyData.address)
      if (!tracker) {
        tracker = blockFrequencyTracker({ from: strategyData.from })
        trackers.set(strategyData.address, tracker)
      }
      if (tracker(ctx, block) || (block.header.height > strategyData.from && ctx.latestBlockOfDay(block))) {
        const balances = await getBalances({ compare: 0 })
        await processDepositWithdrawal(ctx, strategyData, block, strategyYields, balances)
      }
    }
  }
  const results = [...strategyYields.values()].flat()
  await ctx.store.upsert(results)
  await processStrategyDailyEarnings(ctx, [...days.values()], strategyData)
}

const processRewardTokenCollected = async (
  ctx: Context,
  strategyData: IStrategyData,
  block: Block,
  resultMap: Map<string, StrategyYield[]>,
  params: {
    token: string
    amount: bigint
  },
) => {
  const id = `${block.header.height}:${strategyData.address}:${strategyData.base.address}`
  // ctx.log.info(`processRewardTokenCollected ${id}`)
  // ctx.log.info(`Amount earned through rewards: ${formatEther(params.amount)}`)
  let { latest, current, results } = await getLatest(ctx, block, resultMap, strategyData, strategyData.base.address, id)

  const amount = params.amount
  if (!current) {
    current = new StrategyYield({
      id,
      blockNumber: block.header.height,
      timestamp: new Date(block.header.timestamp),
      otoken: strategyData.oTokenAddress,
      strategy: strategyData.address,
      asset: strategyData.base.address,
      balance: latest?.balance ?? 0n,
      balanceWeight: latest?.balanceWeight ?? 1,
      earnings: (latest?.earnings ?? 0n) + amount,
      earningsChange: amount,
    })
    results.push(current)
  } else {
    current.earnings += amount
    current.earningsChange += amount
  }
  // if (current.earningsChange > 0) {
  //   ctx.log.info(
  //     `reward  ${id} ${current.balance} ${current.earnings} ${current.earningsChange}`,
  //   )
  // }
}

const processDepositWithdrawal = async (
  ctx: Context,
  strategyData: IStrategyData,
  block: Block,
  resultMap: Map<string, StrategyYield[]>,
  assets: {
    asset: string
    compareBalance: bigint
    balance: bigint
  }[],
) => {
  const id = `${block.header.height}:${strategyData.address}:${strategyData.base.address}`
  // ctx.log.info(assets, `processDepositWithdrawal ${id}`)
  let { latest, current, results } = await getLatest(ctx, block, resultMap, strategyData, strategyData.base.address, id)

  // Convert incoming values to ETH
  const desiredRates = strategyData.assets.filter((a) => a.convertTo).map((a) => [a.convertTo!.address, a.address]) as [
    MainnetCurrency,
    MainnetCurrency,
  ][]
  await ensureExchangeRates(ctx, block, desiredRates)
  let previousBalance = 0n
  for (let index = 0; index < assets.length; index++) {
    const a = assets[index]
    const asset = strategyData.assets[index]
    previousBalance += asset.convertTo
      ? await convertRate(ctx, block, 'ETH', a.asset as MainnetCurrency, a.compareBalance)
      : a.compareBalance
  }
  let balance = 0n
  for (let index = 0; index < assets.length; index++) {
    const a = assets[index]
    const asset = strategyData.assets[index]
    balance += asset.convertTo ? await convertRate(ctx, block, 'ETH', a.asset as MainnetCurrency, a.balance) : a.balance
  }

  const otokenBalance = assets.find((a) => a.asset.toLowerCase() === strategyData.oTokenAddress)?.balance ?? 0n

  const balanceWeightN = eth1 - (balance === 0n ? 0n : (otokenBalance * eth1) / balance)
  const balanceWeight = Number(formatEther(balanceWeightN))

  const timestamp = new Date(block.header.timestamp)
  let earningsChange = previousBalance - (latest?.balance ?? previousBalance)

  // TODO: ??? Probably should listen for add/remove liquidity events
  //  and calculate earnings changes from fees rather than relying on this
  //  picking up those events. It works fine in some pools, but if we want to
  //  remove OETH from APY considerations then we need more detail.
  if (strategyData.kind === 'CurveAMO') {
    // Only consider earnings on this event by ETH proportion.
    earningsChange *= balanceWeightN / eth1
  }

  // There may be an existing entry on this block from RewardTokenCollected
  if (current) {
    current.balance = balance
    current.balanceWeight = balanceWeight
    current.earnings += earningsChange
    current.earningsChange += earningsChange
  } else {
    current = new StrategyYield({
      id,
      blockNumber: block.header.height,
      timestamp,
      otoken: strategyData.oTokenAddress,
      strategy: strategyData.address,
      asset: strategyData.base.address,
      balance,
      balanceWeight,
      earningsChange,
      earnings: (latest?.earnings ?? 0n) + earningsChange,
    })
    // ctx.log.info(
    //   `${block.header.height} Setting balance: ${formatEther(
    //     balance,
    //   )}, last balance: ${formatEther(
    //     latest?.balance ?? 0n,
    //   )}, previous block balance: ${formatEther(
    //     previousBalance,
    //   )}, perceived earnings: ${formatEther(
    //     earningsChange,
    //   )}, total earnings: ${formatEther(current.earnings)}`,
    // )

    if (earningsChange < 0) {
      ctx.log.warn('WARNING: earnings change is negative')
    }

    // Avoid creating this if nothing has changed.
    if (
      !(
        latest &&
        latest.strategy === current.strategy &&
        latest.asset === current.asset &&
        latest.balance === current.balance &&
        latest.balanceWeight === current.balanceWeight &&
        latest.earnings === current.earnings
      )
    ) {
      results.push(current)
    }
    // if (current.earningsChange > 0) {
    //   ctx.log.info(
    //     `balance ${id} ${current.balance} ${current.earnings} ${current.earningsChange}`,
    //   )
    // }
  }
}

const getLatest = async (
  ctx: Context,
  block: Block,
  resultMap: Map<string, StrategyYield[]>,
  strategyData: IStrategyData,
  asset: string,
  id: string,
) => {
  let results = resultMap.get(asset)
  if (!results) {
    results = []
    resultMap.set(asset, results)
  }
  const latest =
    lastExcept(resultMap.get(asset), id) ??
    (await ctx.store.findOne(StrategyYield, {
      order: { blockNumber: 'desc' },
      where: {
        blockNumber: LessThan(block.header.height),
        strategy: strategyData.address,
        asset,
      },
    }))
  const current = resultMap.get(asset)?.find((l) => l.id === id)
  return { latest, current, results }
}
