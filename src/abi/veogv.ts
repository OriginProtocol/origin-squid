import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './veogv.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Approval: new LogEvent<([owner: string, spender: string, value: bigint] & {owner: string, spender: string, value: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    DelegateChanged: new LogEvent<([delegator: string, fromDelegate: string, toDelegate: string] & {delegator: string, fromDelegate: string, toDelegate: string})>(
        abi, '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f'
    ),
    DelegateVotesChanged: new LogEvent<([delegate: string, previousBalance: bigint, newBalance: bigint] & {delegate: string, previousBalance: bigint, newBalance: bigint})>(
        abi, '0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724'
    ),
    Reward: new LogEvent<([user: string, amount: bigint] & {user: string, amount: bigint})>(
        abi, '0x619caafabdd75649b302ba8419e48cccf64f37f1983ac4727cfb38b57703ffc9'
    ),
    Stake: new LogEvent<([user: string, lockupId: bigint, amount: bigint, end: bigint, points: bigint] & {user: string, lockupId: bigint, amount: bigint, end: bigint, points: bigint})>(
        abi, '0x2720efa4b2dd4f3f8a347da3cbd290a522e9432da9072c5b8e6300496fdde282'
    ),
    Transfer: new LogEvent<([from: string, to: string, value: bigint] & {from: string, to: string, value: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
    Unstake: new LogEvent<([user: string, lockupId: bigint, amount: bigint, end: bigint, points: bigint] & {user: string, lockupId: bigint, amount: bigint, end: bigint, points: bigint})>(
        abi, '0x05b744e3e9358bc00ba3cc0c6606a4d6536134dba00b2d2ee4b5de169acd6427'
    ),
}

export const functions = {
    DOMAIN_SEPARATOR: new Func<[], {}, string>(
        abi, '0x3644e515'
    ),
    accRewardPerShare: new Func<[], {}, bigint>(
        abi, '0x939d6237'
    ),
    allowance: new Func<[owner: string, spender: string], {owner: string, spender: string}, bigint>(
        abi, '0xdd62ed3e'
    ),
    approve: new Func<[spender: string, amount: bigint], {spender: string, amount: bigint}, boolean>(
        abi, '0x095ea7b3'
    ),
    balanceOf: new Func<[account: string], {account: string}, bigint>(
        abi, '0x70a08231'
    ),
    checkpoints: new Func<[account: string, pos: number], {account: string, pos: number}, ([fromBlock: number, votes: bigint] & {fromBlock: number, votes: bigint})>(
        abi, '0xf1127ed8'
    ),
    collectRewards: new Func<[], {}, []>(
        abi, '0x70bb45b3'
    ),
    decimals: new Func<[], {}, number>(
        abi, '0x313ce567'
    ),
    decreaseAllowance: new Func<[spender: string, subtractedValue: bigint], {spender: string, subtractedValue: bigint}, boolean>(
        abi, '0xa457c2d7'
    ),
    delegate: new Func<[delegatee: string], {delegatee: string}, []>(
        abi, '0x5c19a95c'
    ),
    delegateBySig: new Func<[delegatee: string, nonce: bigint, expiry: bigint, v: number, r: string, s: string], {delegatee: string, nonce: bigint, expiry: bigint, v: number, r: string, s: string}, []>(
        abi, '0xc3cda520'
    ),
    delegates: new Func<[account: string], {account: string}, string>(
        abi, '0x587cde1e'
    ),
    epoch: new Func<[], {}, bigint>(
        abi, '0x900cf0cf'
    ),
    extend: new Func<[lockupId: bigint, duration: bigint], {lockupId: bigint, duration: bigint}, []>(
        abi, '0xc89258db'
    ),
    getPastTotalSupply: new Func<[blockNumber: bigint], {blockNumber: bigint}, bigint>(
        abi, '0x8e539e8c'
    ),
    getPastVotes: new Func<[account: string, blockNumber: bigint], {account: string, blockNumber: bigint}, bigint>(
        abi, '0x3a46b1a8'
    ),
    getVotes: new Func<[account: string], {account: string}, bigint>(
        abi, '0x9ab24eb0'
    ),
    hasDelegationSet: new Func<[_: string], {}, boolean>(
        abi, '0x0348dbf1'
    ),
    increaseAllowance: new Func<[spender: string, addedValue: bigint], {spender: string, addedValue: bigint}, boolean>(
        abi, '0x39509351'
    ),
    lockups: new Func<[_: string, _: bigint], {}, ([amount: bigint, end: bigint, points: bigint] & {amount: bigint, end: bigint, points: bigint})>(
        abi, '0xc93d0b1e'
    ),
    minStakeDuration: new Func<[], {}, bigint>(
        abi, '0x5fec5c64'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    nonces: new Func<[owner: string], {owner: string}, bigint>(
        abi, '0x7ecebe00'
    ),
    numCheckpoints: new Func<[account: string], {account: string}, number>(
        abi, '0x6fcfff45'
    ),
    ogv: new Func<[], {}, string>(
        abi, '0x142561cf'
    ),
    permit: new Func<[owner: string, spender: string, value: bigint, deadline: bigint, v: number, r: string, s: string], {owner: string, spender: string, value: bigint, deadline: bigint, v: number, r: string, s: string}, []>(
        abi, '0xd505accf'
    ),
    previewPoints: new Func<[amount: bigint, duration: bigint], {amount: bigint, duration: bigint}, [_: bigint, _: bigint]>(
        abi, '0x4fd0e648'
    ),
    previewRewards: new Func<[user: string], {user: string}, bigint>(
        abi, '0xf166e920'
    ),
    rewardDebtPerShare: new Func<[_: string], {}, bigint>(
        abi, '0x4423bf57'
    ),
    rewardsSource: new Func<[], {}, string>(
        abi, '0xf7240d2f'
    ),
    'stake(uint256,uint256,address)': new Func<[amount: bigint, duration: bigint, to: string], {amount: bigint, duration: bigint, to: string}, []>(
        abi, '0x7628a37d'
    ),
    'stake(uint256,uint256)': new Func<[amount: bigint, duration: bigint], {amount: bigint, duration: bigint}, []>(
        abi, '0x7b0472f0'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
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
    unstake: new Func<[lockupId: bigint], {lockupId: bigint}, []>(
        abi, '0x2e17de78'
    ),
}

export class Contract extends ContractBase {

    DOMAIN_SEPARATOR(): Promise<string> {
        return this.eth_call(functions.DOMAIN_SEPARATOR, [])
    }

    accRewardPerShare(): Promise<bigint> {
        return this.eth_call(functions.accRewardPerShare, [])
    }

    allowance(owner: string, spender: string): Promise<bigint> {
        return this.eth_call(functions.allowance, [owner, spender])
    }

    balanceOf(account: string): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [account])
    }

    checkpoints(account: string, pos: number): Promise<([fromBlock: number, votes: bigint] & {fromBlock: number, votes: bigint})> {
        return this.eth_call(functions.checkpoints, [account, pos])
    }

    decimals(): Promise<number> {
        return this.eth_call(functions.decimals, [])
    }

    delegates(account: string): Promise<string> {
        return this.eth_call(functions.delegates, [account])
    }

    epoch(): Promise<bigint> {
        return this.eth_call(functions.epoch, [])
    }

    getPastTotalSupply(blockNumber: bigint): Promise<bigint> {
        return this.eth_call(functions.getPastTotalSupply, [blockNumber])
    }

    getPastVotes(account: string, blockNumber: bigint): Promise<bigint> {
        return this.eth_call(functions.getPastVotes, [account, blockNumber])
    }

    getVotes(account: string): Promise<bigint> {
        return this.eth_call(functions.getVotes, [account])
    }

    hasDelegationSet(arg0: string): Promise<boolean> {
        return this.eth_call(functions.hasDelegationSet, [arg0])
    }

    lockups(arg0: string, arg1: bigint): Promise<([amount: bigint, end: bigint, points: bigint] & {amount: bigint, end: bigint, points: bigint})> {
        return this.eth_call(functions.lockups, [arg0, arg1])
    }

    minStakeDuration(): Promise<bigint> {
        return this.eth_call(functions.minStakeDuration, [])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    nonces(owner: string): Promise<bigint> {
        return this.eth_call(functions.nonces, [owner])
    }

    numCheckpoints(account: string): Promise<number> {
        return this.eth_call(functions.numCheckpoints, [account])
    }

    ogv(): Promise<string> {
        return this.eth_call(functions.ogv, [])
    }

    previewPoints(amount: bigint, duration: bigint): Promise<[_: bigint, _: bigint]> {
        return this.eth_call(functions.previewPoints, [amount, duration])
    }

    previewRewards(user: string): Promise<bigint> {
        return this.eth_call(functions.previewRewards, [user])
    }

    rewardDebtPerShare(arg0: string): Promise<bigint> {
        return this.eth_call(functions.rewardDebtPerShare, [arg0])
    }

    rewardsSource(): Promise<string> {
        return this.eth_call(functions.rewardsSource, [])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    totalSupply(): Promise<bigint> {
        return this.eth_call(functions.totalSupply, [])
    }
}
