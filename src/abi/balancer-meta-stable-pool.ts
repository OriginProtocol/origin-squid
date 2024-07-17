import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AmpUpdateStarted: event("0x1835882ee7a34ac194f717a35e09bb1d24c82a3b9d854ab6c9749525b714cdf2", "AmpUpdateStarted(uint256,uint256,uint256,uint256)", {"startValue": p.uint256, "endValue": p.uint256, "startTime": p.uint256, "endTime": p.uint256}),
    AmpUpdateStopped: event("0xa0d01593e47e69d07e0ccd87bece09411e07dd1ed40ca8f2e7af2976542a0233", "AmpUpdateStopped(uint256)", {"currentValue": p.uint256}),
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    OracleEnabledChanged: event("0x3e350b41e86a8e10f804ade6d35340d620be35569cc75ac943e8bb14ab80ead1", "OracleEnabledChanged(bool)", {"enabled": p.bool}),
    PausedStateChanged: event("0x9e3a5e37224532dea67b89face185703738a228a6e8a23dee546960180d3be64", "PausedStateChanged(bool)", {"paused": p.bool}),
    PriceRateCacheUpdated: event("0xc1a224b14823b63c7711127f125fbf592434682f38881ebb61408747a303affc", "PriceRateCacheUpdated(address,uint256)", {"token": indexed(p.address), "rate": p.uint256}),
    PriceRateProviderSet: event("0xca6c2c5b6b44b5f3f0c08f0e28e5b6deda1cb38c3fe1113e8031d926c1e8c6d0", "PriceRateProviderSet(address,address,uint256)", {"token": indexed(p.address), "provider": indexed(p.address), "cacheDuration": p.uint256}),
    SwapFeePercentageChanged: event("0xa9ba3ffe0b6c366b81232caab38605a0699ad5398d6cce76f91ee809e322dafc", "SwapFeePercentageChanged(uint256)", {"swapFeePercentage": p.uint256}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "value": p.uint256}),
}

