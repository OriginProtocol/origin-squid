import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    LateQuorumVoteExtensionSet: event("0x7ca4ac117ed3cdce75c1161d8207c440389b1a15d69d096831664657c07dafc2", "LateQuorumVoteExtensionSet(uint64,uint64)", {"oldVoteExtension": p.uint64, "newVoteExtension": p.uint64}),
    ProposalCanceled: event("0x789cf55be980739dad1d0699b93b58e806b51c9d96619bfa8fe0a28abaa7b30c", "ProposalCanceled(uint256)", {"proposalId": p.uint256}),
    ProposalCreated: event("0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0", "ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)", {"proposalId": p.uint256, "proposer": p.address, "targets": p.array(p.address), "values": p.array(p.uint256), "signatures": p.array(p.string), "calldatas": p.array(p.bytes), "startBlock": p.uint256, "endBlock": p.uint256, "description": p.string}),
    ProposalExecuted: event("0x712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f", "ProposalExecuted(uint256)", {"proposalId": p.uint256}),
    ProposalExtended: event("0x541f725fb9f7c98a30cc9c0ff32fbb14358cd7159c847a3aa20a2bdc442ba511", "ProposalExtended(uint256,uint64)", {"proposalId": indexed(p.uint256), "extendedDeadline": p.uint64}),
    ProposalQueued: event("0x9a2e42fd6722813d69113e7d0079d3d940171428df7373df9c7f7617cfda2892", "ProposalQueued(uint256,uint256)", {"proposalId": p.uint256, "eta": p.uint256}),
    ProposalThresholdSet: event("0xccb45da8d5717e6c4544694297c4ba5cf151d455c9bb0ed4fc7a38411bc05461", "ProposalThresholdSet(uint256,uint256)", {"oldProposalThreshold": p.uint256, "newProposalThreshold": p.uint256}),
    QuorumNumeratorUpdated: event("0x0553476bf02ef2726e8ce5ced78d63e26e602e4a2257b1f559418e24b4633997", "QuorumNumeratorUpdated(uint256,uint256)", {"oldQuorumNumerator": p.uint256, "newQuorumNumerator": p.uint256}),
    TimelockChange: event("0x08f74ea46ef7894f65eabfb5e6e695de773a000b47c529ab559178069b226401", "TimelockChange(address,address)", {"oldTimelock": p.address, "newTimelock": p.address}),
    VoteCast: event("0xb8e138887d0aa13bab447e82de9d5c1777041ecd21ca36ba824ff1e6c07ddda4", "VoteCast(address,uint256,uint8,uint256,string)", {"voter": indexed(p.address), "proposalId": p.uint256, "support": p.uint8, "weight": p.uint256, "reason": p.string}),
    VoteCastWithParams: event("0xe2babfbac5889a709b63bb7f598b324e08bc5a4fb9ec647fb3cbc9ec07eb8712", "VoteCastWithParams(address,uint256,uint8,uint256,string,bytes)", {"voter": indexed(p.address), "proposalId": p.uint256, "support": p.uint8, "weight": p.uint256, "reason": p.string, "params": p.bytes}),
    VotingDelaySet: event("0xc565b045403dc03c2eea82b81a0465edad9e2e7fc4d97e11421c209da93d7a93", "VotingDelaySet(uint256,uint256)", {"oldVotingDelay": p.uint256, "newVotingDelay": p.uint256}),
    VotingPeriodSet: event("0x7e3f7f0708a84de9203036abaa450dccc85ad5ff52f78c170f3edb55cf5e8828", "VotingPeriodSet(uint256,uint256)", {"oldVotingPeriod": p.uint256, "newVotingPeriod": p.uint256}),
}

