import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AmpUpdateStarted: event("0x1835882ee7a34ac194f717a35e09bb1d24c82a3b9d854ab6c9749525b714cdf2", "AmpUpdateStarted(uint256,uint256,uint256,uint256)", {"startValue": p.uint256, "endValue": p.uint256, "startTime": p.uint256, "endTime": p.uint256}),
    AmpUpdateStopped: event("0xa0d01593e47e69d07e0ccd87bece09411e07dd1ed40ca8f2e7af2976542a0233", "AmpUpdateStopped(uint256)", {"currentValue": p.uint256}),
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    PausedStateChanged: event("0x9e3a5e37224532dea67b89face185703738a228a6e8a23dee546960180d3be64", "PausedStateChanged(bool)", {"paused": p.bool}),
    ProtocolFeePercentageCacheUpdated: event("0x6bfb689528fa96ec1ad670ad6d6064be1ae96bfd5d2ee35c837fd0fe0c11959a", "ProtocolFeePercentageCacheUpdated(uint256,uint256)", {"feeType": indexed(p.uint256), "protocolFeePercentage": p.uint256}),
    RecoveryModeStateChanged: event("0xeff3d4d215b42bf0960be9c6d5e05c22cba4df6627a3a523e2acee733b5854c8", "RecoveryModeStateChanged(bool)", {"enabled": p.bool}),
    SwapFeePercentageChanged: event("0xa9ba3ffe0b6c366b81232caab38605a0699ad5398d6cce76f91ee809e322dafc", "SwapFeePercentageChanged(uint256)", {"swapFeePercentage": p.uint256}),
    TokenRateCacheUpdated: event("0xb77a83204ca282e08dc3a65b0a1ca32ea4e6875c38ef0bf5bf75e52a67354fac", "TokenRateCacheUpdated(uint256,uint256)", {"tokenIndex": indexed(p.uint256), "rate": p.uint256}),
    TokenRateProviderSet: event("0xdd6d1c9badb346de6925b358a472c937b41698d2632696759e43fd6527feeec4", "TokenRateProviderSet(uint256,address,uint256)", {"tokenIndex": indexed(p.uint256), "provider": indexed(p.address), "cacheDuration": p.uint256}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "value": p.uint256}),
}