export const functions = {
    DOMAIN_SEPARATOR: viewFun("0x3644e515", "DOMAIN_SEPARATOR()", {}, p.bytes32),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"owner": p.address, "spender": p.address}, p.uint256),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"spender": p.address, "amount": p.uint256}, p.bool),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"account": p.address}, p.uint256),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    decreaseAllowance: fun("0xa457c2d7", "decreaseAllowance(address,uint256)", {"spender": p.address, "amount": p.uint256}, p.bool),
    enableOracle: fun("0x292c914a", "enableOracle()", {}, ),
    getActionId: viewFun("0x851c1bb3", "getActionId(bytes4)", {"selector": p.bytes4}, p.bytes32),
    getAmplificationParameter: viewFun("0x6daccffa", "getAmplificationParameter()", {}, {"value": p.uint256, "isUpdating": p.bool, "precision": p.uint256}),
    getAuthorizer: viewFun("0xaaabadc5", "getAuthorizer()", {}, p.address),
    getLargestSafeQueryWindow: viewFun("0xffd088eb", "getLargestSafeQueryWindow()", {}, p.uint256),
    getLastInvariant: viewFun("0x9b02cdde", "getLastInvariant()", {}, {"lastInvariant": p.uint256, "lastInvariantAmp": p.uint256}),
    getLatest: viewFun("0xb10be739", "getLatest(uint8)", {"variable": p.uint8}, p.uint256),
    getOracleMiscData: viewFun("0x1ed4eddc", "getOracleMiscData()", {}, {"logInvariant": p.int256, "logTotalSupply": p.int256, "oracleSampleCreationTimestamp": p.uint256, "oracleIndex": p.uint256, "oracleEnabled": p.bool}),
    getOwner: viewFun("0x893d20e8", "getOwner()", {}, p.address),
    getPastAccumulators: viewFun("0x6b843239", "getPastAccumulators((uint8,uint256)[])", {"queries": p.array(p.struct({"variable": p.uint8, "ago": p.uint256}))}, p.array(p.int256)),
    getPausedState: viewFun("0x1c0de051", "getPausedState()", {}, {"paused": p.bool, "pauseWindowEndTime": p.uint256, "bufferPeriodEndTime": p.uint256}),
    getPoolId: viewFun("0x38fff2d0", "getPoolId()", {}, p.bytes32),
    getPriceRateCache: viewFun("0xb867ee5a", "getPriceRateCache(address)", {"token": p.address}, {"rate": p.uint256, "duration": p.uint256, "expires": p.uint256}),
    getRate: viewFun("0x679aefce", "getRate()", {}, p.uint256),
    getRateProviders: viewFun("0x238a2d59", "getRateProviders()", {}, p.array(p.address)),
    getSample: viewFun("0x60d1507c", "getSample(uint256)", {"index": p.uint256}, {"logPairPrice": p.int256, "accLogPairPrice": p.int256, "logBptPrice": p.int256, "accLogBptPrice": p.int256, "logInvariant": p.int256, "accLogInvariant": p.int256, "timestamp": p.uint256}),
    getScalingFactors: viewFun("0x1dd746ea", "getScalingFactors()", {}, p.array(p.uint256)),
    getSwapFeePercentage: viewFun("0x55c67628", "getSwapFeePercentage()", {}, p.uint256),
    getTimeWeightedAverage: viewFun("0x1dccd830", "getTimeWeightedAverage((uint8,uint256,uint256)[])", {"queries": p.array(p.struct({"variable": p.uint8, "secs": p.uint256, "ago": p.uint256}))}, p.array(p.uint256)),
    getTotalSamples: viewFun("0xb48b5b40", "getTotalSamples()", {}, p.uint256),
    getVault: viewFun("0x8d928af8", "getVault()", {}, p.address),
    increaseAllowance: fun("0x39509351", "increaseAllowance(address,uint256)", {"spender": p.address, "addedValue": p.uint256}, p.bool),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    nonces: viewFun("0x7ecebe00", "nonces(address)", {"owner": p.address}, p.uint256),
    onExitPool: fun("0x74f3b009", "onExitPool(bytes32,address,address,uint256[],uint256,uint256,bytes)", {"poolId": p.bytes32, "sender": p.address, "recipient": p.address, "balances": p.array(p.uint256), "lastChangeBlock": p.uint256, "protocolSwapFeePercentage": p.uint256, "userData": p.bytes}, {"amountsOut": p.array(p.uint256), "dueProtocolFeeAmounts": p.array(p.uint256)}),
    onJoinPool: fun("0xd5c096c4", "onJoinPool(bytes32,address,address,uint256[],uint256,uint256,bytes)", {"poolId": p.bytes32, "sender": p.address, "recipient": p.address, "balances": p.array(p.uint256), "lastChangeBlock": p.uint256, "protocolSwapFeePercentage": p.uint256, "userData": p.bytes}, {"amountsIn": p.array(p.uint256), "dueProtocolFeeAmounts": p.array(p.uint256)}),
    'onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256[],uint256,uint256)': fun("0x01ec954a", "onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256[],uint256,uint256)", {"request": p.struct({"kind": p.uint8, "tokenIn": p.address, "tokenOut": p.address, "amount": p.uint256, "poolId": p.bytes32, "lastChangeBlock": p.uint256, "from": p.address, "to": p.address, "userData": p.bytes}), "balances": p.array(p.uint256), "indexIn": p.uint256, "indexOut": p.uint256}, p.uint256),
    'onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256,uint256)': fun("0x9d2c110c", "onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256,uint256)", {"request": p.struct({"kind": p.uint8, "tokenIn": p.address, "tokenOut": p.address, "amount": p.uint256, "poolId": p.bytes32, "lastChangeBlock": p.uint256, "from": p.address, "to": p.address, "userData": p.bytes}), "balanceTokenIn": p.uint256, "balanceTokenOut": p.uint256}, p.uint256),
    permit: fun("0xd505accf", "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)", {"owner": p.address, "spender": p.address, "value": p.uint256, "deadline": p.uint256, "v": p.uint8, "r": p.bytes32, "s": p.bytes32}, ),
    queryExit: fun("0x6028bfd4", "queryExit(bytes32,address,address,uint256[],uint256,uint256,bytes)", {"poolId": p.bytes32, "sender": p.address, "recipient": p.address, "balances": p.array(p.uint256), "lastChangeBlock": p.uint256, "protocolSwapFeePercentage": p.uint256, "userData": p.bytes}, {"bptIn": p.uint256, "amountsOut": p.array(p.uint256)}),
    queryJoin: fun("0x87ec6817", "queryJoin(bytes32,address,address,uint256[],uint256,uint256,bytes)", {"poolId": p.bytes32, "sender": p.address, "recipient": p.address, "balances": p.array(p.uint256), "lastChangeBlock": p.uint256, "protocolSwapFeePercentage": p.uint256, "userData": p.bytes}, {"bptOut": p.uint256, "amountsIn": p.array(p.uint256)}),
    setAssetManagerPoolConfig: fun("0x50dd6ed9", "setAssetManagerPoolConfig(address,bytes)", {"token": p.address, "poolConfig": p.bytes}, ),
    setPaused: fun("0x16c38b3c", "setPaused(bool)", {"paused": p.bool}, ),
    setPriceRateCacheDuration: fun("0xb7710251", "setPriceRateCacheDuration(address,uint256)", {"token": p.address, "duration": p.uint256}, ),
    setSwapFeePercentage: fun("0x38e9922e", "setSwapFeePercentage(uint256)", {"swapFeePercentage": p.uint256}, ),
    startAmplificationParameterUpdate: fun("0x2f1a0bc9", "startAmplificationParameterUpdate(uint256,uint256)", {"rawEndValue": p.uint256, "endTime": p.uint256}, ),
    stopAmplificationParameterUpdate: fun("0xeb0f24d6", "stopAmplificationParameterUpdate()", {}, ),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"recipient": p.address, "amount": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"sender": p.address, "recipient": p.address, "amount": p.uint256}, p.bool),
    updatePriceRateCache: fun("0xa0daaed0", "updatePriceRateCache(address)", {"token": p.address}, ),
}

