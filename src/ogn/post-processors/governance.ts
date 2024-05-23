import { formatEther } from 'viem'

import * as governanceAbi from '@abi/governance'
import {
  OGNAddress,
  OGNProposal,
  OGNProposalEvent,
  OGNProposalState,
  OGNProposalTxLog,
  OGNProposalVote,
  OGNVoteType,
} from '@model'
import { Block, Context, Log } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { GOVERNANCE_ADDRESS } from '@utils/addresses'
import { env } from '@utils/env'

export const from = 15491391 // https://etherscan.io/tx/0x0e04e429248c384e6b36229edf8eb5a77bec7023c58808c21b702edfcbc0e0d6

interface IProcessResult {
  addresses: Map<string, OGNAddress>
  proposals: Map<string, OGNProposal>
  proposalLogs: OGNProposalTxLog[]
  votes: OGNProposalVote[]
}

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: [GOVERNANCE_ADDRESS], // TODO: Change to OGN Governance Address
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
  processor.includeAllBlocks({ from })
}

let pendingProposals: OGNProposal[] = []
let activeProposals: OGNProposal[] = []
let goActiveBlock = 0
let goFinishedBlock = 0

export const initialize = async (ctx: Context) => {
  const pending = await ctx.store.findBy(OGNProposal, {
    status: OGNProposalState.Pending,
  })
  const active = await ctx.store.findBy(OGNProposal, {
    status: OGNProposalState.Active,
  })
  pendingProposals.push(...pending)
  activeProposals.push(...active)
}

export const process = async (ctx: Context) => {
  if (ctx.blocks[ctx.blocks.length - 1]?.header.height < from) return

  const result: IProcessResult = {
    addresses: new Map<string, OGNAddress>(),
    proposals: new Map<string, OGNProposal>(),
    proposalLogs: [],
    votes: [],
  }

  _updateStatusBlocks()
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
          [governanceAbi.events.VoteCast.topic, governanceAbi.events.VoteCastWithParams.topic].includes(firstTopic)
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
    await _updateProposalStatuses(ctx, result, block, goActiveBlock, goFinishedBlock)
  }

  await ctx.store.upsert(Array.from(result.addresses.values()))
  await ctx.store.upsert(Array.from(result.proposals.values()))
  await ctx.store.upsert(result.proposalLogs)
  await ctx.store.upsert(result.votes)
}

const _processProposalCreated = async (ctx: Context, result: IProcessResult, block: Block, log: Log) => {
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
  const governance = new governanceAbi.Contract(ctx, block.header, GOVERNANCE_ADDRESS)

  const proposal = new OGNProposal({
    id: proposalId.toString(),
    description,
    proposer,
    timestamp: blockTimestamp,
    startBlock,
    endBlock,
    lastUpdated: new Date(),
    status: OGNProposalState.Pending,
    quorum: await governance.quorum(BigInt(block.header.height - 1)),
    choices: [],
    scores: [],
  })

  pendingProposals.push(proposal)

  const proposalTxLog = new OGNProposalTxLog({
    id: `${proposalId}:${log.transactionHash}:${log.logIndex}`,
    proposal,
    event: OGNProposalEvent.Created,
    hash: log.transactionHash,
    timestamp: blockTimestamp,
  })

  result.proposals.set(proposalId.toString(), proposal)
  result.proposalLogs.push(proposalTxLog)
}

const proposalStateMap = [
  OGNProposalState.Pending,
  OGNProposalState.Active,
  OGNProposalState.Canceled,
  OGNProposalState.Defeated,
  OGNProposalState.Succeeded,
  OGNProposalState.Queued,
  OGNProposalState.Expired,
  OGNProposalState.Executed,
]

const eventMapper = {
  [governanceAbi.events.ProposalQueued.topic]: {
    decode: governanceAbi.events.ProposalQueued.decode.bind(governanceAbi.events.ProposalQueued),
    status: OGNProposalState.Queued,
    event: OGNProposalEvent.Queued,
  },
  [governanceAbi.events.ProposalCanceled.topic]: {
    decode: governanceAbi.events.ProposalCanceled.decode.bind(governanceAbi.events.ProposalCanceled),
    status: OGNProposalState.Canceled,
    event: OGNProposalEvent.Canceled,
  },
  [governanceAbi.events.ProposalExecuted.topic]: {
    decode: governanceAbi.events.ProposalExecuted.decode.bind(governanceAbi.events.ProposalExecuted),
    status: OGNProposalState.Executed,
    event: OGNProposalEvent.Executed,
  },
}

const _updateStatusBlocks = () => {
  goActiveBlock = Number(
    pendingProposals.reduce((min, p) => (p.startBlock < min ? p.startBlock : min), BigInt(Number.MAX_SAFE_INTEGER)),
  )
  goFinishedBlock = Number(
    activeProposals.reduce((min, p) => (p.endBlock < min ? p.endBlock : min), BigInt(Number.MAX_SAFE_INTEGER)),
  )
}