export const functions = {
    DELEGATE_PROTOCOL_SWAP_FEES_SENTINEL: viewFun("0xddf4627b", "DELEGATE_PROTOCOL_SWAP_FEES_SENTINEL()", {}, p.uint256),
    DOMAIN_SEPARATOR: viewFun("0x3644e515", "DOMAIN_SEPARATOR()", {}, p.bytes32),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"owner": p.address, "spender": p.address}, p.uint256),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"spender": p.address, "amount": p.uint256}, p.bool),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"account": p.address}, p.uint256),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    decreaseAllowance: fun("0xa457c2d7", "decreaseAllowance(address,uint256)", {"spender": p.address, "amount": p.uint256}, p.bool),
    disableRecoveryMode: fun("0xb7b814fc", "disableRecoveryMode()", {}, ),
    enableRecoveryMode: fun("0x54a844ba", "enableRecoveryMode()", {}, ),
    getActionId: viewFun("0x851c1bb3", "getActionId(bytes4)", {"selector": p.bytes4}, p.bytes32),
    getActualSupply: viewFun("0x876f303b", "getActualSupply()", {}, p.uint256),
    getAmplificationParameter: viewFun("0x6daccffa", "getAmplificationParameter()", {}, {"value": p.uint256, "isUpdating": p.bool, "precision": p.uint256}),
    getAuthorizer: viewFun("0xaaabadc5", "getAuthorizer()", {}, p.address),
    getBptIndex: viewFun("0x82687a56", "getBptIndex()", {}, p.uint256),
    getDomainSeparator: viewFun("0xed24911d", "getDomainSeparator()", {}, p.bytes32),
    getLastJoinExitData: viewFun("0x3c975d51", "getLastJoinExitData()", {}, {"lastJoinExitAmplification": p.uint256, "lastPostJoinExitInvariant": p.uint256}),
    getMinimumBpt: viewFun("0x04842d4c", "getMinimumBpt()", {}, p.uint256),
    getNextNonce: viewFun("0x90193b7c", "getNextNonce(address)", {"account": p.address}, p.uint256),
    getOwner: viewFun("0x893d20e8", "getOwner()", {}, p.address),
    getPausedState: viewFun("0x1c0de051", "getPausedState()", {}, {"paused": p.bool, "pauseWindowEndTime": p.uint256, "bufferPeriodEndTime": p.uint256}),
    getPoolId: viewFun("0x38fff2d0", "getPoolId()", {}, p.bytes32),
    getProtocolFeePercentageCache: viewFun("0x70464016", "getProtocolFeePercentageCache(uint256)", {"feeType": p.uint256}, p.uint256),
    getProtocolFeesCollector: viewFun("0xd2946c2b", "getProtocolFeesCollector()", {}, p.address),
    getProtocolSwapFeeDelegation: viewFun("0x15b0015b", "getProtocolSwapFeeDelegation()", {}, p.bool),
    getRate: viewFun("0x679aefce", "getRate()", {}, p.uint256),
    getRateProviders: viewFun("0x238a2d59", "getRateProviders()", {}, p.array(p.address)),
    getScalingFactors: viewFun("0x1dd746ea", "getScalingFactors()", {}, p.array(p.uint256)),
    getSwapFeePercentage: viewFun("0x55c67628", "getSwapFeePercentage()", {}, p.uint256),
    getTokenRate: viewFun("0x54dea00a", "getTokenRate(address)", {"token": p.address}, p.uint256),
    getTokenRateCache: viewFun("0x7f1260d1", "getTokenRateCache(address)", {"token": p.address}, {"rate": p.uint256, "oldRate": p.uint256, "duration": p.uint256, "expires": p.uint256}),
    getVault: viewFun("0x8d928af8", "getVault()", {}, p.address),
    inRecoveryMode: viewFun("0xb35056b8", "inRecoveryMode()", {}, p.bool),
    increaseAllowance: fun("0x39509351", "increaseAllowance(address,uint256)", {"spender": p.address, "addedValue": p.uint256}, p.bool),
    isExemptFromYieldProtocolFee: viewFun("0x77151bee", "isExemptFromYieldProtocolFee()", {}, p.bool),
    isTokenExemptFromYieldProtocolFee: viewFun("0xab7759f1", "isTokenExemptFromYieldProtocolFee(address)", {"token": p.address}, p.bool),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    nonces: viewFun("0x7ecebe00", "nonces(address)", {"owner": p.address}, p.uint256),
    onExitPool: fun("0x74f3b009", "onExitPool(bytes32,address,address,uint256[],uint256,uint256,bytes)", {"poolId": p.bytes32, "sender": p.address, "recipient": p.address, "balances": p.array(p.uint256), "lastChangeBlock": p.uint256, "protocolSwapFeePercentage": p.uint256, "userData": p.bytes}, {"_0": p.array(p.uint256), "_1": p.array(p.uint256)}),
    onJoinPool: fun("0xd5c096c4", "onJoinPool(bytes32,address,address,uint256[],uint256,uint256,bytes)", {"poolId": p.bytes32, "sender": p.address, "recipient": p.address, "balances": p.array(p.uint256), "lastChangeBlock": p.uint256, "protocolSwapFeePercentage": p.uint256, "userData": p.bytes}, {"_0": p.array(p.uint256), "_1": p.array(p.uint256)}),
    onSwap: fun("0x01ec954a", "onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256[],uint256,uint256)", {"swapRequest": p.struct({"kind": p.uint8, "tokenIn": p.address, "tokenOut": p.address, "amount": p.uint256, "poolId": p.bytes32, "lastChangeBlock": p.uint256, "from": p.address, "to": p.address, "userData": p.bytes}), "balances": p.array(p.uint256), "indexIn": p.uint256, "indexOut": p.uint256}, p.uint256),
    pause: fun("0x8456cb59", "pause()", {}, ),
    permit: fun("0xd505accf", "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)", {"owner": p.address, "spender": p.address, "value": p.uint256, "deadline": p.uint256, "v": p.uint8, "r": p.bytes32, "s": p.bytes32}, ),
    queryExit: fun("0x6028bfd4", "queryExit(bytes32,address,address,uint256[],uint256,uint256,bytes)", {"poolId": p.bytes32, "sender": p.address, "recipient": p.address, "balances": p.array(p.uint256), "lastChangeBlock": p.uint256, "protocolSwapFeePercentage": p.uint256, "userData": p.bytes}, {"bptIn": p.uint256, "amountsOut": p.array(p.uint256)}),
    queryJoin: fun("0x87ec6817", "queryJoin(bytes32,address,address,uint256[],uint256,uint256,bytes)", {"poolId": p.bytes32, "sender": p.address, "recipient": p.address, "balances": p.array(p.uint256), "lastChangeBlock": p.uint256, "protocolSwapFeePercentage": p.uint256, "userData": p.bytes}, {"bptOut": p.uint256, "amountsIn": p.array(p.uint256)}),
    setAssetManagerPoolConfig: fun("0x50dd6ed9", "setAssetManagerPoolConfig(address,bytes)", {"token": p.address, "poolConfig": p.bytes}, ),
    setSwapFeePercentage: fun("0x38e9922e", "setSwapFeePercentage(uint256)", {"swapFeePercentage": p.uint256}, ),
    setTokenRateCacheDuration: fun("0xf4b7964d", "setTokenRateCacheDuration(address,uint256)", {"token": p.address, "duration": p.uint256}, ),
    startAmplificationParameterUpdate: fun("0x2f1a0bc9", "startAmplificationParameterUpdate(uint256,uint256)", {"rawEndValue": p.uint256, "endTime": p.uint256}, ),
    stopAmplificationParameterUpdate: fun("0xeb0f24d6", "stopAmplificationParameterUpdate()", {}, ),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"recipient": p.address, "amount": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"sender": p.address, "recipient": p.address, "amount": p.uint256}, p.bool),
    unpause: fun("0x3f4ba83a", "unpause()", {}, ),
    updateProtocolFeePercentageCache: fun("0x0da0669c", "updateProtocolFeePercentageCache()", {}, ),
    updateTokenRateCache: fun("0x2df2c7c0", "updateTokenRateCache(address)", {"token": p.address}, ),
    version: viewFun("0x54fd4d50", "version()", {}, p.string),
}

