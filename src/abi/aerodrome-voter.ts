import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Abstained: event("0xadab630928b1d46214641293704a312ee7ad87e03ae14a7fd95e7308b93998df", "Abstained(address,address,uint256,uint256,uint256,uint256)", {"voter": indexed(p.address), "pool": indexed(p.address), "tokenId": indexed(p.uint256), "weight": p.uint256, "totalWeight": p.uint256, "timestamp": p.uint256}),
    DistributeReward: event("0x4fa9693cae526341d334e2862ca2413b2e503f1266255f9e0869fb36e6d89b17", "DistributeReward(address,address,uint256)", {"sender": indexed(p.address), "gauge": indexed(p.address), "amount": p.uint256}),
    GaugeCreated: event("0xef9f7d1ffff3b249c6b9bf2528499e935f7d96bb6d6ec4e7da504d1d3c6279e1", "GaugeCreated(address,address,address,address,address,address,address,address)", {"poolFactory": indexed(p.address), "votingRewardsFactory": indexed(p.address), "gaugeFactory": indexed(p.address), "pool": p.address, "bribeVotingReward": p.address, "feeVotingReward": p.address, "gauge": p.address, "creator": p.address}),
    GaugeKilled: event("0x04a5d3f5d80d22d9345acc80618f4a4e7e663cf9e1aed23b57d975acec002ba7", "GaugeKilled(address)", {"gauge": indexed(p.address)}),
    GaugeRevived: event("0xed18e9faa3dccfd8aa45f69c4de40546b2ca9cccc4538a2323531656516db1aa", "GaugeRevived(address)", {"gauge": indexed(p.address)}),
    NotifyReward: event("0xf70d5c697de7ea828df48e5c4573cb2194c659f1901f70110c52b066dcf50826", "NotifyReward(address,address,uint256)", {"sender": indexed(p.address), "reward": indexed(p.address), "amount": p.uint256}),
    Voted: event("0x452d440efc30dfa14a0ef803ccb55936af860ec6a6960ed27f129bef913f296a", "Voted(address,address,uint256,uint256,uint256,uint256)", {"voter": indexed(p.address), "pool": indexed(p.address), "tokenId": indexed(p.uint256), "weight": p.uint256, "totalWeight": p.uint256, "timestamp": p.uint256}),
    WhitelistNFT: event("0x8a6ff732c8641e1e34d771e1f8b1673e988c1abdfb694ebdf6c910a5e3d0d853", "WhitelistNFT(address,uint256,bool)", {"whitelister": indexed(p.address), "tokenId": indexed(p.uint256), "_bool": indexed(p.bool)}),
    WhitelistToken: event("0x44948130cf88523dbc150908a47dd6332c33a01a3869d7f2fa78e51d5a5f9c57", "WhitelistToken(address,address,bool)", {"whitelister": indexed(p.address), "token": indexed(p.address), "_bool": indexed(p.bool)}),
}

