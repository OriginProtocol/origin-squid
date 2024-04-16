import * as erc20Abi from '@abi/erc20'
import * as veogvAbi from '@abi/veogv'
import {
  OGVAddress,
  OGVLockup,
  OGVLockupEventType,
  OGVLockupTxLog,
} from '@model'
import { Block, Context, Log } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { ADDRESS_ZERO, OGV_ADDRESS, VEOGV_ADDRESS } from '@utils/addresses'

export const from = 14439231 // https://etherscan.io/tx/0x9295cac246169f06a3d4ec33fdbd87fced7a9e19ea61177cae75034e45ae66f4
export const veogvFrom = 15089597 // https://etherscan.io/tx/0x70c582e56ea1c49b7e9df70a0b40ddbfac9362b8b172cb527c329c2302d7d48a

interface IProcessResult {
  addresses: Map<string, OGVAddress>
  lockups: Map<string, OGVLockup>
  lockupEvents: OGVLockupTxLog[]
}

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: [OGV_ADDRESS],
    topic0: [erc20Abi.events.Transfer.topic],
    range: { from },
  })
  processor.addLog({
    address: [VEOGV_ADDRESS],
    topic0: [
      veogvAbi.events.Transfer,
      veogvAbi.events.Stake,
      veogvAbi.events.Unstake,
      veogvAbi.events.DelegateChanged,
      veogvAbi.events.DelegateVotesChanged,
    ].map((ev) => ev.topic),
    range: { from: veogvFrom },
  })
}

export const process = async (ctx: Context) => {
  const result: IProcessResult = {
    addresses: new Map<string, OGVAddress>(),
    lockups: new Map<string, OGVLockup>(),
    lockupEvents: [],
  }

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      const firstTopic = log.topics[0]

      if (![VEOGV_ADDRESS, OGV_ADDRESS].includes(log.address.toLowerCase())) {
        continue
      }

      if (firstTopic == veogvAbi.events.Transfer.topic) {
        await _processTransfer(ctx, result, block, log)
      } else if (firstTopic == veogvAbi.events.DelegateChanged.topic) {
        await _processDelegateChanged(ctx, result, block, log)
      } else if (firstTopic == veogvAbi.events.DelegateVotesChanged.topic) {
        await _processDelegateVotesChanged(ctx, result, block, log)
      } else if (firstTopic == veogvAbi.events.Stake.topic) {
        await _processStake(ctx, result, block, log)
      } else if (firstTopic == veogvAbi.events.Unstake.topic) {
        await _processUnstake(ctx, result, block, log)
      }
    }
  }

  await ctx.store.upsert(
    Array.from(result.addresses.values()).sort((a, b) =>
      a.delegatee?.id ? 1 : -1,
    ),
  )
  await ctx.store.upsert(Array.from(result.lockups.values()))
  await ctx.store.upsert(result.lockupEvents)
}

const _processTransfer = async (
  ctx: Context,
  result: IProcessResult,
  block: Block,
  log: Log,
) => {
  const { addresses } = result
  let { from, to, value } = erc20Abi.events.Transfer.decode(log)

  from = from.toLowerCase()
  to = to.toLowerCase()

  const isVeOGV = log.address.toLowerCase() == VEOGV_ADDRESS.toLowerCase()

  const blockTimestamp = new Date(block.header.timestamp)

  if (from != ADDRESS_ZERO) {
    const sender = await _getAddress(ctx, from, result)
    // TODO: Check sender.balance >= value
    if (isVeOGV) {
      sender.veogvBalance -= value
    } else {
      sender.balance -= value
    }
    sender.lastUpdated = blockTimestamp
    addresses.set(from, sender)
  }

  if (to != ADDRESS_ZERO) {
    const receiver = await _getAddress(ctx, to, result)
    if (isVeOGV) {
      receiver.veogvBalance += value
    } else {
      receiver.balance += value
    }
    receiver.lastUpdated = blockTimestamp
    addresses.set(to, receiver)
  }
}

const _processDelegateChanged = async (
  ctx: Context,
  result: IProcessResult,
  block: Block,
  log: Log,
) => {
  const { addresses } = result
  let { delegator, toDelegate } = veogvAbi.events.DelegateChanged.decode(log)
  delegator = delegator.toLowerCase()
  toDelegate = toDelegate.toLowerCase()

  const address = await _getAddress(ctx, delegator, result)

  address.delegatee = await _getAddress(ctx, toDelegate, result)
  address.lastUpdated = new Date(block.header.timestamp)

  addresses.set(toDelegate, address.delegatee)
  addresses.set(delegator, address)
}

const _processDelegateVotesChanged = async (
  ctx: Context,
  result: IProcessResult,
  block: Block,
  log: Log,
) => {
  const { addresses } = result
  let { delegate, newBalance } =
    veogvAbi.events.DelegateVotesChanged.decode(log)
  delegate = delegate.toLowerCase()

  const address = await _getAddress(ctx, delegate, result)

  address.votingPower = newBalance
  address.lastUpdated = new Date(block.header.timestamp)

  addresses.set(delegate, address)
}

