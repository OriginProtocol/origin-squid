import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const functions = {
    forSwaps: viewFun("0xb224fcb5", "forSwaps(uint256,uint256)", {"_limit": p.uint256, "_offset": p.uint256}, p.array(p.struct({"lp": p.address, "type": p.int24, "token0": p.address, "token1": p.address, "factory": p.address, "pool_fee": p.uint256}))),
    tokens: viewFun("0x295212be", "tokens(uint256,uint256,address,address[])", {"_limit": p.uint256, "_offset": p.uint256, "_account": p.address, "_addresses": p.array(p.address)}, p.array(p.struct({"token_address": p.address, "symbol": p.string, "decimals": p.uint8, "account_balance": p.uint256, "listed": p.bool}))),
    all: viewFun("0xb10daf7b", "all(uint256,uint256)", {"_limit": p.uint256, "_offset": p.uint256}, p.array(p.struct({"lp": p.address, "symbol": p.string, "decimals": p.uint8, "liquidity": p.uint256, "type": p.int24, "tick": p.int24, "sqrt_ratio": p.uint160, "token0": p.address, "reserve0": p.uint256, "staked0": p.uint256, "token1": p.address, "reserve1": p.uint256, "staked1": p.uint256, "gauge": p.address, "gauge_liquidity": p.uint256, "gauge_alive": p.bool, "fee": p.address, "bribe": p.address, "factory": p.address, "emissions": p.uint256, "emissions_token": p.address, "pool_fee": p.uint256, "unstaked_fee": p.uint256, "token0_fees": p.uint256, "token1_fees": p.uint256, "nfpm": p.address}))),
    byIndex: viewFun("0x1f342dd6", "byIndex(uint256)", {"_index": p.uint256}, p.struct({"lp": p.address, "symbol": p.string, "decimals": p.uint8, "liquidity": p.uint256, "type": p.int24, "tick": p.int24, "sqrt_ratio": p.uint160, "token0": p.address, "reserve0": p.uint256, "staked0": p.uint256, "token1": p.address, "reserve1": p.uint256, "staked1": p.uint256, "gauge": p.address, "gauge_liquidity": p.uint256, "gauge_alive": p.bool, "fee": p.address, "bribe": p.address, "factory": p.address, "emissions": p.uint256, "emissions_token": p.address, "pool_fee": p.uint256, "unstaked_fee": p.uint256, "token0_fees": p.uint256, "token1_fees": p.uint256, "nfpm": p.address})),
    positions: viewFun("0xedbd33bf", "positions(uint256,uint256,address)", {"_limit": p.uint256, "_offset": p.uint256, "_account": p.address}, p.array(p.struct({"id": p.uint256, "lp": p.address, "liquidity": p.uint256, "staked": p.uint256, "amount0": p.uint256, "amount1": p.uint256, "staked0": p.uint256, "staked1": p.uint256, "unstaked_earned0": p.uint256, "unstaked_earned1": p.uint256, "emissions_earned": p.uint256, "tick_lower": p.int24, "tick_upper": p.int24, "sqrt_ratio_lower": p.uint160, "sqrt_ratio_upper": p.uint160}))),
    positionsByFactory: viewFun("0x0d0154a9", "positionsByFactory(uint256,uint256,address,address)", {"_limit": p.uint256, "_offset": p.uint256, "_account": p.address, "_factory": p.address}, p.array(p.struct({"id": p.uint256, "lp": p.address, "liquidity": p.uint256, "staked": p.uint256, "amount0": p.uint256, "amount1": p.uint256, "staked0": p.uint256, "staked1": p.uint256, "unstaked_earned0": p.uint256, "unstaked_earned1": p.uint256, "emissions_earned": p.uint256, "tick_lower": p.int24, "tick_upper": p.int24, "sqrt_ratio_lower": p.uint160, "sqrt_ratio_upper": p.uint160}))),
    epochsLatest: viewFun("0xd94b9bc6", "epochsLatest(uint256,uint256)", {"_limit": p.uint256, "_offset": p.uint256}, p.array(p.struct({"ts": p.uint256, "lp": p.address, "votes": p.uint256, "emissions": p.uint256, "bribes": p.array(p.struct({"token": p.address, "amount": p.uint256})), "fees": p.array(p.struct({"token": p.address, "amount": p.uint256}))}))),
    epochsByAddress: viewFun("0x8878d06c", "epochsByAddress(uint256,uint256,address)", {"_limit": p.uint256, "_offset": p.uint256, "_address": p.address}, p.array(p.struct({"ts": p.uint256, "lp": p.address, "votes": p.uint256, "emissions": p.uint256, "bribes": p.array(p.struct({"token": p.address, "amount": p.uint256})), "fees": p.array(p.struct({"token": p.address, "amount": p.uint256}))}))),
    rewards: viewFun("0xa9c57fee", "rewards(uint256,uint256,uint256)", {"_limit": p.uint256, "_offset": p.uint256, "_venft_id": p.uint256}, p.array(p.struct({"venft_id": p.uint256, "lp": p.address, "amount": p.uint256, "token": p.address, "fee": p.address, "bribe": p.address}))),
    rewardsByAddress: viewFun("0xcd824fb4", "rewardsByAddress(uint256,address)", {"_venft_id": p.uint256, "_pool": p.address}, p.array(p.struct({"venft_id": p.uint256, "lp": p.address, "amount": p.uint256, "token": p.address, "fee": p.address, "bribe": p.address}))),
    MAX_FACTORIES: viewFun("0x91c275a7", "MAX_FACTORIES()", {}, p.uint256),
    MAX_POOLS: viewFun("0x81358498", "MAX_POOLS()", {}, p.uint256),
    MAX_TOKENS: viewFun("0xf47c84c5", "MAX_TOKENS()", {}, p.uint256),
    MAX_LPS: viewFun("0x93546ff1", "MAX_LPS()", {}, p.uint256),
    MAX_EPOCHS: viewFun("0xc8b72f8f", "MAX_EPOCHS()", {}, p.uint256),
    MAX_REWARDS: viewFun("0xfb5478b3", "MAX_REWARDS()", {}, p.uint256),
    MAX_POSITIONS: viewFun("0xf7b24e08", "MAX_POSITIONS()", {}, p.uint256),
    WEEK: viewFun("0xf4359ce5", "WEEK()", {}, p.uint256),
    registry: viewFun("0x7b103999", "registry()", {}, p.address),
    voter: viewFun("0x46c96aac", "voter()", {}, p.address),
    convertor: viewFun("0xb5030306", "convertor()", {}, p.address),
    cl_helper: viewFun("0xc954a389", "cl_helper()", {}, p.address),
}

