import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './base-reward-pool-4626.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Approval: new LogEvent<([owner: string, spender: string, value: bigint] & {owner: string, spender: string, value: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    Deposit: new LogEvent<([caller: string, owner: string, assets: bigint, shares: bigint] & {caller: string, owner: string, assets: bigint, shares: bigint})>(
        abi, '0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7'
    ),
    RewardAdded: new LogEvent<([reward: bigint] & {reward: bigint})>(
        abi, '0xde88a922e0d3b88b24e9623efeb464919c6bf9f66857a65e2bfcf2ce87a9433d'
    ),
    RewardPaid: new LogEvent<([user: string, reward: bigint] & {user: string, reward: bigint})>(
        abi, '0xe2403640ba68fed3a2f88b7557551d1993f84b99bb10ff833f0cf8db0c5e0486'
    ),
    Staked: new LogEvent<([user: string, amount: bigint] & {user: string, amount: bigint})>(
        abi, '0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d'
    ),
    Transfer: new LogEvent<([from: string, to: string, value: bigint] & {from: string, to: string, value: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
    Withdraw: new LogEvent<([caller: string, receiver: string, owner: string, assets: bigint, shares: bigint] & {caller: string, receiver: string, owner: string, assets: bigint, shares: bigint})>(
        abi, '0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db'
    ),
    Withdrawn: new LogEvent<([user: string, amount: bigint] & {user: string, amount: bigint})>(
        abi, '0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5'
    ),
}

export const functions = {
    addExtraReward: new Func<[_reward: string], {_reward: string}, boolean>(
        abi, '0x5e43c47b'
    ),
    allowance: new Func<[owner: string, spender: string], {owner: string, spender: string}, bigint>(
        abi, '0xdd62ed3e'
    ),
    approve: new Func<[spender: string, amount: bigint], {spender: string, amount: bigint}, boolean>(
        abi, '0x095ea7b3'
    ),
    asset: new Func<[], {}, string>(
        abi, '0x38d52e0f'
    ),
    balanceOf: new Func<[account: string], {account: string}, bigint>(
        abi, '0x70a08231'
    ),
    clearExtraRewards: new Func<[], {}, []>(
        abi, '0x0569d388'
    ),
    convertToAssets: new Func<[shares: bigint], {shares: bigint}, bigint>(
        abi, '0x07a2d13a'
    ),
    convertToShares: new Func<[assets: bigint], {assets: bigint}, bigint>(
        abi, '0xc6e6f592'
    ),
    currentRewards: new Func<[], {}, bigint>(
        abi, '0x901a7d53'
    ),
    decimals: new Func<[], {}, number>(
        abi, '0x313ce567'
    ),
    deposit: new Func<[assets: bigint, receiver: string], {assets: bigint, receiver: string}, bigint>(
        abi, '0x6e553f65'
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
    maxDeposit: new Func<[_: string], {}, bigint>(
        abi, '0x402d267d'
    ),
    maxMint: new Func<[owner: string], {owner: string}, bigint>(
        abi, '0xc63d75b6'
    ),
    maxRedeem: new Func<[owner: string], {owner: string}, bigint>(
        abi, '0xd905777e'
    ),
    maxWithdraw: new Func<[owner: string], {owner: string}, bigint>(
        abi, '0xce96cb77'
    ),
    mint: new Func<[shares: bigint, receiver: string], {shares: bigint, receiver: string}, bigint>(
        abi, '0x94bf804d'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
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
    previewDeposit: new Func<[assets: bigint], {assets: bigint}, bigint>(
        abi, '0xef8b30f7'
    ),
    previewMint: new Func<[shares: bigint], {shares: bigint}, bigint>(
        abi, '0xb3d7f6b9'
    ),
    previewRedeem: new Func<[shares: bigint], {shares: bigint}, bigint>(
        abi, '0x4cdad506'
    ),
    previewWithdraw: new Func<[assets: bigint], {assets: bigint}, bigint>(
        abi, '0x0a28a477'
    ),
    processIdleRewards: new Func<[], {}, []>(
        abi, '0x3e8b83e3'
    ),
    queueNewRewards: new Func<[_rewards: bigint], {_rewards: bigint}, boolean>(
        abi, '0x590a41f5'
    ),
    queuedRewards: new Func<[], {}, bigint>(
        abi, '0x63d38c3b'
    ),
    redeem: new Func<[shares: bigint, receiver: string, owner: string], {shares: bigint, receiver: string, owner: string}, bigint>(
        abi, '0xba087652'
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
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    totalAssets: new Func<[], {}, bigint>(
        abi, '0x01e1d114'
    ),
    totalSupply: new Func<[], {}, bigint>(
        abi, '0x18160ddd'
    ),
    transfer: new Func<[_: string, _: bigint], {}, boolean>(
        abi, '0xa9059cbb'
    ),
    transferFrom: new Func<[_: string, _: string, _: bigint], {}, boolean>(
        abi, '0x23b872dd'
    ),
    userRewardPerTokenPaid: new Func<[_: string], {}, bigint>(
        abi, '0x8b876347'
    ),
    'withdraw(uint256,bool)': new Func<[amount: bigint, claim: boolean], {amount: bigint, claim: boolean}, boolean>(
        abi, '0x38d07436'
    ),
    'withdraw(uint256,address,address)': new Func<[assets: bigint, receiver: string, owner: string], {assets: bigint, receiver: string, owner: string}, bigint>(
        abi, '0xb460af94'
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

    allowance(owner: string, spender: string): Promise<bigint> {
        return this.eth_call(functions.allowance, [owner, spender])
    }

    asset(): Promise<string> {
        return this.eth_call(functions.asset, [])
    }

    balanceOf(account: string): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [account])
    }

    convertToAssets(shares: bigint): Promise<bigint> {
        return this.eth_call(functions.convertToAssets, [shares])
    }

    convertToShares(assets: bigint): Promise<bigint> {
        return this.eth_call(functions.convertToShares, [assets])
    }

    currentRewards(): Promise<bigint> {
        return this.eth_call(functions.currentRewards, [])
    }

    decimals(): Promise<number> {
        return this.eth_call(functions.decimals, [])
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

    maxDeposit(arg0: string): Promise<bigint> {
        return this.eth_call(functions.maxDeposit, [arg0])
    }

    maxMint(owner: string): Promise<bigint> {
        return this.eth_call(functions.maxMint, [owner])
    }

    maxRedeem(owner: string): Promise<bigint> {
        return this.eth_call(functions.maxRedeem, [owner])
    }

    maxWithdraw(owner: string): Promise<bigint> {
        return this.eth_call(functions.maxWithdraw, [owner])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
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

    previewDeposit(assets: bigint): Promise<bigint> {
        return this.eth_call(functions.previewDeposit, [assets])
    }

    previewMint(shares: bigint): Promise<bigint> {
        return this.eth_call(functions.previewMint, [shares])
    }

    previewRedeem(shares: bigint): Promise<bigint> {
        return this.eth_call(functions.previewRedeem, [shares])
    }

    previewWithdraw(assets: bigint): Promise<bigint> {
        return this.eth_call(functions.previewWithdraw, [assets])
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

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    totalAssets(): Promise<bigint> {
        return this.eth_call(functions.totalAssets, [])
    }

    totalSupply(): Promise<bigint> {
        return this.eth_call(functions.totalSupply, [])
    }

    userRewardPerTokenPaid(arg0: string): Promise<bigint> {
        return this.eth_call(functions.userRewardPerTokenPaid, [arg0])
    }
}
