import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as governanceAbi from '../../abi/governance'
import {
  OGVAddress,
  OGVProposal,
  OGVProposalEvent,
  OGVProposalState,
  OGVProposalTxLog,
  OGVProposalVote,
  OGVVoteType,
} from '../../model'
import { Block, Context, Log } from '../../processor'
import { GOVERNANCE_ADDRESS } from '../../utils/addresses'
import { env } from '../../utils/env'

export const from = 15491391 // https://etherscan.io/tx/0x0e04e429248c384e6b36229edf8eb5a77bec7023c58808c21b702edfcbc0e0d6

interface IProcessResult {
  addresses: Map<string, OGVAddress>
  proposals: Map<string, OGVProposal>
  proposalLogs: OGVProposalTxLog[]
  votes: OGVProposalVote[]
}

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: [GOVERNANCE_ADDRESS],
    topic0: [
      governanceAbi.events.ProposalCreated.topic,
      governanceAbi.events.ProposalExecuted.topic,
      governanceAbi.events.ProposalExtended.topic,
      governanceAbi.events.ProposalQueued.topic,
      governanceAbi.events.ProposalCanceled.topic,
      governanceAbi.events.VoteCast.topic,
      governanceAbi.events.VoteCastWithParams.topic,
    ],
    range: { from },
  })
}

export const process = async (ctx: Context) => {
  if (ctx.blocks[ctx.blocks.length - 1]?.header.height < from) return

  const result: IProcessResult = {
    addresses: new Map<string, OGVAddress>(),
    proposals: new Map<string, OGVProposal>(),
    proposalLogs: [],
    votes: [],
  }

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      if (log.address !== GOVERNANCE_ADDRESS) continue

      const firstTopic = log.topics[0]
      try {
        if (firstTopic == governanceAbi.events.ProposalCreated.topic) {
          await _processProposalCreated(ctx, result, block, log)
        } else if (firstTopic == governanceAbi.events.ProposalExtended.topic) {
          await _processProposalExtended(ctx, result, block, log)
        } else if (
          [
            governanceAbi.events.ProposalQueued.topic,
            governanceAbi.events.ProposalCanceled.topic,
            governanceAbi.events.ProposalExecuted.topic,
          ].includes(firstTopic)
        ) {
          await _processProposalEvents(ctx, result, block, log)
        } else if (
          [
            governanceAbi.events.VoteCast.topic,
            governanceAbi.events.VoteCastWithParams.topic,
          ].includes(firstTopic)
        ) {
          await _processVoteCast(ctx, result, block, log)
        }
      } catch (e) {
        if (!env.BLOCK_FROM) {
          throw e
        }
        ctx.log.error('Could not process governance event')
      }
    }
  }

  await ctx.store.upsert(Array.from(result.addresses.values()))
  await ctx.store.upsert(Array.from(result.proposals.values()))
  await ctx.store.upsert(result.proposalLogs)
  await ctx.store.upsert(result.votes)
}

const _processProposalCreated = async (
  ctx: Context,
  result: IProcessResult,
  block: Block,
  log: Log,
) => {
  // ctx.log.info('_processProposalCreated')
  const {
    proposalId,
    proposer: proposerAddr,
    description,
    startBlock,
    endBlock,
  } = governanceAbi.events.ProposalCreated.decode(log)
  const proposer = await _getAddress(ctx, proposerAddr, result)
  const blockTimestamp = new Date(block.header.timestamp)

  const proposal = new OGVProposal({
    id: proposalId.toString(),
    description,
    proposer,
    timestamp: blockTimestamp,
    startBlock,
    endBlock,
    lastUpdated: new Date(),
    status: OGVProposalState.Pending,
  })

  const proposalTxLog = new OGVProposalTxLog({
    id: `${proposalId}:${log.transactionHash}:${log.logIndex}`,
    proposal,
    event: OGVProposalEvent.Created,
    hash: log.transactionHash,
    timestamp: blockTimestamp,
  })

  result.proposals.set(proposalId.toString(), proposal)
  result.proposalLogs.push(proposalTxLog)
}

const proposalStateMap = [
  OGVProposalState.Pending,
  OGVProposalState.Active,
  OGVProposalState.Canceled,
  OGVProposalState.Defeated,
  OGVProposalState.Succeeded,
  OGVProposalState.Queued,
  OGVProposalState.Expired,
  OGVProposalState.Executed,
]

