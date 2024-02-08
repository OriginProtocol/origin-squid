import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { MoreThan } from 'typeorm'
import { parseEther } from 'viem'

import * as abiNodeDelegator from '../abi/el-node-delegator'
import * as abiStrategyManager from '../abi/el-strategy-manager'
import * as abiErc20 from '../abi/erc20'
import * as abiDepositPool from '../abi/lrt-deposit-pool'
import {
  LRTBalanceData,
  LRTDeposit,
  LRTNodeDelegator,
  LRTNodeDelegatorHoldings,
  LRTPointRecipient,
  LRTSummary,
} from '../model'
import { Block, Context, Log } from '../processor'
import { tokens } from '../utils/addresses'
import { logFilter } from '../utils/logFilter'
import { calculateRecipientsPoints } from './calculation'
import * as config from './config'
import {
  getBalanceDataForRecipient,
  getLastSummary,
  getLatestNodeDelegator,
  getRecipient,
  saveAndResetState,
  useLrtState,
} from './state'

// Export
export const from = config.startBlock

// CONSTANTS
const RANGE = { from: config.startBlock }
const HOUR_MS = 3600000
const MINUTE5_MS = 300000

// FILTERS
const depositFilter = logFilter({
  address: [config.addresses.lrtDepositPool],
  topic0: [abiDepositPool.events.AssetDeposit.topic],
  range: RANGE,
})
const transferFilter = logFilter({
  address: [config.addresses.lrtToken],
  topic0: [abiErc20.events.Transfer.topic],
  range: RANGE,
})
const assetDepositIntoStrategyFilter = logFilter({
  address: config.addresses.nodeDelegators.map((n) => n.address),
  topic0: [abiNodeDelegator.events.AssetDepositIntoStrategy.topic],
  range: RANGE,
})

// AssetDepositIntoStrategy
export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog(depositFilter.value)
  processor.addLog(transferFilter.value)
  processor.addLog(assetDepositIntoStrategyFilter.value)
  processor.includeAllBlocks(RANGE) // need for the hourly processing
}

// we use this variable to keep track of the last hour we processed
// this increases every time we process a block that is in a new hour
let lastMinute5Processed = 0
let lastHourProcessed = 0
let haveNodeDelegatorInstance = false
export const initialize = async (ctx: Context) => {
  const nodeDelegator = await ctx.store
    .find(LRTNodeDelegator, { take: 1 })
    .then((n) => n[0])
  haveNodeDelegatorInstance = !!nodeDelegator

  const summary = await getLastSummary(ctx)
  lastHourProcessed = summary
    ? Math.floor(summary.timestamp.getTime() / HOUR_MS)
    : 0

  const state = useLrtState()
  const recipients = await ctx.store.find(LRTPointRecipient, {
    where: { balance: MoreThan(0n) },
    relations: {
      balanceData: {
        recipient: true,
      },
    },
  })
  for (const recipient of recipients) {
    state.recipients.set(recipient.id, recipient)
  }
}

export const process = async (ctx: Context) => {
  // ============================
  // Process chain data
  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      if (depositFilter.matches(log)) {
        await processDeposit(ctx, block, log)
      }
      if (transferFilter.matches(log)) {
        await processTransfer(ctx, block, log)
      }
      if (assetDepositIntoStrategyFilter.matches(log)) {
        haveNodeDelegatorInstance = true
        await createLRTNodeDelegator(ctx, block, log.address.toLowerCase())
      }
    }
    // await processHourly(ctx, block)
  }
  if (ctx.isHead) {
    // If we're at the latest block, process summary every 5 minutes.
    await processMinute5(ctx, ctx.blocks[ctx.blocks.length - 1])
  }
  await saveAndResetState(ctx)
}

const processHourly = async (ctx: Context, block: Block) => {
  const blockHour = Math.floor(block.header.timestamp / HOUR_MS)
  const state = useLrtState()

  if (lastHourProcessed !== blockHour) {
    ctx.log.info(
      `Processing hour: ${blockHour} ${new Date(block.header.timestamp)}`,
    )

    // ensure that we don't miss any hours
    const hoursPassed = blockHour - lastHourProcessed
    if (lastHourProcessed !== 0 && hoursPassed !== 1) {
      ctx.log.info({
        lastHourProcessed,
        hoursPassed,
        blockHour,
      })
      throw new Error('Something is wrong. We should trigger once per hour.')
    }

    await saveAndResetState(ctx)
    const { summary, recipients } = await createSummary(ctx, block)
    await calculateELPoints(ctx, block, summary, recipients)
    lastHourProcessed = blockHour
  }
}

