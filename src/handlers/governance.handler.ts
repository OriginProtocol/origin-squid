import { Log } from '@subsquid/evm-processor';
import { Context } from '../processor';
import { GOVERNANCE_ADDRESS } from '../addresses';

import * as governance from '../abi/governance';
import { Proposal, ProposalTxLog } from '../model';
import { v4 as uuidv4 } from 'uuid';
import { findOrCreateAddress } from '../utils/address';
import { GOVERNANCE_PROPOSAL_STATE_LABELS } from '../constants';

export default async (ctx: Context) => {
  const proposals: Array<Proposal> = []
  const txLogs: Array<ProposalTxLog> = []

  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      if (log.address !== GOVERNANCE_ADDRESS) {
        continue
      }

      // TODO: Handle Expirations and Extensions

      switch(log.topics[0]) {
        case governance.events.ProposalCreated.topic: 
          await _proposalCreated(ctx, log);
          const [_, createTxLog] = await _logProposalEvent(ctx, log)
          txLogs.push(createTxLog)
          break

        case governance.events.ProposalCanceled.topic: 
        case governance.events.ProposalExecuted.topic: 
        case governance.events.ProposalQueued.topic:
          const [proposal, txLog] = await _logProposalEvent(ctx, log)
          txLogs.push(txLog)
          proposals.push(proposal)
          break

        default:
          // TODO: Update state of all proposals
          continue
      }
    }
  }

  await ctx.store.save(proposals)
  await ctx.store.insert(txLogs)
}

const eventTopicMap = {
  [governance.events.ProposalCreated.topic]: governance.events.ProposalCreated,
  [governance.events.ProposalCanceled.topic]: governance.events.ProposalCanceled,
  [governance.events.ProposalExecuted.topic]: governance.events.ProposalExecuted,
  [governance.events.ProposalQueued.topic]: governance.events.ProposalQueued,
}

async function _proposalCreated(ctx: Context, log: Log): Promise<Proposal> {
  const {
    proposalId,
    proposer,
    description,
  } = governance.events.ProposalCreated.decode(log)

  const proposerAddress = await findOrCreateAddress(ctx, proposer)


  let proposal = await ctx.store.findOneBy(Proposal, {
    id: proposalId.toString()
  })

  if (!proposal) {
    proposal = new Proposal({
      id: proposalId.toString(),
      proposer: proposerAddress,
      description: description,
      createdAt: new Date(log.block.timestamp),
      status: 0 // Pending
    })
    
    await ctx.store.insert(proposal)
  }

  return proposal
}

async function _logProposalEvent(ctx: Context, log: Log): Promise<[Proposal, ProposalTxLog]> {
  const ev = eventTopicMap[log.topics[0]]
  const { proposalId } = ev.decode(log)

  const proposal = await ctx.store.findOneByOrFail(Proposal, {
    id: proposalId.toString()
  })

  const cGovernance = new governance.Contract(ctx, log.block, GOVERNANCE_ADDRESS)

  proposal.status = await cGovernance.state(proposalId)

  const txLog = new ProposalTxLog({
    id: uuidv4(),
    proposal: proposal,
    createdAt: new Date(log.block.timestamp),
    hash: log.transaction?.hash,
    event: GOVERNANCE_PROPOSAL_STATE_LABELS[proposal.status]
  })

  return [proposal, txLog]
}