export const functions = {
    claimBribes: fun("0x7715ee75", "claimBribes(address[],address[][],uint256)", {"_bribes": p.array(p.address), "_tokens": p.array(p.array(p.address)), "_tokenId": p.uint256}, ),
    claimFees: fun("0x666256aa", "claimFees(address[],address[][],uint256)", {"_fees": p.array(p.address), "_tokens": p.array(p.array(p.address)), "_tokenId": p.uint256}, ),
    claimRewards: fun("0xf9f031df", "claimRewards(address[])", {"_gauges": p.array(p.address)}, ),
    claimable: viewFun("0x402914f5", "claimable(address)", {"_0": p.address}, p.uint256),
    createGauge: fun("0x794cea3c", "createGauge(address,address)", {"_poolFactory": p.address, "_pool": p.address}, p.address),
    depositManaged: fun("0xe0c11f9a", "depositManaged(uint256,uint256)", {"_tokenId": p.uint256, "_mTokenId": p.uint256}, ),
    'distribute(address[])': fun("0x6138889b", "distribute(address[])", {"_gauges": p.array(p.address)}, ),
    'distribute(uint256,uint256)': fun("0x7625391a", "distribute(uint256,uint256)", {"_start": p.uint256, "_finish": p.uint256}, ),
    emergencyCouncil: viewFun("0x7778960e", "emergencyCouncil()", {}, p.address),
    epochGovernor: viewFun("0x3aae971f", "epochGovernor()", {}, p.address),
    epochNext: viewFun("0x880e36fc", "epochNext(uint256)", {"_timestamp": p.uint256}, p.uint256),
    epochStart: viewFun("0xaa9354a3", "epochStart(uint256)", {"_timestamp": p.uint256}, p.uint256),
    epochVoteEnd: viewFun("0xd58b15d4", "epochVoteEnd(uint256)", {"_timestamp": p.uint256}, p.uint256),
    epochVoteStart: viewFun("0x39e9f3b6", "epochVoteStart(uint256)", {"_timestamp": p.uint256}, p.uint256),
    factoryRegistry: viewFun("0x3bf0c9fb", "factoryRegistry()", {}, p.address),
    forwarder: viewFun("0xf645d4f9", "forwarder()", {}, p.address),
    gaugeToBribe: viewFun("0x929c8dcd", "gaugeToBribe(address)", {"_0": p.address}, p.address),
    gaugeToFees: viewFun("0xc4f08165", "gaugeToFees(address)", {"_0": p.address}, p.address),
    gauges: viewFun("0xb9a09fd5", "gauges(address)", {"_0": p.address}, p.address),
    governor: viewFun("0x0c340a24", "governor()", {}, p.address),
    initialize: fun("0x462d0b2e", "initialize(address[],address)", {"_tokens": p.array(p.address), "_minter": p.address}, ),
    isAlive: viewFun("0x1703e5f9", "isAlive(address)", {"_0": p.address}, p.bool),
    isGauge: viewFun("0xaa79979b", "isGauge(address)", {"_0": p.address}, p.bool),
    isTrustedForwarder: viewFun("0x572b6c05", "isTrustedForwarder(address)", {"forwarder": p.address}, p.bool),
    isWhitelistedNFT: viewFun("0xd4e2616f", "isWhitelistedNFT(uint256)", {"_0": p.uint256}, p.bool),
    isWhitelistedToken: viewFun("0xab37f486", "isWhitelistedToken(address)", {"_0": p.address}, p.bool),
    killGauge: fun("0x992a7933", "killGauge(address)", {"_gauge": p.address}, ),
    lastVoted: viewFun("0xf3594be0", "lastVoted(uint256)", {"_0": p.uint256}, p.uint256),
    length: viewFun("0x1f7b6d32", "length()", {}, p.uint256),
    maxVotingNum: viewFun("0xe8b3fd57", "maxVotingNum()", {}, p.uint256),
    minter: viewFun("0x07546172", "minter()", {}, p.address),
    notifyRewardAmount: fun("0x3c6b16ab", "notifyRewardAmount(uint256)", {"_amount": p.uint256}, ),
    poke: fun("0x32145f90", "poke(uint256)", {"_tokenId": p.uint256}, ),
    poolForGauge: viewFun("0x06d6a1b2", "poolForGauge(address)", {"_0": p.address}, p.address),
    poolVote: viewFun("0xa86a366d", "poolVote(uint256,uint256)", {"_0": p.uint256, "_1": p.uint256}, p.address),
    pools: viewFun("0xac4afa38", "pools(uint256)", {"_0": p.uint256}, p.address),
    reset: fun("0x310bd74b", "reset(uint256)", {"_tokenId": p.uint256}, ),
    reviveGauge: fun("0x9f06247b", "reviveGauge(address)", {"_gauge": p.address}, ),
    setEmergencyCouncil: fun("0xe586875f", "setEmergencyCouncil(address)", {"_council": p.address}, ),
    setEpochGovernor: fun("0x598d521b", "setEpochGovernor(address)", {"_epochGovernor": p.address}, ),
    setGovernor: fun("0xc42cf535", "setGovernor(address)", {"_governor": p.address}, ),
    setMaxVotingNum: fun("0x30331b2f", "setMaxVotingNum(uint256)", {"_maxVotingNum": p.uint256}, ),
    totalWeight: viewFun("0x96c82e57", "totalWeight()", {}, p.uint256),
    'updateFor(address)': fun("0x0e0a5968", "updateFor(address)", {"_gauge": p.address}, ),
    'updateFor(uint256,uint256)': fun("0xc9ff6f4d", "updateFor(uint256,uint256)", {"start": p.uint256, "end": p.uint256}, ),
    'updateFor(address[])': fun("0xd560b0d7", "updateFor(address[])", {"_gauges": p.array(p.address)}, ),
    usedWeights: viewFun("0x79e93824", "usedWeights(uint256)", {"_0": p.uint256}, p.uint256),
    ve: viewFun("0x1f850716", "ve()", {}, p.address),
    vote: fun("0x7ac09bf7", "vote(uint256,address[],uint256[])", {"_tokenId": p.uint256, "_poolVote": p.array(p.address), "_weights": p.array(p.uint256)}, ),
    votes: viewFun("0xd23254b4", "votes(uint256,address)", {"_0": p.uint256, "_1": p.address}, p.uint256),
    weights: viewFun("0xa7cac846", "weights(address)", {"_0": p.address}, p.uint256),
    whitelistNFT: fun("0xe2819d5c", "whitelistNFT(uint256,bool)", {"_tokenId": p.uint256, "_bool": p.bool}, ),
    whitelistToken: fun("0x0ffb1d8b", "whitelistToken(address,bool)", {"_token": p.address, "_bool": p.bool}, ),
    withdrawManaged: fun("0x370fb5fa", "withdrawManaged(uint256)", {"_tokenId": p.uint256}, ),
}

