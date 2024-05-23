import * as erc20Abi from '@abi/erc20'
import * as xognAbi from '@abi/xogn'
import {
  OGNAddress,
  OGNLockup,
  OGNLockupEventType,
  OGNLockupTxLog,
} from '@model'
import { Block, Context, Log } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { ADDRESS_ZERO, OGN_ADDRESS, XOGN_ADDRESS } from '@utils/addresses'

export const from = 6436154 // https://etherscan.io/tx/0x9b8a3a8db40b02078f89cec2eed569682a23e37b36c3e462190ef391ebdd1d11
export const xognFrom = 19919745 //https://etherscan.io/tx/0x8cc2dd6dc0b049add37561e983ea4f99187900ac12e327dddf56b0001eb9be5c

interface IProcessResult {
  addresses: Map<string, OGNAddress>
  lockups: Map<string, OGNLockup>
  lockupEvents: OGNLockupTxLog[]
}

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: [OGN_ADDRESS],
    topic0: [erc20Abi.events.Transfer.topic],
    range: { from },
  })
  processor.addLog({
    address: [XOGN_ADDRESS],
    topic0: [
      xognAbi.events.Transfer,
      xognAbi.events.Stake,
      xognAbi.events.Unstake,
      xognAbi.events.DelegateChanged,
      xognAbi.events.DelegateVotesChanged,
    ].map((ev) => ev.topic),
    range: { from: xognFrom },
  })
}

export const process = async (ctx: Context) => {
  const result: IProcessResult = {
    addresses: new Map<string, OGNAddress>(),
    lockups: new Map<string, OGNLockup>(),
    lockupEvents: [],
  }

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      const firstTopic = log.topics[0]

      if (![XOGN_ADDRESS, OGN_ADDRESS].includes(log.address.toLowerCase())) {
        continue
      }

      if (firstTopic == xognAbi.events.Transfer.topic) {
        await _processTransfer(ctx, result, block, log)
      } else if (firstTopic == xognAbi.events.DelegateChanged.topic) {
        await _processDelegateChanged(ctx, result, block, log)
      } else if (firstTopic == xognAbi.events.DelegateVotesChanged.topic) {
        await _processDelegateVotesChanged(ctx, result, block, log)
      } else if (firstTopic == xognAbi.events.Stake.topic) {
        await _processStake(ctx, result, block, log)
      } else if (firstTopic == xognAbi.events.Unstake.topic) {
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

  const isXOGN = log.address.toLowerCase() == XOGN_ADDRESS.toLowerCase()

  const blockTimestamp = new Date(block.header.timestamp)

  if (from != ADDRESS_ZERO) {
    const sender = await _getAddress(ctx, from, result)
    // TODO: Check sender.balance >= value
    if (isXOGN) {
      sender.xognBalance -= value
    } else {
      sender.balance -= value
    }
    sender.lastUpdated = blockTimestamp
    addresses.set(from, sender)
  }

  if (to != ADDRESS_ZERO) {
    const receiver = await _getAddress(ctx, to, result)
    if (isXOGN) {
      receiver.xognBalance += value
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
  let { delegator, toDelegate } = xognAbi.events.DelegateChanged.decode(log)
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
    xognAbi.events.DelegateVotesChanged.decode(log)
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
    xognAbi.events.Stake.decode(log)
  const address = await _getAddress(ctx, user, result)
  const lockup = await _getLockup(ctx, lockupId.toString(), address, result)

  lockup.amount = amount
  lockup.xogn = points
  lockup.end = new Date(Number(end) * 1000)
  lockup.timestamp = new Date(block.header.timestamp)
  lockups.set(lockup.id, lockup)

  // Find last Unstake txLog
  const unstakeIndex = result.lockupEvents.findIndex(
    (x) =>
      x.event == OGNLockupEventType.Unstaked &&
      // Unstake is emitted just before Stake for Extend
      x.id == `${log.transactionHash}:${log.logIndex - 1}`,
  )

  if (unstakeIndex >= 0) {
    // If it exists, it's an extend
    result.lockupEvents[unstakeIndex].event = OGNLockupEventType.Extended
  } else {
    const xOgnToken = new erc20Abi.Contract(ctx, block.header, XOGN_ADDRESS)
    // If not, it's just a new stake
    result.lockupEvents.push(
      new OGNLockupTxLog({
        id: `${log.transactionHash}:${log.logIndex}`,
        hash: log.transactionHash,
        event: OGNLockupEventType.Staked,
        timestamp: new Date(block.header.timestamp),
        blockNumber: block.header.height,
        totalSupply: await xOgnToken.totalSupply(),
        ognLockup: lockup,
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
  const { lockupId, user, amount } = xognAbi.events.Unstake.decode(log)
  const address = await _getAddress(ctx, user, result)
  const lockup = await _getLockup(ctx, lockupId.toString(), address, result)
  const xOgnToken = new erc20Abi.Contract(ctx, block.header, XOGN_ADDRESS)

  result.lockupEvents.push(
    new OGNLockupTxLog({
      id: `${log.transactionHash}:${log.logIndex}`,
      hash: log.transactionHash,
      event: OGNLockupEventType.Unstaked,
      timestamp: new Date(block.header.timestamp),
      blockNumber: block.header.height,
      totalSupply: await xOgnToken.totalSupply(),
      ognLockup: lockup,
    }),
  )

  address.staked -= amount

  await _updateVotingPowers(ctx, result, block, address)
}

const _updateVotingPowers = async (
  ctx: Context,
  result: IProcessResult,
  block: Block,
  address: OGNAddress,
) => {
  const { addresses } = result
  const xogn = new xognAbi.Contract(ctx, block.header, XOGN_ADDRESS)

  address.votingPower = await xogn.getVotes(address.id)
  address.lastUpdated = new Date(block.header.timestamp)
  addresses.set(address.id, address)

  const delegateeId = address.delegatee?.id
  if (delegateeId && delegateeId !== address.id) {
    const delegatee = await _getAddress(ctx, address.delegatee?.id!, result)
    delegatee.votingPower = await xogn.getVotes(delegateeId)
    delegatee.lastUpdated = new Date(block.header.timestamp)
    addresses.set(delegateeId, delegatee)
  }
}

const _getAddress = async (
  ctx: Context,
  id: string,
  result: IProcessResult,
): Promise<OGNAddress> => {
  id = id.toLowerCase()
  const { addresses } = result

  if (addresses.has(id)) {
    return addresses.get(id)!
  }

  let address = await ctx.store.findOneBy(OGNAddress, {
    id,
  })

  if (!address) {
    address = new OGNAddress({
      id: id.toLowerCase(),
      balance: 0n,
      staked: 0n,
      xognBalance: 0n,
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
  address: OGNAddress,
  result: IProcessResult,
): Promise<OGNLockup> => {
  const id = `${address.id}:${lockupId}`.toLowerCase()
  const { lockups } = result

  if (lockups.has(id)) {
    return lockups.get(id)!
  }

  let lockup = await ctx.store.findOneBy(OGNLockup, {
    id,
  })

  if (!lockup) {
    lockup = new OGNLockup({
      id,
      address,
      lockupId,
      amount: 0n,
      xogn: 0n,
      end: new Date(0),
      logs: [],
      timestamp: new Date(),
    })
  }

  lockups.set(id, lockup)

  return lockup
}
