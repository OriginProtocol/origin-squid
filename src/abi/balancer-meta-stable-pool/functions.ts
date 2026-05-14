import { address, array, bool, bytes, bytes32, bytes4, int256, string, struct, uint256, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** DOMAIN_SEPARATOR() */
export const DOMAIN_SEPARATOR = func('0x3644e515', {}, bytes32)
export type DOMAIN_SEPARATORParams = FunctionArguments<typeof DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof DOMAIN_SEPARATOR>

/** allowance(address,address) */
export const allowance = func('0xdd62ed3e', {
    owner: address,
    spender: address,
}, uint256)
export type AllowanceParams = FunctionArguments<typeof allowance>
export type AllowanceReturn = FunctionReturn<typeof allowance>

/** approve(address,uint256) */
export const approve = func('0x095ea7b3', {
    spender: address,
    amount: uint256,
}, bool)
export type ApproveParams = FunctionArguments<typeof approve>
export type ApproveReturn = FunctionReturn<typeof approve>

/** balanceOf(address) */
export const balanceOf = func('0x70a08231', {
    account: address,
}, uint256)
export type BalanceOfParams = FunctionArguments<typeof balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof balanceOf>

/** decimals() */
export const decimals = func('0x313ce567', {}, uint8)
export type DecimalsParams = FunctionArguments<typeof decimals>
export type DecimalsReturn = FunctionReturn<typeof decimals>

/** decreaseAllowance(address,uint256) */
export const decreaseAllowance = func('0xa457c2d7', {
    spender: address,
    amount: uint256,
}, bool)
export type DecreaseAllowanceParams = FunctionArguments<typeof decreaseAllowance>
export type DecreaseAllowanceReturn = FunctionReturn<typeof decreaseAllowance>

/** enableOracle() */
export const enableOracle = func('0x292c914a', {})
export type EnableOracleParams = FunctionArguments<typeof enableOracle>
export type EnableOracleReturn = FunctionReturn<typeof enableOracle>

/** getActionId(bytes4) */
export const getActionId = func('0x851c1bb3', {
    selector: bytes4,
}, bytes32)
export type GetActionIdParams = FunctionArguments<typeof getActionId>
export type GetActionIdReturn = FunctionReturn<typeof getActionId>

/** getAmplificationParameter() */
export const getAmplificationParameter = func('0x6daccffa', {}, struct({
    value: uint256,
    isUpdating: bool,
    precision: uint256,
}))
export type GetAmplificationParameterParams = FunctionArguments<typeof getAmplificationParameter>
export type GetAmplificationParameterReturn = FunctionReturn<typeof getAmplificationParameter>

/** getAuthorizer() */
export const getAuthorizer = func('0xaaabadc5', {}, address)
export type GetAuthorizerParams = FunctionArguments<typeof getAuthorizer>
export type GetAuthorizerReturn = FunctionReturn<typeof getAuthorizer>

/** getLargestSafeQueryWindow() */
export const getLargestSafeQueryWindow = func('0xffd088eb', {}, uint256)
export type GetLargestSafeQueryWindowParams = FunctionArguments<typeof getLargestSafeQueryWindow>
export type GetLargestSafeQueryWindowReturn = FunctionReturn<typeof getLargestSafeQueryWindow>

/** getLastInvariant() */
export const getLastInvariant = func('0x9b02cdde', {}, struct({
    lastInvariant: uint256,
    lastInvariantAmp: uint256,
}))
export type GetLastInvariantParams = FunctionArguments<typeof getLastInvariant>
export type GetLastInvariantReturn = FunctionReturn<typeof getLastInvariant>

/** getLatest(uint8) */
export const getLatest = func('0xb10be739', {
    variable: uint8,
}, uint256)
export type GetLatestParams = FunctionArguments<typeof getLatest>
export type GetLatestReturn = FunctionReturn<typeof getLatest>

/** getOracleMiscData() */
export const getOracleMiscData = func('0x1ed4eddc', {}, struct({
    logInvariant: int256,
    logTotalSupply: int256,
    oracleSampleCreationTimestamp: uint256,
    oracleIndex: uint256,
    oracleEnabled: bool,
}))
export type GetOracleMiscDataParams = FunctionArguments<typeof getOracleMiscData>
export type GetOracleMiscDataReturn = FunctionReturn<typeof getOracleMiscData>

/** getOwner() */
export const getOwner = func('0x893d20e8', {}, address)
export type GetOwnerParams = FunctionArguments<typeof getOwner>
export type GetOwnerReturn = FunctionReturn<typeof getOwner>

/** getPastAccumulators((uint8,uint256)[]) */
export const getPastAccumulators = func('0x6b843239', {
    queries: array(struct({
        variable: uint8,
        ago: uint256,
    })),
}, array(int256))
export type GetPastAccumulatorsParams = FunctionArguments<typeof getPastAccumulators>
export type GetPastAccumulatorsReturn = FunctionReturn<typeof getPastAccumulators>

/** getPausedState() */
export const getPausedState = func('0x1c0de051', {}, struct({
    paused: bool,
    pauseWindowEndTime: uint256,
    bufferPeriodEndTime: uint256,
}))
export type GetPausedStateParams = FunctionArguments<typeof getPausedState>
export type GetPausedStateReturn = FunctionReturn<typeof getPausedState>

/** getPoolId() */
export const getPoolId = func('0x38fff2d0', {}, bytes32)
export type GetPoolIdParams = FunctionArguments<typeof getPoolId>
export type GetPoolIdReturn = FunctionReturn<typeof getPoolId>

/** getPriceRateCache(address) */
export const getPriceRateCache = func('0xb867ee5a', {
    token: address,
}, struct({
    rate: uint256,
    duration: uint256,
    expires: uint256,
}))
export type GetPriceRateCacheParams = FunctionArguments<typeof getPriceRateCache>
export type GetPriceRateCacheReturn = FunctionReturn<typeof getPriceRateCache>

/** getRate() */
export const getRate = func('0x679aefce', {}, uint256)
export type GetRateParams = FunctionArguments<typeof getRate>
export type GetRateReturn = FunctionReturn<typeof getRate>

/** getRateProviders() */
export const getRateProviders = func('0x238a2d59', {}, array(address))
export type GetRateProvidersParams = FunctionArguments<typeof getRateProviders>
export type GetRateProvidersReturn = FunctionReturn<typeof getRateProviders>

/** getSample(uint256) */
export const getSample = func('0x60d1507c', {
    index: uint256,
}, struct({
    logPairPrice: int256,
    accLogPairPrice: int256,
    logBptPrice: int256,
    accLogBptPrice: int256,
    logInvariant: int256,
    accLogInvariant: int256,
    timestamp: uint256,
}))
export type GetSampleParams = FunctionArguments<typeof getSample>
export type GetSampleReturn = FunctionReturn<typeof getSample>

/** getScalingFactors() */
export const getScalingFactors = func('0x1dd746ea', {}, array(uint256))
export type GetScalingFactorsParams = FunctionArguments<typeof getScalingFactors>
export type GetScalingFactorsReturn = FunctionReturn<typeof getScalingFactors>

/** getSwapFeePercentage() */
export const getSwapFeePercentage = func('0x55c67628', {}, uint256)
export type GetSwapFeePercentageParams = FunctionArguments<typeof getSwapFeePercentage>
export type GetSwapFeePercentageReturn = FunctionReturn<typeof getSwapFeePercentage>

/** getTimeWeightedAverage((uint8,uint256,uint256)[]) */
export const getTimeWeightedAverage = func('0x1dccd830', {
    queries: array(struct({
        variable: uint8,
        secs: uint256,
        ago: uint256,
    })),
}, array(uint256))
export type GetTimeWeightedAverageParams = FunctionArguments<typeof getTimeWeightedAverage>
export type GetTimeWeightedAverageReturn = FunctionReturn<typeof getTimeWeightedAverage>

/** getTotalSamples() */
export const getTotalSamples = func('0xb48b5b40', {}, uint256)
export type GetTotalSamplesParams = FunctionArguments<typeof getTotalSamples>
export type GetTotalSamplesReturn = FunctionReturn<typeof getTotalSamples>

/** getVault() */
export const getVault = func('0x8d928af8', {}, address)
export type GetVaultParams = FunctionArguments<typeof getVault>
export type GetVaultReturn = FunctionReturn<typeof getVault>

/** increaseAllowance(address,uint256) */
export const increaseAllowance = func('0x39509351', {
    spender: address,
    addedValue: uint256,
}, bool)
export type IncreaseAllowanceParams = FunctionArguments<typeof increaseAllowance>
export type IncreaseAllowanceReturn = FunctionReturn<typeof increaseAllowance>

/** name() */
export const name = func('0x06fdde03', {}, string)
export type NameParams = FunctionArguments<typeof name>
export type NameReturn = FunctionReturn<typeof name>

/** nonces(address) */
export const nonces = func('0x7ecebe00', {
    owner: address,
}, uint256)
export type NoncesParams = FunctionArguments<typeof nonces>
export type NoncesReturn = FunctionReturn<typeof nonces>

/** onExitPool(bytes32,address,address,uint256[],uint256,uint256,bytes) */
export const onExitPool = func('0x74f3b009', {
    poolId: bytes32,
    sender: address,
    recipient: address,
    balances: array(uint256),
    lastChangeBlock: uint256,
    protocolSwapFeePercentage: uint256,
    userData: bytes,
}, struct({
    amountsOut: array(uint256),
    dueProtocolFeeAmounts: array(uint256),
}))
export type OnExitPoolParams = FunctionArguments<typeof onExitPool>
export type OnExitPoolReturn = FunctionReturn<typeof onExitPool>

/** onJoinPool(bytes32,address,address,uint256[],uint256,uint256,bytes) */
export const onJoinPool = func('0xd5c096c4', {
    poolId: bytes32,
    sender: address,
    recipient: address,
    balances: array(uint256),
    lastChangeBlock: uint256,
    protocolSwapFeePercentage: uint256,
    userData: bytes,
}, struct({
    amountsIn: array(uint256),
    dueProtocolFeeAmounts: array(uint256),
}))
export type OnJoinPoolParams = FunctionArguments<typeof onJoinPool>
export type OnJoinPoolReturn = FunctionReturn<typeof onJoinPool>

/** onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256[],uint256,uint256) */
export const onSwap = func('0x01ec954a', {
    request: struct({
        kind: uint8,
        tokenIn: address,
        tokenOut: address,
        amount: uint256,
        poolId: bytes32,
        lastChangeBlock: uint256,
        from: address,
        to: address,
        userData: bytes,
    }),
    balances: array(uint256),
    indexIn: uint256,
    indexOut: uint256,
}, uint256)
export type OnSwapParams = FunctionArguments<typeof onSwap>
export type OnSwapReturn = FunctionReturn<typeof onSwap>

/** onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256,uint256) */
export const onSwap_1 = func('0x9d2c110c', {
    request: struct({
        kind: uint8,
        tokenIn: address,
        tokenOut: address,
        amount: uint256,
        poolId: bytes32,
        lastChangeBlock: uint256,
        from: address,
        to: address,
        userData: bytes,
    }),
    balanceTokenIn: uint256,
    balanceTokenOut: uint256,
}, uint256)
export type OnSwapParams_1 = FunctionArguments<typeof onSwap_1>
export type OnSwapReturn_1 = FunctionReturn<typeof onSwap_1>

/** permit(address,address,uint256,uint256,uint8,bytes32,bytes32) */
export const permit = func('0xd505accf', {
    owner: address,
    spender: address,
    value: uint256,
    deadline: uint256,
    v: uint8,
    r: bytes32,
    s: bytes32,
})
export type PermitParams = FunctionArguments<typeof permit>
export type PermitReturn = FunctionReturn<typeof permit>

/** queryExit(bytes32,address,address,uint256[],uint256,uint256,bytes) */
export const queryExit = func('0x6028bfd4', {
    poolId: bytes32,
    sender: address,
    recipient: address,
    balances: array(uint256),
    lastChangeBlock: uint256,
    protocolSwapFeePercentage: uint256,
    userData: bytes,
}, struct({
    bptIn: uint256,
    amountsOut: array(uint256),
}))
export type QueryExitParams = FunctionArguments<typeof queryExit>
export type QueryExitReturn = FunctionReturn<typeof queryExit>

/** queryJoin(bytes32,address,address,uint256[],uint256,uint256,bytes) */
export const queryJoin = func('0x87ec6817', {
    poolId: bytes32,
    sender: address,
    recipient: address,
    balances: array(uint256),
    lastChangeBlock: uint256,
    protocolSwapFeePercentage: uint256,
    userData: bytes,
}, struct({
    bptOut: uint256,
    amountsIn: array(uint256),
}))
export type QueryJoinParams = FunctionArguments<typeof queryJoin>
export type QueryJoinReturn = FunctionReturn<typeof queryJoin>

/** setAssetManagerPoolConfig(address,bytes) */
export const setAssetManagerPoolConfig = func('0x50dd6ed9', {
    token: address,
    poolConfig: bytes,
})
export type SetAssetManagerPoolConfigParams = FunctionArguments<typeof setAssetManagerPoolConfig>
export type SetAssetManagerPoolConfigReturn = FunctionReturn<typeof setAssetManagerPoolConfig>

/** setPaused(bool) */
export const setPaused = func('0x16c38b3c', {
    paused: bool,
})
export type SetPausedParams = FunctionArguments<typeof setPaused>
export type SetPausedReturn = FunctionReturn<typeof setPaused>

/** setPriceRateCacheDuration(address,uint256) */
export const setPriceRateCacheDuration = func('0xb7710251', {
    token: address,
    duration: uint256,
})
export type SetPriceRateCacheDurationParams = FunctionArguments<typeof setPriceRateCacheDuration>
export type SetPriceRateCacheDurationReturn = FunctionReturn<typeof setPriceRateCacheDuration>

/** setSwapFeePercentage(uint256) */
export const setSwapFeePercentage = func('0x38e9922e', {
    swapFeePercentage: uint256,
})
export type SetSwapFeePercentageParams = FunctionArguments<typeof setSwapFeePercentage>
export type SetSwapFeePercentageReturn = FunctionReturn<typeof setSwapFeePercentage>

/** startAmplificationParameterUpdate(uint256,uint256) */
export const startAmplificationParameterUpdate = func('0x2f1a0bc9', {
    rawEndValue: uint256,
    endTime: uint256,
})
export type StartAmplificationParameterUpdateParams = FunctionArguments<typeof startAmplificationParameterUpdate>
export type StartAmplificationParameterUpdateReturn = FunctionReturn<typeof startAmplificationParameterUpdate>

/** stopAmplificationParameterUpdate() */
export const stopAmplificationParameterUpdate = func('0xeb0f24d6', {})
export type StopAmplificationParameterUpdateParams = FunctionArguments<typeof stopAmplificationParameterUpdate>
export type StopAmplificationParameterUpdateReturn = FunctionReturn<typeof stopAmplificationParameterUpdate>

/** symbol() */
export const symbol = func('0x95d89b41', {}, string)
export type SymbolParams = FunctionArguments<typeof symbol>
export type SymbolReturn = FunctionReturn<typeof symbol>

/** totalSupply() */
export const totalSupply = func('0x18160ddd', {}, uint256)
export type TotalSupplyParams = FunctionArguments<typeof totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof totalSupply>

/** transfer(address,uint256) */
export const transfer = func('0xa9059cbb', {
    recipient: address,
    amount: uint256,
}, bool)
export type TransferParams = FunctionArguments<typeof transfer>
export type TransferReturn = FunctionReturn<typeof transfer>

/** transferFrom(address,address,uint256) */
export const transferFrom = func('0x23b872dd', {
    sender: address,
    recipient: address,
    amount: uint256,
}, bool)
export type TransferFromParams = FunctionArguments<typeof transferFrom>
export type TransferFromReturn = FunctionReturn<typeof transferFrom>

/** updatePriceRateCache(address) */
export const updatePriceRateCache = func('0xa0daaed0', {
    token: address,
})
export type UpdatePriceRateCacheParams = FunctionArguments<typeof updatePriceRateCache>
export type UpdatePriceRateCacheReturn = FunctionReturn<typeof updatePriceRateCache>
