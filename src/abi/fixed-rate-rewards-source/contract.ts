import { ContractBase } from '../abi.support.js'
import { collectRewards, governor, isGovernor, previewRewards, rewardConfig, rewardToken, rewardsTarget, strategistAddr } from './functions.js'

export class Contract extends ContractBase {
    collectRewards() {
        return this.eth_call(collectRewards, {})
    }

    governor() {
        return this.eth_call(governor, {})
    }

    isGovernor() {
        return this.eth_call(isGovernor, {})
    }

    previewRewards() {
        return this.eth_call(previewRewards, {})
    }

    rewardConfig() {
        return this.eth_call(rewardConfig, {})
    }

    rewardToken() {
        return this.eth_call(rewardToken, {})
    }

    rewardsTarget() {
        return this.eth_call(rewardsTarget, {})
    }

    strategistAddr() {
        return this.eth_call(strategistAddr, {})
    }
}