export class Contract extends ContractBase {

    claimable(_0: ClaimableParams["_0"]) {
        return this.eth_call(functions.claimable, {_0})
    }

    emergencyCouncil() {
        return this.eth_call(functions.emergencyCouncil, {})
    }

    epochGovernor() {
        return this.eth_call(functions.epochGovernor, {})
    }

    epochNext(_timestamp: EpochNextParams["_timestamp"]) {
        return this.eth_call(functions.epochNext, {_timestamp})
    }

    epochStart(_timestamp: EpochStartParams["_timestamp"]) {
        return this.eth_call(functions.epochStart, {_timestamp})
    }

    epochVoteEnd(_timestamp: EpochVoteEndParams["_timestamp"]) {
        return this.eth_call(functions.epochVoteEnd, {_timestamp})
    }

    epochVoteStart(_timestamp: EpochVoteStartParams["_timestamp"]) {
        return this.eth_call(functions.epochVoteStart, {_timestamp})
    }

    factoryRegistry() {
        return this.eth_call(functions.factoryRegistry, {})
    }

    forwarder() {
        return this.eth_call(functions.forwarder, {})
    }

    gaugeToBribe(_0: GaugeToBribeParams["_0"]) {
        return this.eth_call(functions.gaugeToBribe, {_0})
    }

    gaugeToFees(_0: GaugeToFeesParams["_0"]) {
        return this.eth_call(functions.gaugeToFees, {_0})
    }

    gauges(_0: GaugesParams["_0"]) {
        return this.eth_call(functions.gauges, {_0})
    }

    governor() {
        return this.eth_call(functions.governor, {})
    }

    isAlive(_0: IsAliveParams["_0"]) {
        return this.eth_call(functions.isAlive, {_0})
    }

    isGauge(_0: IsGaugeParams["_0"]) {
        return this.eth_call(functions.isGauge, {_0})
    }

