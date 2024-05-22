import { add } from 'lodash'
import { Hex } from 'viem'

import * as governanceAbi from '@abi/governance'
import {
  GovernanceProposal,
  GovernanceProposalEvent,
  GovernanceProposalEventType,
  GovernanceProposalState,
  GovernanceProposalVote,
  GovernanceVoteType,
} from '@model'
import { Block, Context, Log } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { env } from '@utils/env'

interface IProcessResult {
  proposals: Map<string, GovernanceProposal>
  proposalEvents: GovernanceProposalEvent[]
  votes: GovernanceProposalVote[]
}

const proposalStateMap = [
  GovernanceProposalState.Pending,
  GovernanceProposalState.Active,
  GovernanceProposalState.Canceled,
  GovernanceProposalState.Defeated,
  GovernanceProposalState.Succeeded,
  GovernanceProposalState.Queued,
  GovernanceProposalState.Expired,
  GovernanceProposalState.Executed,
]

const eventMapper = {
  [governanceAbi.events.ProposalQueued.topic]: {
    decode: governanceAbi.events.ProposalQueued.decode.bind(governanceAbi.events.ProposalQueued),
    status: GovernanceProposalState.Queued,
    event: GovernanceProposalEventType.Queued,
  },
  [governanceAbi.events.ProposalCanceled.topic]: {
    decode: governanceAbi.events.ProposalCanceled.decode.bind(governanceAbi.events.ProposalCanceled),
    status: GovernanceProposalState.Canceled,
    event: GovernanceProposalEventType.Canceled,
  },
  [governanceAbi.events.ProposalExecuted.topic]: {
    decode: governanceAbi.events.ProposalExecuted.decode.bind(governanceAbi.events.ProposalExecuted),
    status: GovernanceProposalState.Executed,
    event: GovernanceProposalEventType.Executed,
  },
}

