import { address, array, bool, int24, string, struct, uint160, uint256, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** forSwaps(uint256,uint256) */
export const forSwaps = func('0xb224fcb5', {
    _limit: uint256,
    _offset: uint256,
}, array(struct({
    lp: address,
    type: int24,
    token0: address,
    token1: address,
    factory: address,
    pool_fee: uint256,
})))
export type ForSwapsParams = FunctionArguments<typeof forSwaps>
export type ForSwapsReturn = FunctionReturn<typeof forSwaps>

/** tokens(uint256,uint256,address,address[]) */
export const tokens = func('0x295212be', {
    _limit: uint256,
    _offset: uint256,
    _account: address,
    _addresses: array(address),
}, array(struct({
    token_address: address,
    symbol: string,
    decimals: uint8,
    account_balance: uint256,
    listed: bool,
})))
export type TokensParams = FunctionArguments<typeof tokens>
export type TokensReturn = FunctionReturn<typeof tokens>

/** all(uint256,uint256) */
export const all = func('0xb10daf7b', {
    _limit: uint256,
    _offset: uint256,
}, array(struct({
    lp: address,
    symbol: string,
    decimals: uint8,
    liquidity: uint256,
    type: int24,
    tick: int24,
    sqrt_ratio: uint160,
    token0: address,
    reserve0: uint256,
    staked0: uint256,
    token1: address,
    reserve1: uint256,
    staked1: uint256,
    gauge: address,
    gauge_liquidity: uint256,
    gauge_alive: bool,
    fee: address,
    bribe: address,
    factory: address,
    emissions: uint256,
    emissions_token: address,
    pool_fee: uint256,
    unstaked_fee: uint256,
    token0_fees: uint256,
    token1_fees: uint256,
    nfpm: address,
})))
export type AllParams = FunctionArguments<typeof all>
export type AllReturn = FunctionReturn<typeof all>

/** byIndex(uint256) */
export const byIndex = func('0x1f342dd6', {
    _index: uint256,
}, struct({
    lp: address,
    symbol: string,
    decimals: uint8,
    liquidity: uint256,
    type: int24,
    tick: int24,
    sqrt_ratio: uint160,
    token0: address,
    reserve0: uint256,
    staked0: uint256,
    token1: address,
    reserve1: uint256,
    staked1: uint256,
    gauge: address,
    gauge_liquidity: uint256,
    gauge_alive: bool,
    fee: address,
    bribe: address,
    factory: address,
    emissions: uint256,
    emissions_token: address,
    pool_fee: uint256,
    unstaked_fee: uint256,
    token0_fees: uint256,
    token1_fees: uint256,
    nfpm: address,
}))
export type ByIndexParams = FunctionArguments<typeof byIndex>
export type ByIndexReturn = FunctionReturn<typeof byIndex>

/** positions(uint256,uint256,address) */
export const positions = func('0xedbd33bf', {
    _limit: uint256,
    _offset: uint256,
    _account: address,
}, array(struct({
    id: uint256,
    lp: address,
    liquidity: uint256,
    staked: uint256,
    amount0: uint256,
    amount1: uint256,
    staked0: uint256,
    staked1: uint256,
    unstaked_earned0: uint256,
    unstaked_earned1: uint256,
    emissions_earned: uint256,
    tick_lower: int24,
    tick_upper: int24,
    sqrt_ratio_lower: uint160,
    sqrt_ratio_upper: uint160,
})))
export type PositionsParams = FunctionArguments<typeof positions>
export type PositionsReturn = FunctionReturn<typeof positions>

/** positionsByFactory(uint256,uint256,address,address) */
export const positionsByFactory = func('0x0d0154a9', {
    _limit: uint256,
    _offset: uint256,
    _account: address,
    _factory: address,
}, array(struct({
    id: uint256,
    lp: address,
    liquidity: uint256,
    staked: uint256,
    amount0: uint256,
    amount1: uint256,
    staked0: uint256,
    staked1: uint256,
    unstaked_earned0: uint256,
    unstaked_earned1: uint256,
    emissions_earned: uint256,
    tick_lower: int24,
    tick_upper: int24,
    sqrt_ratio_lower: uint160,
    sqrt_ratio_upper: uint160,
})))
export type PositionsByFactoryParams = FunctionArguments<typeof positionsByFactory>
export type PositionsByFactoryReturn = FunctionReturn<typeof positionsByFactory>

/** epochsLatest(uint256,uint256) */
export const epochsLatest = func('0xd94b9bc6', {
    _limit: uint256,
    _offset: uint256,
}, array(struct({
    ts: uint256,
    lp: address,
    votes: uint256,
    emissions: uint256,
    bribes: array(struct({
        token: address,
        amount: uint256,
    })),
    fees: array(struct({
        token: address,
        amount: uint256,
    })),
})))
export type EpochsLatestParams = FunctionArguments<typeof epochsLatest>
export type EpochsLatestReturn = FunctionReturn<typeof epochsLatest>

/** epochsByAddress(uint256,uint256,address) */
export const epochsByAddress = func('0x8878d06c', {
    _limit: uint256,
    _offset: uint256,
    _address: address,
}, array(struct({
    ts: uint256,
    lp: address,
    votes: uint256,
    emissions: uint256,
    bribes: array(struct({
        token: address,
        amount: uint256,
    })),
    fees: array(struct({
        token: address,
        amount: uint256,
    })),
})))
export type EpochsByAddressParams = FunctionArguments<typeof epochsByAddress>
export type EpochsByAddressReturn = FunctionReturn<typeof epochsByAddress>

/** rewards(uint256,uint256,uint256) */
export const rewards = func('0xa9c57fee', {
    _limit: uint256,
    _offset: uint256,
    _venft_id: uint256,
}, array(struct({
    venft_id: uint256,
    lp: address,
    amount: uint256,
    token: address,
    fee: address,
    bribe: address,
})))
export type RewardsParams = FunctionArguments<typeof rewards>
export type RewardsReturn = FunctionReturn<typeof rewards>

/** rewardsByAddress(uint256,address) */
export const rewardsByAddress = func('0xcd824fb4', {
    _venft_id: uint256,
    _pool: address,
}, array(struct({
    venft_id: uint256,
    lp: address,
    amount: uint256,
    token: address,
    fee: address,
    bribe: address,
})))
export type RewardsByAddressParams = FunctionArguments<typeof rewardsByAddress>
export type RewardsByAddressReturn = FunctionReturn<typeof rewardsByAddress>

/** MAX_FACTORIES() */
export const MAX_FACTORIES = func('0x91c275a7', {}, uint256)
export type MAX_FACTORIESParams = FunctionArguments<typeof MAX_FACTORIES>
export type MAX_FACTORIESReturn = FunctionReturn<typeof MAX_FACTORIES>

/** MAX_POOLS() */
export const MAX_POOLS = func('0x81358498', {}, uint256)
export type MAX_POOLSParams = FunctionArguments<typeof MAX_POOLS>
export type MAX_POOLSReturn = FunctionReturn<typeof MAX_POOLS>

/** MAX_TOKENS() */
export const MAX_TOKENS = func('0xf47c84c5', {}, uint256)
export type MAX_TOKENSParams = FunctionArguments<typeof MAX_TOKENS>
export type MAX_TOKENSReturn = FunctionReturn<typeof MAX_TOKENS>

/** MAX_LPS() */
export const MAX_LPS = func('0x93546ff1', {}, uint256)
export type MAX_LPSParams = FunctionArguments<typeof MAX_LPS>
export type MAX_LPSReturn = FunctionReturn<typeof MAX_LPS>

/** MAX_EPOCHS() */
export const MAX_EPOCHS = func('0xc8b72f8f', {}, uint256)
export type MAX_EPOCHSParams = FunctionArguments<typeof MAX_EPOCHS>
export type MAX_EPOCHSReturn = FunctionReturn<typeof MAX_EPOCHS>

/** MAX_REWARDS() */
export const MAX_REWARDS = func('0xfb5478b3', {}, uint256)
export type MAX_REWARDSParams = FunctionArguments<typeof MAX_REWARDS>
export type MAX_REWARDSReturn = FunctionReturn<typeof MAX_REWARDS>

/** MAX_POSITIONS() */
export const MAX_POSITIONS = func('0xf7b24e08', {}, uint256)
export type MAX_POSITIONSParams = FunctionArguments<typeof MAX_POSITIONS>
export type MAX_POSITIONSReturn = FunctionReturn<typeof MAX_POSITIONS>

/** WEEK() */
export const WEEK = func('0xf4359ce5', {}, uint256)
export type WEEKParams = FunctionArguments<typeof WEEK>
export type WEEKReturn = FunctionReturn<typeof WEEK>

/** registry() */
export const registry = func('0x7b103999', {}, address)
export type RegistryParams = FunctionArguments<typeof registry>
export type RegistryReturn = FunctionReturn<typeof registry>

/** voter() */
export const voter = func('0x46c96aac', {}, address)
export type VoterParams = FunctionArguments<typeof voter>
export type VoterReturn = FunctionReturn<typeof voter>

/** convertor() */
export const convertor = func('0xb5030306', {}, address)
export type ConvertorParams = FunctionArguments<typeof convertor>
export type ConvertorReturn = FunctionReturn<typeof convertor>

/** cl_helper() */
export const cl_helper = func('0xc954a389', {}, address)
export type Cl_helperParams = FunctionArguments<typeof cl_helper>
export type Cl_helperReturn = FunctionReturn<typeof cl_helper>
