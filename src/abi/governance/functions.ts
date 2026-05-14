import { address, array, bool, bytes, bytes32, bytes4, string, struct, uint256, uint64, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** BALLOT_TYPEHASH() */
export const BALLOT_TYPEHASH = func('0xdeaaa7cc', {}, bytes32)
export type BALLOT_TYPEHASHParams = FunctionArguments<typeof BALLOT_TYPEHASH>
export type BALLOT_TYPEHASHReturn = FunctionReturn<typeof BALLOT_TYPEHASH>

/** COUNTING_MODE() */
export const COUNTING_MODE = func('0xdd4e2ba5', {}, string)
export type COUNTING_MODEParams = FunctionArguments<typeof COUNTING_MODE>
export type COUNTING_MODEReturn = FunctionReturn<typeof COUNTING_MODE>

/** EXTENDED_BALLOT_TYPEHASH() */
export const EXTENDED_BALLOT_TYPEHASH = func('0x2fe3e261', {}, bytes32)
export type EXTENDED_BALLOT_TYPEHASHParams = FunctionArguments<typeof EXTENDED_BALLOT_TYPEHASH>
export type EXTENDED_BALLOT_TYPEHASHReturn = FunctionReturn<typeof EXTENDED_BALLOT_TYPEHASH>

/** cancel(uint256) */
export const cancel = func('0x40e58ee5', {
    proposalId: uint256,
})
export type CancelParams = FunctionArguments<typeof cancel>
export type CancelReturn = FunctionReturn<typeof cancel>

/** castVote(uint256,uint8) */
export const castVote = func('0x56781388', {
    proposalId: uint256,
    support: uint8,
}, uint256)
export type CastVoteParams = FunctionArguments<typeof castVote>
export type CastVoteReturn = FunctionReturn<typeof castVote>

/** castVoteBySig(uint256,uint8,uint8,bytes32,bytes32) */
export const castVoteBySig = func('0x3bccf4fd', {
    proposalId: uint256,
    support: uint8,
    v: uint8,
    r: bytes32,
    s: bytes32,
}, uint256)
export type CastVoteBySigParams = FunctionArguments<typeof castVoteBySig>
export type CastVoteBySigReturn = FunctionReturn<typeof castVoteBySig>

/** castVoteWithReason(uint256,uint8,string) */
export const castVoteWithReason = func('0x7b3c71d3', {
    proposalId: uint256,
    support: uint8,
    reason: string,
}, uint256)
export type CastVoteWithReasonParams = FunctionArguments<typeof castVoteWithReason>
export type CastVoteWithReasonReturn = FunctionReturn<typeof castVoteWithReason>

/** castVoteWithReasonAndParams(uint256,uint8,string,bytes) */
export const castVoteWithReasonAndParams = func('0x5f398a14', {
    proposalId: uint256,
    support: uint8,
    reason: string,
    params: bytes,
}, uint256)
export type CastVoteWithReasonAndParamsParams = FunctionArguments<typeof castVoteWithReasonAndParams>
export type CastVoteWithReasonAndParamsReturn = FunctionReturn<typeof castVoteWithReasonAndParams>

/** castVoteWithReasonAndParamsBySig(uint256,uint8,string,bytes,uint8,bytes32,bytes32) */
export const castVoteWithReasonAndParamsBySig = func('0x03420181', {
    proposalId: uint256,
    support: uint8,
    reason: string,
    params: bytes,
    v: uint8,
    r: bytes32,
    s: bytes32,
}, uint256)
export type CastVoteWithReasonAndParamsBySigParams = FunctionArguments<typeof castVoteWithReasonAndParamsBySig>
export type CastVoteWithReasonAndParamsBySigReturn = FunctionReturn<typeof castVoteWithReasonAndParamsBySig>

/** execute(address[],uint256[],bytes[],bytes32) */
export const execute = func('0x2656227d', {
    targets: array(address),
    values: array(uint256),
    calldatas: array(bytes),
    descriptionHash: bytes32,
}, uint256)
export type ExecuteParams = FunctionArguments<typeof execute>
export type ExecuteReturn = FunctionReturn<typeof execute>

/** execute(uint256) */
export const execute_1 = func('0xfe0d94c1', {
    proposalId: uint256,
})
export type ExecuteParams_1 = FunctionArguments<typeof execute_1>
export type ExecuteReturn_1 = FunctionReturn<typeof execute_1>

/** getActions(uint256) */
export const getActions = func('0x328dd982', {
    proposalId: uint256,
}, struct({
    targets: array(address),
    values: array(uint256),
    signatures: array(string),
    calldatas: array(bytes),
}))
export type GetActionsParams = FunctionArguments<typeof getActions>
export type GetActionsReturn = FunctionReturn<typeof getActions>

/** getReceipt(uint256,address) */
export const getReceipt = func('0xe23a9a52', {
    proposalId: uint256,
    voter: address,
}, struct({
    hasVoted: bool,
    support: uint8,
    votes: uint256,
}))
export type GetReceiptParams = FunctionArguments<typeof getReceipt>
export type GetReceiptReturn = FunctionReturn<typeof getReceipt>

/** getVotes(address,uint256) */
export const getVotes = func('0xeb9019d4', {
    account: address,
    blockNumber: uint256,
}, uint256)
export type GetVotesParams = FunctionArguments<typeof getVotes>
export type GetVotesReturn = FunctionReturn<typeof getVotes>

/** getVotesWithParams(address,uint256,bytes) */
export const getVotesWithParams = func('0x9a802a6d', {
    account: address,
    blockNumber: uint256,
    params: bytes,
}, uint256)
export type GetVotesWithParamsParams = FunctionArguments<typeof getVotesWithParams>
export type GetVotesWithParamsReturn = FunctionReturn<typeof getVotesWithParams>

/** hasVoted(uint256,address) */
export const hasVoted = func('0x43859632', {
    proposalId: uint256,
    account: address,
}, bool)
export type HasVotedParams = FunctionArguments<typeof hasVoted>
export type HasVotedReturn = FunctionReturn<typeof hasVoted>

/** hashProposal(address[],uint256[],bytes[],bytes32) */
export const hashProposal = func('0xc59057e4', {
    targets: array(address),
    values: array(uint256),
    calldatas: array(bytes),
    descriptionHash: bytes32,
}, uint256)
export type HashProposalParams = FunctionArguments<typeof hashProposal>
export type HashProposalReturn = FunctionReturn<typeof hashProposal>

/** lateQuorumVoteExtension() */
export const lateQuorumVoteExtension = func('0x32b8113e', {}, uint64)
export type LateQuorumVoteExtensionParams = FunctionArguments<typeof lateQuorumVoteExtension>
export type LateQuorumVoteExtensionReturn = FunctionReturn<typeof lateQuorumVoteExtension>

/** name() */
export const name = func('0x06fdde03', {}, string)
export type NameParams = FunctionArguments<typeof name>
export type NameReturn = FunctionReturn<typeof name>

/** onERC1155BatchReceived(address,address,uint256[],uint256[],bytes) */
export const onERC1155BatchReceived = func('0xbc197c81', {
    _0: address,
    _1: address,
    _2: array(uint256),
    _3: array(uint256),
    _4: bytes,
}, bytes4)
export type OnERC1155BatchReceivedParams = FunctionArguments<typeof onERC1155BatchReceived>
export type OnERC1155BatchReceivedReturn = FunctionReturn<typeof onERC1155BatchReceived>

/** onERC1155Received(address,address,uint256,uint256,bytes) */
export const onERC1155Received = func('0xf23a6e61', {
    _0: address,
    _1: address,
    _2: uint256,
    _3: uint256,
    _4: bytes,
}, bytes4)
export type OnERC1155ReceivedParams = FunctionArguments<typeof onERC1155Received>
export type OnERC1155ReceivedReturn = FunctionReturn<typeof onERC1155Received>

/** onERC721Received(address,address,uint256,bytes) */
export const onERC721Received = func('0x150b7a02', {
    _0: address,
    _1: address,
    _2: uint256,
    _3: bytes,
}, bytes4)
export type OnERC721ReceivedParams = FunctionArguments<typeof onERC721Received>
export type OnERC721ReceivedReturn = FunctionReturn<typeof onERC721Received>

/** proposalDeadline(uint256) */
export const proposalDeadline = func('0xc01f9e37', {
    proposalId: uint256,
}, uint256)
export type ProposalDeadlineParams = FunctionArguments<typeof proposalDeadline>
export type ProposalDeadlineReturn = FunctionReturn<typeof proposalDeadline>

/** proposalEta(uint256) */
export const proposalEta = func('0xab58fb8e', {
    proposalId: uint256,
}, uint256)
export type ProposalEtaParams = FunctionArguments<typeof proposalEta>
export type ProposalEtaReturn = FunctionReturn<typeof proposalEta>

/** proposalSnapshot(uint256) */
export const proposalSnapshot = func('0x2d63f693', {
    proposalId: uint256,
}, uint256)
export type ProposalSnapshotParams = FunctionArguments<typeof proposalSnapshot>
export type ProposalSnapshotReturn = FunctionReturn<typeof proposalSnapshot>

/** proposalThreshold() */
export const proposalThreshold = func('0xb58131b0', {}, uint256)
export type ProposalThresholdParams = FunctionArguments<typeof proposalThreshold>
export type ProposalThresholdReturn = FunctionReturn<typeof proposalThreshold>

/** proposals(uint256) */
export const proposals = func('0x013cf08b', {
    proposalId: uint256,
}, struct({
    id: uint256,
    proposer: address,
    eta: uint256,
    startBlock: uint256,
    endBlock: uint256,
    forVotes: uint256,
    againstVotes: uint256,
    abstainVotes: uint256,
    canceled: bool,
    executed: bool,
}))
export type ProposalsParams = FunctionArguments<typeof proposals>
export type ProposalsReturn = FunctionReturn<typeof proposals>

/** propose(address[],uint256[],bytes[],string) */
export const propose = func('0x7d5e81e2', {
    targets: array(address),
    values: array(uint256),
    calldatas: array(bytes),
    description: string,
}, uint256)
export type ProposeParams = FunctionArguments<typeof propose>
export type ProposeReturn = FunctionReturn<typeof propose>

/** propose(address[],uint256[],string[],bytes[],string) */
export const propose_1 = func('0xda95691a', {
    targets: array(address),
    values: array(uint256),
    signatures: array(string),
    calldatas: array(bytes),
    description: string,
}, uint256)
export type ProposeParams_1 = FunctionArguments<typeof propose_1>
export type ProposeReturn_1 = FunctionReturn<typeof propose_1>

/** queue(address[],uint256[],bytes[],bytes32) */
export const queue = func('0x160cbed7', {
    targets: array(address),
    values: array(uint256),
    calldatas: array(bytes),
    descriptionHash: bytes32,
}, uint256)
export type QueueParams = FunctionArguments<typeof queue>
export type QueueReturn = FunctionReturn<typeof queue>

/** queue(uint256) */
export const queue_1 = func('0xddf0b009', {
    proposalId: uint256,
})
export type QueueParams_1 = FunctionArguments<typeof queue_1>
export type QueueReturn_1 = FunctionReturn<typeof queue_1>

/** quorum(uint256) */
export const quorum = func('0xf8ce560a', {
    blockNumber: uint256,
}, uint256)
export type QuorumParams = FunctionArguments<typeof quorum>
export type QuorumReturn = FunctionReturn<typeof quorum>

/** quorumDenominator() */
export const quorumDenominator = func('0x97c3d334', {}, uint256)
export type QuorumDenominatorParams = FunctionArguments<typeof quorumDenominator>
export type QuorumDenominatorReturn = FunctionReturn<typeof quorumDenominator>

/** quorumNumerator() */
export const quorumNumerator = func('0xa7713a70', {}, uint256)
export type QuorumNumeratorParams = FunctionArguments<typeof quorumNumerator>
export type QuorumNumeratorReturn = FunctionReturn<typeof quorumNumerator>

/** quorumVotes() */
export const quorumVotes = func('0x24bc1a64', {}, uint256)
export type QuorumVotesParams = FunctionArguments<typeof quorumVotes>
export type QuorumVotesReturn = FunctionReturn<typeof quorumVotes>

/** relay(address,uint256,bytes) */
export const relay = func('0xc28bc2fa', {
    target: address,
    value: uint256,
    data: bytes,
})
export type RelayParams = FunctionArguments<typeof relay>
export type RelayReturn = FunctionReturn<typeof relay>

/** setLateQuorumVoteExtension(uint64) */
export const setLateQuorumVoteExtension = func('0xd07f91e9', {
    newVoteExtension: uint64,
})
export type SetLateQuorumVoteExtensionParams = FunctionArguments<typeof setLateQuorumVoteExtension>
export type SetLateQuorumVoteExtensionReturn = FunctionReturn<typeof setLateQuorumVoteExtension>

/** setProposalThreshold(uint256) */
export const setProposalThreshold = func('0xece40cc1', {
    newProposalThreshold: uint256,
})
export type SetProposalThresholdParams = FunctionArguments<typeof setProposalThreshold>
export type SetProposalThresholdReturn = FunctionReturn<typeof setProposalThreshold>

/** setVotingDelay(uint256) */
export const setVotingDelay = func('0x70b0f660', {
    newVotingDelay: uint256,
})
export type SetVotingDelayParams = FunctionArguments<typeof setVotingDelay>
export type SetVotingDelayReturn = FunctionReturn<typeof setVotingDelay>

/** setVotingPeriod(uint256) */
export const setVotingPeriod = func('0xea0217cf', {
    newVotingPeriod: uint256,
})
export type SetVotingPeriodParams = FunctionArguments<typeof setVotingPeriod>
export type SetVotingPeriodReturn = FunctionReturn<typeof setVotingPeriod>

/** state(uint256) */
export const state = func('0x3e4f49e6', {
    proposalId: uint256,
}, uint8)
export type StateParams = FunctionArguments<typeof state>
export type StateReturn = FunctionReturn<typeof state>

/** supportsInterface(bytes4) */
export const supportsInterface = func('0x01ffc9a7', {
    interfaceId: bytes4,
}, bool)
export type SupportsInterfaceParams = FunctionArguments<typeof supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof supportsInterface>

/** timelock() */
export const timelock = func('0xd33219b4', {}, address)
export type TimelockParams = FunctionArguments<typeof timelock>
export type TimelockReturn = FunctionReturn<typeof timelock>

/** token() */
export const token = func('0xfc0c546a', {}, address)
export type TokenParams = FunctionArguments<typeof token>
export type TokenReturn = FunctionReturn<typeof token>

/** updateQuorumNumerator(uint256) */
export const updateQuorumNumerator = func('0x06f3f9e6', {
    newQuorumNumerator: uint256,
})
export type UpdateQuorumNumeratorParams = FunctionArguments<typeof updateQuorumNumerator>
export type UpdateQuorumNumeratorReturn = FunctionReturn<typeof updateQuorumNumerator>

/** updateTimelock(address) */
export const updateTimelock = func('0xa890c910', {
    newTimelock: address,
})
export type UpdateTimelockParams = FunctionArguments<typeof updateTimelock>
export type UpdateTimelockReturn = FunctionReturn<typeof updateTimelock>

/** version() */
export const version = func('0x54fd4d50', {}, string)
export type VersionParams = FunctionArguments<typeof version>
export type VersionReturn = FunctionReturn<typeof version>

/** votingDelay() */
export const votingDelay = func('0x3932abb1', {}, uint256)
export type VotingDelayParams = FunctionArguments<typeof votingDelay>
export type VotingDelayReturn = FunctionReturn<typeof votingDelay>

/** votingPeriod() */
export const votingPeriod = func('0x02a251a3', {}, uint256)
export type VotingPeriodParams = FunctionArguments<typeof votingPeriod>
export type VotingPeriodReturn = FunctionReturn<typeof votingPeriod>