export const functions = {
    BALLOT_TYPEHASH: viewFun("0xdeaaa7cc", "BALLOT_TYPEHASH()", {}, p.bytes32),
    COUNTING_MODE: viewFun("0xdd4e2ba5", "COUNTING_MODE()", {}, p.string),
    EXTENDED_BALLOT_TYPEHASH: viewFun("0x2fe3e261", "EXTENDED_BALLOT_TYPEHASH()", {}, p.bytes32),
    cancel: fun("0x40e58ee5", "cancel(uint256)", {"proposalId": p.uint256}, ),
    castVote: fun("0x56781388", "castVote(uint256,uint8)", {"proposalId": p.uint256, "support": p.uint8}, p.uint256),
    castVoteBySig: fun("0x3bccf4fd", "castVoteBySig(uint256,uint8,uint8,bytes32,bytes32)", {"proposalId": p.uint256, "support": p.uint8, "v": p.uint8, "r": p.bytes32, "s": p.bytes32}, p.uint256),
    castVoteWithReason: fun("0x7b3c71d3", "castVoteWithReason(uint256,uint8,string)", {"proposalId": p.uint256, "support": p.uint8, "reason": p.string}, p.uint256),
    castVoteWithReasonAndParams: fun("0x5f398a14", "castVoteWithReasonAndParams(uint256,uint8,string,bytes)", {"proposalId": p.uint256, "support": p.uint8, "reason": p.string, "params": p.bytes}, p.uint256),
    castVoteWithReasonAndParamsBySig: fun("0x03420181", "castVoteWithReasonAndParamsBySig(uint256,uint8,string,bytes,uint8,bytes32,bytes32)", {"proposalId": p.uint256, "support": p.uint8, "reason": p.string, "params": p.bytes, "v": p.uint8, "r": p.bytes32, "s": p.bytes32}, p.uint256),
    'execute(address[],uint256[],bytes[],bytes32)': fun("0x2656227d", "execute(address[],uint256[],bytes[],bytes32)", {"targets": p.array(p.address), "values": p.array(p.uint256), "calldatas": p.array(p.bytes), "descriptionHash": p.bytes32}, p.uint256),
    'execute(uint256)': fun("0xfe0d94c1", "execute(uint256)", {"proposalId": p.uint256}, ),
    getActions: viewFun("0x328dd982", "getActions(uint256)", {"proposalId": p.uint256}, {"targets": p.array(p.address), "values": p.array(p.uint256), "signatures": p.array(p.string), "calldatas": p.array(p.bytes)}),
    getReceipt: viewFun("0xe23a9a52", "getReceipt(uint256,address)", {"proposalId": p.uint256, "voter": p.address}, p.struct({"hasVoted": p.bool, "support": p.uint8, "votes": p.uint256})),
    getVotes: viewFun("0xeb9019d4", "getVotes(address,uint256)", {"account": p.address, "blockNumber": p.uint256}, p.uint256),
    getVotesWithParams: viewFun("0x9a802a6d", "getVotesWithParams(address,uint256,bytes)", {"account": p.address, "blockNumber": p.uint256, "params": p.bytes}, p.uint256),
    hasVoted: viewFun("0x43859632", "hasVoted(uint256,address)", {"proposalId": p.uint256, "account": p.address}, p.bool),
    hashProposal: viewFun("0xc59057e4", "hashProposal(address[],uint256[],bytes[],bytes32)", {"targets": p.array(p.address), "values": p.array(p.uint256), "calldatas": p.array(p.bytes), "descriptionHash": p.bytes32}, p.uint256),
    lateQuorumVoteExtension: viewFun("0x32b8113e", "lateQuorumVoteExtension()", {}, p.uint64),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    onERC1155BatchReceived: fun("0xbc197c81", "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)", {"_0": p.address, "_1": p.address, "_2": p.array(p.uint256), "_3": p.array(p.uint256), "_4": p.bytes}, p.bytes4),
    onERC1155Received: fun("0xf23a6e61", "onERC1155Received(address,address,uint256,uint256,bytes)", {"_0": p.address, "_1": p.address, "_2": p.uint256, "_3": p.uint256, "_4": p.bytes}, p.bytes4),
    onERC721Received: fun("0x150b7a02", "onERC721Received(address,address,uint256,bytes)", {"_0": p.address, "_1": p.address, "_2": p.uint256, "_3": p.bytes}, p.bytes4),
    proposalDeadline: viewFun("0xc01f9e37", "proposalDeadline(uint256)", {"proposalId": p.uint256}, p.uint256),
    proposalEta: viewFun("0xab58fb8e", "proposalEta(uint256)", {"proposalId": p.uint256}, p.uint256),
    proposalSnapshot: viewFun("0x2d63f693", "proposalSnapshot(uint256)", {"proposalId": p.uint256}, p.uint256),
    proposalThreshold: viewFun("0xb58131b0", "proposalThreshold()", {}, p.uint256),
    proposals: viewFun("0x013cf08b", "proposals(uint256)", {"proposalId": p.uint256}, {"id": p.uint256, "proposer": p.address, "eta": p.uint256, "startBlock": p.uint256, "endBlock": p.uint256, "forVotes": p.uint256, "againstVotes": p.uint256, "abstainVotes": p.uint256, "canceled": p.bool, "executed": p.bool}),
    'propose(address[],uint256[],bytes[],string)': fun("0x7d5e81e2", "propose(address[],uint256[],bytes[],string)", {"targets": p.array(p.address), "values": p.array(p.uint256), "calldatas": p.array(p.bytes), "description": p.string}, p.uint256),
    'propose(address[],uint256[],string[],bytes[],string)': fun("0xda95691a", "propose(address[],uint256[],string[],bytes[],string)", {"targets": p.array(p.address), "values": p.array(p.uint256), "signatures": p.array(p.string), "calldatas": p.array(p.bytes), "description": p.string}, p.uint256),
    'queue(address[],uint256[],bytes[],bytes32)': fun("0x160cbed7", "queue(address[],uint256[],bytes[],bytes32)", {"targets": p.array(p.address), "values": p.array(p.uint256), "calldatas": p.array(p.bytes), "descriptionHash": p.bytes32}, p.uint256),
    'queue(uint256)': fun("0xddf0b009", "queue(uint256)", {"proposalId": p.uint256}, ),
    quorum: viewFun("0xf8ce560a", "quorum(uint256)", {"blockNumber": p.uint256}, p.uint256),
    quorumDenominator: viewFun("0x97c3d334", "quorumDenominator()", {}, p.uint256),
    quorumNumerator: viewFun("0xa7713a70", "quorumNumerator()", {}, p.uint256),
    quorumVotes: viewFun("0x24bc1a64", "quorumVotes()", {}, p.uint256),
    relay: fun("0xc28bc2fa", "relay(address,uint256,bytes)", {"target": p.address, "value": p.uint256, "data": p.bytes}, ),
    setLateQuorumVoteExtension: fun("0xd07f91e9", "setLateQuorumVoteExtension(uint64)", {"newVoteExtension": p.uint64}, ),
    setProposalThreshold: fun("0xece40cc1", "setProposalThreshold(uint256)", {"newProposalThreshold": p.uint256}, ),
    setVotingDelay: fun("0x70b0f660", "setVotingDelay(uint256)", {"newVotingDelay": p.uint256}, ),
    setVotingPeriod: fun("0xea0217cf", "setVotingPeriod(uint256)", {"newVotingPeriod": p.uint256}, ),
    state: viewFun("0x3e4f49e6", "state(uint256)", {"proposalId": p.uint256}, p.uint8),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    timelock: viewFun("0xd33219b4", "timelock()", {}, p.address),
    token: viewFun("0xfc0c546a", "token()", {}, p.address),
    updateQuorumNumerator: fun("0x06f3f9e6", "updateQuorumNumerator(uint256)", {"newQuorumNumerator": p.uint256}, ),
    updateTimelock: fun("0xa890c910", "updateTimelock(address)", {"newTimelock": p.address}, ),
    version: viewFun("0x54fd4d50", "version()", {}, p.string),
    votingDelay: viewFun("0x3932abb1", "votingDelay()", {}, p.uint256),
    votingPeriod: viewFun("0x02a251a3", "votingPeriod()", {}, p.uint256),
}