export class Contract extends ContractBase {

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

    getAmplificationParameter() {
        return this.eth_call(functions.getAmplificationParameter, {})
    }

    getAuthorizer() {
        return this.eth_call(functions.getAuthorizer, {})
    }

    getLargestSafeQueryWindow() {
        return this.eth_call(functions.getLargestSafeQueryWindow, {})
    }

    getLastInvariant() {
        return this.eth_call(functions.getLastInvariant, {})
    }

    getLatest(variable: GetLatestParams["variable"]) {
        return this.eth_call(functions.getLatest, {variable})
    }

    getOracleMiscData() {
        return this.eth_call(functions.getOracleMiscData, {})
    }

    getOwner() {
        return this.eth_call(functions.getOwner, {})
    }

    getPastAccumulators(queries: GetPastAccumulatorsParams["queries"]) {
        return this.eth_call(functions.getPastAccumulators, {queries})
    }

    getPausedState() {
        return this.eth_call(functions.getPausedState, {})
    }

    getPoolId() {
        return this.eth_call(functions.getPoolId, {})
    }

    getPriceRateCache(token: GetPriceRateCacheParams["token"]) {
        return this.eth_call(functions.getPriceRateCache, {token})
    }

    getRate() {
        return this.eth_call(functions.getRate, {})
    }

    getRateProviders() {
        return this.eth_call(functions.getRateProviders, {})
    }

    getSample(index: GetSampleParams["index"]) {
        return this.eth_call(functions.getSample, {index})
    }