    isTrustedForwarder(forwarder: IsTrustedForwarderParams["forwarder"]) {
        return this.eth_call(functions.isTrustedForwarder, {forwarder})
    }

    isWhitelistedNFT(_0: IsWhitelistedNFTParams["_0"]) {
        return this.eth_call(functions.isWhitelistedNFT, {_0})
    }

    isWhitelistedToken(_0: IsWhitelistedTokenParams["_0"]) {
        return this.eth_call(functions.isWhitelistedToken, {_0})
    }

    lastVoted(_0: LastVotedParams["_0"]) {
        return this.eth_call(functions.lastVoted, {_0})
    }

    length() {
        return this.eth_call(functions.length, {})
    }

    maxVotingNum() {
        return this.eth_call(functions.maxVotingNum, {})
    }

    minter() {
        return this.eth_call(functions.minter, {})
    }

    poolForGauge(_0: PoolForGaugeParams["_0"]) {
        return this.eth_call(functions.poolForGauge, {_0})
    }

    poolVote(_0: PoolVoteParams["_0"], _1: PoolVoteParams["_1"]) {
        return this.eth_call(functions.poolVote, {_0, _1})
    }

    pools(_0: PoolsParams["_0"]) {
        return this.eth_call(functions.pools, {_0})
    }

    totalWeight() {
        return this.eth_call(functions.totalWeight, {})
    }

    usedWeights(_0: UsedWeightsParams["_0"]) {
        return this.eth_call(functions.usedWeights, {_0})
    }

    ve() {
        return this.eth_call(functions.ve, {})
    }

    votes(_0: VotesParams["_0"], _1: VotesParams["_1"]) {
        return this.eth_call(functions.votes, {_0, _1})
    }

    weights(_0: WeightsParams["_0"]) {
        return this.eth_call(functions.weights, {_0})
    }
}

/// Event types
export type AbstainedEventArgs = EParams<typeof events.Abstained>
export type DistributeRewardEventArgs = EParams<typeof events.DistributeReward>
export type GaugeCreatedEventArgs = EParams<typeof events.GaugeCreated>
export type GaugeKilledEventArgs = EParams<typeof events.GaugeKilled>
export type GaugeRevivedEventArgs = EParams<typeof events.GaugeRevived>
export type NotifyRewardEventArgs = EParams<typeof events.NotifyReward>
export type VotedEventArgs = EParams<typeof events.Voted>
export type WhitelistNFTEventArgs = EParams<typeof events.WhitelistNFT>
export type WhitelistTokenEventArgs = EParams<typeof events.WhitelistToken>

/// Function types
export type ClaimBribesParams = FunctionArguments<typeof functions.claimBribes>
export type ClaimBribesReturn = FunctionReturn<typeof functions.claimBribes>

export type ClaimFeesParams = FunctionArguments<typeof functions.claimFees>
export type ClaimFeesReturn = FunctionReturn<typeof functions.claimFees>

export type ClaimRewardsParams = FunctionArguments<typeof functions.claimRewards>
export type ClaimRewardsReturn = FunctionReturn<typeof functions.claimRewards>

export type ClaimableParams = FunctionArguments<typeof functions.claimable>
export type ClaimableReturn = FunctionReturn<typeof functions.claimable>

export type CreateGaugeParams = FunctionArguments<typeof functions.createGauge>
export type CreateGaugeReturn = FunctionReturn<typeof functions.createGauge>

export type DepositManagedParams = FunctionArguments<typeof functions.depositManaged>
export type DepositManagedReturn = FunctionReturn<typeof functions.depositManaged>

export type DistributeParams_0 = FunctionArguments<typeof functions['distribute(address[])']>
export type DistributeReturn_0 = FunctionReturn<typeof functions['distribute(address[])']>