const _updateProposalStatuses = async (
  ctx: Context,
  result: IProcessResult,
  block: Block,
  goActiveBlock: number,
  goFinishedBlock: number,
) => {
  // Update for Active and post-Active statuses.
  if (block.header.height > goActiveBlock) {
    ctx.log.info('block.header.height > goActiveBlock')
    for (const proposal of pendingProposals.filter((p) => block.header.height > Number(p.startBlock))) {
      await _updateProposalStatus(ctx, result, block, proposal.id)
    }
    pendingProposals = pendingProposals.filter((p) => block.header.height <= Number(p.startBlock))
  }
  if (block.header.height > goFinishedBlock) {
    ctx.log.info('block.header.height > goFinishedBlock')
    for (const proposal of activeProposals.filter((p) => block.header.height > Number(p.endBlock))) {
      await _updateProposalStatus(ctx, result, block, proposal.id)
    }
    activeProposals = activeProposals.filter((p) => block.header.height <= Number(p.endBlock))
  }
  _updateStatusBlocks()
}

const _updateProposalStatus = async (ctx: Context, result: IProcessResult, block: Block, proposalId: string) => {
  const proposal = await _getProposal(ctx, proposalId, result)
  proposal.status = await _getProposalState(ctx, block, BigInt(proposalId))
  ctx.log.info({ status: proposal.status }, '_updateProposalStatus')
  if (proposal.status === OGNProposalState.Pending && !pendingProposals.find((p) => p.id === proposal.id)) {
    pendingProposals.push(proposal)
  }
  if (proposal.status === OGNProposalState.Active && !activeProposals.find((p) => p.id === proposal.id)) {
    activeProposals.push(proposal)
  }
}

const _processProposalEvents = async (ctx: Context, result: IProcessResult, block: Block, log: Log) => {
  // ctx.log.info('_processProposalEvents')
  const { decode, status, event } = eventMapper[log.topics[0]]!

  const { proposalId } = decode(log)
  const blockTimestamp = new Date(block.header.timestamp)

  const proposal = await _getProposal(ctx, proposalId.toString(), result)
  await _updateProposalStatus(ctx, result, block, proposalId.toString())

  const proposalTxLog = new OGNProposalTxLog({
    id: `${proposalId}:${log.transactionHash}:${log.logIndex}`,
    proposal,
    event,
    hash: log.transactionHash,
    timestamp: blockTimestamp,
  })

  result.proposalLogs.push(proposalTxLog)
}

const _processProposalExtended = async (ctx: Context, result: IProcessResult, block: Block, log: Log) => {
  // ctx.log.info('_processProposalExtended')
  const { proposalId, extendedDeadline } = governanceAbi.events.ProposalExtended.decode(log)
  const blockTimestamp = new Date(block.header.timestamp)

  const proposal = await _getProposal(ctx, proposalId.toString(), result)
  proposal.endBlock = extendedDeadline
  await _updateProposalStatus(ctx, result, block, proposalId.toString())

  const proposalTxLog = new OGNProposalTxLog({
    id: `${proposalId}:${log.transactionHash}:${log.logIndex}`,
    proposal,
    event: OGNProposalEvent.Extended,
    hash: log.transactionHash,
    timestamp: blockTimestamp,
  })

  result.proposalLogs.push(proposalTxLog)
}

const _processVoteCast = async (ctx: Context, result: IProcessResult, block: Block, log: Log) => {
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

  const voteType = [OGNVoteType.Against, OGNVoteType.For, OGNVoteType.Abstain][parseInt(support.toString())]
  const proposalVote = new OGNProposalVote({
    id: `${proposalId.toString()}:${log.transactionHash}:${voter.id}`,
    proposal,
    voter,
    txHash: log.transactionHash,
    timestamp: blockTimestamp,
    weight,
    type: voteType,
  })

  const weightN = Number(formatEther(weight))
  const choiceIndex = proposal.choices.indexOf(voteType)
  if (choiceIndex >= 0) {
    proposal.scores[choiceIndex]! += weightN
  } else {
    proposal.choices.push(voteType)
    proposal.scores.push(weightN.toString())
  }

  result.votes.push(proposalVote)
}

const _getProposalState = async (ctx: Context, block: Block, proposalId: bigint): Promise<OGNProposalState> => {
  const governance = new governanceAbi.Contract(ctx, block.header, GOVERNANCE_ADDRESS)
  return proposalStateMap[parseInt((await governance.state(proposalId)).toString())] || OGNProposalState.Pending
}

const _getAddress = async (ctx: Context, id: string, result: IProcessResult): Promise<OGNAddress> => {
  id = id.toLowerCase()
  const { addresses } = result

  if (addresses.has(id)) {
    return addresses.get(id)!
  }

  const address = await ctx.store.findOneByOrFail(OGNAddress, {
    id,
  })

  addresses.set(id, address)

  return address
}

const _getProposal = async (ctx: Context, id: string, result: IProcessResult): Promise<OGNProposal> => {
  const { proposals } = result

  if (proposals.has(id)) {
    return proposals.get(id)!
  }

  const proposal = await ctx.store.findOneByOrFail(OGNProposal, {
    id,
  })

  proposals.set(id, proposal)

  return proposal
}
