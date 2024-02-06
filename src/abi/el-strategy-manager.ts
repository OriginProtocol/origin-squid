import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './el-strategy-manager.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Deposit: new LogEvent<([depositor: string, token: string, strategy: string, shares: bigint] & {depositor: string, token: string, strategy: string, shares: bigint})>(
        abi, '0x7cfff908a4b583f36430b25d75964c458d8ede8a99bd61be750e97ee1b2f3a96'
    ),
    Initialized: new LogEvent<([version: number] & {version: number})>(
        abi, '0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498'
    ),
    OwnershipTransferred: new LogEvent<([previousOwner: string, newOwner: string] & {previousOwner: string, newOwner: string})>(
        abi, '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0'
    ),
    Paused: new LogEvent<([account: string, newPausedStatus: bigint] & {account: string, newPausedStatus: bigint})>(
        abi, '0xab40a374bc51de372200a8bc981af8c9ecdc08dfdaef0bb6e09f88f3c616ef3d'
    ),
    PauserRegistrySet: new LogEvent<([pauserRegistry: string, newPauserRegistry: string] & {pauserRegistry: string, newPauserRegistry: string})>(
        abi, '0x6e9fcd539896fca60e8b0f01dd580233e48a6b0f7df013b89ba7f565869acdb6'
    ),
    ShareWithdrawalQueued: new LogEvent<([depositor: string, nonce: bigint, strategy: string, shares: bigint] & {depositor: string, nonce: bigint, strategy: string, shares: bigint})>(
        abi, '0xcf1c2370141bbd0a6d971beb0e3a2455f24d6e773ddc20ccc1c4e32f3dd9f9f7'
    ),
    StrategyAddedToDepositWhitelist: new LogEvent<([strategy: string] & {strategy: string})>(
        abi, '0x0c35b17d91c96eb2751cd456e1252f42a386e524ef9ff26ecc9950859fdc04fe'
    ),
    StrategyRemovedFromDepositWhitelist: new LogEvent<([strategy: string] & {strategy: string})>(
        abi, '0x4074413b4b443e4e58019f2855a8765113358c7c72e39509c6af45fc0f5ba030'
    ),
    StrategyWhitelisterChanged: new LogEvent<([previousAddress: string, newAddress: string] & {previousAddress: string, newAddress: string})>(
        abi, '0x4264275e593955ff9d6146a51a4525f6ddace2e81db9391abcc9d1ca48047d29'
    ),
    Unpaused: new LogEvent<([account: string, newPausedStatus: bigint] & {account: string, newPausedStatus: bigint})>(
        abi, '0x3582d1828e26bf56bd801502bc021ac0bc8afb57c826e4986b45593c8fad389c'
    ),
    WithdrawalCompleted: new LogEvent<([depositor: string, nonce: bigint, withdrawer: string, withdrawalRoot: string] & {depositor: string, nonce: bigint, withdrawer: string, withdrawalRoot: string})>(
        abi, '0xe7eb0ca11b83744ece3d78e9be01b913425fbae70c32ce27726d0ecde92ef8d2'
    ),
    WithdrawalDelayBlocksSet: new LogEvent<([previousValue: bigint, newValue: bigint] & {previousValue: bigint, newValue: bigint})>(
        abi, '0x4ffb00400574147429ee377a5633386321e66d45d8b14676014b5fa393e61e9e'
    ),
    WithdrawalQueued: new LogEvent<([depositor: string, nonce: bigint, withdrawer: string, delegatedAddress: string, withdrawalRoot: string] & {depositor: string, nonce: bigint, withdrawer: string, delegatedAddress: string, withdrawalRoot: string})>(
        abi, '0x32cf9fc97155f52860a59a99879a2e89c1e53f28126a9ab6a2ff29344299e674'
    ),
}

