import { ContractBase } from '../abi.support.js'
import { MAX_FEE, accessHub, allPairs, allPairsLength, createPair, fee, feeRecipientFactory, feeSplit, feeSplitWhenNoGauge, getPair, isPair, pairCodeHash, pairFee, skimEnabled, treasury, voter } from './functions.js'
import type { AllPairsParams, CreatePairParams, GetPairParams, IsPairParams, PairFeeParams, SkimEnabledParams } from './functions.js'

export class Contract extends ContractBase {
    MAX_FEE() {
        return this.eth_call(MAX_FEE, {})
    }

    accessHub() {
        return this.eth_call(accessHub, {})
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

    fee() {
        return this.eth_call(fee, {})
    }

    feeRecipientFactory() {
        return this.eth_call(feeRecipientFactory, {})
    }

    feeSplit() {
        return this.eth_call(feeSplit, {})
    }

    feeSplitWhenNoGauge() {
        return this.eth_call(feeSplitWhenNoGauge, {})
    }

    getPair(token0: GetPairParams["token0"], token1: GetPairParams["token1"], stable: GetPairParams["stable"]) {
        return this.eth_call(getPair, {token0, token1, stable})
    }

    isPair(pair: IsPairParams["pair"]) {
        return this.eth_call(isPair, {pair})
    }

    pairCodeHash() {
        return this.eth_call(pairCodeHash, {})
    }

    pairFee(_pair: PairFeeParams["_pair"]) {
        return this.eth_call(pairFee, {_pair})
    }

    skimEnabled(pair: SkimEnabledParams["pair"]) {
        return this.eth_call(skimEnabled, {pair})
    }

    treasury() {
        return this.eth_call(treasury, {})
    }

    voter() {
        return this.eth_call(voter, {})
    }
}
