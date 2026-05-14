import { address, array, bytes, string, uint256, uint64, uint8 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** LateQuorumVoteExtensionSet(uint64,uint64) */
export const LateQuorumVoteExtensionSet = event('0x7ca4ac117ed3cdce75c1161d8207c440389b1a15d69d096831664657c07dafc2', {
    oldVoteExtension: uint64,
    newVoteExtension: uint64,
})
export type LateQuorumVoteExtensionSetEventArgs = EParams<typeof LateQuorumVoteExtensionSet>

/** ProposalCanceled(uint256) */
export const ProposalCanceled = event('0x789cf55be980739dad1d0699b93b58e806b51c9d96619bfa8fe0a28abaa7b30c', {
    proposalId: uint256,
})
export type ProposalCanceledEventArgs = EParams<typeof ProposalCanceled>

/** ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string) */
export const ProposalCreated = event('0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0', {
    proposalId: uint256,
    proposer: address,
    targets: array(address),
    values: array(uint256),
    signatures: array(string),
    calldatas: array(bytes),
    startBlock: uint256,
    endBlock: uint256,
    description: string,
})
export type ProposalCreatedEventArgs = EParams<typeof ProposalCreated>

/** ProposalExecuted(uint256) */
export const ProposalExecuted = event('0x712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f', {
    proposalId: uint256,
})
export type ProposalExecutedEventArgs = EParams<typeof ProposalExecuted>

/** ProposalExtended(uint256,uint64) */
export const ProposalExtended = event('0x541f725fb9f7c98a30cc9c0ff32fbb14358cd7159c847a3aa20a2bdc442ba511', {
    proposalId: indexed(uint256),
    extendedDeadline: uint64,
})
export type ProposalExtendedEventArgs = EParams<typeof ProposalExtended>

/** ProposalQueued(uint256,uint256) */
export const ProposalQueued = event('0x9a2e42fd6722813d69113e7d0079d3d940171428df7373df9c7f7617cfda2892', {
    proposalId: uint256,
    eta: uint256,
})
export type ProposalQueuedEventArgs = EParams<typeof ProposalQueued>

/** ProposalThresholdSet(uint256,uint256) */
export const ProposalThresholdSet = event('0xccb45da8d5717e6c4544694297c4ba5cf151d455c9bb0ed4fc7a38411bc05461', {
    oldProposalThreshold: uint256,
    newProposalThreshold: uint256,
})
export type ProposalThresholdSetEventArgs = EParams<typeof ProposalThresholdSet>

/** QuorumNumeratorUpdated(uint256,uint256) */
export const QuorumNumeratorUpdated = event('0x0553476bf02ef2726e8ce5ced78d63e26e602e4a2257b1f559418e24b4633997', {
    oldQuorumNumerator: uint256,
    newQuorumNumerator: uint256,
})
export type QuorumNumeratorUpdatedEventArgs = EParams<typeof QuorumNumeratorUpdated>

/** TimelockChange(address,address) */
export const TimelockChange = event('0x08f74ea46ef7894f65eabfb5e6e695de773a000b47c529ab559178069b226401', {
    oldTimelock: address,
    newTimelock: address,
})
export type TimelockChangeEventArgs = EParams<typeof TimelockChange>

/** VoteCast(address,uint256,uint8,uint256,string) */
export const VoteCast = event('0xb8e138887d0aa13bab447e82de9d5c1777041ecd21ca36ba824ff1e6c07ddda4', {
    voter: indexed(address),
    proposalId: uint256,
    support: uint8,
    weight: uint256,
    reason: string,
})
export type VoteCastEventArgs = EParams<typeof VoteCast>

/** VoteCastWithParams(address,uint256,uint8,uint256,string,bytes) */
export const VoteCastWithParams = event('0xe2babfbac5889a709b63bb7f598b324e08bc5a4fb9ec647fb3cbc9ec07eb8712', {
    voter: indexed(address),
    proposalId: uint256,
    support: uint8,
    weight: uint256,
    reason: string,
    params: bytes,
})
export type VoteCastWithParamsEventArgs = EParams<typeof VoteCastWithParams>

/** VotingDelaySet(uint256,uint256) */
export const VotingDelaySet = event('0xc565b045403dc03c2eea82b81a0465edad9e2e7fc4d97e11421c209da93d7a93', {
    oldVotingDelay: uint256,
    newVotingDelay: uint256,
})
export type VotingDelaySetEventArgs = EParams<typeof VotingDelaySet>

/** VotingPeriodSet(uint256,uint256) */
export const VotingPeriodSet = event('0x7e3f7f0708a84de9203036abaa450dccc85ad5ff52f78c170f3edb55cf5e8828', {
    oldVotingPeriod: uint256,
    newVotingPeriod: uint256,
})
export type VotingPeriodSetEventArgs = EParams<typeof VotingPeriodSet>
