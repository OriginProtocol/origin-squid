import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Initialized: event("0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498", "Initialized(uint8)", {"version": p.uint8}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    PairCreated: event("0xc4805696c66d7cf352fc1d6bb633ad5ee82f6cb577c453024b6e0eb8306c6fc9", "PairCreated(address,address,bool,address,uint256)", {"token0": indexed(p.address), "token1": indexed(p.address), "stable": p.bool, "pair": p.address, "_4": p.uint256}),
}

export const functions = {
    MAX_FEE: viewFun("0xbc063e1a", "MAX_FEE()", {}, p.uint256),
    MAX_TREASURY_FEE: viewFun("0xf2b3c809", "MAX_TREASURY_FEE()", {}, p.uint256),
    acceptFeeManager: fun("0xf94c53c7", "acceptFeeManager()", {}, ),
    allPairs: viewFun("0x1e3dd18b", "allPairs(uint256)", {"_0": p.uint256}, p.address),
    allPairsLength: viewFun("0x574f2ba3", "allPairsLength()", {}, p.uint256),
    createPair: fun("0x82dfdce4", "createPair(address,address,bool)", {"tokenA": p.address, "tokenB": p.address, "stable": p.bool}, p.address),
    dibs: viewFun("0x7be1623e", "dibs()", {}, p.address),
    feeManager: viewFun("0xd0fb0203", "feeManager()", {}, p.address),
    getFee: viewFun("0x512b45ea", "getFee(bool)", {"_stable": p.bool}, p.uint256),
    getInitializable: viewFun("0xeb13c4cf", "getInitializable()", {}, {"_0": p.address, "_1": p.address, "_2": p.bool}),
    getPair: viewFun("0x6801cc30", "getPair(address,address,bool)", {"_0": p.address, "_1": p.address, "_2": p.bool}, p.address),
    initialize: fun("0x8129fc1c", "initialize()", {}, ),
    isPair: viewFun("0xe5e31b13", "isPair(address)", {"_0": p.address}, p.bool),
    isPaused: viewFun("0xb187bd26", "isPaused()", {}, p.bool),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    pairCodeHash: viewFun("0x9aab9248", "pairCodeHash()", {}, p.bytes32),
    pairs: viewFun("0xffb0a4a0", "pairs()", {}, p.array(p.address)),
    pendingFeeManager: viewFun("0x8a4fa0d2", "pendingFeeManager()", {}, p.address),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    setDibs: fun("0x0c74db12", "setDibs(address)", {"_dibs": p.address}, ),
    setFee: fun("0xe1f76b44", "setFee(bool,uint256)", {"_stable": p.bool, "_fee": p.uint256}, ),
    setFeeManager: fun("0x472d35b9", "setFeeManager(address)", {"_feeManager": p.address}, ),
    setPause: fun("0xbedb86fb", "setPause(bool)", {"_state": p.bool}, ),
    setStakingFeeAddress: fun("0x4091cb77", "setStakingFeeAddress(address)", {"_feehandler": p.address}, ),
    setStakingFees: fun("0x482a8d07", "setStakingFees(uint256)", {"_newFee": p.uint256}, ),
    setTreasuryFee: fun("0x77e741c7", "setTreasuryFee(uint256)", {"_tresFee": p.uint256}, ),
    stableFee: viewFun("0x40bbd775", "stableFee()", {}, p.uint256),
    stakingFeeHandler: viewFun("0xc124a4a2", "stakingFeeHandler()", {}, p.address),
    stakingNFTFee: viewFun("0x956f94a1", "stakingNFTFee()", {}, p.uint256),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    volatileFee: viewFun("0x5084ed03", "volatileFee()", {}, p.uint256),
}

export class Contract extends ContractBase {

    MAX_FEE() {
        return this.eth_call(functions.MAX_FEE, {})
    }

    MAX_TREASURY_FEE() {
        return this.eth_call(functions.MAX_TREASURY_FEE, {})
    }

    allPairs(_0: AllPairsParams["_0"]) {
        return this.eth_call(functions.allPairs, {_0})
    }

    allPairsLength() {
        return this.eth_call(functions.allPairsLength, {})
    }

    dibs() {
        return this.eth_call(functions.dibs, {})
    }

    feeManager() {
        return this.eth_call(functions.feeManager, {})
    }

    getFee(_stable: GetFeeParams["_stable"]) {
        return this.eth_call(functions.getFee, {_stable})
    }

    getInitializable() {
        return this.eth_call(functions.getInitializable, {})
    }

    getPair(_0: GetPairParams["_0"], _1: GetPairParams["_1"], _2: GetPairParams["_2"]) {
        return this.eth_call(functions.getPair, {_0, _1, _2})
    }

    isPair(_0: IsPairParams["_0"]) {
        return this.eth_call(functions.isPair, {_0})
    }

