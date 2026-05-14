import { ContractBase } from '../abi.support.js'
import { BALLOT_TYPEHASH, COUNTING_MODE, EXTENDED_BALLOT_TYPEHASH, castVote, castVoteBySig, castVoteWithReason, castVoteWithReasonAndParams, castVoteWithReasonAndParamsBySig, execute, getActions, getReceipt, getVotes, getVotesWithParams, hasVoted, hashProposal, lateQuorumVoteExtension, name, onERC1155BatchReceived, onERC1155Received, onERC721Received, proposalDeadline, proposalEta, proposalSnapshot, proposalThreshold, proposals, propose, propose_1, queue, quorum, quorumDenominator, quorumNumerator, quorumVotes, state, supportsInterface, timelock, token, version, votingDelay, votingPeriod } from './functions.js'
import type { CastVoteBySigParams, CastVoteParams, CastVoteWithReasonAndParamsBySigParams, CastVoteWithReasonAndParamsParams, CastVoteWithReasonParams, ExecuteParams, GetActionsParams, GetReceiptParams, GetVotesParams, GetVotesWithParamsParams, HasVotedParams, HashProposalParams, OnERC1155BatchReceivedParams, OnERC1155ReceivedParams, OnERC721ReceivedParams, ProposalDeadlineParams, ProposalEtaParams, ProposalSnapshotParams, ProposalsParams, ProposeParams, ProposeParams_1, QueueParams, QuorumParams, StateParams, SupportsInterfaceParams } from './functions.js'

export class Contract extends ContractBase {
    BALLOT_TYPEHASH() {
        return this.eth_call(BALLOT_TYPEHASH, {})
    }

    COUNTING_MODE() {
        return this.eth_call(COUNTING_MODE, {})
    }

    EXTENDED_BALLOT_TYPEHASH() {
        return this.eth_call(EXTENDED_BALLOT_TYPEHASH, {})
    }

    castVote(proposalId: CastVoteParams["proposalId"], support: CastVoteParams["support"]) {
        return this.eth_call(castVote, {proposalId, support})
    }

    castVoteBySig(proposalId: CastVoteBySigParams["proposalId"], support: CastVoteBySigParams["support"], v: CastVoteBySigParams["v"], r: CastVoteBySigParams["r"], s: CastVoteBySigParams["s"]) {
        return this.eth_call(castVoteBySig, {proposalId, support, v, r, s})
    }

    castVoteWithReason(proposalId: CastVoteWithReasonParams["proposalId"], support: CastVoteWithReasonParams["support"], reason: CastVoteWithReasonParams["reason"]) {
        return this.eth_call(castVoteWithReason, {proposalId, support, reason})
    }

    castVoteWithReasonAndParams(proposalId: CastVoteWithReasonAndParamsParams["proposalId"], support: CastVoteWithReasonAndParamsParams["support"], reason: CastVoteWithReasonAndParamsParams["reason"], params: CastVoteWithReasonAndParamsParams["params"]) {
        return this.eth_call(castVoteWithReasonAndParams, {proposalId, support, reason, params})
    }

    castVoteWithReasonAndParamsBySig(proposalId: CastVoteWithReasonAndParamsBySigParams["proposalId"], support: CastVoteWithReasonAndParamsBySigParams["support"], reason: CastVoteWithReasonAndParamsBySigParams["reason"], params: CastVoteWithReasonAndParamsBySigParams["params"], v: CastVoteWithReasonAndParamsBySigParams["v"], r: CastVoteWithReasonAndParamsBySigParams["r"], s: CastVoteWithReasonAndParamsBySigParams["s"]) {
        return this.eth_call(castVoteWithReasonAndParamsBySig, {proposalId, support, reason, params, v, r, s})
    }

    execute(targets: ExecuteParams["targets"], values: ExecuteParams["values"], calldatas: ExecuteParams["calldatas"], descriptionHash: ExecuteParams["descriptionHash"]) {
        return this.eth_call(execute, {targets, values, calldatas, descriptionHash})
    }

    getActions(proposalId: GetActionsParams["proposalId"]) {
        return this.eth_call(getActions, {proposalId})
    }

    getReceipt(proposalId: GetReceiptParams["proposalId"], voter: GetReceiptParams["voter"]) {
        return this.eth_call(getReceipt, {proposalId, voter})
    }

    getVotes(account: GetVotesParams["account"], blockNumber: GetVotesParams["blockNumber"]) {
        return this.eth_call(getVotes, {account, blockNumber})
    }