export const createGovernanceProcessor = ({ from, address }: { from: number; address: Hex }) => {
  const setup = (processor: EvmBatchProcessor) => {
    processor.addLog({
      address: [address],
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

  let pendingProposals: GovernanceProposal[] = []
  let activeProposals: GovernanceProposal[] = []
  let goActiveBlock = 0
  let goFinishedBlock = 0

  const initialize = async (ctx: Context) => {
    const pending = await ctx.store.findBy(GovernanceProposal, {
      status: GovernanceProposalState.Pending,
    })
    const active = await ctx.store.findBy(GovernanceProposal, {
      status: GovernanceProposalState.Active,
    })
    pendingProposals.push(...pending)
    activeProposals.push(...active)
  }

  const process = async (ctx: Context) => {
    if (ctx.blocks[ctx.blocks.length - 1]?.header.height < from) return

    const result: IProcessResult = {
      proposals: new Map<string, GovernanceProposal>(),
      proposalEvents: [],
      votes: [],
    }

    _updateStatusBlocks()
    for (const block of ctx.blocks) {
      for (const log of block.logs) {
        if (log.address !== address) continue

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

    await ctx.store.upsert(Array.from(result.proposals.values()))
    await ctx.store.upsert(result.proposalEvents)
    await ctx.store.upsert(result.votes)
  }

  const _processProposalCreated = async (ctx: Context, result: IProcessResult, block: Block, log: Log) => {
    // ctx.log.info('_processProposalCreated')
    const data = governanceAbi.events.ProposalCreated.decode(log)
    const blockTimestamp = new Date(block.header.timestamp)
    const governance = new governanceAbi.Contract(ctx, block.header, address)

    const proposal = new GovernanceProposal({
      id: `${ctx.chain.id}:${address}:${data.proposalId}`,
      chainId: ctx.chain.id,
      address,
      proposalId: data.proposalId,
      description: data.description,
      proposer: data.proposer.toLowerCase(),
      timestamp: blockTimestamp,
      startBlock: data.startBlock,
      endBlock: data.endBlock,
      signatures: data.signatures,
      calldatas: data.calldatas,
      values: data.values.map((v) => v.toString()),
      targets: data.targets,
      lastUpdated: new Date(),
      status: GovernanceProposalState.Pending,
      events: [],
      quorum: await governance.quorum(BigInt(block.header.height - 1)),
      choices: [],
      scores: [],
    })

    pendingProposals.push(proposal)

    const proposalTxLog = new GovernanceProposalEvent({
      id: `${ctx.chain.id}:${log.id}`,
      proposal,
      event: GovernanceProposalEventType.Created,
      hash: log.transactionHash,
      timestamp: blockTimestamp,
    })

    result.proposals.set(proposal.id, proposal)
    result.proposalEvents.push(proposalTxLog)
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
        await _updateProposalStatus(ctx, result, block, proposal.proposalId)
      }
      pendingProposals = pendingProposals.filter((p) => block.header.height <= Number(p.startBlock))
    }
    if (block.header.height > goFinishedBlock) {
      ctx.log.info('block.header.height > goFinishedBlock')
      for (const proposal of activeProposals.filter((p) => block.header.height > Number(p.endBlock))) {
        await _updateProposalStatus(ctx, result, block, proposal.proposalId)
      }
      activeProposals = activeProposals.filter((p) => block.header.height <= Number(p.endBlock))
    }
    _updateStatusBlocks()
  }

  const _updateProposalStatus = async (ctx: Context, result: IProcessResult, block: Block, proposalId: bigint) => {
    const proposal = await _getProposal(ctx, proposalId, result)
    proposal.status = await _getProposalState(ctx, block, proposal.proposalId)
    ctx.log.info({ status: proposal.status }, '_updateProposalStatus')
    if (proposal.status === GovernanceProposalState.Pending && !pendingProposals.find((p) => p.id === proposal.id)) {
      pendingProposals.push(proposal)
    }
    if (proposal.status === GovernanceProposalState.Active && !activeProposals.find((p) => p.id === proposal.id)) {
      activeProposals.push(proposal)
    }
  }

  const _processProposalEvents = async (ctx: Context, result: IProcessResult, block: Block, log: Log) => {
    // ctx.log.info('_processProposalEvents')
    const { decode, status, event } = eventMapper[log.topics[0]]!

    const { proposalId } = decode(log)
    const blockTimestamp = new Date(block.header.timestamp)

    const proposal = await _getProposal(ctx, proposalId, result)
    await _updateProposalStatus(ctx, result, block, proposalId)

    const proposalTxLog = new GovernanceProposalEvent({
      id: `${ctx.chain.id}:${log.id}`,
      proposal,
      event,
      hash: log.transactionHash,
      timestamp: blockTimestamp,
    })

    result.proposalEvents.push(proposalTxLog)
  }

  const _processProposalExtended = async (ctx: Context, result: IProcessResult, block: Block, log: Log) => {
    // ctx.log.info('_processProposalExtended')
    const { proposalId, extendedDeadline } = governanceAbi.events.ProposalExtended.decode(log)
    const blockTimestamp = new Date(block.header.timestamp)

    const proposal = await _getProposal(ctx, proposalId, result)
    proposal.endBlock = extendedDeadline
    await _updateProposalStatus(ctx, result, block, proposalId)

    const proposalTxLog = new GovernanceProposalEvent({
      id: `${ctx.chain.id}:${log.id}`,
      proposal,
      event: GovernanceProposalEventType.Extended,
      hash: log.transactionHash,
      timestamp: blockTimestamp,
    })

    result.proposalEvents.push(proposalTxLog)
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

    const proposal = await _getProposal(ctx, proposalId, result)

    const voteType = [GovernanceVoteType.Against, GovernanceVoteType.For, GovernanceVoteType.Abstain][
      parseInt(support.toString())
    ]
    const proposalVote = new GovernanceProposalVote({
      id: `${ctx.chain.id}:${log.id}`,
      chainId: ctx.chain.id,
      address,
      proposal,
      voter: voterAddr.toLowerCase(),
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

  const _getProposalState = async (
    ctx: Context,
    block: Block,
    proposalId: bigint,
  ): Promise<GovernanceProposalState> => {
    const governance = new governanceAbi.Contract(ctx, block.header, address)
    return (
      proposalStateMap[parseInt((await governance.state(proposalId)).toString())] || GovernanceProposalState.Pending
    )
  }

  const _getProposal = async (
    ctx: Context,
    proposalId: bigint,
    result: IProcessResult,
  ): Promise<GovernanceProposal> => {
    const { proposals } = result
    const id = `${ctx.chain.id}:${address}:${proposalId}`

    if (proposals.has(id)) {
      return proposals.get(id)!
    }

    const proposal = await ctx.store.findOneByOrFail(GovernanceProposal, {
      id,
    })

    proposals.set(id, proposal)

    return proposal
  }

  return { from, setup, initialize, process }
}
