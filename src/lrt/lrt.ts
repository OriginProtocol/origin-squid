import { EvmBatchProcessor } from '@subsquid/evm-processor'
import dayjs from 'dayjs'
import { countBy, remove } from 'lodash'
import { MoreThan } from 'typeorm'

import * as erc20 from '../abi/erc20'
import * as abi from '../abi/lrt-deposit-pool'
import {
  LRTBalanceCondition,
  LRTBalanceData,
  LRTDeposit,
  LRTPointRecipient,
  LRTSummary,
} from '../model'
import { Block, Context, Log } from '../processor'
import { tokens } from '../utils/addresses'
import { logFilter } from '../utils/logFilter'
import {
  balanceMultiplier,
  calculateRecipientsPoints,
  calculateTimespanEarned,
} from './calculation'
import { balanceBonuses, pointConditions } from './config'
import { getBalanceDataForRecipient, getRecipient, useLrtState } from './state'

export const depositPoolAddress = '0x036676389e48133b63a802f8635ad39e752d375d'

export const from = 18758282 // Contract Deploy: 0x036676389e48133b63a802f8635ad39e752d375d

const depositFilter = logFilter({
  address: [depositPoolAddress],
  topic0: [abi.events.AssetDeposit.topic],
  range: { from },
})

const transferFilter = logFilter({
  address: [tokens.primeETH],
  topic0: [erc20.events.Transfer.topic],
  range: { from },
})

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog(depositFilter.value)
  processor.addLog(transferFilter.value)
}
export const process = async (ctx: Context) => {
  // ============================
  // Process chain data
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

  // ============================
  // Save
  await ctx.store.insert(state.deposits)
  await ctx.store.upsert([...state.recipients.values()])
  await ctx.store.insert(state.balanceData)
  await ctx.store.insert(state.balanceCondition)

  // ============================
  // Do point calculations, maybe
  const lastBlock = ctx.blocks[ctx.blocks.length - 1]
  const lastSummary = await ctx.store
    .find(LRTSummary, {
      take: 1,
      order: { id: 'desc' },
    })
    .then((r) => r[0])
  const lastBlockDate = dayjs.utc(lastBlock.header.timestamp)
  const lastSummaryDate = dayjs.utc(lastSummary?.timestamp ?? 0)
  const shouldUpdateSummary = lastBlockDate.isAfter(
    lastSummaryDate.add(1, 'hour'),
  )

  // TODO: Could update more precisely at the beginning of the hour.
  // This is a big update - we load everything!
  // Can iterate through this in batches later if needed.
  if (shouldUpdateSummary) {
    const recipients = await ctx.store.find(LRTPointRecipient, {
      where: { balance: MoreThan(0n) },
      relations: {
        balanceData: {
          recipient: true,
          conditions: true,
        },
      },
    })

    // Create Summary
    const summary = new LRTSummary({
      id: lastBlock.header.id,
      timestamp: new Date(lastBlock.header.timestamp),
      blockNumber: lastBlock.header.height,
      balance: recipients.reduce((sum, r) => sum + r.balance, 0n),
      points: calculateRecipientsPoints(lastBlock.header.timestamp, recipients),
    })
    await ctx.store.insert(summary)
    await ctx.store.save(recipients)

    // Save Updated Balance Data (from `calculateRecipientsPoints`)
    const updatedBalanceData = recipients.flatMap((r) => r.balanceData)
    await ctx.store.save(updatedBalanceData)

    // Clear Expired Conditions
    const expiredConditions = recipients.flatMap((r) =>
      r.balanceData.flatMap((bd) =>
        bd.conditions.filter(
          (c) => c.endDate && c.endDate < bd.staticPointsDate,
        ),
      ),
    )
    if (expiredConditions.length) {
      // TODO: investigate strange output
      ctx.log.info(
        countBy(expiredConditions, 'name'),
        'Removing expired conditions',
      )
      if (expiredConditions.length < 20) {
        ctx.log.info(expiredConditions)
      }
    }
    await ctx.store.remove(expiredConditions)
  }
}

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
    depositAsset: deposit.asset,
    recipient: deposit.depositor,
    timestamp: deposit.timestamp,
    balance: deposit.amountReceived,
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

const addPoints = async (
  ctx: Context,
  params: {
    log: Log
    timestamp: Date
    recipient: string
    balance: bigint
    depositAsset?: string
    conditionNameFilter?: string
  },
) => {
  const [state] = useLrtState(ctx)
  const recipient = await getRecipient(ctx, params.recipient.toLowerCase())
  recipient.balance += params.balance
  const balanceData = new LRTBalanceData({
    id: params.log.id,
    recipient,
    balance: params.balance,
    staticPointsDate: params.timestamp,
    staticPoints: 0n,
    conditions: [],
  })
  recipient.balanceData.push(balanceData)
  state.balanceData.push(balanceData)

  const conditions = pointConditions.filter(
    (c) =>
      (!params.conditionNameFilter || c.name === params.conditionNameFilter) &&
      (!c.asset || params.depositAsset === c.asset) &&
      (!c.endDate || params.timestamp < c.endDate),
  )
  for (const condition of conditions) {
    const balanceCondition = new LRTBalanceCondition({
      balanceData,
      id: `${params.log.id}:${condition.name}`,
      name: condition.name,
      multiplier: condition.multiplier,
      startDate: params.timestamp,
      endDate: condition.endDate,
    })
    balanceData.conditions.push(balanceCondition)
    state.balanceCondition.push(balanceCondition)

    // ctx.log.info(
    //   `Added ${points.balance} from ${condition.name} points for ${recipient.id}`,
    // )
  }
}

const removePoints = async (
  ctx: Context,
  params: {
    log: Log
    timestamp: Date
    recipient: string
    balance: bigint
  },
) => {
  const [state] = useLrtState(ctx)
  const recipient = await getRecipient(ctx, params.recipient)
  recipient.balance -= params.balance
  let amountToRemove = params.balance
  const balanceData = await getBalanceDataForRecipient(
    ctx,
    params.timestamp,
    params.recipient,
  )
  if (!balanceData.length) {
    throw new Error('should have results here')
  }
  for (const data of balanceData) {
    if (amountToRemove === 0n) return
    for (const condition of data.conditions) {
      data.staticPoints = calculateTimespanEarned(
        condition.startDate.getTime(),
        params.timestamp.getTime(),
        data.balance,
        condition.multiplier + balanceMultiplier(recipient.balance),
      )
      condition.startDate = params.timestamp
      if (amountToRemove > data.balance) {
        amountToRemove -= data.balance
        data.balance = 0n
      } else {
        data.balance -= amountToRemove
        amountToRemove = 0n
      }
    }
    if (data.balance === 0n && data.staticPoints === 0n) {
      remove(state.balanceData, data)
      for (const condition of data.conditions) {
        remove(state.balanceCondition, condition)
      }
    }
  }
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
  // ctx.log.info({ from: params.from, to: params.to }, 'transferPoints')
  if (params.from === '0x0000000000000000000000000000000000000000') return
  await removePoints(ctx, {
    log: params.log,
    timestamp: params.timestamp,
    recipient: params.from,
    balance: params.amount,
  })
  if (params.to === '0x0000000000000000000000000000000000000000') return
  // ctx.log.info(
  //   {
  //     timestamp: params.timestamp,
  //     from: params.from,
  //     to: params.to,
  //     amount: params.amount,
  //   },
  //   'processTransfer',
  // )
  await addPoints(ctx, {
    log: params.log,
    timestamp: params.timestamp,
    recipient: params.to,
    balance: params.amount,
    conditionNameFilter: 'standard',
  })
}