const eventMapper = {
  [governanceAbi.events.ProposalQueued.topic]: {
    decode: governanceAbi.events.ProposalQueued.decode.bind(
      governanceAbi.events.ProposalQueued,
    ),
    status: OGVProposalState.Queued,
    event: OGVProposalEvent.Queued,
  },
  [governanceAbi.events.ProposalCanceled.topic]: {
    decode: governanceAbi.events.ProposalCanceled.decode.bind(
      governanceAbi.events.ProposalCanceled,
    ),
    status: OGVProposalState.Canceled,
    event: OGVProposalEvent.Canceled,
  },
  [governanceAbi.events.ProposalExecuted.topic]: {
    decode: governanceAbi.events.ProposalExecuted.decode.bind(
      governanceAbi.events.ProposalExecuted,
    ),
    status: OGVProposalState.Executed,
    event: OGVProposalEvent.Executed,
  },
}

const _processProposalEvents = async (
  ctx: Context,
  result: IProcessResult,
  block: Block,
  log: Log,
) => {
  // ctx.log.info('_processProposalEvents')
  const { decode, status, event } = eventMapper[log.topics[0]]!

  const { proposalId } = decode(log)
  const blockTimestamp = new Date(block.header.timestamp)

  const proposal = await _getProposal(ctx, proposalId.toString(), result)
  proposal.status = status

  const proposalTxLog = new OGVProposalTxLog({
    id: `${proposalId}:${log.transactionHash}:${log.logIndex}`,
    proposal,
    event,
    hash: log.transactionHash,
    timestamp: blockTimestamp,
  })

  result.proposalLogs.push(proposalTxLog)
}

const _processProposalExtended = async (
  ctx: Context,
  result: IProcessResult,
  block: Block,
  log: Log,
) => {
  // ctx.log.info('_processProposalExtended')
  const { proposalId, extendedDeadline } =
    governanceAbi.events.ProposalExtended.decode(log)
  const blockTimestamp = new Date(block.header.timestamp)

  const proposal = await _getProposal(ctx, proposalId.toString(), result)
  proposal.endBlock = extendedDeadline
  proposal.status = await _getProposalState(ctx, block, proposalId)

  const proposalTxLog = new OGVProposalTxLog({
    id: `${proposalId}:${log.transactionHash}:${log.logIndex}`,
    proposal,
    event: OGVProposalEvent.Extended,
    hash: log.transactionHash,
    timestamp: blockTimestamp,
  })

  result.proposalLogs.push(proposalTxLog)
}

const _processVoteCast = async (
  ctx: Context,
  result: IProcessResult,
  block: Block,
  log: Log,
) => {
  // ctx.log.info('_processVoteCast')
  const {
    proposalId,
    voter: voterAddr,
    weight,
    support,
  } = log.topics[0] == governanceAbi.events.VoteCast.topic
    ? governanceAbi.events.VoteCast.decode(log)
    : governanceAbi.events.VoteCastWithParams.decode(log)
  const blockTimestamp = new Date(block.header.timestamp)

  const proposal = await _getProposal(ctx, proposalId.toString(), result)
  const voter = await _getAddress(ctx, voterAddr, result)

  const proposalVote = new OGVProposalVote({
    id: `${proposalId.toString()}:${log.transactionHash}:${voter.id}`,
    proposal,
    voter,
    txHash: log.transactionHash,
    timestamp: blockTimestamp,
    weight,
    type: [OGVVoteType.Against, OGVVoteType.For, OGVVoteType.Abstain][
      parseInt(support.toString())
    ],
  })

  result.votes.push(proposalVote)
}

const _getProposalState = async (
  ctx: Context,
  block: Block,
  proposalId: bigint,
): Promise<OGVProposalState> => {
  const governance = new governanceAbi.Contract(
    ctx,
    block.header,
    GOVERNANCE_ADDRESS,
  )
  return (
    proposalStateMap[
      parseInt((await governance.state(proposalId)).toString())
    ] || OGVProposalState.Pending
  )
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

  const address = await ctx.store.findOneByOrFail(OGVAddress, {
    id,
  })

  addresses.set(id, address)

  return address
}

const _getProposal = async (
  ctx: Context,
  id: string,
  result: IProcessResult,
): Promise<OGVProposal> => {
  const { proposals } = result

  if (proposals.has(id)) {
    return proposals.get(id)!
  }

  const proposal = await ctx.store.findOneByOrFail(OGVProposal, {
    id,
  })

  proposals.set(id, proposal)

  return proposal
}
