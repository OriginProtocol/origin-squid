import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    FeeSplitWhenNoGauge: event("0x09f29919de9bbce805ed8b6088457163a7508940470e70a1c67a8d58a70b433d", "FeeSplitWhenNoGauge(address,bool)", {"_caller": indexed(p.address), "_status": indexed(p.bool)}),
    NewTreasury: event("0x567657fa3f286518b318f4a29870674f433f622fdfc819691acb13105b228225", "NewTreasury(address,address)", {"_caller": indexed(p.address), "_newTreasury": indexed(p.address)}),
    PairCreated: event("0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9", "PairCreated(address,address,address,uint256)", {"token0": indexed(p.address), "token1": indexed(p.address), "pair": p.address, "_3": p.uint256}),
    SetFee: event("0x00172ddfc5ae88d08b3de01a5a187667c37a5a53989e8c175055cb6c993792a7", "SetFee(uint256)", {"fee": indexed(p.uint256)}),
    SetFeeRecipient: event("0xd9d6b85b6d670cd443496fc6d03390f739bbff47f96a8e33fb0cdd52ad26f5c2", "SetFeeRecipient(address,address)", {"pair": indexed(p.address), "feeRecipient": indexed(p.address)}),
    SetFeeSplit: event("0x2b29780fbcadbddb5194d8c2c6a834e1cd71e5a38456738fb1c9d39c7821066b", "SetFeeSplit(uint256)", {"_feeSplit": indexed(p.uint256)}),
    SetPairFee: event("0xc792b1e9d2b63c63a75f8146a0b5bd7f568bdd6a0b97b9c31d585398718d4c46", "SetPairFee(address,uint256)", {"pair": indexed(p.address), "fee": indexed(p.uint256)}),
    SetPairFeeSplit: event("0x40c433a8082166fcd8218fba9d4247bb08e03016d0056fc857d6363673ded031", "SetPairFeeSplit(address,uint256)", {"pair": indexed(p.address), "_feeSplit": indexed(p.uint256)}),
    SkimStatus: event("0x13af6400168c56d7a03760d35e1d3d7e60d3f86c654d857e5c77ed8a83ffc119", "SkimStatus(address,bool)", {"_pair": indexed(p.address), "_status": indexed(p.bool)}),
}

export const functions = {
    MAX_FEE: viewFun("0xbc063e1a", "MAX_FEE()", {}, p.uint256),
    accessHub: viewFun("0xe7589b39", "accessHub()", {}, p.address),
    allPairs: viewFun("0x1e3dd18b", "allPairs(uint256)", {"_0": p.uint256}, p.address),
    allPairsLength: viewFun("0x574f2ba3", "allPairsLength()", {}, p.uint256),
    createPair: fun("0x82dfdce4", "createPair(address,address,bool)", {"tokenA": p.address, "tokenB": p.address, "stable": p.bool}, p.address),
    fee: viewFun("0xddca3f43", "fee()", {}, p.uint256),
    feeRecipientFactory: viewFun("0xd32af6c1", "feeRecipientFactory()", {}, p.address),
    feeSplit: viewFun("0x6373ea69", "feeSplit()", {}, p.uint256),
    feeSplitWhenNoGauge: viewFun("0x83b274f2", "feeSplitWhenNoGauge()", {}, p.bool),
    getPair: viewFun("0x6801cc30", "getPair(address,address,bool)", {"token0": p.address, "token1": p.address, "stable": p.bool}, p.address),
    isPair: viewFun("0xe5e31b13", "isPair(address)", {"pair": p.address}, p.bool),
    pairCodeHash: viewFun("0x9aab9248", "pairCodeHash()", {}, p.bytes32),
    pairFee: viewFun("0x841fa66b", "pairFee(address)", {"_pair": p.address}, p.uint256),
    setFee: fun("0x69fe0e2d", "setFee(uint256)", {"_fee": p.uint256}, ),
    setFeeRecipient: fun("0x270401cb", "setFeeRecipient(address,address)", {"_pair": p.address, "_feeRecipient": p.address}, ),
    setFeeSplit: fun("0xcd962a06", "setFeeSplit(uint256)", {"_feeSplit": p.uint256}, ),
    setFeeSplitWhenNoGauge: fun("0x90291058", "setFeeSplitWhenNoGauge(bool)", {"status": p.bool}, ),
    setPairFee: fun("0xa93a897d", "setPairFee(address,uint256)", {"_pair": p.address, "_fee": p.uint256}, ),
    setPairFeeSplit: fun("0x407c301e", "setPairFeeSplit(address,uint256)", {"_pair": p.address, "_feeSplit": p.uint256}, ),
    setSkimEnabled: fun("0xe0bd111d", "setSkimEnabled(address,bool)", {"_pair": p.address, "_status": p.bool}, ),
    setTreasury: fun("0xf0f44260", "setTreasury(address)", {"_treasury": p.address}, ),
    skimEnabled: viewFun("0xd2b66384", "skimEnabled(address)", {"pair": p.address}, p.bool),
    treasury: viewFun("0x61d027b3", "treasury()", {}, p.address),
    voter: viewFun("0x46c96aac", "voter()", {}, p.address),
}