    getVotesWithParams(account: GetVotesWithParamsParams["account"], blockNumber: GetVotesWithParamsParams["blockNumber"], params: GetVotesWithParamsParams["params"]) {
        return this.eth_call(getVotesWithParams, {account, blockNumber, params})
    }

    hasVoted(proposalId: HasVotedParams["proposalId"], account: HasVotedParams["account"]) {
        return this.eth_call(hasVoted, {proposalId, account})
    }

    hashProposal(targets: HashProposalParams["targets"], values: HashProposalParams["values"], calldatas: HashProposalParams["calldatas"], descriptionHash: HashProposalParams["descriptionHash"]) {
        return this.eth_call(hashProposal, {targets, values, calldatas, descriptionHash})
    }

    lateQuorumVoteExtension() {
        return this.eth_call(lateQuorumVoteExtension, {})
    }

    name() {
        return this.eth_call(name, {})
    }

    onERC1155BatchReceived(_0: OnERC1155BatchReceivedParams["_0"], _1: OnERC1155BatchReceivedParams["_1"], _2: OnERC1155BatchReceivedParams["_2"], _3: OnERC1155BatchReceivedParams["_3"], _4: OnERC1155BatchReceivedParams["_4"]) {
        return this.eth_call(onERC1155BatchReceived, {_0, _1, _2, _3, _4})
    }

    onERC1155Received(_0: OnERC1155ReceivedParams["_0"], _1: OnERC1155ReceivedParams["_1"], _2: OnERC1155ReceivedParams["_2"], _3: OnERC1155ReceivedParams["_3"], _4: OnERC1155ReceivedParams["_4"]) {
        return this.eth_call(onERC1155Received, {_0, _1, _2, _3, _4})
    }

    onERC721Received(_0: OnERC721ReceivedParams["_0"], _1: OnERC721ReceivedParams["_1"], _2: OnERC721ReceivedParams["_2"], _3: OnERC721ReceivedParams["_3"]) {
        return this.eth_call(onERC721Received, {_0, _1, _2, _3})
    }

    proposalDeadline(proposalId: ProposalDeadlineParams["proposalId"]) {
        return this.eth_call(proposalDeadline, {proposalId})
    }

    proposalEta(proposalId: ProposalEtaParams["proposalId"]) {
        return this.eth_call(proposalEta, {proposalId})
    }

    proposalSnapshot(proposalId: ProposalSnapshotParams["proposalId"]) {
        return this.eth_call(proposalSnapshot, {proposalId})
    }

    proposalThreshold() {
        return this.eth_call(proposalThreshold, {})
    }

    proposals(proposalId: ProposalsParams["proposalId"]) {
        return this.eth_call(proposals, {proposalId})
    }

    propose(targets: ProposeParams["targets"], values: ProposeParams["values"], calldatas: ProposeParams["calldatas"], description: ProposeParams["description"]) {
        return this.eth_call(propose, {targets, values, calldatas, description})
    }

    propose_1(targets: ProposeParams_1["targets"], values: ProposeParams_1["values"], signatures: ProposeParams_1["signatures"], calldatas: ProposeParams_1["calldatas"], description: ProposeParams_1["description"]) {
        return this.eth_call(propose_1, {targets, values, signatures, calldatas, description})
    }

    queue(targets: QueueParams["targets"], values: QueueParams["values"], calldatas: QueueParams["calldatas"], descriptionHash: QueueParams["descriptionHash"]) {
        return this.eth_call(queue, {targets, values, calldatas, descriptionHash})
    }

    quorum(blockNumber: QuorumParams["blockNumber"]) {
        return this.eth_call(quorum, {blockNumber})
    }

    quorumDenominator() {
        return this.eth_call(quorumDenominator, {})
    }

    quorumNumerator() {
        return this.eth_call(quorumNumerator, {})
    }

    quorumVotes() {
        return this.eth_call(quorumVotes, {})
    }

    state(proposalId: StateParams["proposalId"]) {
        return this.eth_call(state, {proposalId})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(supportsInterface, {interfaceId})
    }

    timelock() {
        return this.eth_call(timelock, {})
    }

    token() {
        return this.eth_call(token, {})
    }

    version() {
        return this.eth_call(version, {})
    }

    votingDelay() {
        return this.eth_call(votingDelay, {})
    }

    votingPeriod() {
        return this.eth_call(votingPeriod, {})
    }
}
