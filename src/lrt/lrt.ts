import { EvmBatchProcessor } from '@subsquid/evm-processor'
import dayjs from 'dayjs'
import { Any, IsNull, LessThan, MoreThan, MoreThanOrEqual } from 'typeorm'
import { parseEther } from 'viem'

import * as erc20 from '../abi/erc20'
import * as abi from '../abi/lrt-deposit-pool'
import {
  LRTDeposit,
  LRTPointData,
  LRTPointDataAggregate,
  LRTPointRecipient,
} from '../model'
import { Block, Context, Log } from '../processor'
import { tokens } from '../utils/addresses'
import { logFilter } from '../utils/logFilter'
import { useProcessorState } from '../utils/state'

const dayMs = 86400000

export const from = 18758282 // Contract Deploy: 0x036676389e48133b63a802f8635ad39e752d375d

export const depositPoolAddress = '0x036676389e48133b63a802f8635ad39e752d375d'
export const erc20Address = '0xa1290d69c65a6fe4df752f95823fae25cb99e5a7'

const depositFilter = logFilter({
  address: [depositPoolAddress],
  topic0: [abi.events.AssetDeposit.topic],
  range: { from },
})

const transferFilter = logFilter({
  address: [erc20Address],
  topic0: [erc20.events.Transfer.topic],
  range: { from },
})

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog(depositFilter.value)
  processor.addLog(transferFilter.value)
}
export const process = async (ctx: Context) => {
  const [state] = useLrtState(ctx)

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      if (depositFilter.matches(log)) {
        await processDeposit(ctx, block, log)
      }
      if (transferFilter.matches(log)) {
        await processTransfer(ctx, block, log)
      }
    }
  }
  await ctx.store.insert(state.deposits)
  await ctx.store.upsert([...state.depositors.values()])
  await ctx.store.insert(state.depositorPointData)
  await ctx.store.upsert([...state.pointsAggregates.values()])
}

const useLrtState = (ctx: Context) =>
  useProcessorState(ctx, 'lrt-processor', {
    pointsAggregates: new Map<string, LRTPointDataAggregate>(),
    deposits: [] as LRTDeposit[],
    depositors: new Map<string, LRTPointRecipient>(),
    depositorPointData: [] as LRTPointData[],
  })

const processDeposit = async (ctx: Context, block: Block, log: Log) => {
  const [state] = useLrtState(ctx)
  const {
    depositor: depositorAddress,
    asset,
    depositAmount,
    rsethMintAmount,
    referralId,
  } = abi.events.AssetDeposit.decode(log)
  const timestamp = new Date(block.header.timestamp)
  const deposit = new LRTDeposit({
    id: log.id,
    blockNumber: block.header.height,
    timestamp: timestamp,
    asset: asset.toLowerCase(),
    depositor: depositorAddress.toLowerCase(),
    depositAmount,
    amountReceived: rsethMintAmount,
    referralId,
  })
  state.deposits.push(deposit)
  await addPoints(ctx, {
    log,
    recipient: deposit.depositor,
    timestamp: deposit.timestamp,
    amount: deposit.amountReceived,
  })
}

const processTransfer = async (ctx: Context, block: Block, log: Log) => {
  const data = erc20.events.Transfer.decode(log)
  await transferPoints(ctx, {
    log,
    timestamp: new Date(block.header.timestamp),
    from: data.from.toLowerCase(),
    to: data.to.toLowerCase(),
    amount: data.value,
  })
}

const pointConditions = [
  { name: 'oeth-.5x', asset: tokens.OETH, endDate: null, multiplier: 50n },
  { name: 'week1-50x', endDate: new Date('2024-02-06'), multiplier: 1000n },
  { name: 'week1-40x', endDate: new Date('2024-02-07'), multiplier: 1000n },
  { name: 'week1-30x', endDate: new Date('2024-02-08'), multiplier: 1000n },
  { name: 'week1-20x', endDate: new Date('2024-02-09'), multiplier: 1900n },
  { name: 'standard', endDate: null, multiplier: 100n },
] as const

const addPoints = async (
  ctx: Context,
  params: {
    log: Log
    timestamp: Date
    recipient: string
    amount: bigint
    conditionNameFilter?: string
  },
) => {
  const [state] = useLrtState(ctx)
  const pointsBase = params.amount
  const recipient = await getRecipient(ctx, params.recipient.toLowerCase())
  for (const condition of pointConditions.filter(
    (c) => !params.conditionNameFilter || c.name === params.conditionNameFilter,
  )) {
    if (!condition.endDate || params.timestamp < condition.endDate) {
      const pointsEffective = (pointsBase * condition.multiplier) / 100n
      const points = new LRTPointData({
        recipient,
        id: `${recipient.id}:${params.log.id}:${condition.name}`,
        name: condition.name,
        balance: pointsEffective,
        startDate: params.timestamp,
        endDate: null,
        staticPoints: 0n,
      })
      recipient.pointData.push(points)
      state.depositorPointData.push(points)

      await addConditionPoints(
        ctx,
        condition.name,
        params.timestamp,
        pointsEffective,
      )
      // ctx.log.info(
      //   `Added ${points.balance} from ${condition.name} points for ${recipient.id}`,
      // )
    }
  }
}

const addConditionPoints = async (
  ctx: Context,
  conditionName: string,
  timestamp: Date,
  amount: bigint,
) => {
  const pointsAggregate = await getPointsAggregate(ctx, conditionName)
  pointsAggregate.startDate = calculatePointsDate(
    pointsAggregate.startDate,
    pointsAggregate.balance,
    timestamp,
    pointsAggregate.balance + amount,
  )
  pointsAggregate.balance += amount
}