const processMinute5 = async (ctx: Context, block: Block) => {
  const blockMinute5 = Math.floor(block.header.timestamp / MINUTE5_MS)
  if (lastMinute5Processed !== blockMinute5) {
    ctx.log.info(
      `Processing minute 5: ${blockMinute5} ${new Date(
        block.header.timestamp,
      )}`,
    )

    // ensure that we don't miss any hours
    // const minute5Passed = blockMinute5 - lastMinute5Processed
    // if (lastMinute5Processed !== 0 && minute5Passed !== 1) {
    //   ctx.log.info({
    //     lastMinute5Processed,
    //     minute5Passed,
    //     blockMinute5,
    //   })
    //   throw new Error(
    //     'Something is wrong. We should trigger once per 5 minutes.',
    //   )
    // }

    await saveAndResetState(ctx)
    const { summary, recipients } = await createSummary(ctx, block)
    await calculateELPoints(ctx, block, summary, recipients)
    lastMinute5Processed = blockMinute5
  }
}

const createSummary = async (ctx: Context, block: Block) => {
  const state = useLrtState()
  const lastSummary = await getLastSummary(ctx)

  // This is a big update - we load everything!
  // Can iterate through this in batches later if needed.
  const recipients = [...state.recipients.values()]

  if (lastSummary?.id === block.header.id) {
    // The hourly run likely already created this.
    return { summary: lastSummary, recipients }
  }

  const calculationResult = await calculateRecipientsPoints(
    ctx,
    block.header.timestamp,
    recipients,
  )

  // Create Summary
  const summary = new LRTSummary({
    id: block.header.id,
    timestamp: new Date(block.header.timestamp),
    blockNumber: block.header.height,
    balance: recipients.reduce((sum, r) => sum + r.balance, 0n),
    points: calculationResult.totalPoints,
    elPoints: lastSummary?.elPoints ?? 0n,
  })

  await saveAndResetState(ctx)

  return { summary, recipients }
}

async function calculateELPoints(
  ctx: Context,
  block: Block,
  summary: LRTSummary,
  recipients: LRTPointRecipient[],
) {
  if (haveNodeDelegatorInstance) {
    const state = useLrtState()
    const totalBalance = recipients.reduce((sum, r) => sum + r.balance, 0n)
    let totalPointsEarned = 0n
    let totalPoints = 0n
    for (const node of config.addresses.nodeDelegators.filter(
      (n) => n.blockNumber <= block.header.height,
    )) {
      const { pointsEarned, nodeDelegator } = await createLRTNodeDelegator(
        ctx,
        block,
        node.address,
      )
      totalPointsEarned += pointsEarned
      totalPoints += nodeDelegator.points
    }
    for (const recipient of recipients) {
      recipient.elPoints +=
        (recipient.balance * totalPointsEarned) / totalBalance
    }
    summary.elPoints = totalPoints
    await Promise.all([
      ctx.store.save(summary),
      ctx.store.save(recipients),
      ctx.store.upsert([...state.nodeDelegators.values()]),
      ctx.store.upsert([...state.nodeDelegatorHoldings.values()]),
    ])
  }
}

const processDeposit = async (ctx: Context, block: Block, log: Log) => {
  const state = useLrtState()
  const {
    depositor: depositorAddress,
    asset,
    depositAmount,
    primeEthMintAmount,
    referralId,
  } = abiDepositPool.events.AssetDeposit.decode(log)
  // ctx.log.info(
  //   `${block.header.timestamp} processDeposit: ${depositorAddress} ${log.transactionHash}`,
  // )
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
  await addBalance(ctx, {
    log,
    depositAsset: deposit.asset,
    recipient: deposit.depositor,
    referralId: deposit.referralId,
    timestamp: deposit.timestamp,
    balance: deposit.amountReceived,
  })
}

const processTransfer = async (ctx: Context, block: Block, log: Log) => {
  const data = abiErc20.events.Transfer.decode(log)
  // ctx.log.info(
  //   `${block.header.timestamp} processTransfer: ${data.from} ${data.to} ${log.transactionHash}`,
  // )
  await transferBalance(ctx, {
    log,
    timestamp: new Date(block.header.timestamp),
    from: data.from.toLowerCase(),
    to: data.to.toLowerCase(),
    amount: data.value,
  })
}