const _processStake = async (
  ctx: Context,
  result: IProcessResult,
  block: Block,
  log: Log,
) => {
  const { lockups } = result

  const { lockupId, amount, user, points, end } =
    veogvAbi.events.Stake.decode(log)
  const address = await _getAddress(ctx, user, result)
  const lockup = await _getLockup(ctx, lockupId.toString(), address, result)

  lockup.amount = amount
  lockup.veogv = points
  lockup.end = new Date(Number(end) * 1000)
  lockup.timestamp = new Date(block.header.timestamp)
  lockups.set(lockup.id, lockup)

  // Find last Unstake txLog
  const unstakeIndex = result.lockupEvents.findIndex(
    (x) =>
      x.event == OGVLockupEventType.Unstaked &&
      // Unstake is emitted just before Stake for Extend
      x.id == `${log.transactionHash}:${log.logIndex - 1}`,
  )

  if (unstakeIndex >= 0) {
    // If it exists, it's an extend
    result.lockupEvents[unstakeIndex].event = OGVLockupEventType.Extended
  } else {
    const veOgvToken = new erc20Abi.Contract(ctx, block.header, VEOGV_ADDRESS)
    // If not, it's just a new stake
    result.lockupEvents.push(
      new OGVLockupTxLog({
        id: `${log.transactionHash}:${log.logIndex}`,
        hash: log.transactionHash,
        event: OGVLockupEventType.Staked,
        timestamp: new Date(block.header.timestamp),
        blockNumber: block.header.height,
        totalSupply: await veOgvToken.totalSupply(),
        ogvLockup: lockup,
      }),
    )
  }

  address.staked += amount

  await _updateVotingPowers(ctx, result, block, address)
}

const _processUnstake = async (
  ctx: Context,
  result: IProcessResult,
  block: Block,
  log: Log,
) => {
  const { lockupId, user, amount } = veogvAbi.events.Unstake.decode(log)
  const address = await _getAddress(ctx, user, result)
  const lockup = await _getLockup(ctx, lockupId.toString(), address, result)
  const veOgvToken = new erc20Abi.Contract(ctx, block.header, VEOGV_ADDRESS)

  result.lockupEvents.push(
    new OGVLockupTxLog({
      id: `${log.transactionHash}:${log.logIndex}`,
      hash: log.transactionHash,
      event: OGVLockupEventType.Unstaked,
      timestamp: new Date(block.header.timestamp),
      blockNumber: block.header.height,
      totalSupply: await veOgvToken.totalSupply(),
      ogvLockup: lockup,
    }),
  )

  address.staked -= amount

  await _updateVotingPowers(ctx, result, block, address)
}

const _updateVotingPowers = async (
  ctx: Context,
  result: IProcessResult,
  block: Block,
  address: OGVAddress,
) => {
  const { addresses } = result
  const veogv = new veogvAbi.Contract(ctx, block.header, VEOGV_ADDRESS)

  address.votingPower = await veogv.getVotes(address.id)
  address.lastUpdated = new Date(block.header.timestamp)
  addresses.set(address.id, address)

  const delegateeId = address.delegatee?.id
  if (delegateeId && delegateeId !== address.id) {
    const delegatee = await _getAddress(ctx, address.delegatee?.id!, result)
    delegatee.votingPower = await veogv.getVotes(delegateeId)
    delegatee.lastUpdated = new Date(block.header.timestamp)
    addresses.set(delegateeId, delegatee)
  }
}

const _getAddress = async (
  ctx: Context,
  id: string,
  result: IProcessResult,
): Promise<OGVAddress> => {
  id = id.toLowerCase()
  const { addresses } = result

  if (addresses.has(id)) {
    return addresses.get(id)!
  }

  let address = await ctx.store.findOneBy(OGVAddress, {
    id,
  })

  if (!address) {
    address = new OGVAddress({
      id: id.toLowerCase(),
      balance: 0n,
      staked: 0n,
      veogvBalance: 0n,
      votingPower: 0n,
      lastUpdated: new Date(),
    })
  }

  addresses.set(id, address)

  return address
}

const _getLockup = async (
  ctx: Context,
  lockupId: string,
  address: OGVAddress,
  result: IProcessResult,
): Promise<OGVLockup> => {
  const id = `${address.id}:${lockupId}`.toLowerCase()
  const { lockups } = result

  if (lockups.has(id)) {
    return lockups.get(id)!
  }

  let lockup = await ctx.store.findOneBy(OGVLockup, {
    id,
  })

  if (!lockup) {
    lockup = new OGVLockup({
      id,
      address,
      lockupId,
      amount: 0n,
      veogv: 0n,
      end: new Date(0),
      logs: [],
      timestamp: new Date(),
    })
  }

  lockups.set(id, lockup)

  return lockup
}
