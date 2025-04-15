import * as governanceAbi from '@abi/governance'
import {
  OGVAddress,
  OGVProposal,
  OGVProposalEvent,
  OGVProposalState,
  OGVProposalTxLog,
  OGVProposalVote,
  OGVVoteType,
} from '@model'
import { Block, Context, EvmBatchProcessor, Log } from '@originprotocol/squid-utils'
import { OGV_GOVERNANCE_ADDRESS } from '@utils/addresses'
import { env } from '@utils/env'

export const from = 15491391 // https://etherscan.io/tx/0x0e04e429248c384e6b36229edf8eb5a77bec7023c58808c21b702edfcbc0e0d6

interface IProcessResult {
  addresses: Map<string, OGVAddress>
  proposals: Map<string, OGVProposal>
  proposalLogs: OGVProposalTxLog[]
  votes: OGVProposalVote[]
}

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: [OGV_GOVERNANCE_ADDRESS],
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

let pendingProposals: OGVProposal[] = []
let activeProposals: OGVProposal[] = []
let goActiveBlock = 0
let goFinishedBlock = 0

export const initialize = async (ctx: Context) => {
  const pending = await ctx.store.findBy(OGVProposal, {
    status: OGVProposalState.Pending,
  })
  const active = await ctx.store.findBy(OGVProposal, {
    status: OGVProposalState.Active,
  })
  pendingProposals.push(...pending)
  activeProposals.push(...active)
}

export const process = async (ctx: Context) => {
  if (!ctx.blocksWithContent.length || ctx.blocksWithContent[ctx.blocksWithContent.length - 1].header.height < from) {
    return
  }
  const result: IProcessResult = {
    addresses: new Map<string, OGVAddress>(),
    proposals: new Map<string, OGVProposal>(),
    proposalLogs: [],
    votes: [],
  }

  _updateStatusBlocks()
  for (const block of ctx.blocksWithContent) {
    for (const log of block.logs) {
      if (log.address !== OGV_GOVERNANCE_ADDRESS) continue

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
  const governance = new governanceAbi.Contract(ctx, block.header, OGV_GOVERNANCE_ADDRESS)

  const proposal = new OGVProposal({
    id: proposalId.toString(),
    description,
    proposer,
    timestamp: blockTimestamp,
    startBlock,
    endBlock,
    lastUpdated: new Date(),
    status: OGVProposalState.Pending,
    quorum: await governance.quorum(BigInt(block.header.height - 1)),
    choices: [],
    scores: [],
  })

  pendingProposals.push(proposal)

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
    decode: governanceAbi.events.ProposalQueued.decode.bind(governanceAbi.events.ProposalQueued),
    status: OGVProposalState.Queued,
    event: OGVProposalEvent.Queued,
  },
  [governanceAbi.events.ProposalCanceled.topic]: {
    decode: governanceAbi.events.ProposalCanceled.decode.bind(governanceAbi.events.ProposalCanceled),
    status: OGVProposalState.Canceled,
    event: OGVProposalEvent.Canceled,
  },
  [governanceAbi.events.ProposalExecuted.topic]: {
    decode: governanceAbi.events.ProposalExecuted.decode.bind(governanceAbi.events.ProposalExecuted),
    status: OGVProposalState.Executed,
    event: OGVProposalEvent.Executed,
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
  if (proposal.status === OGVProposalState.Pending && !pendingProposals.find((p) => p.id === proposal.id)) {
    pendingProposals.push(proposal)
  }
  if (proposal.status === OGVProposalState.Active && !activeProposals.find((p) => p.id === proposal.id)) {
    activeProposals.push(proposal)
  }
}

const _processProposalEvents = async (ctx: Context, result: IProcessResult, block: Block, log: Log) => {
  // ctx.log.info('_processProposalEvents')
  const { decode, event } = eventMapper[log.topics[0]]!

  const { proposalId } = decode(log)
  const blockTimestamp = new Date(block.header.timestamp)

  const proposal = await _getProposal(ctx, proposalId.toString(), result)
  await _updateProposalStatus(ctx, result, block, proposalId.toString())

  const proposalTxLog = new OGVProposalTxLog({
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

  const proposalTxLog = new OGVProposalTxLog({
    id: `${proposalId}:${log.transactionHash}:${log.logIndex}`,
    proposal,
    event: OGVProposalEvent.Extended,
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

  const voteType = [OGVVoteType.Against, OGVVoteType.For, OGVVoteType.Abstain][parseInt(support.toString())]
  const proposalVote = new OGVProposalVote({
    id: `${proposalId.toString()}:${log.transactionHash}:${voter.id}`,
    proposal,
    voter,
    txHash: log.transactionHash,
    timestamp: blockTimestamp,
    weight,
    type: voteType,
  })

  const choiceIndex = proposal.choices.indexOf(voteType)
  if (choiceIndex >= 0) {
    proposal.scores[choiceIndex] = (BigInt(proposal.scores[choiceIndex]!) + weight).toString()
  } else {
    proposal.choices.push(voteType)
    proposal.scores.push(weight.toString())
  }

  result.votes.push(proposalVote)
}

const _getProposalState = async (ctx: Context, block: Block, proposalId: bigint): Promise<OGVProposalState> => {
  const governance = new governanceAbi.Contract(ctx, block.header, OGV_GOVERNANCE_ADDRESS)
  return proposalStateMap[parseInt((await governance.state(proposalId)).toString())] || OGVProposalState.Pending
}

const _getAddress = async (ctx: Context, id: string, result: IProcessResult): Promise<OGVAddress> => {
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

const _getProposal = async (ctx: Context, id: string, result: IProcessResult): Promise<OGVProposal> => {
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