export class Contract extends ContractBase {

    BALLOT_TYPEHASH() {
        return this.eth_call(functions.BALLOT_TYPEHASH, {})
    }

    COUNTING_MODE() {
        return this.eth_call(functions.COUNTING_MODE, {})
    }

    EXTENDED_BALLOT_TYPEHASH() {
        return this.eth_call(functions.EXTENDED_BALLOT_TYPEHASH, {})
    }

    getActions(proposalId: GetActionsParams["proposalId"]) {
        return this.eth_call(functions.getActions, {proposalId})
    }

    getReceipt(proposalId: GetReceiptParams["proposalId"], voter: GetReceiptParams["voter"]) {
        return this.eth_call(functions.getReceipt, {proposalId, voter})
    }

    getVotes(account: GetVotesParams["account"], blockNumber: GetVotesParams["blockNumber"]) {
        return this.eth_call(functions.getVotes, {account, blockNumber})
    }

    getVotesWithParams(account: GetVotesWithParamsParams["account"], blockNumber: GetVotesWithParamsParams["blockNumber"], params: GetVotesWithParamsParams["params"]) {
        return this.eth_call(functions.getVotesWithParams, {account, blockNumber, params})
    }

    hasVoted(proposalId: HasVotedParams["proposalId"], account: HasVotedParams["account"]) {
        return this.eth_call(functions.hasVoted, {proposalId, account})
    }