export class Contract extends ContractBase {

    forSwaps(_limit: ForSwapsParams["_limit"], _offset: ForSwapsParams["_offset"]) {
        return this.eth_call(functions.forSwaps, {_limit, _offset})
    }

    tokens(_limit: TokensParams["_limit"], _offset: TokensParams["_offset"], _account: TokensParams["_account"], _addresses: TokensParams["_addresses"]) {
        return this.eth_call(functions.tokens, {_limit, _offset, _account, _addresses})
    }

    all(_limit: AllParams["_limit"], _offset: AllParams["_offset"]) {
        return this.eth_call(functions.all, {_limit, _offset})
    }

    byIndex(_index: ByIndexParams["_index"]) {
        return this.eth_call(functions.byIndex, {_index})
    }

    positions(_limit: PositionsParams["_limit"], _offset: PositionsParams["_offset"], _account: PositionsParams["_account"]) {
        return this.eth_call(functions.positions, {_limit, _offset, _account})
    }

    positionsByFactory(_limit: PositionsByFactoryParams["_limit"], _offset: PositionsByFactoryParams["_offset"], _account: PositionsByFactoryParams["_account"], _factory: PositionsByFactoryParams["_factory"]) {
        return this.eth_call(functions.positionsByFactory, {_limit, _offset, _account, _factory})
    }

    epochsLatest(_limit: EpochsLatestParams["_limit"], _offset: EpochsLatestParams["_offset"]) {
        return this.eth_call(functions.epochsLatest, {_limit, _offset})
    }

    epochsByAddress(_limit: EpochsByAddressParams["_limit"], _offset: EpochsByAddressParams["_offset"], _address: EpochsByAddressParams["_address"]) {
        return this.eth_call(functions.epochsByAddress, {_limit, _offset, _address})
    }

    rewards(_limit: RewardsParams["_limit"], _offset: RewardsParams["_offset"], _venft_id: RewardsParams["_venft_id"]) {
        return this.eth_call(functions.rewards, {_limit, _offset, _venft_id})
    }

    rewardsByAddress(_venft_id: RewardsByAddressParams["_venft_id"], _pool: RewardsByAddressParams["_pool"]) {
        return this.eth_call(functions.rewardsByAddress, {_venft_id, _pool})
    }

    MAX_FACTORIES() {
        return this.eth_call(functions.MAX_FACTORIES, {})
    }

    MAX_POOLS() {
        return this.eth_call(functions.MAX_POOLS, {})
    }

