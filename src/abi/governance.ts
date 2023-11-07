import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './governance.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    LateQuorumVoteExtensionSet: new LogEvent<([oldVoteExtension: bigint, newVoteExtension: bigint] & {oldVoteExtension: bigint, newVoteExtension: bigint})>(
        abi, '0x7ca4ac117ed3cdce75c1161d8207c440389b1a15d69d096831664657c07dafc2'
    ),
    ProposalCanceled: new LogEvent<([proposalId: bigint] & {proposalId: bigint})>(
        abi, '0x789cf55be980739dad1d0699b93b58e806b51c9d96619bfa8fe0a28abaa7b30c'
    ),
    ProposalCreated: new LogEvent<([proposalId: bigint, proposer: string, targets: Array<string>, values: Array<bigint>, signatures: Array<string>, calldatas: Array<string>, startBlock: bigint, endBlock: bigint, description: string] & {proposalId: bigint, proposer: string, targets: Array<string>, signatures: Array<string>, calldatas: Array<string>, startBlock: bigint, endBlock: bigint, description: string})>(
        abi, '0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0'
    ),
    ProposalExecuted: new LogEvent<([proposalId: bigint] & {proposalId: bigint})>(
        abi, '0x712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f'
    ),
    ProposalExtended: new LogEvent<([proposalId: bigint, extendedDeadline: bigint] & {proposalId: bigint, extendedDeadline: bigint})>(
        abi, '0x541f725fb9f7c98a30cc9c0ff32fbb14358cd7159c847a3aa20a2bdc442ba511'
    ),
    ProposalQueued: new LogEvent<([proposalId: bigint, eta: bigint] & {proposalId: bigint, eta: bigint})>(
        abi, '0x9a2e42fd6722813d69113e7d0079d3d940171428df7373df9c7f7617cfda2892'
    ),
    ProposalThresholdSet: new LogEvent<([oldProposalThreshold: bigint, newProposalThreshold: bigint] & {oldProposalThreshold: bigint, newProposalThreshold: bigint})>(
        abi, '0xccb45da8d5717e6c4544694297c4ba5cf151d455c9bb0ed4fc7a38411bc05461'
    ),
    QuorumNumeratorUpdated: new LogEvent<([oldQuorumNumerator: bigint, newQuorumNumerator: bigint] & {oldQuorumNumerator: bigint, newQuorumNumerator: bigint})>(
        abi, '0x0553476bf02ef2726e8ce5ced78d63e26e602e4a2257b1f559418e24b4633997'
    ),
    TimelockChange: new LogEvent<([oldTimelock: string, newTimelock: string] & {oldTimelock: string, newTimelock: string})>(
        abi, '0x08f74ea46ef7894f65eabfb5e6e695de773a000b47c529ab559178069b226401'
    ),
    VoteCast: new LogEvent<([voter: string, proposalId: bigint, support: number, weight: bigint, reason: string] & {voter: string, proposalId: bigint, support: number, weight: bigint, reason: string})>(
        abi, '0xb8e138887d0aa13bab447e82de9d5c1777041ecd21ca36ba824ff1e6c07ddda4'
    ),
    VoteCastWithParams: new LogEvent<([voter: string, proposalId: bigint, support: number, weight: bigint, reason: string, params: string] & {voter: string, proposalId: bigint, support: number, weight: bigint, reason: string, params: string})>(
        abi, '0xe2babfbac5889a709b63bb7f598b324e08bc5a4fb9ec647fb3cbc9ec07eb8712'
    ),
    VotingDelaySet: new LogEvent<([oldVotingDelay: bigint, newVotingDelay: bigint] & {oldVotingDelay: bigint, newVotingDelay: bigint})>(
        abi, '0xc565b045403dc03c2eea82b81a0465edad9e2e7fc4d97e11421c209da93d7a93'
    ),
    VotingPeriodSet: new LogEvent<([oldVotingPeriod: bigint, newVotingPeriod: bigint] & {oldVotingPeriod: bigint, newVotingPeriod: bigint})>(
        abi, '0x7e3f7f0708a84de9203036abaa450dccc85ad5ff52f78c170f3edb55cf5e8828'
    ),
}