export const functions = {
    DEPOSIT_TYPEHASH: new Func<[], {}, string>(
        abi, '0x48825e94'
    ),
    DOMAIN_SEPARATOR: new Func<[], {}, string>(
        abi, '0x3644e515'
    ),
    DOMAIN_TYPEHASH: new Func<[], {}, string>(
        abi, '0x20606b70'
    ),
    MAX_WITHDRAWAL_DELAY_BLOCKS: new Func<[], {}, bigint>(
        abi, '0xca661c04'
    ),
    addStrategiesToDepositWhitelist: new Func<[strategiesToWhitelist: Array<string>], {strategiesToWhitelist: Array<string>}, []>(
        abi, '0x5de08ff2'
    ),
    beaconChainETHSharesToDecrementOnWithdrawal: new Func<[_: string], {}, bigint>(
        abi, '0x8b88b915'
    ),
    beaconChainETHStrategy: new Func<[], {}, string>(
        abi, '0x9104c319'
    ),
    calculateWithdrawalRoot: new Func<[queuedWithdrawal: ([strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string] & {strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string})], {queuedWithdrawal: ([strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string] & {strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string})}, string>(
        abi, '0xb43b514b'
    ),
    completeQueuedWithdrawal: new Func<[queuedWithdrawal: ([strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string] & {strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string}), tokens: Array<string>, middlewareTimesIndex: bigint, receiveAsTokens: boolean], {queuedWithdrawal: ([strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string] & {strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string}), tokens: Array<string>, middlewareTimesIndex: bigint, receiveAsTokens: boolean}, []>(
        abi, '0xf3be65d3'
    ),
    completeQueuedWithdrawals: new Func<[queuedWithdrawals: Array<([strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string] & {strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string})>, tokens: Array<Array<string>>, middlewareTimesIndexes: Array<bigint>, receiveAsTokens: Array<boolean>], {queuedWithdrawals: Array<([strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string] & {strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string})>, tokens: Array<Array<string>>, middlewareTimesIndexes: Array<bigint>, receiveAsTokens: Array<boolean>}, []>(
        abi, '0xa782d945'
    ),
    delegation: new Func<[], {}, string>(
        abi, '0xdf5cf723'
    ),
    depositBeaconChainETH: new Func<[staker: string, amount: bigint], {staker: string, amount: bigint}, []>(
        abi, '0x9f00fa24'
    ),
    depositIntoStrategy: new Func<[strategy: string, token: string, amount: bigint], {strategy: string, token: string, amount: bigint}, bigint>(
        abi, '0xe7a050aa'
    ),
    depositIntoStrategyWithSignature: new Func<[strategy: string, token: string, amount: bigint, staker: string, expiry: bigint, signature: string], {strategy: string, token: string, amount: bigint, staker: string, expiry: bigint, signature: string}, bigint>(
        abi, '0x32e89ace'
    ),
    eigenPodManager: new Func<[], {}, string>(
        abi, '0x4665bcda'
    ),
    getDeposits: new Func<[depositor: string], {depositor: string}, [_: Array<string>, _: Array<bigint>]>(
        abi, '0x94f649dd'
    ),
    initialize: new Func<[initialOwner: string, initialStrategyWhitelister: string, _pauserRegistry: string, initialPausedStatus: bigint, _withdrawalDelayBlocks: bigint], {initialOwner: string, initialStrategyWhitelister: string, _pauserRegistry: string, initialPausedStatus: bigint, _withdrawalDelayBlocks: bigint}, []>(
        abi, '0xa6b63eb8'
    ),
    nonces: new Func<[_: string], {}, bigint>(
        abi, '0x7ecebe00'
    ),
    numWithdrawalsQueued: new Func<[_: string], {}, bigint>(
        abi, '0x56631028'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    pause: new Func<[newPausedStatus: bigint], {newPausedStatus: bigint}, []>(
        abi, '0x136439dd'
    ),
    pauseAll: new Func<[], {}, []>(
        abi, '0x595c6a67'
    ),
    'paused(uint8)': new Func<[index: number], {index: number}, boolean>(
        abi, '0x5ac86ab7'
    ),
    'paused()': new Func<[], {}, bigint>(
        abi, '0x5c975abb'
    ),
    pauserRegistry: new Func<[], {}, string>(
        abi, '0x886f1195'
    ),
    queueWithdrawal: new Func<[strategyIndexes: Array<bigint>, strategies: Array<string>, shares: Array<bigint>, withdrawer: string, undelegateIfPossible: boolean], {strategyIndexes: Array<bigint>, strategies: Array<string>, shares: Array<bigint>, withdrawer: string, undelegateIfPossible: boolean}, string>(
        abi, '0xf123991e'
    ),
    recordOvercommittedBeaconChainETH: new Func<[overcommittedPodOwner: string, beaconChainETHStrategyIndex: bigint, amount: bigint], {overcommittedPodOwner: string, beaconChainETHStrategyIndex: bigint, amount: bigint}, []>(
        abi, '0x63ecafb6'
    ),
    removeStrategiesFromDepositWhitelist: new Func<[strategiesToRemoveFromWhitelist: Array<string>], {strategiesToRemoveFromWhitelist: Array<string>}, []>(
        abi, '0xb5d8b5b8'
    ),
    renounceOwnership: new Func<[], {}, []>(
        abi, '0x715018a6'
    ),
    setPauserRegistry: new Func<[newPauserRegistry: string], {newPauserRegistry: string}, []>(
        abi, '0x10d67a2f'
    ),
    setStrategyWhitelister: new Func<[newStrategyWhitelister: string], {newStrategyWhitelister: string}, []>(
        abi, '0xc6656702'
    ),
    setWithdrawalDelayBlocks: new Func<[_withdrawalDelayBlocks: bigint], {_withdrawalDelayBlocks: bigint}, []>(
        abi, '0x4d50f9a4'
    ),
    slashQueuedWithdrawal: new Func<[recipient: string, queuedWithdrawal: ([strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string] & {strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string}), tokens: Array<string>, indicesToSkip: Array<bigint>], {recipient: string, queuedWithdrawal: ([strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string] & {strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string}), tokens: Array<string>, indicesToSkip: Array<bigint>}, []>(
        abi, '0x43c09061'
    ),
    slashShares: new Func<[slashedAddress: string, recipient: string, strategies: Array<string>, tokens: Array<string>, strategyIndexes: Array<bigint>, shareAmounts: Array<bigint>], {slashedAddress: string, recipient: string, strategies: Array<string>, tokens: Array<string>, strategyIndexes: Array<bigint>, shareAmounts: Array<bigint>}, []>(
        abi, '0x06f1f684'
    ),
    slasher: new Func<[], {}, string>(
        abi, '0xb1344271'
    ),
    stakerStrategyList: new Func<[_: string, _: bigint], {}, string>(
        abi, '0xcbc2bd62'
    ),
    stakerStrategyListLength: new Func<[staker: string], {staker: string}, bigint>(
        abi, '0x8b8aac3c'
    ),
    stakerStrategyShares: new Func<[_: string, _: string], {}, bigint>(
        abi, '0x7a7e0d92'
    ),
    strategyIsWhitelistedForDeposit: new Func<[_: string], {}, boolean>(
        abi, '0x663c1de4'
    ),
    strategyWhitelister: new Func<[], {}, string>(
        abi, '0x967fc0d2'
    ),
    transferOwnership: new Func<[newOwner: string], {newOwner: string}, []>(
        abi, '0xf2fde38b'
    ),
    undelegate: new Func<[], {}, []>(
        abi, '0x92ab89bb'
    ),
    unpause: new Func<[newPausedStatus: bigint], {newPausedStatus: bigint}, []>(
        abi, '0xfabc1cbc'
    ),
    withdrawalDelayBlocks: new Func<[], {}, bigint>(
        abi, '0x50f73e7c'
    ),
    withdrawalRootPending: new Func<[_: string], {}, boolean>(
        abi, '0xc3c6b3a9'
    ),
}

export class Contract extends ContractBase {

    DEPOSIT_TYPEHASH(): Promise<string> {
        return this.eth_call(functions.DEPOSIT_TYPEHASH, [])
    }

    DOMAIN_SEPARATOR(): Promise<string> {
        return this.eth_call(functions.DOMAIN_SEPARATOR, [])
    }

    DOMAIN_TYPEHASH(): Promise<string> {
        return this.eth_call(functions.DOMAIN_TYPEHASH, [])
    }

    MAX_WITHDRAWAL_DELAY_BLOCKS(): Promise<bigint> {
        return this.eth_call(functions.MAX_WITHDRAWAL_DELAY_BLOCKS, [])
    }

    beaconChainETHSharesToDecrementOnWithdrawal(arg0: string): Promise<bigint> {
        return this.eth_call(functions.beaconChainETHSharesToDecrementOnWithdrawal, [arg0])
    }

    beaconChainETHStrategy(): Promise<string> {
        return this.eth_call(functions.beaconChainETHStrategy, [])
    }

    calculateWithdrawalRoot(queuedWithdrawal: ([strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string] & {strategies: Array<string>, shares: Array<bigint>, depositor: string, withdrawerAndNonce: ([withdrawer: string, nonce: bigint] & {withdrawer: string, nonce: bigint}), withdrawalStartBlock: number, delegatedAddress: string})): Promise<string> {
        return this.eth_call(functions.calculateWithdrawalRoot, [queuedWithdrawal])
    }

    delegation(): Promise<string> {
        return this.eth_call(functions.delegation, [])
    }

    eigenPodManager(): Promise<string> {
        return this.eth_call(functions.eigenPodManager, [])
    }

    getDeposits(depositor: string): Promise<[_: Array<string>, _: Array<bigint>]> {
        return this.eth_call(functions.getDeposits, [depositor])
    }

    nonces(arg0: string): Promise<bigint> {
        return this.eth_call(functions.nonces, [arg0])
    }

    numWithdrawalsQueued(arg0: string): Promise<bigint> {
        return this.eth_call(functions.numWithdrawalsQueued, [arg0])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    'paused(uint8)'(index: number): Promise<boolean> {
        return this.eth_call(functions['paused(uint8)'], [index])
    }

    'paused()'(): Promise<bigint> {
        return this.eth_call(functions['paused()'], [])
    }

    pauserRegistry(): Promise<string> {
        return this.eth_call(functions.pauserRegistry, [])
    }

    slasher(): Promise<string> {
        return this.eth_call(functions.slasher, [])
    }

    stakerStrategyList(arg0: string, arg1: bigint): Promise<string> {
        return this.eth_call(functions.stakerStrategyList, [arg0, arg1])
    }

    stakerStrategyListLength(staker: string): Promise<bigint> {
        return this.eth_call(functions.stakerStrategyListLength, [staker])
    }

    stakerStrategyShares(arg0: string, arg1: string): Promise<bigint> {
        return this.eth_call(functions.stakerStrategyShares, [arg0, arg1])
    }

    strategyIsWhitelistedForDeposit(arg0: string): Promise<boolean> {
        return this.eth_call(functions.strategyIsWhitelistedForDeposit, [arg0])
    }

    strategyWhitelister(): Promise<string> {
        return this.eth_call(functions.strategyWhitelister, [])
    }

    withdrawalDelayBlocks(): Promise<bigint> {
        return this.eth_call(functions.withdrawalDelayBlocks, [])
    }

    withdrawalRootPending(arg0: string): Promise<boolean> {
        return this.eth_call(functions.withdrawalRootPending, [arg0])
    }
}