const createLRTNodeDelegator = async (
  ctx: Context,
  block: Block,
  node: string,
) => {
  const state = useLrtState()
  const strategyManagerContract = new abiStrategyManager.Contract(
    ctx,
    block.header,
    '0x858646372CC42E1A627fcE94aa7A7033e7CF075A',
  )
  const [assets, balances] = await strategyManagerContract.getDeposits(node)
  const totalBalance = balances.reduce((sum, balance) => sum + balance, 0n)
  const lastNodeDelegatorEntry = await getLatestNodeDelegator(
    ctx,
    node.toLowerCase(),
  )

  const calcPoints = (ethAmount: bigint, hours: bigint) => {
    return (ethAmount * hours) / 1_000000000_000000000n
  }

  let pointsEarned = 0n
  if (lastNodeDelegatorEntry) {
    const from = parseEther(
      lastNodeDelegatorEntry.timestamp.getTime().toString(),
    )
    const to = parseEther(block.header.timestamp.toString())
    const hourLength =
      ((to - from) * 1_000000000_000000000n) / parseEther('3600000')
    pointsEarned = calcPoints(lastNodeDelegatorEntry?.amount, hourLength)
  }

  const nodeDelegator = new LRTNodeDelegator({
    id: `${block.header.height}:${node}`,
    blockNumber: block.header.height,
    timestamp: new Date(block.header.timestamp),
    node: node.toLowerCase(),
    amount: totalBalance,
    points: (lastNodeDelegatorEntry?.points ?? 0n) + pointsEarned,
    holdings: [],
  })
  // ctx.log.info({
  //   lastNodeDelegatorEntry: !!lastNodeDelegatorEntry,
  //   timestamp: nodeDelegator.timestamp,
  //   pointsEarned: formatEther(nodeDelegator.points),
  // })

  nodeDelegator.holdings = assets.map((asset, i) => {
    const holding = new LRTNodeDelegatorHoldings({
      id: `${block.header.height}:${node}:${asset.toLowerCase()}`,
      asset: asset.toLowerCase(),
      delegator: nodeDelegator,
      amount: balances[i],
    })
    state.nodeDelegatorHoldings.set(holding.id, holding)
    return holding
  })

  state.nodeDelegators.set(nodeDelegator.id, nodeDelegator)
  await ctx.store.upsert(nodeDelegator)
  return { nodeDelegator, pointsEarned }
}

const addBalance = async (
  ctx: Context,
  params: {
    log: Log
    timestamp: Date
    recipient: string
    referralId?: string
    balance: bigint
    depositAsset?: string
    conditionNameFilter?: string
  },
) => {
  const state = useLrtState()
  const recipient = await getRecipient(ctx, params.recipient.toLowerCase())
  recipient.balance += params.balance
  const balanceData = new LRTBalanceData({
    id: params.log.id,
    recipient,
    referralId: params.referralId,
    asset: params.depositAsset,
    balance: params.balance,
    balanceDate: params.timestamp,
    staticPointsDate: params.timestamp,
    staticPoints: 0n,
    staticReferralPointsBase: 0n,
  })
  recipient.balanceData.push(balanceData)
  state.balanceData.set(balanceData.id, balanceData)
}

const removeBalance = async (
  ctx: Context,
  params: {
    log: Log
    timestamp: Date
    recipient: string
    balance: bigint
  },
) => {
  const state = useLrtState()
  const recipient = await getRecipient(ctx, params.recipient)

  const calculationResult = await calculateRecipientsPoints(
    ctx,
    params.timestamp.getTime(),
    [recipient],
  )
  console.log('Calculation count: ' + calculationResult.count)

  recipient.balance -= params.balance
  let amountToRemove = params.balance
  const balanceData = await getBalanceDataForRecipient(ctx, params.recipient)
  if (!balanceData.length) {
    throw new Error(
      `should have results here for ${params.recipient}, tx ${params.log.transactionHash}`,
    )
  }
  // - Prefer not to remove balance from OETH deposits.
  // - Prefer to remove balance from recent balances.
  balanceData.sort((a, b) => {
    if (a.asset === tokens.OETH && b.asset !== tokens.OETH) {
      return 1
    } else if (a.asset !== tokens.OETH && b.asset === tokens.OETH) {
      return -1
    } else {
      return a.id > b.id ? -1 : 1
    }
  })
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
    } else {
      state.balanceData.set(data.id, data)
    }
  }
}

const transferBalance = async (
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
  if (params.from === '0x0000000000000000000000000000000000000000') {
    // We don't need to reach `addBalance` here because it is added in the deposit handler.
    return
  }
  await removeBalance(ctx, {
    log: params.log,
    timestamp: params.timestamp,
    recipient: params.from,
    balance: params.amount,
  })
  if (params.to === '0x0000000000000000000000000000000000000000') return
  await addBalance(ctx, {
    log: params.log,
    timestamp: params.timestamp,
    recipient: params.to,
    balance: params.amount,
    conditionNameFilter: 'standard',
  })
}