export const functions = {
    BALLOT_TYPEHASH: new Func<[], {}, string>(
        abi, '0xdeaaa7cc'
    ),
    COUNTING_MODE: new Func<[], {}, string>(
        abi, '0xdd4e2ba5'
    ),
    EXTENDED_BALLOT_TYPEHASH: new Func<[], {}, string>(
        abi, '0x2fe3e261'
    ),
    cancel: new Func<[proposalId: bigint], {proposalId: bigint}, []>(
        abi, '0x40e58ee5'
    ),
    castVote: new Func<[proposalId: bigint, support: number], {proposalId: bigint, support: number}, bigint>(
        abi, '0x56781388'
    ),
    castVoteBySig: new Func<[proposalId: bigint, support: number, v: number, r: string, s: string], {proposalId: bigint, support: number, v: number, r: string, s: string}, bigint>(
        abi, '0x3bccf4fd'
    ),
    castVoteWithReason: new Func<[proposalId: bigint, support: number, reason: string], {proposalId: bigint, support: number, reason: string}, bigint>(
        abi, '0x7b3c71d3'
    ),
    castVoteWithReasonAndParams: new Func<[proposalId: bigint, support: number, reason: string, params: string], {proposalId: bigint, support: number, reason: string, params: string}, bigint>(
        abi, '0x5f398a14'
    ),
    castVoteWithReasonAndParamsBySig: new Func<[proposalId: bigint, support: number, reason: string, params: string, v: number, r: string, s: string], {proposalId: bigint, support: number, reason: string, params: string, v: number, r: string, s: string}, bigint>(
        abi, '0x03420181'
    ),
    'execute(address[],uint256[],bytes[],bytes32)': new Func<[targets: Array<string>, values: Array<bigint>, calldatas: Array<string>, descriptionHash: string], {targets: Array<string>, calldatas: Array<string>, descriptionHash: string}, bigint>(
        abi, '0x2656227d'
    ),
    'execute(uint256)': new Func<[proposalId: bigint], {proposalId: bigint}, []>(
        abi, '0xfe0d94c1'
    ),
    getActions: new Func<[proposalId: bigint], {proposalId: bigint}, ([targets: Array<string>, values: Array<bigint>, signatures: Array<string>, calldatas: Array<string>] & {targets: Array<string>, signatures: Array<string>, calldatas: Array<string>})>(
        abi, '0x328dd982'
    ),
    getReceipt: new Func<[proposalId: bigint, voter: string], {proposalId: bigint, voter: string}, ([hasVoted: boolean, support: number, votes: bigint] & {hasVoted: boolean, support: number, votes: bigint})>(
        abi, '0xe23a9a52'
    ),
    getVotes: new Func<[account: string, blockNumber: bigint], {account: string, blockNumber: bigint}, bigint>(
        abi, '0xeb9019d4'
    ),
    getVotesWithParams: new Func<[account: string, blockNumber: bigint, params: string], {account: string, blockNumber: bigint, params: string}, bigint>(
        abi, '0x9a802a6d'
    ),
    hasVoted: new Func<[proposalId: bigint, account: string], {proposalId: bigint, account: string}, boolean>(
        abi, '0x43859632'
    ),
    hashProposal: new Func<[targets: Array<string>, values: Array<bigint>, calldatas: Array<string>, descriptionHash: string], {targets: Array<string>, calldatas: Array<string>, descriptionHash: string}, bigint>(
        abi, '0xc59057e4'
    ),
    lateQuorumVoteExtension: new Func<[], {}, bigint>(
        abi, '0x32b8113e'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    onERC1155BatchReceived: new Func<[_: string, _: string, _: Array<bigint>, _: Array<bigint>, _: string], {}, string>(
        abi, '0xbc197c81'
    ),
    onERC1155Received: new Func<[_: string, _: string, _: bigint, _: bigint, _: string], {}, string>(
        abi, '0xf23a6e61'
    ),
    onERC721Received: new Func<[_: string, _: string, _: bigint, _: string], {}, string>(
        abi, '0x150b7a02'
    ),
    proposalDeadline: new Func<[proposalId: bigint], {proposalId: bigint}, bigint>(
        abi, '0xc01f9e37'
    ),
    proposalEta: new Func<[proposalId: bigint], {proposalId: bigint}, bigint>(
        abi, '0xab58fb8e'
    ),
    proposalSnapshot: new Func<[proposalId: bigint], {proposalId: bigint}, bigint>(
        abi, '0x2d63f693'
    ),
    proposalThreshold: new Func<[], {}, bigint>(
        abi, '0xb58131b0'
    ),
    proposals: new Func<[proposalId: bigint], {proposalId: bigint}, ([id: bigint, proposer: string, eta: bigint, startBlock: bigint, endBlock: bigint, forVotes: bigint, againstVotes: bigint, abstainVotes: bigint, canceled: boolean, executed: boolean] & {id: bigint, proposer: string, eta: bigint, startBlock: bigint, endBlock: bigint, forVotes: bigint, againstVotes: bigint, abstainVotes: bigint, canceled: boolean, executed: boolean})>(
        abi, '0x013cf08b'
    ),
    'propose(address[],uint256[],bytes[],string)': new Func<[targets: Array<string>, values: Array<bigint>, calldatas: Array<string>, description: string], {targets: Array<string>, calldatas: Array<string>, description: string}, bigint>(
        abi, '0x7d5e81e2'
    ),
    'propose(address[],uint256[],string[],bytes[],string)': new Func<[targets: Array<string>, values: Array<bigint>, signatures: Array<string>, calldatas: Array<string>, description: string], {targets: Array<string>, signatures: Array<string>, calldatas: Array<string>, description: string}, bigint>(
        abi, '0xda95691a'
    ),
    'queue(address[],uint256[],bytes[],bytes32)': new Func<[targets: Array<string>, values: Array<bigint>, calldatas: Array<string>, descriptionHash: string], {targets: Array<string>, calldatas: Array<string>, descriptionHash: string}, bigint>(
        abi, '0x160cbed7'
    ),
    'queue(uint256)': new Func<[proposalId: bigint], {proposalId: bigint}, []>(
        abi, '0xddf0b009'
    ),
    quorum: new Func<[blockNumber: bigint], {blockNumber: bigint}, bigint>(
        abi, '0xf8ce560a'
    ),
    quorumDenominator: new Func<[], {}, bigint>(
        abi, '0x97c3d334'
    ),
    quorumNumerator: new Func<[], {}, bigint>(
        abi, '0xa7713a70'
    ),
    quorumVotes: new Func<[], {}, bigint>(
        abi, '0x24bc1a64'
    ),
    relay: new Func<[target: string, value: bigint, data: string], {target: string, value: bigint, data: string}, []>(
        abi, '0xc28bc2fa'
    ),
    setLateQuorumVoteExtension: new Func<[newVoteExtension: bigint], {newVoteExtension: bigint}, []>(
        abi, '0xd07f91e9'
    ),
    setProposalThreshold: new Func<[newProposalThreshold: bigint], {newProposalThreshold: bigint}, []>(
        abi, '0xece40cc1'
    ),
    setVotingDelay: new Func<[newVotingDelay: bigint], {newVotingDelay: bigint}, []>(
        abi, '0x70b0f660'
    ),
    setVotingPeriod: new Func<[newVotingPeriod: bigint], {newVotingPeriod: bigint}, []>(
        abi, '0xea0217cf'
    ),
    state: new Func<[proposalId: bigint], {proposalId: bigint}, number>(
        abi, '0x3e4f49e6'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    timelock: new Func<[], {}, string>(
        abi, '0xd33219b4'
    ),
    token: new Func<[], {}, string>(
        abi, '0xfc0c546a'
    ),
    updateQuorumNumerator: new Func<[newQuorumNumerator: bigint], {newQuorumNumerator: bigint}, []>(
        abi, '0x06f3f9e6'
    ),
    updateTimelock: new Func<[newTimelock: string], {newTimelock: string}, []>(
        abi, '0xa890c910'
    ),
    version: new Func<[], {}, string>(
        abi, '0x54fd4d50'
    ),
    votingDelay: new Func<[], {}, bigint>(
        abi, '0x3932abb1'
    ),
    votingPeriod: new Func<[], {}, bigint>(
        abi, '0x02a251a3'
    ),
}

export class Contract extends ContractBase {

    BALLOT_TYPEHASH(): Promise<string> {
        return this.eth_call(functions.BALLOT_TYPEHASH, [])
    }

    COUNTING_MODE(): Promise<string> {
        return this.eth_call(functions.COUNTING_MODE, [])
    }

    EXTENDED_BALLOT_TYPEHASH(): Promise<string> {
        return this.eth_call(functions.EXTENDED_BALLOT_TYPEHASH, [])
    }

    getActions(proposalId: bigint): Promise<([targets: Array<string>, values: Array<bigint>, signatures: Array<string>, calldatas: Array<string>] & {targets: Array<string>, signatures: Array<string>, calldatas: Array<string>})> {
        return this.eth_call(functions.getActions, [proposalId])
    }

    getReceipt(proposalId: bigint, voter: string): Promise<([hasVoted: boolean, support: number, votes: bigint] & {hasVoted: boolean, support: number, votes: bigint})> {
        return this.eth_call(functions.getReceipt, [proposalId, voter])
    }

    getVotes(account: string, blockNumber: bigint): Promise<bigint> {
        return this.eth_call(functions.getVotes, [account, blockNumber])
    }

    getVotesWithParams(account: string, blockNumber: bigint, params: string): Promise<bigint> {
        return this.eth_call(functions.getVotesWithParams, [account, blockNumber, params])
    }

    hasVoted(proposalId: bigint, account: string): Promise<boolean> {
        return this.eth_call(functions.hasVoted, [proposalId, account])
    }

    hashProposal(targets: Array<string>, values: Array<bigint>, calldatas: Array<string>, descriptionHash: string): Promise<bigint> {
        return this.eth_call(functions.hashProposal, [targets, values, calldatas, descriptionHash])
    }

    lateQuorumVoteExtension(): Promise<bigint> {
        return this.eth_call(functions.lateQuorumVoteExtension, [])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    proposalDeadline(proposalId: bigint): Promise<bigint> {
        return this.eth_call(functions.proposalDeadline, [proposalId])
    }

    proposalEta(proposalId: bigint): Promise<bigint> {
        return this.eth_call(functions.proposalEta, [proposalId])
    }

    proposalSnapshot(proposalId: bigint): Promise<bigint> {
        return this.eth_call(functions.proposalSnapshot, [proposalId])
    }

    proposalThreshold(): Promise<bigint> {
        return this.eth_call(functions.proposalThreshold, [])
    }

    proposals(proposalId: bigint): Promise<([id: bigint, proposer: string, eta: bigint, startBlock: bigint, endBlock: bigint, forVotes: bigint, againstVotes: bigint, abstainVotes: bigint, canceled: boolean, executed: boolean] & {id: bigint, proposer: string, eta: bigint, startBlock: bigint, endBlock: bigint, forVotes: bigint, againstVotes: bigint, abstainVotes: bigint, canceled: boolean, executed: boolean})> {
        return this.eth_call(functions.proposals, [proposalId])
    }

    quorum(blockNumber: bigint): Promise<bigint> {
        return this.eth_call(functions.quorum, [blockNumber])
    }

    quorumDenominator(): Promise<bigint> {
        return this.eth_call(functions.quorumDenominator, [])
    }

    quorumNumerator(): Promise<bigint> {
        return this.eth_call(functions.quorumNumerator, [])
    }

    quorumVotes(): Promise<bigint> {
        return this.eth_call(functions.quorumVotes, [])
    }

    state(proposalId: bigint): Promise<number> {
        return this.eth_call(functions.state, [proposalId])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    timelock(): Promise<string> {
        return this.eth_call(functions.timelock, [])
    }

    token(): Promise<string> {
        return this.eth_call(functions.token, [])
    }

    version(): Promise<string> {
        return this.eth_call(functions.version, [])
    }

    votingDelay(): Promise<bigint> {
        return this.eth_call(functions.votingDelay, [])
    }

    votingPeriod(): Promise<bigint> {
        return this.eth_call(functions.votingPeriod, [])
    }
}
