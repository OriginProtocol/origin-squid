import { EvmBatchProcessor } from '@subsquid/evm-processor'
import dayjs from 'dayjs'
import { countBy, remove } from 'lodash'
import { MoreThan } from 'typeorm'

import * as abiNodeDelegator from '../abi/el-node-delegator'
import * as abiErc20 from '../abi/erc20'
import * as abiDepositPool from '../abi/lrt-deposit-pool'
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
import { calculateRecipientsPoints } from './calculation'
import { pointConditions } from './config'
import { getBalanceDataForRecipient, getRecipient, useLrtState } from './state'

// LRT Addresses: https://github.com/oplabs/primestaked-eth/blob/main/README.md
export const addresses = {
  primeETH: '0x6ef3D766Dfe02Dc4bF04aAe9122EB9A0Ded25615',
  lrtDepositPools: '0xA479582c8b64533102F6F528774C536e354B8d32',
  nodeDelegators: ['0x8bBBCB5F4D31a6db3201D40F478f30Dc4F704aE2'],
}

// export const nodeDelegators = [
//   '0x07b96Cf1183C9BFf2E43Acf0E547a8c4E4429473',
//   '0x429554411C8f0ACEEC899100D3aacCF2707748b3',
//   '0x92B4f5b9ffa1b5DB3b976E89A75E87B332E6e388',
//   '0x9d2Fc9287e1c3A1A814382B40AAB13873031C4ad',
//   '0xe8038228ff1aEfD007D7A22C9f08DDaadF8374E4',
// ]

const lsts = {
  '0xbe9895146f7af43049ca1c1ae358b0541ea49704': 'cbETH',
  '0xe95a203b1a91a908f9b9ce46459d101078c2c3cb': 'ankrETH',
  '0xae78736cd615f374d3085123a210448e74fc6393': 'rETH',
  '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3': 'OETH',
  '0xf951e335afb289353dc249e82926178eac7ded78': 'swETH',
  '0x8c1bed5b9a0928467c9b1341da1d7bd5e10b6549': 'lsETH',
  '0xf1c9acdc66974dfb6decb12aa385b9cd01190e38': 'osETH',
  '0xa35b1b31ce002fbf2058d22f30f95d405200a15b': 'ETHx',
  '0xd5f7838f5c461feff7fe49ea5ebaf7728bb0adfa': 'mETH',
  '0xac3e018457b222d93114458476f3e3416abbe38f': 'sfrxETH',
  '0xa2e3356610840701bdf5611a53974510ae27e2e1': 'wBETH',
  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84': 'stETH',
}

export const from = 19143860 // Contract Deploy: 0xA479582c8b64533102F6F528774C536e354B8d32

const depositFilter = logFilter({
  address: [addresses.lrtDepositPools],
  topic0: [abiDepositPool.events.AssetDeposit.topic],
  range: { from },
})

const transferFilter = logFilter({
  address: [tokens.primeETH],
  topic0: [abiErc20.events.Transfer.topic],
  range: { from },
})

const assetDepositIntoStrategyFilter = logFilter({
  address: addresses.nodeDelegators,
  topic0: [abiNodeDelegator.events.AssetDepositIntoStrategy.topic],
  range: { from },
})

// AssetDepositIntoStrategy

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog(depositFilter.value)
  processor.addLog(transferFilter.value)
  processor.addLog(assetDepositIntoStrategyFilter.value)
}
export const process = async (ctx: Context) => {
  // ============================
  // Process chain data
  const state = useLrtState(ctx)
  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      if (depositFilter.matches(log)) {
        await processDeposit(ctx, block, log)
      }
      if (transferFilter.matches(log)) {
        await processTransfer(ctx, block, log)
      }
      if (assetDepositIntoStrategyFilter.matches(log)) {
        await processAssetDepositIntoStrategy(ctx, block, log)
      }
    }
  }

  // ============================
  // Save
  await ctx.store.insert([...state.deposits.values()])
  await ctx.store.upsert([...state.recipients.values()])
  await ctx.store.insert([...state.balanceData.values()])
  await ctx.store.insert([...state.balanceCondition.values()])
  await ctx.store.upsert([...state.nodeDelegators.values()])

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
  const state = useLrtState(ctx)
  const {
    depositor: depositorAddress,
    asset,
    depositAmount,
    primeEthMintAmount,
    referralId,
  } = abiDepositPool.events.AssetDeposit.decode(log)
  ctx.log.info(
    `${block.header.height} processDeposit: ${depositorAddress} ${log.transactionHash}`,
  )
  const timestamp = new Date(block.header.timestamp)
  const deposit = new LRTDeposit({
    id: log.id,
    blockNumber: block.header.height,
    timestamp: timestamp,
    asset: asset.toLowerCase(),
    depositor: depositorAddress.toLowerCase(),
    depositAmount,
    amountReceived: primeEthMintAmount,
    referralId,
  })
  state.deposits.set(deposit.id, deposit)
  await addPoints(ctx, {
    log,
    depositAsset: deposit.asset,
    recipient: deposit.depositor,
    timestamp: deposit.timestamp,
    balance: deposit.amountReceived,
  })
}

const processTransfer = async (ctx: Context, block: Block, log: Log) => {
  const data = abiErc20.events.Transfer.decode(log)
  ctx.log.info(
    `${block.header.height} processTransfer: ${data.from} ${data.to} ${log.transactionHash}`,
  )
  await transferPoints(ctx, {
    log,
    timestamp: new Date(block.header.timestamp),
    from: data.from.toLowerCase(),
    to: data.to.toLowerCase(),
    amount: data.value,
  })
}

const processAssetDepositIntoStrategy = async (
  ctx: Context,
  block: Block,
  log: Log,
) => {}

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
  const state = useLrtState(ctx)
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
  state.balanceData.set(balanceData.id, balanceData)

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
    state.balanceCondition.set(balanceCondition.id, balanceCondition)

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
  const state = useLrtState(ctx)
  const recipient = await getRecipient(ctx, params.recipient)
  calculateRecipientsPoints(params.timestamp.getTime(), [recipient])
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
    if (amountToRemove > data.balance) {
      amountToRemove -= data.balance
      data.balance = 0n
    } else {
      data.balance -= amountToRemove
      amountToRemove = 0n
    }
    if (data.balance === 0n && data.staticPoints === 0n) {
      state.balanceData.delete(data.id)
      for (const condition of data.conditions) {
        state.balanceCondition.delete(condition.id)
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
