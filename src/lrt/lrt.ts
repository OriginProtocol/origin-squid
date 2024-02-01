import { EvmBatchProcessor } from '@subsquid/evm-processor'
import dayjs from 'dayjs'
import { formatEther, parseEther } from 'viem'

import * as abi from '../abi/lrt-deposit-pool'
import {
  LRTDeposit,
  LRTDepositor,
  LRTDepositorPointData,
  LRTPointDataAggregate,
} from '../model'
import { Block, Context, Log } from '../processor'
import { logFilter } from '../utils/logFilter'
import { useProcessorState } from '../utils/state'

const dayMs = 86400000

export const from = 18758282 // Contract Deploy: 0x036676389e48133b63a802f8635ad39e752d375d

export const contractAddress = '0x036676389e48133b63a802f8635ad39e752d375d'

const depositFilter = logFilter({
  address: [contractAddress],
  topic0: [abi.events.AssetDeposit.topic],
  range: { from },
})

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog(depositFilter.value)
}
export const process = async (ctx: Context) => {
  const [state] = useLrtState(ctx)

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      if (depositFilter.matches(log)) {
        await processDeposit(ctx, block, log)
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
    depositors: new Map<string, LRTDepositor>(),
    depositorPointData: [] as LRTDepositorPointData[],
  })

const earlyAdopterEnd = new Date('2024-01-01')
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
  const earlyAdopter = timestamp < earlyAdopterEnd
  const depositor = await getDepositor(ctx, depositorAddress.toLowerCase())
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

  const pointsBase = rsethMintAmount
  const points = new LRTDepositorPointData({
    depositor,
    id: `${depositor.id}:${deposit.id}:standard`,
    name: 'standard',
    balance: pointsBase,
    startDate: deposit.timestamp,
    endDate: null,
  })
  depositor.pointData.push(points)
  state.depositorPointData.push(points)

  const standardPointsAggregate = await getPointsAggregate(ctx, 'standard')
  standardPointsAggregate.startDate = calculatePointsDate(
    standardPointsAggregate.startDate,
    standardPointsAggregate.balance,
    deposit.timestamp,
    standardPointsAggregate.balance + pointsBase,
  )
  standardPointsAggregate.balance += pointsBase

  if (earlyAdopter) {
    const earlyAdopterPointsBase = (pointsBase * 25n) / 100n
    const earlyAdopterPointsEndDate = dayjs
      .utc(deposit.timestamp)
      .add(90, 'days')
      .toDate()
    const earlyAdoptersPoints = new LRTDepositorPointData({
      depositor,
      id: `${depositor.id}:${deposit.id}:early-adopter`,
      name: 'early-adopter',
      balance: earlyAdopterPointsBase,
      startDate: deposit.timestamp,
      endDate: earlyAdopterPointsEndDate,
    })
    depositor.pointData.push(earlyAdoptersPoints)
    state.depositorPointData.push(earlyAdoptersPoints)

    const earlyAdopterPointsAggregate = await getPointsAggregate(
      ctx,
      'early-adopter',
    )
    earlyAdopterPointsAggregate.startDate = calculatePointsDate(
      earlyAdopterPointsAggregate.startDate,
      earlyAdopterPointsAggregate.balance,
      deposit.timestamp,
      earlyAdopterPointsAggregate.balance + earlyAdopterPointsBase,
    )
    earlyAdopterPointsAggregate.endDate = calculatePointsDate(
      earlyAdopterPointsAggregate.endDate,
      earlyAdopterPointsAggregate.balance,
      earlyAdopterPointsEndDate,
      earlyAdopterPointsAggregate.balance + earlyAdopterPointsBase,
    )
    earlyAdopterPointsAggregate.balance += earlyAdopterPointsBase
  }
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

const getDepositor = async (ctx: Context, id: string) => {
  const [state] = useLrtState(ctx)
  let depositor = state.depositors.get(id)
  if (!depositor) {
    depositor = await ctx.store.get(LRTDepositor, {
      where: { id },
      relations: { pointData: true },
    })
    if (!depositor) {
      depositor = new LRTDepositor({
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