    isPaused() {
        return this.eth_call(functions.isPaused, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    pairCodeHash() {
        return this.eth_call(functions.pairCodeHash, {})
    }

    pairs() {
        return this.eth_call(functions.pairs, {})
    }

    pendingFeeManager() {
        return this.eth_call(functions.pendingFeeManager, {})
    }

    stableFee() {
        return this.eth_call(functions.stableFee, {})
    }

    stakingFeeHandler() {
        return this.eth_call(functions.stakingFeeHandler, {})
    }

    stakingNFTFee() {
        return this.eth_call(functions.stakingNFTFee, {})
    }

    volatileFee() {
        return this.eth_call(functions.volatileFee, {})
    }
}

/// Event types
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type PairCreatedEventArgs = EParams<typeof events.PairCreated>

/// Function types
export type MAX_FEEParams = FunctionArguments<typeof functions.MAX_FEE>
export type MAX_FEEReturn = FunctionReturn<typeof functions.MAX_FEE>

export type MAX_TREASURY_FEEParams = FunctionArguments<typeof functions.MAX_TREASURY_FEE>
export type MAX_TREASURY_FEEReturn = FunctionReturn<typeof functions.MAX_TREASURY_FEE>

export type AcceptFeeManagerParams = FunctionArguments<typeof functions.acceptFeeManager>
export type AcceptFeeManagerReturn = FunctionReturn<typeof functions.acceptFeeManager>

export type AllPairsParams = FunctionArguments<typeof functions.allPairs>
export type AllPairsReturn = FunctionReturn<typeof functions.allPairs>

export type AllPairsLengthParams = FunctionArguments<typeof functions.allPairsLength>
export type AllPairsLengthReturn = FunctionReturn<typeof functions.allPairsLength>

export type CreatePairParams = FunctionArguments<typeof functions.createPair>
export type CreatePairReturn = FunctionReturn<typeof functions.createPair>

export type DibsParams = FunctionArguments<typeof functions.dibs>
export type DibsReturn = FunctionReturn<typeof functions.dibs>

export type FeeManagerParams = FunctionArguments<typeof functions.feeManager>
export type FeeManagerReturn = FunctionReturn<typeof functions.feeManager>

export type GetFeeParams = FunctionArguments<typeof functions.getFee>
export type GetFeeReturn = FunctionReturn<typeof functions.getFee>

export type GetInitializableParams = FunctionArguments<typeof functions.getInitializable>
export type GetInitializableReturn = FunctionReturn<typeof functions.getInitializable>

export type GetPairParams = FunctionArguments<typeof functions.getPair>
export type GetPairReturn = FunctionReturn<typeof functions.getPair>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsPairParams = FunctionArguments<typeof functions.isPair>
export type IsPairReturn = FunctionReturn<typeof functions.isPair>

export type IsPausedParams = FunctionArguments<typeof functions.isPaused>
export type IsPausedReturn = FunctionReturn<typeof functions.isPaused>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PairCodeHashParams = FunctionArguments<typeof functions.pairCodeHash>
export type PairCodeHashReturn = FunctionReturn<typeof functions.pairCodeHash>

export type PairsParams = FunctionArguments<typeof functions.pairs>
export type PairsReturn = FunctionReturn<typeof functions.pairs>

export type PendingFeeManagerParams = FunctionArguments<typeof functions.pendingFeeManager>
export type PendingFeeManagerReturn = FunctionReturn<typeof functions.pendingFeeManager>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type SetDibsParams = FunctionArguments<typeof functions.setDibs>
export type SetDibsReturn = FunctionReturn<typeof functions.setDibs>

export type SetFeeParams = FunctionArguments<typeof functions.setFee>
export type SetFeeReturn = FunctionReturn<typeof functions.setFee>

export type SetFeeManagerParams = FunctionArguments<typeof functions.setFeeManager>
export type SetFeeManagerReturn = FunctionReturn<typeof functions.setFeeManager>

export type SetPauseParams = FunctionArguments<typeof functions.setPause>
export type SetPauseReturn = FunctionReturn<typeof functions.setPause>

export type SetStakingFeeAddressParams = FunctionArguments<typeof functions.setStakingFeeAddress>
export type SetStakingFeeAddressReturn = FunctionReturn<typeof functions.setStakingFeeAddress>

export type SetStakingFeesParams = FunctionArguments<typeof functions.setStakingFees>
export type SetStakingFeesReturn = FunctionReturn<typeof functions.setStakingFees>

export type SetTreasuryFeeParams = FunctionArguments<typeof functions.setTreasuryFee>
export type SetTreasuryFeeReturn = FunctionReturn<typeof functions.setTreasuryFee>

export type StableFeeParams = FunctionArguments<typeof functions.stableFee>
export type StableFeeReturn = FunctionReturn<typeof functions.stableFee>

export type StakingFeeHandlerParams = FunctionArguments<typeof functions.stakingFeeHandler>
export type StakingFeeHandlerReturn = FunctionReturn<typeof functions.stakingFeeHandler>

export type StakingNFTFeeParams = FunctionArguments<typeof functions.stakingNFTFee>
export type StakingNFTFeeReturn = FunctionReturn<typeof functions.stakingNFTFee>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type VolatileFeeParams = FunctionArguments<typeof functions.volatileFee>
export type VolatileFeeReturn = FunctionReturn<typeof functions.volatileFee>