    hashProposal(targets: HashProposalParams["targets"], values: HashProposalParams["values"], calldatas: HashProposalParams["calldatas"], descriptionHash: HashProposalParams["descriptionHash"]) {
        return this.eth_call(functions.hashProposal, {targets, values, calldatas, descriptionHash})
    }

    lateQuorumVoteExtension() {
        return this.eth_call(functions.lateQuorumVoteExtension, {})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    proposalDeadline(proposalId: ProposalDeadlineParams["proposalId"]) {
        return this.eth_call(functions.proposalDeadline, {proposalId})
    }

    proposalEta(proposalId: ProposalEtaParams["proposalId"]) {
        return this.eth_call(functions.proposalEta, {proposalId})
    }

    proposalSnapshot(proposalId: ProposalSnapshotParams["proposalId"]) {
        return this.eth_call(functions.proposalSnapshot, {proposalId})
    }

    proposalThreshold() {
        return this.eth_call(functions.proposalThreshold, {})
    }

    proposals(proposalId: ProposalsParams["proposalId"]) {
        return this.eth_call(functions.proposals, {proposalId})
    }

    quorum(blockNumber: QuorumParams["blockNumber"]) {
        return this.eth_call(functions.quorum, {blockNumber})
    }

    quorumDenominator() {
        return this.eth_call(functions.quorumDenominator, {})
    }

    quorumNumerator() {
        return this.eth_call(functions.quorumNumerator, {})
    }

    quorumVotes() {
        return this.eth_call(functions.quorumVotes, {})
    }

    state(proposalId: StateParams["proposalId"]) {
        return this.eth_call(functions.state, {proposalId})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    timelock() {
        return this.eth_call(functions.timelock, {})
    }

    token() {
        return this.eth_call(functions.token, {})
    }

    version() {
        return this.eth_call(functions.version, {})
    }

    votingDelay() {
        return this.eth_call(functions.votingDelay, {})
    }

    votingPeriod() {
        return this.eth_call(functions.votingPeriod, {})
    }
}

/// Event types
export type LateQuorumVoteExtensionSetEventArgs = EParams<typeof events.LateQuorumVoteExtensionSet>
export type ProposalCanceledEventArgs = EParams<typeof events.ProposalCanceled>
export type ProposalCreatedEventArgs = EParams<typeof events.ProposalCreated>
export type ProposalExecutedEventArgs = EParams<typeof events.ProposalExecuted>
export type ProposalExtendedEventArgs = EParams<typeof events.ProposalExtended>
export type ProposalQueuedEventArgs = EParams<typeof events.ProposalQueued>
export type ProposalThresholdSetEventArgs = EParams<typeof events.ProposalThresholdSet>
export type QuorumNumeratorUpdatedEventArgs = EParams<typeof events.QuorumNumeratorUpdated>
export type TimelockChangeEventArgs = EParams<typeof events.TimelockChange>
export type VoteCastEventArgs = EParams<typeof events.VoteCast>
export type VoteCastWithParamsEventArgs = EParams<typeof events.VoteCastWithParams>
export type VotingDelaySetEventArgs = EParams<typeof events.VotingDelaySet>
export type VotingPeriodSetEventArgs = EParams<typeof events.VotingPeriodSet>

/// Function types
export type BALLOT_TYPEHASHParams = FunctionArguments<typeof functions.BALLOT_TYPEHASH>
export type BALLOT_TYPEHASHReturn = FunctionReturn<typeof functions.BALLOT_TYPEHASH>

export type COUNTING_MODEParams = FunctionArguments<typeof functions.COUNTING_MODE>
export type COUNTING_MODEReturn = FunctionReturn<typeof functions.COUNTING_MODE>

export type EXTENDED_BALLOT_TYPEHASHParams = FunctionArguments<typeof functions.EXTENDED_BALLOT_TYPEHASH>
export type EXTENDED_BALLOT_TYPEHASHReturn = FunctionReturn<typeof functions.EXTENDED_BALLOT_TYPEHASH>

export type CancelParams = FunctionArguments<typeof functions.cancel>
export type CancelReturn = FunctionReturn<typeof functions.cancel>

export type CastVoteParams = FunctionArguments<typeof functions.castVote>
export type CastVoteReturn = FunctionReturn<typeof functions.castVote>

export type CastVoteBySigParams = FunctionArguments<typeof functions.castVoteBySig>
export type CastVoteBySigReturn = FunctionReturn<typeof functions.castVoteBySig>

export type CastVoteWithReasonParams = FunctionArguments<typeof functions.castVoteWithReason>
export type CastVoteWithReasonReturn = FunctionReturn<typeof functions.castVoteWithReason>

export type CastVoteWithReasonAndParamsParams = FunctionArguments<typeof functions.castVoteWithReasonAndParams>
export type CastVoteWithReasonAndParamsReturn = FunctionReturn<typeof functions.castVoteWithReasonAndParams>

export type CastVoteWithReasonAndParamsBySigParams = FunctionArguments<typeof functions.castVoteWithReasonAndParamsBySig>
export type CastVoteWithReasonAndParamsBySigReturn = FunctionReturn<typeof functions.castVoteWithReasonAndParamsBySig>

export type ExecuteParams_0 = FunctionArguments<typeof functions['execute(address[],uint256[],bytes[],bytes32)']>
export type ExecuteReturn_0 = FunctionReturn<typeof functions['execute(address[],uint256[],bytes[],bytes32)']>

export type ExecuteParams_1 = FunctionArguments<typeof functions['execute(uint256)']>
export type ExecuteReturn_1 = FunctionReturn<typeof functions['execute(uint256)']>

export type GetActionsParams = FunctionArguments<typeof functions.getActions>
export type GetActionsReturn = FunctionReturn<typeof functions.getActions>

export type GetReceiptParams = FunctionArguments<typeof functions.getReceipt>
export type GetReceiptReturn = FunctionReturn<typeof functions.getReceipt>

export type GetVotesParams = FunctionArguments<typeof functions.getVotes>
export type GetVotesReturn = FunctionReturn<typeof functions.getVotes>

export type GetVotesWithParamsParams = FunctionArguments<typeof functions.getVotesWithParams>
export type GetVotesWithParamsReturn = FunctionReturn<typeof functions.getVotesWithParams>

export type HasVotedParams = FunctionArguments<typeof functions.hasVoted>
export type HasVotedReturn = FunctionReturn<typeof functions.hasVoted>

export type HashProposalParams = FunctionArguments<typeof functions.hashProposal>
export type HashProposalReturn = FunctionReturn<typeof functions.hashProposal>

export type LateQuorumVoteExtensionParams = FunctionArguments<typeof functions.lateQuorumVoteExtension>
export type LateQuorumVoteExtensionReturn = FunctionReturn<typeof functions.lateQuorumVoteExtension>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type OnERC1155BatchReceivedParams = FunctionArguments<typeof functions.onERC1155BatchReceived>
export type OnERC1155BatchReceivedReturn = FunctionReturn<typeof functions.onERC1155BatchReceived>

export type OnERC1155ReceivedParams = FunctionArguments<typeof functions.onERC1155Received>
export type OnERC1155ReceivedReturn = FunctionReturn<typeof functions.onERC1155Received>

export type OnERC721ReceivedParams = FunctionArguments<typeof functions.onERC721Received>
export type OnERC721ReceivedReturn = FunctionReturn<typeof functions.onERC721Received>

export type ProposalDeadlineParams = FunctionArguments<typeof functions.proposalDeadline>
export type ProposalDeadlineReturn = FunctionReturn<typeof functions.proposalDeadline>

export type ProposalEtaParams = FunctionArguments<typeof functions.proposalEta>
export type ProposalEtaReturn = FunctionReturn<typeof functions.proposalEta>

export type ProposalSnapshotParams = FunctionArguments<typeof functions.proposalSnapshot>
export type ProposalSnapshotReturn = FunctionReturn<typeof functions.proposalSnapshot>

export type ProposalThresholdParams = FunctionArguments<typeof functions.proposalThreshold>
export type ProposalThresholdReturn = FunctionReturn<typeof functions.proposalThreshold>

export type ProposalsParams = FunctionArguments<typeof functions.proposals>
export type ProposalsReturn = FunctionReturn<typeof functions.proposals>

export type ProposeParams_0 = FunctionArguments<typeof functions['propose(address[],uint256[],bytes[],string)']>
export type ProposeReturn_0 = FunctionReturn<typeof functions['propose(address[],uint256[],bytes[],string)']>

export type ProposeParams_1 = FunctionArguments<typeof functions['propose(address[],uint256[],string[],bytes[],string)']>
export type ProposeReturn_1 = FunctionReturn<typeof functions['propose(address[],uint256[],string[],bytes[],string)']>

export type QueueParams_0 = FunctionArguments<typeof functions['queue(address[],uint256[],bytes[],bytes32)']>
export type QueueReturn_0 = FunctionReturn<typeof functions['queue(address[],uint256[],bytes[],bytes32)']>

export type QueueParams_1 = FunctionArguments<typeof functions['queue(uint256)']>
export type QueueReturn_1 = FunctionReturn<typeof functions['queue(uint256)']>

export type QuorumParams = FunctionArguments<typeof functions.quorum>
export type QuorumReturn = FunctionReturn<typeof functions.quorum>

export type QuorumDenominatorParams = FunctionArguments<typeof functions.quorumDenominator>
export type QuorumDenominatorReturn = FunctionReturn<typeof functions.quorumDenominator>

export type QuorumNumeratorParams = FunctionArguments<typeof functions.quorumNumerator>
export type QuorumNumeratorReturn = FunctionReturn<typeof functions.quorumNumerator>

export type QuorumVotesParams = FunctionArguments<typeof functions.quorumVotes>
export type QuorumVotesReturn = FunctionReturn<typeof functions.quorumVotes>

export type RelayParams = FunctionArguments<typeof functions.relay>
export type RelayReturn = FunctionReturn<typeof functions.relay>

export type SetLateQuorumVoteExtensionParams = FunctionArguments<typeof functions.setLateQuorumVoteExtension>
export type SetLateQuorumVoteExtensionReturn = FunctionReturn<typeof functions.setLateQuorumVoteExtension>

export type SetProposalThresholdParams = FunctionArguments<typeof functions.setProposalThreshold>
export type SetProposalThresholdReturn = FunctionReturn<typeof functions.setProposalThreshold>

export type SetVotingDelayParams = FunctionArguments<typeof functions.setVotingDelay>
export type SetVotingDelayReturn = FunctionReturn<typeof functions.setVotingDelay>

export type SetVotingPeriodParams = FunctionArguments<typeof functions.setVotingPeriod>
export type SetVotingPeriodReturn = FunctionReturn<typeof functions.setVotingPeriod>

export type StateParams = FunctionArguments<typeof functions.state>
export type StateReturn = FunctionReturn<typeof functions.state>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type TimelockParams = FunctionArguments<typeof functions.timelock>
export type TimelockReturn = FunctionReturn<typeof functions.timelock>

export type TokenParams = FunctionArguments<typeof functions.token>
export type TokenReturn = FunctionReturn<typeof functions.token>

export type UpdateQuorumNumeratorParams = FunctionArguments<typeof functions.updateQuorumNumerator>
export type UpdateQuorumNumeratorReturn = FunctionReturn<typeof functions.updateQuorumNumerator>

export type UpdateTimelockParams = FunctionArguments<typeof functions.updateTimelock>
export type UpdateTimelockReturn = FunctionReturn<typeof functions.updateTimelock>

export type VersionParams = FunctionArguments<typeof functions.version>
export type VersionReturn = FunctionReturn<typeof functions.version>

export type VotingDelayParams = FunctionArguments<typeof functions.votingDelay>
export type VotingDelayReturn = FunctionReturn<typeof functions.votingDelay>

export type VotingPeriodParams = FunctionArguments<typeof functions.votingPeriod>
export type VotingPeriodReturn = FunctionReturn<typeof functions.votingPeriod>