export type DistributeParams_1 = FunctionArguments<typeof functions['distribute(uint256,uint256)']>
export type DistributeReturn_1 = FunctionReturn<typeof functions['distribute(uint256,uint256)']>

export type EmergencyCouncilParams = FunctionArguments<typeof functions.emergencyCouncil>
export type EmergencyCouncilReturn = FunctionReturn<typeof functions.emergencyCouncil>

export type EpochGovernorParams = FunctionArguments<typeof functions.epochGovernor>
export type EpochGovernorReturn = FunctionReturn<typeof functions.epochGovernor>

export type EpochNextParams = FunctionArguments<typeof functions.epochNext>
export type EpochNextReturn = FunctionReturn<typeof functions.epochNext>

export type EpochStartParams = FunctionArguments<typeof functions.epochStart>
export type EpochStartReturn = FunctionReturn<typeof functions.epochStart>

export type EpochVoteEndParams = FunctionArguments<typeof functions.epochVoteEnd>
export type EpochVoteEndReturn = FunctionReturn<typeof functions.epochVoteEnd>

export type EpochVoteStartParams = FunctionArguments<typeof functions.epochVoteStart>
export type EpochVoteStartReturn = FunctionReturn<typeof functions.epochVoteStart>

export type FactoryRegistryParams = FunctionArguments<typeof functions.factoryRegistry>
export type FactoryRegistryReturn = FunctionReturn<typeof functions.factoryRegistry>

export type ForwarderParams = FunctionArguments<typeof functions.forwarder>
export type ForwarderReturn = FunctionReturn<typeof functions.forwarder>

export type GaugeToBribeParams = FunctionArguments<typeof functions.gaugeToBribe>
export type GaugeToBribeReturn = FunctionReturn<typeof functions.gaugeToBribe>

export type GaugeToFeesParams = FunctionArguments<typeof functions.gaugeToFees>
export type GaugeToFeesReturn = FunctionReturn<typeof functions.gaugeToFees>

export type GaugesParams = FunctionArguments<typeof functions.gauges>
export type GaugesReturn = FunctionReturn<typeof functions.gauges>

export type GovernorParams = FunctionArguments<typeof functions.governor>
export type GovernorReturn = FunctionReturn<typeof functions.governor>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsAliveParams = FunctionArguments<typeof functions.isAlive>
export type IsAliveReturn = FunctionReturn<typeof functions.isAlive>

export type IsGaugeParams = FunctionArguments<typeof functions.isGauge>
export type IsGaugeReturn = FunctionReturn<typeof functions.isGauge>

export type IsTrustedForwarderParams = FunctionArguments<typeof functions.isTrustedForwarder>
export type IsTrustedForwarderReturn = FunctionReturn<typeof functions.isTrustedForwarder>

export type IsWhitelistedNFTParams = FunctionArguments<typeof functions.isWhitelistedNFT>
export type IsWhitelistedNFTReturn = FunctionReturn<typeof functions.isWhitelistedNFT>

export type IsWhitelistedTokenParams = FunctionArguments<typeof functions.isWhitelistedToken>
export type IsWhitelistedTokenReturn = FunctionReturn<typeof functions.isWhitelistedToken>

export type KillGaugeParams = FunctionArguments<typeof functions.killGauge>
export type KillGaugeReturn = FunctionReturn<typeof functions.killGauge>

export type LastVotedParams = FunctionArguments<typeof functions.lastVoted>
export type LastVotedReturn = FunctionReturn<typeof functions.lastVoted>

export type LengthParams = FunctionArguments<typeof functions.length>
export type LengthReturn = FunctionReturn<typeof functions.length>

export type MaxVotingNumParams = FunctionArguments<typeof functions.maxVotingNum>
export type MaxVotingNumReturn = FunctionReturn<typeof functions.maxVotingNum>

export type MinterParams = FunctionArguments<typeof functions.minter>
export type MinterReturn = FunctionReturn<typeof functions.minter>

