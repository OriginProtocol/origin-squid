import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as erc20Abi from '../../abi/erc20'
import * as governanceAbi from '../../abi/governance'
import { OGVAddress, OGVProposal, OGVProposalEvent, OGVProposalState, OGVProposalTxLog, OGVProposalVote, OGVVoteType } from '../../model'
import { Block, Context, Log } from '../../processor'
import {
  GOVERNANCE_ADDRESS,
  OGV_ADDRESS,
  VEOGV_ADDRESS,
} from '../../utils/addresses'

export const from = 14439231 // https://etherscan.io/tx/0x9295cac246169f06a3d4ec33fdbd87fced7a9e19ea61177cae75034e45ae66f4
export const veogvFrom = 15089597 // https://etherscan.io/tx/0x70c582e56ea1c49b7e9df70a0b40ddbfac9362b8b172cb527c329c2302d7d48a

interface IProcessResult {
  addresses: Map<string, OGVAddress>,
  proposals: Map<string, OGVProposal>,
  proposalLogs: OGVProposalTxLog[],
  votes: OGVProposalVote[],
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
      governanceAbi.events.ProposalCreated,
      governanceAbi.events.ProposalExecuted,
      governanceAbi.events.ProposalExtended,
      governanceAbi.events.ProposalQueued,
      governanceAbi.events.ProposalCanceled,
      governanceAbi.events.VoteCast,
      governanceAbi.events.VoteCastWithParams,
    ].map(ev => ev.topic),
    range: { from: veogvFrom },
  })
}

export const process = async (ctx: Context) => {
  const result: IProcessResult = {
    addresses: new Map<string, OGVAddress>(),
    proposals: new Map<string, OGVProposal>(),
    proposalLogs: [],
    votes: []
  }

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      const firstTopic = log.topics[0]

      if (![VEOGV_ADDRESS, OGV_ADDRESS].includes(log.address)) {
        return
      }

      if (firstTopic == governanceAbi.events.ProposalCreated.topic) {
        await _processProposalCreated(ctx, result, block, log);
      } else if (firstTopic == governanceAbi.events.ProposalExtended.topic) {
        await _processProposalExtended(ctx, result, block, log);
      } else if ([governanceAbi.events.ProposalQueued.topic, governanceAbi.events.ProposalCanceled.topic, governanceAbi.events.ProposalExecuted.topic].includes(firstTopic)) {
        await _processProposalEvents(ctx, result, block, log);
      } else if ([governanceAbi.events.VoteCast.topic, governanceAbi.events.VoteCastWithParams.topic].includes(firstTopic)) {
        await _processVoteCast(ctx, result, block, log)
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
  log: Log
) => {
  const { proposalId, proposer: proposerAddr, description, startBlock, endBlock } = governanceAbi.events.ProposalCreated.decode(log)
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
    status: OGVProposalState.Pending
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
    decode: governanceAbi.events.ProposalQueued.decode,
    status: OGVProposalState.Queued,
    event: OGVProposalEvent.Queued
  },
  [governanceAbi.events.ProposalCanceled.topic]: {
    decode: governanceAbi.events.ProposalCanceled.decode,
    status: OGVProposalState.Canceled,
    event: OGVProposalEvent.Canceled
  },
  [governanceAbi.events.ProposalExecuted.topic]: {
    decode: governanceAbi.events.ProposalExecuted.decode,
    status: OGVProposalState.Executed,
    event: OGVProposalEvent.Executed
  },
}

const _processProposalEvents = async (
  ctx: Context,
  result: IProcessResult,
  block: Block,
  log: Log
) => {
  const { decode, status, event } = eventMapper[log.topics[0]]!

  const { proposalId } = decode(log)
  const blockTimestamp = new Date(block.header.timestamp)

  const proposal = await _getProposal(ctx, proposalId.toString(), result)
  proposal.status = status;


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
  log: Log
) => {
  const { proposalId, extendedDeadline } = governanceAbi.events.ProposalExtended.decode(log)
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
  log: Log
) => {
  const decode = (log.topics[0] == governanceAbi.events.VoteCast.topic) ? governanceAbi.events.VoteCast.decode : governanceAbi.events.VoteCastWithParams.decode
  const { proposalId, voter: voterAddr, weight, support } = decode(log)
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
    type: [OGVVoteType.Against, OGVVoteType.For, OGVVoteType.Abstain][parseInt(support.toString())]
  })

  result.votes.push(proposalVote)
}

const _getProposalState = async (ctx: Context, block: Block, proposalId: bigint): Promise<OGVProposalState> => {
  const governance = new governanceAbi.Contract(ctx, block.header, GOVERNANCE_ADDRESS)
  return proposalStateMap[
    parseInt((await governance.state(proposalId)).toString())
  ] || OGVProposalState.Pending;
}

const _getAddress = async (ctx: Context, id: string, result: IProcessResult): Promise<OGVAddress> => {
  id = id.toLowerCase()
  const { addresses } = result

  if (addresses.has(id)) {
    return addresses.get(id)!
  }

  const address = await ctx.store.findOneByOrFail(OGVAddress, {
    id
  })

  addresses.set(id, address)

  return address
}

const _getProposal = async (ctx: Context, id: string, result: IProcessResult): Promise<OGVProposal> => {
  const { proposals } = result

  if (proposals.has(id)) {
    return proposals.get(id)!
  }

  const proposal = await ctx.store.findOneByOrFail(OGVProposal, {
    id
  })

  proposals.set(id, proposal)

  return proposal
}
