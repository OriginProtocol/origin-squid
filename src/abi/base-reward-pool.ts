import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './base-reward-pool.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    RewardAdded: new LogEvent<([reward: bigint] & {reward: bigint})>(
        abi, '0xde88a922e0d3b88b24e9623efeb464919c6bf9f66857a65e2bfcf2ce87a9433d'
    ),
    RewardPaid: new LogEvent<([user: string, reward: bigint] & {user: string, reward: bigint})>(
        abi, '0xe2403640ba68fed3a2f88b7557551d1993f84b99bb10ff833f0cf8db0c5e0486'
    ),
    Staked: new LogEvent<([user: string, amount: bigint] & {user: string, amount: bigint})>(
        abi, '0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d'
    ),
    Withdrawn: new LogEvent<([user: string, amount: bigint] & {user: string, amount: bigint})>(
        abi, '0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5'
    ),
}

export const functions = {
    addExtraReward: new Func<[_reward: string], {_reward: string}, boolean>(
        abi, '0x5e43c47b'
    ),
    balanceOf: new Func<[account: string], {account: string}, bigint>(
        abi, '0x70a08231'
    ),
    clearExtraRewards: new Func<[], {}, []>(
        abi, '0x0569d388'
    ),
    currentRewards: new Func<[], {}, bigint>(
        abi, '0x901a7d53'
    ),
    donate: new Func<[_amount: bigint], {_amount: bigint}, boolean>(
        abi, '0xf14faf6f'
    ),
    duration: new Func<[], {}, bigint>(
        abi, '0x0fb5a6b4'
    ),
    earned: new Func<[account: string], {account: string}, bigint>(
        abi, '0x008cc262'
    ),
    extraRewards: new Func<[_: bigint], {}, string>(
        abi, '0x40c35446'
    ),
    extraRewardsLength: new Func<[], {}, bigint>(
        abi, '0xd55a23f4'
    ),
    'getReward()': new Func<[], {}, boolean>(
        abi, '0x3d18b912'
    ),
    'getReward(address,bool)': new Func<[_account: string, _claimExtras: boolean], {_account: string, _claimExtras: boolean}, boolean>(
        abi, '0x7050ccd9'
    ),
    historicalRewards: new Func<[], {}, bigint>(
        abi, '0x262d3d6d'
    ),
    lastTimeRewardApplicable: new Func<[], {}, bigint>(
        abi, '0x80faa57d'
    ),
    lastUpdateTime: new Func<[], {}, bigint>(
        abi, '0xc8f33c91'
    ),
    newRewardRatio: new Func<[], {}, bigint>(
        abi, '0x6c8bcee8'
    ),
    operator: new Func<[], {}, string>(
        abi, '0x570ca735'
    ),
    periodFinish: new Func<[], {}, bigint>(
        abi, '0xebe2b12b'
    ),
    pid: new Func<[], {}, bigint>(
        abi, '0xf1068454'
    ),
    queueNewRewards: new Func<[_rewards: bigint], {_rewards: bigint}, boolean>(
        abi, '0x590a41f5'
    ),
    queuedRewards: new Func<[], {}, bigint>(
        abi, '0x63d38c3b'
    ),
    rewardManager: new Func<[], {}, string>(
        abi, '0x0f4ef8a6'
    ),
    rewardPerToken: new Func<[], {}, bigint>(
        abi, '0xcd3daf9d'
    ),
    rewardPerTokenStored: new Func<[], {}, bigint>(
        abi, '0xdf136d65'
    ),
    rewardRate: new Func<[], {}, bigint>(
        abi, '0x7b0a47ee'
    ),
    rewardToken: new Func<[], {}, string>(
        abi, '0xf7c618c1'
    ),
    rewards: new Func<[_: string], {}, bigint>(
        abi, '0x0700037d'
    ),
    stake: new Func<[_amount: bigint], {_amount: bigint}, boolean>(
        abi, '0xa694fc3a'
    ),
    stakeAll: new Func<[], {}, boolean>(
        abi, '0x8dcb4061'
    ),
    stakeFor: new Func<[_for: string, _amount: bigint], {_for: string, _amount: bigint}, boolean>(
        abi, '0x2ee40908'
    ),
    stakingToken: new Func<[], {}, string>(
        abi, '0x72f702f3'
    ),
    totalSupply: new Func<[], {}, bigint>(
        abi, '0x18160ddd'
    ),
    userRewardPerTokenPaid: new Func<[_: string], {}, bigint>(
        abi, '0x8b876347'
    ),
    withdraw: new Func<[amount: bigint, claim: boolean], {amount: bigint, claim: boolean}, boolean>(
        abi, '0x38d07436'
    ),
    withdrawAll: new Func<[claim: boolean], {claim: boolean}, []>(
        abi, '0x1c1c6fe5'
    ),
    withdrawAllAndUnwrap: new Func<[claim: boolean], {claim: boolean}, []>(
        abi, '0x49f039a2'
    ),
    withdrawAndUnwrap: new Func<[amount: bigint, claim: boolean], {amount: bigint, claim: boolean}, boolean>(
        abi, '0xc32e7202'
    ),
}

export class Contract extends ContractBase {

    balanceOf(account: string): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [account])
    }

    currentRewards(): Promise<bigint> {
        return this.eth_call(functions.currentRewards, [])
    }

    duration(): Promise<bigint> {
        return this.eth_call(functions.duration, [])
    }

    earned(account: string): Promise<bigint> {
        return this.eth_call(functions.earned, [account])
    }

    extraRewards(arg0: bigint): Promise<string> {
        return this.eth_call(functions.extraRewards, [arg0])
    }

    extraRewardsLength(): Promise<bigint> {
        return this.eth_call(functions.extraRewardsLength, [])
    }

    historicalRewards(): Promise<bigint> {
        return this.eth_call(functions.historicalRewards, [])
    }

    lastTimeRewardApplicable(): Promise<bigint> {
        return this.eth_call(functions.lastTimeRewardApplicable, [])
    }

    lastUpdateTime(): Promise<bigint> {
        return this.eth_call(functions.lastUpdateTime, [])
    }

    newRewardRatio(): Promise<bigint> {
        return this.eth_call(functions.newRewardRatio, [])
    }

    operator(): Promise<string> {
        return this.eth_call(functions.operator, [])
    }

    periodFinish(): Promise<bigint> {
        return this.eth_call(functions.periodFinish, [])
    }

    pid(): Promise<bigint> {
        return this.eth_call(functions.pid, [])
    }

    queuedRewards(): Promise<bigint> {
        return this.eth_call(functions.queuedRewards, [])
    }

    rewardManager(): Promise<string> {
        return this.eth_call(functions.rewardManager, [])
    }

    rewardPerToken(): Promise<bigint> {
        return this.eth_call(functions.rewardPerToken, [])
    }

    rewardPerTokenStored(): Promise<bigint> {
        return this.eth_call(functions.rewardPerTokenStored, [])
    }

    rewardRate(): Promise<bigint> {
        return this.eth_call(functions.rewardRate, [])
    }

    rewardToken(): Promise<string> {
        return this.eth_call(functions.rewardToken, [])
    }

    rewards(arg0: string): Promise<bigint> {
        return this.eth_call(functions.rewards, [arg0])
    }

    stakingToken(): Promise<string> {
        return this.eth_call(functions.stakingToken, [])
    }

    totalSupply(): Promise<bigint> {
        return this.eth_call(functions.totalSupply, [])
    }

    userRewardPerTokenPaid(arg0: string): Promise<bigint> {
        return this.eth_call(functions.userRewardPerTokenPaid, [arg0])
    }
}