export type NotifyRewardAmountParams = FunctionArguments<typeof functions.notifyRewardAmount>
export type NotifyRewardAmountReturn = FunctionReturn<typeof functions.notifyRewardAmount>

export type PokeParams = FunctionArguments<typeof functions.poke>
export type PokeReturn = FunctionReturn<typeof functions.poke>

export type PoolForGaugeParams = FunctionArguments<typeof functions.poolForGauge>
export type PoolForGaugeReturn = FunctionReturn<typeof functions.poolForGauge>

export type PoolVoteParams = FunctionArguments<typeof functions.poolVote>
export type PoolVoteReturn = FunctionReturn<typeof functions.poolVote>

export type PoolsParams = FunctionArguments<typeof functions.pools>
export type PoolsReturn = FunctionReturn<typeof functions.pools>

export type ResetParams = FunctionArguments<typeof functions.reset>
export type ResetReturn = FunctionReturn<typeof functions.reset>

export type ReviveGaugeParams = FunctionArguments<typeof functions.reviveGauge>
export type ReviveGaugeReturn = FunctionReturn<typeof functions.reviveGauge>

export type SetEmergencyCouncilParams = FunctionArguments<typeof functions.setEmergencyCouncil>
export type SetEmergencyCouncilReturn = FunctionReturn<typeof functions.setEmergencyCouncil>

export type SetEpochGovernorParams = FunctionArguments<typeof functions.setEpochGovernor>
export type SetEpochGovernorReturn = FunctionReturn<typeof functions.setEpochGovernor>

export type SetGovernorParams = FunctionArguments<typeof functions.setGovernor>
export type SetGovernorReturn = FunctionReturn<typeof functions.setGovernor>

export type SetMaxVotingNumParams = FunctionArguments<typeof functions.setMaxVotingNum>
export type SetMaxVotingNumReturn = FunctionReturn<typeof functions.setMaxVotingNum>

export type TotalWeightParams = FunctionArguments<typeof functions.totalWeight>
export type TotalWeightReturn = FunctionReturn<typeof functions.totalWeight>

export type UpdateForParams_0 = FunctionArguments<typeof functions['updateFor(address)']>
export type UpdateForReturn_0 = FunctionReturn<typeof functions['updateFor(address)']>

export type UpdateForParams_1 = FunctionArguments<typeof functions['updateFor(uint256,uint256)']>
export type UpdateForReturn_1 = FunctionReturn<typeof functions['updateFor(uint256,uint256)']>

export type UpdateForParams_2 = FunctionArguments<typeof functions['updateFor(address[])']>
export type UpdateForReturn_2 = FunctionReturn<typeof functions['updateFor(address[])']>

export type UsedWeightsParams = FunctionArguments<typeof functions.usedWeights>
export type UsedWeightsReturn = FunctionReturn<typeof functions.usedWeights>

export type VeParams = FunctionArguments<typeof functions.ve>
export type VeReturn = FunctionReturn<typeof functions.ve>

export type VoteParams = FunctionArguments<typeof functions.vote>
export type VoteReturn = FunctionReturn<typeof functions.vote>

export type VotesParams = FunctionArguments<typeof functions.votes>
export type VotesReturn = FunctionReturn<typeof functions.votes>

export type WeightsParams = FunctionArguments<typeof functions.weights>
export type WeightsReturn = FunctionReturn<typeof functions.weights>

export type WhitelistNFTParams = FunctionArguments<typeof functions.whitelistNFT>
export type WhitelistNFTReturn = FunctionReturn<typeof functions.whitelistNFT>

export type WhitelistTokenParams = FunctionArguments<typeof functions.whitelistToken>
export type WhitelistTokenReturn = FunctionReturn<typeof functions.whitelistToken>

export type WithdrawManagedParams = FunctionArguments<typeof functions.withdrawManaged>
export type WithdrawManagedReturn = FunctionReturn<typeof functions.withdrawManaged>