export class Contract extends ContractBase {

    DELEGATE_PROTOCOL_SWAP_FEES_SENTINEL() {
        return this.eth_call(functions.DELEGATE_PROTOCOL_SWAP_FEES_SENTINEL, {})
    }

    DOMAIN_SEPARATOR() {
        return this.eth_call(functions.DOMAIN_SEPARATOR, {})
    }

    allowance(owner: AllowanceParams["owner"], spender: AllowanceParams["spender"]) {
        return this.eth_call(functions.allowance, {owner, spender})
    }

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(functions.balanceOf, {account})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    getActionId(selector: GetActionIdParams["selector"]) {
        return this.eth_call(functions.getActionId, {selector})
    }

    getActualSupply() {
        return this.eth_call(functions.getActualSupply, {})
    }

    getAmplificationParameter() {
        return this.eth_call(functions.getAmplificationParameter, {})
    }

    getAuthorizer() {
        return this.eth_call(functions.getAuthorizer, {})
    }

    getBptIndex() {
        return this.eth_call(functions.getBptIndex, {})
    }

    getDomainSeparator() {
        return this.eth_call(functions.getDomainSeparator, {})
    }

    getLastJoinExitData() {
        return this.eth_call(functions.getLastJoinExitData, {})
    }

    getMinimumBpt() {
        return this.eth_call(functions.getMinimumBpt, {})
    }

    getNextNonce(account: GetNextNonceParams["account"]) {
        return this.eth_call(functions.getNextNonce, {account})
    }