export class Contract extends ContractBase {

    MAX_FEE() {
        return this.eth_call(functions.MAX_FEE, {})
    }

    accessHub() {
        return this.eth_call(functions.accessHub, {})
    }

    allPairs(_0: AllPairsParams["_0"]) {
        return this.eth_call(functions.allPairs, {_0})
    }

    allPairsLength() {
        return this.eth_call(functions.allPairsLength, {})
    }

    fee() {
        return this.eth_call(functions.fee, {})
    }

    feeRecipientFactory() {
        return this.eth_call(functions.feeRecipientFactory, {})
    }

    feeSplit() {
        return this.eth_call(functions.feeSplit, {})
    }

    feeSplitWhenNoGauge() {
        return this.eth_call(functions.feeSplitWhenNoGauge, {})
    }

    getPair(token0: GetPairParams["token0"], token1: GetPairParams["token1"], stable: GetPairParams["stable"]) {
        return this.eth_call(functions.getPair, {token0, token1, stable})
    }

    isPair(pair: IsPairParams["pair"]) {
        return this.eth_call(functions.isPair, {pair})
    }

    pairCodeHash() {
        return this.eth_call(functions.pairCodeHash, {})
    }

    pairFee(_pair: PairFeeParams["_pair"]) {
        return this.eth_call(functions.pairFee, {_pair})
    }

    skimEnabled(pair: SkimEnabledParams["pair"]) {
        return this.eth_call(functions.skimEnabled, {pair})
    }

    treasury() {
        return this.eth_call(functions.treasury, {})
    }

    voter() {
        return this.eth_call(functions.voter, {})
    }
}

/// Event types
export type FeeSplitWhenNoGaugeEventArgs = EParams<typeof events.FeeSplitWhenNoGauge>
export type NewTreasuryEventArgs = EParams<typeof events.NewTreasury>
export type PairCreatedEventArgs = EParams<typeof events.PairCreated>
export type SetFeeEventArgs = EParams<typeof events.SetFee>
export type SetFeeRecipientEventArgs = EParams<typeof events.SetFeeRecipient>
export type SetFeeSplitEventArgs = EParams<typeof events.SetFeeSplit>
export type SetPairFeeEventArgs = EParams<typeof events.SetPairFee>
export type SetPairFeeSplitEventArgs = EParams<typeof events.SetPairFeeSplit>
export type SkimStatusEventArgs = EParams<typeof events.SkimStatus>

/// Function types
export type MAX_FEEParams = FunctionArguments<typeof functions.MAX_FEE>
export type MAX_FEEReturn = FunctionReturn<typeof functions.MAX_FEE>