    MAX_TOKENS() {
        return this.eth_call(functions.MAX_TOKENS, {})
    }

    MAX_LPS() {
        return this.eth_call(functions.MAX_LPS, {})
    }

    MAX_EPOCHS() {
        return this.eth_call(functions.MAX_EPOCHS, {})
    }

    MAX_REWARDS() {
        return this.eth_call(functions.MAX_REWARDS, {})
    }

    MAX_POSITIONS() {
        return this.eth_call(functions.MAX_POSITIONS, {})
    }

    WEEK() {
        return this.eth_call(functions.WEEK, {})
    }

    registry() {
        return this.eth_call(functions.registry, {})
    }

    voter() {
        return this.eth_call(functions.voter, {})
    }

    convertor() {
        return this.eth_call(functions.convertor, {})
    }

    cl_helper() {
        return this.eth_call(functions.cl_helper, {})
    }
}

/// Function types
export type ForSwapsParams = FunctionArguments<typeof functions.forSwaps>
export type ForSwapsReturn = FunctionReturn<typeof functions.forSwaps>

export type TokensParams = FunctionArguments<typeof functions.tokens>
export type TokensReturn = FunctionReturn<typeof functions.tokens>

export type AllParams = FunctionArguments<typeof functions.all>
export type AllReturn = FunctionReturn<typeof functions.all>

export type ByIndexParams = FunctionArguments<typeof functions.byIndex>
export type ByIndexReturn = FunctionReturn<typeof functions.byIndex>

export type PositionsParams = FunctionArguments<typeof functions.positions>
export type PositionsReturn = FunctionReturn<typeof functions.positions>

export type PositionsByFactoryParams = FunctionArguments<typeof functions.positionsByFactory>
export type PositionsByFactoryReturn = FunctionReturn<typeof functions.positionsByFactory>

export type EpochsLatestParams = FunctionArguments<typeof functions.epochsLatest>
export type EpochsLatestReturn = FunctionReturn<typeof functions.epochsLatest>

export type EpochsByAddressParams = FunctionArguments<typeof functions.epochsByAddress>
export type EpochsByAddressReturn = FunctionReturn<typeof functions.epochsByAddress>

export type RewardsParams = FunctionArguments<typeof functions.rewards>
export type RewardsReturn = FunctionReturn<typeof functions.rewards>

export type RewardsByAddressParams = FunctionArguments<typeof functions.rewardsByAddress>
export type RewardsByAddressReturn = FunctionReturn<typeof functions.rewardsByAddress>

export type MAX_FACTORIESParams = FunctionArguments<typeof functions.MAX_FACTORIES>
export type MAX_FACTORIESReturn = FunctionReturn<typeof functions.MAX_FACTORIES>

export type MAX_POOLSParams = FunctionArguments<typeof functions.MAX_POOLS>
export type MAX_POOLSReturn = FunctionReturn<typeof functions.MAX_POOLS>

export type MAX_TOKENSParams = FunctionArguments<typeof functions.MAX_TOKENS>
export type MAX_TOKENSReturn = FunctionReturn<typeof functions.MAX_TOKENS>

export type MAX_LPSParams = FunctionArguments<typeof functions.MAX_LPS>
export type MAX_LPSReturn = FunctionReturn<typeof functions.MAX_LPS>

export type MAX_EPOCHSParams = FunctionArguments<typeof functions.MAX_EPOCHS>
export type MAX_EPOCHSReturn = FunctionReturn<typeof functions.MAX_EPOCHS>

export type MAX_REWARDSParams = FunctionArguments<typeof functions.MAX_REWARDS>
export type MAX_REWARDSReturn = FunctionReturn<typeof functions.MAX_REWARDS>

export type MAX_POSITIONSParams = FunctionArguments<typeof functions.MAX_POSITIONS>
export type MAX_POSITIONSReturn = FunctionReturn<typeof functions.MAX_POSITIONS>

export type WEEKParams = FunctionArguments<typeof functions.WEEK>
export type WEEKReturn = FunctionReturn<typeof functions.WEEK>

export type RegistryParams = FunctionArguments<typeof functions.registry>
export type RegistryReturn = FunctionReturn<typeof functions.registry>

export type VoterParams = FunctionArguments<typeof functions.voter>
export type VoterReturn = FunctionReturn<typeof functions.voter>

export type ConvertorParams = FunctionArguments<typeof functions.convertor>
export type ConvertorReturn = FunctionReturn<typeof functions.convertor>

export type Cl_helperParams = FunctionArguments<typeof functions.cl_helper>
export type Cl_helperReturn = FunctionReturn<typeof functions.cl_helper>