    getOwner() {
        return this.eth_call(functions.getOwner, {})
    }

    getPausedState() {
        return this.eth_call(functions.getPausedState, {})
    }

    getPoolId() {
        return this.eth_call(functions.getPoolId, {})
    }

    getProtocolFeePercentageCache(feeType: GetProtocolFeePercentageCacheParams["feeType"]) {
        return this.eth_call(functions.getProtocolFeePercentageCache, {feeType})
    }

    getProtocolFeesCollector() {
        return this.eth_call(functions.getProtocolFeesCollector, {})
    }

    getProtocolSwapFeeDelegation() {
        return this.eth_call(functions.getProtocolSwapFeeDelegation, {})
    }

    getRate() {
        return this.eth_call(functions.getRate, {})
    }

    getRateProviders() {
        return this.eth_call(functions.getRateProviders, {})
    }

    getScalingFactors() {
        return this.eth_call(functions.getScalingFactors, {})
    }

    getSwapFeePercentage() {
        return this.eth_call(functions.getSwapFeePercentage, {})
    }

    getTokenRate(token: GetTokenRateParams["token"]) {
        return this.eth_call(functions.getTokenRate, {token})
    }

    getTokenRateCache(token: GetTokenRateCacheParams["token"]) {
        return this.eth_call(functions.getTokenRateCache, {token})
    }

    getVault() {
        return this.eth_call(functions.getVault, {})
    }

    inRecoveryMode() {
        return this.eth_call(functions.inRecoveryMode, {})
    }

    isExemptFromYieldProtocolFee() {
        return this.eth_call(functions.isExemptFromYieldProtocolFee, {})
    }

