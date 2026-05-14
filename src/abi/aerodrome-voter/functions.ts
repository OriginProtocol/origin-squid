import { address, array, bool, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** claimBribes(address[],address[][],uint256) */
export const claimBribes = func('0x7715ee75', {
    _bribes: array(address),
    _tokens: array(array(address)),
    _tokenId: uint256,
})
export type ClaimBribesParams = FunctionArguments<typeof claimBribes>
export type ClaimBribesReturn = FunctionReturn<typeof claimBribes>

/** claimFees(address[],address[][],uint256) */
export const claimFees = func('0x666256aa', {
    _fees: array(address),
    _tokens: array(array(address)),
    _tokenId: uint256,
})
export type ClaimFeesParams = FunctionArguments<typeof claimFees>
export type ClaimFeesReturn = FunctionReturn<typeof claimFees>

/** claimRewards(address[]) */
export const claimRewards = func('0xf9f031df', {
    _gauges: array(address),
})
export type ClaimRewardsParams = FunctionArguments<typeof claimRewards>
export type ClaimRewardsReturn = FunctionReturn<typeof claimRewards>

/** claimable(address) */
export const claimable = func('0x402914f5', {
    _0: address,
}, uint256)
export type ClaimableParams = FunctionArguments<typeof claimable>
export type ClaimableReturn = FunctionReturn<typeof claimable>

/** createGauge(address,address) */
export const createGauge = func('0x794cea3c', {
    _poolFactory: address,
    _pool: address,
}, address)
export type CreateGaugeParams = FunctionArguments<typeof createGauge>
export type CreateGaugeReturn = FunctionReturn<typeof createGauge>

/** depositManaged(uint256,uint256) */
export const depositManaged = func('0xe0c11f9a', {
    _tokenId: uint256,
    _mTokenId: uint256,
})
export type DepositManagedParams = FunctionArguments<typeof depositManaged>
export type DepositManagedReturn = FunctionReturn<typeof depositManaged>

/** distribute(address[]) */
export const distribute = func('0x6138889b', {
    _gauges: array(address),
})
export type DistributeParams = FunctionArguments<typeof distribute>
export type DistributeReturn = FunctionReturn<typeof distribute>

/** distribute(uint256,uint256) */
export const distribute_1 = func('0x7625391a', {
    _start: uint256,
    _finish: uint256,
})
export type DistributeParams_1 = FunctionArguments<typeof distribute_1>
export type DistributeReturn_1 = FunctionReturn<typeof distribute_1>

/** emergencyCouncil() */
export const emergencyCouncil = func('0x7778960e', {}, address)
export type EmergencyCouncilParams = FunctionArguments<typeof emergencyCouncil>
export type EmergencyCouncilReturn = FunctionReturn<typeof emergencyCouncil>

/** epochGovernor() */
export const epochGovernor = func('0x3aae971f', {}, address)
export type EpochGovernorParams = FunctionArguments<typeof epochGovernor>
export type EpochGovernorReturn = FunctionReturn<typeof epochGovernor>

/** epochNext(uint256) */
export const epochNext = func('0x880e36fc', {
    _timestamp: uint256,
}, uint256)
export type EpochNextParams = FunctionArguments<typeof epochNext>
export type EpochNextReturn = FunctionReturn<typeof epochNext>

/** epochStart(uint256) */
export const epochStart = func('0xaa9354a3', {
    _timestamp: uint256,
}, uint256)
export type EpochStartParams = FunctionArguments<typeof epochStart>
export type EpochStartReturn = FunctionReturn<typeof epochStart>

/** epochVoteEnd(uint256) */
export const epochVoteEnd = func('0xd58b15d4', {
    _timestamp: uint256,
}, uint256)
export type EpochVoteEndParams = FunctionArguments<typeof epochVoteEnd>
export type EpochVoteEndReturn = FunctionReturn<typeof epochVoteEnd>

/** epochVoteStart(uint256) */
export const epochVoteStart = func('0x39e9f3b6', {
    _timestamp: uint256,
}, uint256)
export type EpochVoteStartParams = FunctionArguments<typeof epochVoteStart>
export type EpochVoteStartReturn = FunctionReturn<typeof epochVoteStart>

/** factoryRegistry() */
export const factoryRegistry = func('0x3bf0c9fb', {}, address)
export type FactoryRegistryParams = FunctionArguments<typeof factoryRegistry>
export type FactoryRegistryReturn = FunctionReturn<typeof factoryRegistry>

/** forwarder() */
export const forwarder = func('0xf645d4f9', {}, address)
export type ForwarderParams = FunctionArguments<typeof forwarder>
export type ForwarderReturn = FunctionReturn<typeof forwarder>

/** gaugeToBribe(address) */
export const gaugeToBribe = func('0x929c8dcd', {
    _0: address,
}, address)
export type GaugeToBribeParams = FunctionArguments<typeof gaugeToBribe>
export type GaugeToBribeReturn = FunctionReturn<typeof gaugeToBribe>

/** gaugeToFees(address) */
export const gaugeToFees = func('0xc4f08165', {
    _0: address,
}, address)
export type GaugeToFeesParams = FunctionArguments<typeof gaugeToFees>
export type GaugeToFeesReturn = FunctionReturn<typeof gaugeToFees>

/** gauges(address) */
export const gauges = func('0xb9a09fd5', {
    _0: address,
}, address)
export type GaugesParams = FunctionArguments<typeof gauges>
export type GaugesReturn = FunctionReturn<typeof gauges>

/** governor() */
export const governor = func('0x0c340a24', {}, address)
export type GovernorParams = FunctionArguments<typeof governor>
export type GovernorReturn = FunctionReturn<typeof governor>

/** initialize(address[],address) */
export const initialize = func('0x462d0b2e', {
    _tokens: array(address),
    _minter: address,
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** isAlive(address) */
export const isAlive = func('0x1703e5f9', {
    _0: address,
}, bool)
export type IsAliveParams = FunctionArguments<typeof isAlive>
export type IsAliveReturn = FunctionReturn<typeof isAlive>

/** isGauge(address) */
export const isGauge = func('0xaa79979b', {
    _0: address,
}, bool)
export type IsGaugeParams = FunctionArguments<typeof isGauge>
export type IsGaugeReturn = FunctionReturn<typeof isGauge>

/** isTrustedForwarder(address) */
export const isTrustedForwarder = func('0x572b6c05', {
    forwarder: address,
}, bool)
export type IsTrustedForwarderParams = FunctionArguments<typeof isTrustedForwarder>
export type IsTrustedForwarderReturn = FunctionReturn<typeof isTrustedForwarder>

/** isWhitelistedNFT(uint256) */
export const isWhitelistedNFT = func('0xd4e2616f', {
    _0: uint256,
}, bool)
export type IsWhitelistedNFTParams = FunctionArguments<typeof isWhitelistedNFT>
export type IsWhitelistedNFTReturn = FunctionReturn<typeof isWhitelistedNFT>

/** isWhitelistedToken(address) */
export const isWhitelistedToken = func('0xab37f486', {
    _0: address,
}, bool)
export type IsWhitelistedTokenParams = FunctionArguments<typeof isWhitelistedToken>
export type IsWhitelistedTokenReturn = FunctionReturn<typeof isWhitelistedToken>

/** killGauge(address) */
export const killGauge = func('0x992a7933', {
    _gauge: address,
})
export type KillGaugeParams = FunctionArguments<typeof killGauge>
export type KillGaugeReturn = FunctionReturn<typeof killGauge>

/** lastVoted(uint256) */
export const lastVoted = func('0xf3594be0', {
    _0: uint256,
}, uint256)
export type LastVotedParams = FunctionArguments<typeof lastVoted>
export type LastVotedReturn = FunctionReturn<typeof lastVoted>

/** length() */
export const length = func('0x1f7b6d32', {}, uint256)
export type LengthParams = FunctionArguments<typeof length>
export type LengthReturn = FunctionReturn<typeof length>

/** maxVotingNum() */
export const maxVotingNum = func('0xe8b3fd57', {}, uint256)
export type MaxVotingNumParams = FunctionArguments<typeof maxVotingNum>
export type MaxVotingNumReturn = FunctionReturn<typeof maxVotingNum>

/** minter() */
export const minter = func('0x07546172', {}, address)
export type MinterParams = FunctionArguments<typeof minter>
export type MinterReturn = FunctionReturn<typeof minter>

/** notifyRewardAmount(uint256) */
export const notifyRewardAmount = func('0x3c6b16ab', {
    _amount: uint256,
})
export type NotifyRewardAmountParams = FunctionArguments<typeof notifyRewardAmount>
export type NotifyRewardAmountReturn = FunctionReturn<typeof notifyRewardAmount>

/** poke(uint256) */
export const poke = func('0x32145f90', {
    _tokenId: uint256,
})
export type PokeParams = FunctionArguments<typeof poke>
export type PokeReturn = FunctionReturn<typeof poke>

/** poolForGauge(address) */
export const poolForGauge = func('0x06d6a1b2', {
    _0: address,
}, address)
export type PoolForGaugeParams = FunctionArguments<typeof poolForGauge>
export type PoolForGaugeReturn = FunctionReturn<typeof poolForGauge>

/** poolVote(uint256,uint256) */
export const poolVote = func('0xa86a366d', {
    _0: uint256,
    _1: uint256,
}, address)
export type PoolVoteParams = FunctionArguments<typeof poolVote>
export type PoolVoteReturn = FunctionReturn<typeof poolVote>

/** pools(uint256) */
export const pools = func('0xac4afa38', {
    _0: uint256,
}, address)
export type PoolsParams = FunctionArguments<typeof pools>
export type PoolsReturn = FunctionReturn<typeof pools>

/** reset(uint256) */
export const reset = func('0x310bd74b', {
    _tokenId: uint256,
})
export type ResetParams = FunctionArguments<typeof reset>
export type ResetReturn = FunctionReturn<typeof reset>

/** reviveGauge(address) */
export const reviveGauge = func('0x9f06247b', {
    _gauge: address,
})
export type ReviveGaugeParams = FunctionArguments<typeof reviveGauge>
export type ReviveGaugeReturn = FunctionReturn<typeof reviveGauge>

/** setEmergencyCouncil(address) */
export const setEmergencyCouncil = func('0xe586875f', {
    _council: address,
})
export type SetEmergencyCouncilParams = FunctionArguments<typeof setEmergencyCouncil>
export type SetEmergencyCouncilReturn = FunctionReturn<typeof setEmergencyCouncil>

/** setEpochGovernor(address) */
export const setEpochGovernor = func('0x598d521b', {
    _epochGovernor: address,
})
export type SetEpochGovernorParams = FunctionArguments<typeof setEpochGovernor>
export type SetEpochGovernorReturn = FunctionReturn<typeof setEpochGovernor>

/** setGovernor(address) */
export const setGovernor = func('0xc42cf535', {
    _governor: address,
})
export type SetGovernorParams = FunctionArguments<typeof setGovernor>
export type SetGovernorReturn = FunctionReturn<typeof setGovernor>

/** setMaxVotingNum(uint256) */
export const setMaxVotingNum = func('0x30331b2f', {
    _maxVotingNum: uint256,
})
export type SetMaxVotingNumParams = FunctionArguments<typeof setMaxVotingNum>
export type SetMaxVotingNumReturn = FunctionReturn<typeof setMaxVotingNum>

/** totalWeight() */
export const totalWeight = func('0x96c82e57', {}, uint256)
export type TotalWeightParams = FunctionArguments<typeof totalWeight>
export type TotalWeightReturn = FunctionReturn<typeof totalWeight>

/** updateFor(address) */
export const updateFor = func('0x0e0a5968', {
    _gauge: address,
})
export type UpdateForParams = FunctionArguments<typeof updateFor>
export type UpdateForReturn = FunctionReturn<typeof updateFor>

/** updateFor(uint256,uint256) */
export const updateFor_1 = func('0xc9ff6f4d', {
    start: uint256,
    end: uint256,
})
export type UpdateForParams_1 = FunctionArguments<typeof updateFor_1>
export type UpdateForReturn_1 = FunctionReturn<typeof updateFor_1>

/** updateFor(address[]) */
export const updateFor_2 = func('0xd560b0d7', {
    _gauges: array(address),
})
export type UpdateForParams_2 = FunctionArguments<typeof updateFor_2>
export type UpdateForReturn_2 = FunctionReturn<typeof updateFor_2>

/** usedWeights(uint256) */
export const usedWeights = func('0x79e93824', {
    _0: uint256,
}, uint256)
export type UsedWeightsParams = FunctionArguments<typeof usedWeights>
export type UsedWeightsReturn = FunctionReturn<typeof usedWeights>

/** ve() */
export const ve = func('0x1f850716', {}, address)
export type VeParams = FunctionArguments<typeof ve>
export type VeReturn = FunctionReturn<typeof ve>

/** vote(uint256,address[],uint256[]) */
export const vote = func('0x7ac09bf7', {
    _tokenId: uint256,
    _poolVote: array(address),
    _weights: array(uint256),
})
export type VoteParams = FunctionArguments<typeof vote>
export type VoteReturn = FunctionReturn<typeof vote>

/** votes(uint256,address) */
export const votes = func('0xd23254b4', {
    _0: uint256,
    _1: address,
}, uint256)
export type VotesParams = FunctionArguments<typeof votes>
export type VotesReturn = FunctionReturn<typeof votes>

/** weights(address) */
export const weights = func('0xa7cac846', {
    _0: address,
}, uint256)
export type WeightsParams = FunctionArguments<typeof weights>
export type WeightsReturn = FunctionReturn<typeof weights>

/** whitelistNFT(uint256,bool) */
export const whitelistNFT = func('0xe2819d5c', {
    _tokenId: uint256,
    _bool: bool,
})
export type WhitelistNFTParams = FunctionArguments<typeof whitelistNFT>
export type WhitelistNFTReturn = FunctionReturn<typeof whitelistNFT>

/** whitelistToken(address,bool) */
export const whitelistToken = func('0x0ffb1d8b', {
    _token: address,
    _bool: bool,
})
export type WhitelistTokenParams = FunctionArguments<typeof whitelistToken>
export type WhitelistTokenReturn = FunctionReturn<typeof whitelistToken>

/** withdrawManaged(uint256) */
export const withdrawManaged = func('0x370fb5fa', {
    _tokenId: uint256,
})
export type WithdrawManagedParams = FunctionArguments<typeof withdrawManaged>
export type WithdrawManagedReturn = FunctionReturn<typeof withdrawManaged>