const removePoints = async (
  ctx: Context,
  params: {
    log: Log
    timestamp: Date
    recipient: string
    amount: bigint
  },
) => {
  let amountToRemove = params.amount
  // TODO: some stuff isn't written yet so we have to look for it locally
  const pointData = await ctx.store.find(LRTPointData, {
    order: { startDate: 'asc' },
    where: [
      {
        recipient: { id: params.recipient },
        balance: MoreThan(0n),
        startDate: MoreThanOrEqual(params.timestamp),
        endDate: IsNull(),
      },
      {
        recipient: { id: params.recipient },
        balance: MoreThan(0n),
        startDate: MoreThanOrEqual(params.timestamp),
        endDate: LessThan(params.timestamp),
      },
    ],
  })
  if (!pointData.length) {
    ctx.log.info({ recipient: params.recipient, pointData: pointData.length })
    throw new Error('should have results here')
  }
  for (const data of pointData) {
    if (amountToRemove === 0n) return
    ctx.log.info({ name: 'before', amountToRemove, data })
    data.staticPoints = calculatePoints(
      data.startDate.getTime(),
      params.timestamp.getTime(),
      data.balance,
    )
    let amountRemoved = 0n
    data.startDate = params.timestamp
    if (amountToRemove > data.balance) {
      amountToRemove -= data.balance
      amountRemoved = data.balance
      data.balance = 0n
    } else {
      data.balance -= amountToRemove
      amountRemoved = amountToRemove
      amountToRemove = 0n
    }
    await removeAggregatePoints(ctx, data.name, params.timestamp, amountRemoved)
    ctx.log.info({ name: 'after', amountToRemove, data })
  }
}

const removeAggregatePoints = async (
  ctx: Context,
  conditionName: string,
  timestamp: Date,
  amount: bigint,
) => {
  throw new Error('removeAggregatePoints')
  const pointsAggregate = await getPointsAggregate(ctx, conditionName)
  pointsAggregate.startDate = calculatePointsDate(
    pointsAggregate.startDate,
    pointsAggregate.balance,
    timestamp,
    pointsAggregate.balance + amount,
  )
  pointsAggregate.balance += amount
}

const transferPoints = async (
  ctx: Context,
  params: {
    log: Log
    timestamp: Date
    from: string
    to: string
    amount: bigint
  },
) => {
  if (params.from === '0x0000000000000000000000000000000000000000') return
  await removePoints(ctx, {
    log: params.log,
    timestamp: params.timestamp,
    recipient: params.from,
    amount: params.amount,
  })
  if (params.to === '0x0000000000000000000000000000000000000000') return
  ctx.log.info(
    {
      timestamp: params.timestamp,
      from: params.from,
      to: params.to,
      amount: params.amount,
    },
    'processTransfer',
  )
  await addPoints(ctx, {
    log: params.log,
    timestamp: params.timestamp,
    recipient: params.to,
    amount: params.amount,
    conditionNameFilter: 'standard',
  })
}

const getPointsAggregate = async (ctx: Context, name: string) => {
  const [state] = useLrtState(ctx)
  const id = name
  let pointsAggregate = state.pointsAggregates.get(id)
  if (!pointsAggregate) {
    pointsAggregate = await ctx.store.get(LRTPointDataAggregate, id)
    if (!pointsAggregate) {
      pointsAggregate = new LRTPointDataAggregate({
        id,
        name,
        balance: 0n,
        endDate: null,
      })
    }
    state.pointsAggregates.set(id, pointsAggregate)
  }
  return pointsAggregate
}

const getRecipient = async (ctx: Context, id: string) => {
  const [state] = useLrtState(ctx)
  let depositor = state.depositors.get(id)
  if (!depositor) {
    depositor = await ctx.store.get(LRTPointRecipient, {
      where: { id },
      relations: { pointData: true },
    })
    if (!depositor) {
      depositor = new LRTPointRecipient({
        id,
        pointData: [],
      })
    }
    state.depositors.set(id, depositor)
  }
  return depositor
}

const calculatePointsDate = (
  dateA: Date | null | undefined,
  amountA: bigint,
  dateB: Date,
  amountB: bigint,
) => {
  const totalAmount = amountA + amountB
  const proportion = Number(amountB) / Number(totalAmount)
  const timeDifference = dateB.getTime() - (dateA ?? dateB).getTime()
  const timeAdjustment = timeDifference * proportion
  return new Date((dateA ?? dateB).getTime() + timeAdjustment)
}

/**
 * How many points have been earned since the depositor has had `amount` at `timestamp`.
 */
export const calculatePoints = (
  startTimestamp: number,
  endTimestamp: number,
  amount: bigint,
): bigint => {
  /*
  Original: https://kelp.gitbook.io/kelp/explore-rseth/kelp-miles-and-eigenlayer-points
  Kelp Miles Early = (*Amount of ETH worth of LST*) * *Number of days ** 10_000 * 1.25
  Kelp Miles = (*Amount of ETH worth of LST*) * *Number of days ** 10_000
  Adaptation(?)
  Amount Received * Number of days * 10_000
 */
  const daysSinceUpdate = (endTimestamp - startTimestamp) / dayMs
  return (
    (parseEther(daysSinceUpdate.toString()) * amount * 10_000n) /
    1_000000000_000000000n
  )
}