    isTokenExemptFromYieldProtocolFee(token: IsTokenExemptFromYieldProtocolFeeParams["token"]) {
        return this.eth_call(functions.isTokenExemptFromYieldProtocolFee, {token})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    nonces(owner: NoncesParams["owner"]) {
        return this.eth_call(functions.nonces, {owner})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    version() {
        return this.eth_call(functions.version, {})
    }
}

/// Event types
export type AmpUpdateStartedEventArgs = EParams<typeof events.AmpUpdateStarted>
export type AmpUpdateStoppedEventArgs = EParams<typeof events.AmpUpdateStopped>
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type PausedStateChangedEventArgs = EParams<typeof events.PausedStateChanged>
export type ProtocolFeePercentageCacheUpdatedEventArgs = EParams<typeof events.ProtocolFeePercentageCacheUpdated>
export type RecoveryModeStateChangedEventArgs = EParams<typeof events.RecoveryModeStateChanged>
export type SwapFeePercentageChangedEventArgs = EParams<typeof events.SwapFeePercentageChanged>
export type TokenRateCacheUpdatedEventArgs = EParams<typeof events.TokenRateCacheUpdated>
export type TokenRateProviderSetEventArgs = EParams<typeof events.TokenRateProviderSet>
export type TransferEventArgs = EParams<typeof events.Transfer>

/// Function types
export type DELEGATE_PROTOCOL_SWAP_FEES_SENTINELParams = FunctionArguments<typeof functions.DELEGATE_PROTOCOL_SWAP_FEES_SENTINEL>
export type DELEGATE_PROTOCOL_SWAP_FEES_SENTINELReturn = FunctionReturn<typeof functions.DELEGATE_PROTOCOL_SWAP_FEES_SENTINEL>

export type DOMAIN_SEPARATORParams = FunctionArguments<typeof functions.DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof functions.DOMAIN_SEPARATOR>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DecreaseAllowanceParams = FunctionArguments<typeof functions.decreaseAllowance>
export type DecreaseAllowanceReturn = FunctionReturn<typeof functions.decreaseAllowance>

export type DisableRecoveryModeParams = FunctionArguments<typeof functions.disableRecoveryMode>
export type DisableRecoveryModeReturn = FunctionReturn<typeof functions.disableRecoveryMode>

export type EnableRecoveryModeParams = FunctionArguments<typeof functions.enableRecoveryMode>
export type EnableRecoveryModeReturn = FunctionReturn<typeof functions.enableRecoveryMode>

export type GetActionIdParams = FunctionArguments<typeof functions.getActionId>
export type GetActionIdReturn = FunctionReturn<typeof functions.getActionId>

export type GetActualSupplyParams = FunctionArguments<typeof functions.getActualSupply>
export type GetActualSupplyReturn = FunctionReturn<typeof functions.getActualSupply>

export type GetAmplificationParameterParams = FunctionArguments<typeof functions.getAmplificationParameter>
export type GetAmplificationParameterReturn = FunctionReturn<typeof functions.getAmplificationParameter>

export type GetAuthorizerParams = FunctionArguments<typeof functions.getAuthorizer>
export type GetAuthorizerReturn = FunctionReturn<typeof functions.getAuthorizer>

export type GetBptIndexParams = FunctionArguments<typeof functions.getBptIndex>
export type GetBptIndexReturn = FunctionReturn<typeof functions.getBptIndex>

export type GetDomainSeparatorParams = FunctionArguments<typeof functions.getDomainSeparator>
export type GetDomainSeparatorReturn = FunctionReturn<typeof functions.getDomainSeparator>

export type GetLastJoinExitDataParams = FunctionArguments<typeof functions.getLastJoinExitData>
export type GetLastJoinExitDataReturn = FunctionReturn<typeof functions.getLastJoinExitData>

export type GetMinimumBptParams = FunctionArguments<typeof functions.getMinimumBpt>
export type GetMinimumBptReturn = FunctionReturn<typeof functions.getMinimumBpt>

export type GetNextNonceParams = FunctionArguments<typeof functions.getNextNonce>
export type GetNextNonceReturn = FunctionReturn<typeof functions.getNextNonce>

export type GetOwnerParams = FunctionArguments<typeof functions.getOwner>
export type GetOwnerReturn = FunctionReturn<typeof functions.getOwner>

export type GetPausedStateParams = FunctionArguments<typeof functions.getPausedState>
export type GetPausedStateReturn = FunctionReturn<typeof functions.getPausedState>

export type GetPoolIdParams = FunctionArguments<typeof functions.getPoolId>
export type GetPoolIdReturn = FunctionReturn<typeof functions.getPoolId>

export type GetProtocolFeePercentageCacheParams = FunctionArguments<typeof functions.getProtocolFeePercentageCache>
export type GetProtocolFeePercentageCacheReturn = FunctionReturn<typeof functions.getProtocolFeePercentageCache>

export type GetProtocolFeesCollectorParams = FunctionArguments<typeof functions.getProtocolFeesCollector>
export type GetProtocolFeesCollectorReturn = FunctionReturn<typeof functions.getProtocolFeesCollector>

export type GetProtocolSwapFeeDelegationParams = FunctionArguments<typeof functions.getProtocolSwapFeeDelegation>
export type GetProtocolSwapFeeDelegationReturn = FunctionReturn<typeof functions.getProtocolSwapFeeDelegation>

export type GetRateParams = FunctionArguments<typeof functions.getRate>
export type GetRateReturn = FunctionReturn<typeof functions.getRate>

export type GetRateProvidersParams = FunctionArguments<typeof functions.getRateProviders>
export type GetRateProvidersReturn = FunctionReturn<typeof functions.getRateProviders>

export type GetScalingFactorsParams = FunctionArguments<typeof functions.getScalingFactors>
export type GetScalingFactorsReturn = FunctionReturn<typeof functions.getScalingFactors>

export type GetSwapFeePercentageParams = FunctionArguments<typeof functions.getSwapFeePercentage>
export type GetSwapFeePercentageReturn = FunctionReturn<typeof functions.getSwapFeePercentage>

export type GetTokenRateParams = FunctionArguments<typeof functions.getTokenRate>
export type GetTokenRateReturn = FunctionReturn<typeof functions.getTokenRate>

export type GetTokenRateCacheParams = FunctionArguments<typeof functions.getTokenRateCache>
export type GetTokenRateCacheReturn = FunctionReturn<typeof functions.getTokenRateCache>

export type GetVaultParams = FunctionArguments<typeof functions.getVault>
export type GetVaultReturn = FunctionReturn<typeof functions.getVault>

export type InRecoveryModeParams = FunctionArguments<typeof functions.inRecoveryMode>
export type InRecoveryModeReturn = FunctionReturn<typeof functions.inRecoveryMode>

export type IncreaseAllowanceParams = FunctionArguments<typeof functions.increaseAllowance>
export type IncreaseAllowanceReturn = FunctionReturn<typeof functions.increaseAllowance>

export type IsExemptFromYieldProtocolFeeParams = FunctionArguments<typeof functions.isExemptFromYieldProtocolFee>
export type IsExemptFromYieldProtocolFeeReturn = FunctionReturn<typeof functions.isExemptFromYieldProtocolFee>

export type IsTokenExemptFromYieldProtocolFeeParams = FunctionArguments<typeof functions.isTokenExemptFromYieldProtocolFee>
export type IsTokenExemptFromYieldProtocolFeeReturn = FunctionReturn<typeof functions.isTokenExemptFromYieldProtocolFee>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type NoncesParams = FunctionArguments<typeof functions.nonces>
export type NoncesReturn = FunctionReturn<typeof functions.nonces>

export type OnExitPoolParams = FunctionArguments<typeof functions.onExitPool>
export type OnExitPoolReturn = FunctionReturn<typeof functions.onExitPool>

export type OnJoinPoolParams = FunctionArguments<typeof functions.onJoinPool>
export type OnJoinPoolReturn = FunctionReturn<typeof functions.onJoinPool>

export type OnSwapParams = FunctionArguments<typeof functions.onSwap>
export type OnSwapReturn = FunctionReturn<typeof functions.onSwap>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PermitParams = FunctionArguments<typeof functions.permit>
export type PermitReturn = FunctionReturn<typeof functions.permit>

export type QueryExitParams = FunctionArguments<typeof functions.queryExit>
export type QueryExitReturn = FunctionReturn<typeof functions.queryExit>

export type QueryJoinParams = FunctionArguments<typeof functions.queryJoin>
export type QueryJoinReturn = FunctionReturn<typeof functions.queryJoin>

export type SetAssetManagerPoolConfigParams = FunctionArguments<typeof functions.setAssetManagerPoolConfig>
export type SetAssetManagerPoolConfigReturn = FunctionReturn<typeof functions.setAssetManagerPoolConfig>

export type SetSwapFeePercentageParams = FunctionArguments<typeof functions.setSwapFeePercentage>
export type SetSwapFeePercentageReturn = FunctionReturn<typeof functions.setSwapFeePercentage>

export type SetTokenRateCacheDurationParams = FunctionArguments<typeof functions.setTokenRateCacheDuration>
export type SetTokenRateCacheDurationReturn = FunctionReturn<typeof functions.setTokenRateCacheDuration>

export type StartAmplificationParameterUpdateParams = FunctionArguments<typeof functions.startAmplificationParameterUpdate>
export type StartAmplificationParameterUpdateReturn = FunctionReturn<typeof functions.startAmplificationParameterUpdate>

export type StopAmplificationParameterUpdateParams = FunctionArguments<typeof functions.stopAmplificationParameterUpdate>
export type StopAmplificationParameterUpdateReturn = FunctionReturn<typeof functions.stopAmplificationParameterUpdate>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

export type UpdateProtocolFeePercentageCacheParams = FunctionArguments<typeof functions.updateProtocolFeePercentageCache>
export type UpdateProtocolFeePercentageCacheReturn = FunctionReturn<typeof functions.updateProtocolFeePercentageCache>

export type UpdateTokenRateCacheParams = FunctionArguments<typeof functions.updateTokenRateCache>
export type UpdateTokenRateCacheReturn = FunctionReturn<typeof functions.updateTokenRateCache>

export type VersionParams = FunctionArguments<typeof functions.version>
export type VersionReturn = FunctionReturn<typeof functions.version>

