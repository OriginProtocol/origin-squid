import { Log } from '@subsquid/evm-processor';
import { Context } from '../processor';
import { GOVERNANCE_ADDRESS, VEOGV_ADDRESS } from '../addresses';

import * as veogv from '../abi/veogv';
import { Address, OGVLockup, OGVLockupTxLog, ProposalTxLog } from '../model';
import { v4 as uuidv4 } from 'uuid';
import { findOrCreateAddress } from '../utils/address';
import { GOVERNANCE_PROPOSAL_STATE_LABELS } from '../constants';
import { lock } from 'ethers';

export default async (ctx: Context) => {
  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      if (log.address !== VEOGV_ADDRESS) {
        continue
      }

      switch(log.topics[0]) {
        case veogv.events.Stake.topic:
          await _handleStake(ctx, log)
          break
        case veogv.events.Unstake.topic:
          await _handleUnstake(ctx, log)
          break
        case veogv.events.DelegateVotesChanged.topic: 
          await _handleVotesChange(ctx, log)
          break
      }
    }
  }
}

async function _handleVotesChange(ctx: Context, log: Log) {
  const { delegate, newBalance } = veogv.events.DelegateVotesChanged.decode(log)
  const address = await findOrCreateAddress(ctx, delegate.toLowerCase())

  address.ogvVotes = newBalance

  await ctx.store.save(address)
}

async function _handleStake(ctx: Context, log: Log) {
  const { user, lockupId, amount, end } = veogv.events.Stake.decode(log)
  const address = await findOrCreateAddress(ctx, user.toLowerCase())

  const lockup = new OGVLockup({
    id: uuidv4(),
    active: true,
    lockupId: Number(lockupId),
    amount,
    end: new Date(Number(end.toString()) * 1000),
    createdAt: new Date(log.block.timestamp),
    user: address,
    logs: []
  })

  const txLog = new OGVLockupTxLog({
    id: uuidv4(),
    ogvLockup: lockup,
    createdAt: new Date(log.block.timestamp),
    hash: log.transaction?.hash,
    event: 'Staked'
  })
  
  const contract = new veogv.Contract(ctx, log.block, VEOGV_ADDRESS)
  address.ogvVotes = await contract.getVotes(user)

  await ctx.store.save(address)
  await ctx.store.save(lockup)
  await ctx.store.save(txLog)
}

async function _handleUnstake(ctx: Context, log: Log) {
  const { user, lockupId, amount, end } = veogv.events.Unstake.decode(log)
  const address = await findOrCreateAddress(ctx, user.toLowerCase())

  const lockup = await ctx.store.findOneByOrFail(OGVLockup, {
    lockupId: Number(lockupId),
    user: address
  })

  const txLog = new OGVLockupTxLog({
    id: uuidv4(),
    ogvLockup: lockup,
    createdAt: new Date(log.block.timestamp),
    hash: log.transaction?.hash,
    event: 'Staked'
  })
  
  const contract = new veogv.Contract(ctx, log.block, VEOGV_ADDRESS)
  address.ogvVotes = await contract.getVotes(user)

  await ctx.store.save(address)
  await ctx.store.save(lockup)
  await ctx.store.save(txLog)
}