    getScalingFactors() {
        return this.eth_call(functions.getScalingFactors, {})
    }

    getSwapFeePercentage() {
        return this.eth_call(functions.getSwapFeePercentage, {})
    }

    getTimeWeightedAverage(queries: GetTimeWeightedAverageParams["queries"]) {
        return this.eth_call(functions.getTimeWeightedAverage, {queries})
    }

    getTotalSamples() {
        return this.eth_call(functions.getTotalSamples, {})
    }

    getVault() {
        return this.eth_call(functions.getVault, {})
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
}

/// Event types
export type AmpUpdateStartedEventArgs = EParams<typeof events.AmpUpdateStarted>
export type AmpUpdateStoppedEventArgs = EParams<typeof events.AmpUpdateStopped>
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type OracleEnabledChangedEventArgs = EParams<typeof events.OracleEnabledChanged>
export type PausedStateChangedEventArgs = EParams<typeof events.PausedStateChanged>
export type PriceRateCacheUpdatedEventArgs = EParams<typeof events.PriceRateCacheUpdated>
export type PriceRateProviderSetEventArgs = EParams<typeof events.PriceRateProviderSet>
export type SwapFeePercentageChangedEventArgs = EParams<typeof events.SwapFeePercentageChanged>
export type TransferEventArgs = EParams<typeof events.Transfer>

/// Function types
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

export type EnableOracleParams = FunctionArguments<typeof functions.enableOracle>
export type EnableOracleReturn = FunctionReturn<typeof functions.enableOracle>

export type GetActionIdParams = FunctionArguments<typeof functions.getActionId>
export type GetActionIdReturn = FunctionReturn<typeof functions.getActionId>

export type GetAmplificationParameterParams = FunctionArguments<typeof functions.getAmplificationParameter>
export type GetAmplificationParameterReturn = FunctionReturn<typeof functions.getAmplificationParameter>

export type GetAuthorizerParams = FunctionArguments<typeof functions.getAuthorizer>
export type GetAuthorizerReturn = FunctionReturn<typeof functions.getAuthorizer>

export type GetLargestSafeQueryWindowParams = FunctionArguments<typeof functions.getLargestSafeQueryWindow>
export type GetLargestSafeQueryWindowReturn = FunctionReturn<typeof functions.getLargestSafeQueryWindow>

export type GetLastInvariantParams = FunctionArguments<typeof functions.getLastInvariant>
export type GetLastInvariantReturn = FunctionReturn<typeof functions.getLastInvariant>

export type GetLatestParams = FunctionArguments<typeof functions.getLatest>
export type GetLatestReturn = FunctionReturn<typeof functions.getLatest>

export type GetOracleMiscDataParams = FunctionArguments<typeof functions.getOracleMiscData>
export type GetOracleMiscDataReturn = FunctionReturn<typeof functions.getOracleMiscData>

export type GetOwnerParams = FunctionArguments<typeof functions.getOwner>
export type GetOwnerReturn = FunctionReturn<typeof functions.getOwner>

export type GetPastAccumulatorsParams = FunctionArguments<typeof functions.getPastAccumulators>
export type GetPastAccumulatorsReturn = FunctionReturn<typeof functions.getPastAccumulators>

export type GetPausedStateParams = FunctionArguments<typeof functions.getPausedState>
export type GetPausedStateReturn = FunctionReturn<typeof functions.getPausedState>

export type GetPoolIdParams = FunctionArguments<typeof functions.getPoolId>
export type GetPoolIdReturn = FunctionReturn<typeof functions.getPoolId>

export type GetPriceRateCacheParams = FunctionArguments<typeof functions.getPriceRateCache>
export type GetPriceRateCacheReturn = FunctionReturn<typeof functions.getPriceRateCache>

export type GetRateParams = FunctionArguments<typeof functions.getRate>
export type GetRateReturn = FunctionReturn<typeof functions.getRate>

export type GetRateProvidersParams = FunctionArguments<typeof functions.getRateProviders>
export type GetRateProvidersReturn = FunctionReturn<typeof functions.getRateProviders>

export type GetSampleParams = FunctionArguments<typeof functions.getSample>
export type GetSampleReturn = FunctionReturn<typeof functions.getSample>

export type GetScalingFactorsParams = FunctionArguments<typeof functions.getScalingFactors>
export type GetScalingFactorsReturn = FunctionReturn<typeof functions.getScalingFactors>

export type GetSwapFeePercentageParams = FunctionArguments<typeof functions.getSwapFeePercentage>
export type GetSwapFeePercentageReturn = FunctionReturn<typeof functions.getSwapFeePercentage>

export type GetTimeWeightedAverageParams = FunctionArguments<typeof functions.getTimeWeightedAverage>
export type GetTimeWeightedAverageReturn = FunctionReturn<typeof functions.getTimeWeightedAverage>

export type GetTotalSamplesParams = FunctionArguments<typeof functions.getTotalSamples>
export type GetTotalSamplesReturn = FunctionReturn<typeof functions.getTotalSamples>

export type GetVaultParams = FunctionArguments<typeof functions.getVault>
export type GetVaultReturn = FunctionReturn<typeof functions.getVault>

export type IncreaseAllowanceParams = FunctionArguments<typeof functions.increaseAllowance>
export type IncreaseAllowanceReturn = FunctionReturn<typeof functions.increaseAllowance>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type NoncesParams = FunctionArguments<typeof functions.nonces>
export type NoncesReturn = FunctionReturn<typeof functions.nonces>

export type OnExitPoolParams = FunctionArguments<typeof functions.onExitPool>
export type OnExitPoolReturn = FunctionReturn<typeof functions.onExitPool>

export type OnJoinPoolParams = FunctionArguments<typeof functions.onJoinPool>
export type OnJoinPoolReturn = FunctionReturn<typeof functions.onJoinPool>

export type OnSwapParams_0 = FunctionArguments<typeof functions['onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256[],uint256,uint256)']>
export type OnSwapReturn_0 = FunctionReturn<typeof functions['onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256[],uint256,uint256)']>

export type OnSwapParams_1 = FunctionArguments<typeof functions['onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256,uint256)']>
export type OnSwapReturn_1 = FunctionReturn<typeof functions['onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256,uint256)']>

export type PermitParams = FunctionArguments<typeof functions.permit>
export type PermitReturn = FunctionReturn<typeof functions.permit>

export type QueryExitParams = FunctionArguments<typeof functions.queryExit>
export type QueryExitReturn = FunctionReturn<typeof functions.queryExit>

export type QueryJoinParams = FunctionArguments<typeof functions.queryJoin>
export type QueryJoinReturn = FunctionReturn<typeof functions.queryJoin>

export type SetAssetManagerPoolConfigParams = FunctionArguments<typeof functions.setAssetManagerPoolConfig>
export type SetAssetManagerPoolConfigReturn = FunctionReturn<typeof functions.setAssetManagerPoolConfig>

export type SetPausedParams = FunctionArguments<typeof functions.setPaused>
export type SetPausedReturn = FunctionReturn<typeof functions.setPaused>

export type SetPriceRateCacheDurationParams = FunctionArguments<typeof functions.setPriceRateCacheDuration>
export type SetPriceRateCacheDurationReturn = FunctionReturn<typeof functions.setPriceRateCacheDuration>

export type SetSwapFeePercentageParams = FunctionArguments<typeof functions.setSwapFeePercentage>
export type SetSwapFeePercentageReturn = FunctionReturn<typeof functions.setSwapFeePercentage>

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

export type UpdatePriceRateCacheParams = FunctionArguments<typeof functions.updatePriceRateCache>
export type UpdatePriceRateCacheReturn = FunctionReturn<typeof functions.updatePriceRateCache>

