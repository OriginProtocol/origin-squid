import { ContractBase } from '../abi.support.js'
import { MAX_FEE, MAX_TREASURY_FEE, allPairs, allPairsLength, createPair, dibs, feeManager, getFee, getInitializable, getPair, isPair, isPaused, owner, pairCodeHash, pairs, pendingFeeManager, stableFee, stakingFeeHandler, stakingNFTFee, volatileFee } from './functions.js'
import type { AllPairsParams, CreatePairParams, GetFeeParams, GetPairParams, IsPairParams } from './functions.js'

export class Contract extends ContractBase {
    MAX_FEE() {
        return this.eth_call(MAX_FEE, {})
    }

    MAX_TREASURY_FEE() {
        return this.eth_call(MAX_TREASURY_FEE, {})
    }

    allPairs(_0: AllPairsParams["_0"]) {
        return this.eth_call(allPairs, {_0})
    }

    allPairsLength() {
        return this.eth_call(allPairsLength, {})
    }

    createPair(tokenA: CreatePairParams["tokenA"], tokenB: CreatePairParams["tokenB"], stable: CreatePairParams["stable"]) {
        return this.eth_call(createPair, {tokenA, tokenB, stable})
    }

    dibs() {
        return this.eth_call(dibs, {})
    }

    feeManager() {
        return this.eth_call(feeManager, {})
    }

    getFee(_stable: GetFeeParams["_stable"]) {
        return this.eth_call(getFee, {_stable})
    }

    getInitializable() {
        return this.eth_call(getInitializable, {})
    }

    getPair(_0: GetPairParams["_0"], _1: GetPairParams["_1"], _2: GetPairParams["_2"]) {
        return this.eth_call(getPair, {_0, _1, _2})
    }

    isPair(_0: IsPairParams["_0"]) {
        return this.eth_call(isPair, {_0})
    }

    isPaused() {
        return this.eth_call(isPaused, {})
    }

    owner() {
        return this.eth_call(owner, {})
    }

    pairCodeHash() {
        return this.eth_call(pairCodeHash, {})
    }

    pairs() {
        return this.eth_call(pairs, {})
    }

    pendingFeeManager() {
        return this.eth_call(pendingFeeManager, {})
    }

    stableFee() {
        return this.eth_call(stableFee, {})
    }

    stakingFeeHandler() {
        return this.eth_call(stakingFeeHandler, {})
    }

    stakingNFTFee() {
        return this.eth_call(stakingNFTFee, {})
    }

    volatileFee() {
        return this.eth_call(volatileFee, {})
    }
}