export type AccessHubParams = FunctionArguments<typeof functions.accessHub>
export type AccessHubReturn = FunctionReturn<typeof functions.accessHub>

export type AllPairsParams = FunctionArguments<typeof functions.allPairs>
export type AllPairsReturn = FunctionReturn<typeof functions.allPairs>

export type AllPairsLengthParams = FunctionArguments<typeof functions.allPairsLength>
export type AllPairsLengthReturn = FunctionReturn<typeof functions.allPairsLength>

export type CreatePairParams = FunctionArguments<typeof functions.createPair>
export type CreatePairReturn = FunctionReturn<typeof functions.createPair>

export type FeeParams = FunctionArguments<typeof functions.fee>
export type FeeReturn = FunctionReturn<typeof functions.fee>

export type FeeRecipientFactoryParams = FunctionArguments<typeof functions.feeRecipientFactory>
export type FeeRecipientFactoryReturn = FunctionReturn<typeof functions.feeRecipientFactory>

export type FeeSplitParams = FunctionArguments<typeof functions.feeSplit>
export type FeeSplitReturn = FunctionReturn<typeof functions.feeSplit>

export type FeeSplitWhenNoGaugeParams = FunctionArguments<typeof functions.feeSplitWhenNoGauge>
export type FeeSplitWhenNoGaugeReturn = FunctionReturn<typeof functions.feeSplitWhenNoGauge>

export type GetPairParams = FunctionArguments<typeof functions.getPair>
export type GetPairReturn = FunctionReturn<typeof functions.getPair>

export type IsPairParams = FunctionArguments<typeof functions.isPair>
export type IsPairReturn = FunctionReturn<typeof functions.isPair>

export type PairCodeHashParams = FunctionArguments<typeof functions.pairCodeHash>
export type PairCodeHashReturn = FunctionReturn<typeof functions.pairCodeHash>

export type PairFeeParams = FunctionArguments<typeof functions.pairFee>
export type PairFeeReturn = FunctionReturn<typeof functions.pairFee>

export type SetFeeParams = FunctionArguments<typeof functions.setFee>
export type SetFeeReturn = FunctionReturn<typeof functions.setFee>

export type SetFeeRecipientParams = FunctionArguments<typeof functions.setFeeRecipient>
export type SetFeeRecipientReturn = FunctionReturn<typeof functions.setFeeRecipient>

export type SetFeeSplitParams = FunctionArguments<typeof functions.setFeeSplit>
export type SetFeeSplitReturn = FunctionReturn<typeof functions.setFeeSplit>

export type SetFeeSplitWhenNoGaugeParams = FunctionArguments<typeof functions.setFeeSplitWhenNoGauge>
export type SetFeeSplitWhenNoGaugeReturn = FunctionReturn<typeof functions.setFeeSplitWhenNoGauge>

export type SetPairFeeParams = FunctionArguments<typeof functions.setPairFee>
export type SetPairFeeReturn = FunctionReturn<typeof functions.setPairFee>

export type SetPairFeeSplitParams = FunctionArguments<typeof functions.setPairFeeSplit>
export type SetPairFeeSplitReturn = FunctionReturn<typeof functions.setPairFeeSplit>

export type SetSkimEnabledParams = FunctionArguments<typeof functions.setSkimEnabled>
export type SetSkimEnabledReturn = FunctionReturn<typeof functions.setSkimEnabled>

export type SetTreasuryParams = FunctionArguments<typeof functions.setTreasury>
export type SetTreasuryReturn = FunctionReturn<typeof functions.setTreasury>

export type SkimEnabledParams = FunctionArguments<typeof functions.skimEnabled>
export type SkimEnabledReturn = FunctionReturn<typeof functions.skimEnabled>

export type TreasuryParams = FunctionArguments<typeof functions.treasury>
export type TreasuryReturn = FunctionReturn<typeof functions.treasury>

export type VoterParams = FunctionArguments<typeof functions.voter>
export type VoterReturn = FunctionReturn<typeof functions.voter>

