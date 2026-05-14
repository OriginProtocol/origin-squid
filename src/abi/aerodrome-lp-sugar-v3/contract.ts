import { ContractBase } from '../abi.support.js'
import { MAX_EPOCHS, MAX_FACTORIES, MAX_LPS, MAX_POOLS, MAX_POSITIONS, MAX_REWARDS, MAX_TOKENS, WEEK, all, byIndex, cl_helper, convertor, epochsByAddress, epochsLatest, forSwaps, positions, positionsByFactory, registry, rewards, rewardsByAddress, tokens, voter } from './functions.js'
import type { AllParams, ByIndexParams, EpochsByAddressParams, EpochsLatestParams, ForSwapsParams, PositionsByFactoryParams, PositionsParams, RewardsByAddressParams, RewardsParams, TokensParams } from './functions.js'

export class Contract extends ContractBase {
    forSwaps(_limit: ForSwapsParams["_limit"], _offset: ForSwapsParams["_offset"]) {
        return this.eth_call(forSwaps, {_limit, _offset})
    }

    tokens(_limit: TokensParams["_limit"], _offset: TokensParams["_offset"], _account: TokensParams["_account"], _addresses: TokensParams["_addresses"]) {
        return this.eth_call(tokens, {_limit, _offset, _account, _addresses})
    }

    all(_limit: AllParams["_limit"], _offset: AllParams["_offset"]) {
        return this.eth_call(all, {_limit, _offset})
    }

    byIndex(_index: ByIndexParams["_index"]) {
        return this.eth_call(byIndex, {_index})
    }

    positions(_limit: PositionsParams["_limit"], _offset: PositionsParams["_offset"], _account: PositionsParams["_account"]) {
        return this.eth_call(positions, {_limit, _offset, _account})
    }

    positionsByFactory(_limit: PositionsByFactoryParams["_limit"], _offset: PositionsByFactoryParams["_offset"], _account: PositionsByFactoryParams["_account"], _factory: PositionsByFactoryParams["_factory"]) {
        return this.eth_call(positionsByFactory, {_limit, _offset, _account, _factory})
    }

    epochsLatest(_limit: EpochsLatestParams["_limit"], _offset: EpochsLatestParams["_offset"]) {
        return this.eth_call(epochsLatest, {_limit, _offset})
    }

    epochsByAddress(_limit: EpochsByAddressParams["_limit"], _offset: EpochsByAddressParams["_offset"], _address: EpochsByAddressParams["_address"]) {
        return this.eth_call(epochsByAddress, {_limit, _offset, _address})
    }

    rewards(_limit: RewardsParams["_limit"], _offset: RewardsParams["_offset"], _venft_id: RewardsParams["_venft_id"]) {
        return this.eth_call(rewards, {_limit, _offset, _venft_id})
    }

    rewardsByAddress(_venft_id: RewardsByAddressParams["_venft_id"], _pool: RewardsByAddressParams["_pool"]) {
        return this.eth_call(rewardsByAddress, {_venft_id, _pool})
    }

    MAX_FACTORIES() {
        return this.eth_call(MAX_FACTORIES, {})
    }

    MAX_POOLS() {
        return this.eth_call(MAX_POOLS, {})
    }

    MAX_TOKENS() {
        return this.eth_call(MAX_TOKENS, {})
    }

    MAX_LPS() {
        return this.eth_call(MAX_LPS, {})
    }

    MAX_EPOCHS() {
        return this.eth_call(MAX_EPOCHS, {})
    }

    MAX_REWARDS() {
        return this.eth_call(MAX_REWARDS, {})
    }

    MAX_POSITIONS() {
        return this.eth_call(MAX_POSITIONS, {})
    }

    WEEK() {
        return this.eth_call(WEEK, {})
    }

    registry() {
        return this.eth_call(registry, {})
    }

    voter() {
        return this.eth_call(voter, {})
    }

    convertor() {
        return this.eth_call(convertor, {})
    }

    cl_helper() {
        return this.eth_call(cl_helper, {})
    }
}
