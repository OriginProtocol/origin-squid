import * as p from '@subsquid/evm-codec'
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    OracleEnabledChanged: event("0x3e350b41e86a8e10f804ade6d35340d620be35569cc75ac943e8bb14ab80ead1", {"enabled": p.bool}),
    PausedStateChanged: event("0x9e3a5e37224532dea67b89face185703738a228a6e8a23dee546960180d3be64", {"paused": p.bool}),
    SwapFeePercentageChanged: event("0xa9ba3ffe0b6c366b81232caab38605a0699ad5398d6cce76f91ee809e322dafc", {"swapFeePercentage": p.uint256}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", {"from": indexed(p.address), "to": indexed(p.address), "value": p.uint256}),
}

export const functions = {
    DOMAIN_SEPARATOR: fun("0x3644e515", {}, p.bytes32),
    allowance: fun("0xdd62ed3e", {"owner": p.address, "spender": p.address}, p.uint256),
    approve: fun("0x095ea7b3", {"spender": p.address, "amount": p.uint256}, p.bool),
    balanceOf: fun("0x70a08231", {"account": p.address}, p.uint256),
    decimals: fun("0x313ce567", {}, p.uint8),
    decreaseApproval: fun("0x66188463", {"spender": p.address, "amount": p.uint256}, p.bool),
    enableOracle: fun("0x292c914a", {}, ),
    getActionId: fun("0x851c1bb3", {"selector": p.bytes4}, p.bytes32),
    getAuthorizer: fun("0xaaabadc5", {}, p.address),
    getInvariant: fun("0xc0ff1a15", {}, p.uint256),
    getLargestSafeQueryWindow: fun("0xffd088eb", {}, p.uint256),
    getLastInvariant: fun("0x9b02cdde", {}, p.uint256),
    getLatest: fun("0xb10be739", {"variable": p.uint8}, p.uint256),
    getMiscData: fun("0x4a6b0b15", {}, {"logInvariant": p.int256, "logTotalSupply": p.int256, "oracleSampleCreationTimestamp": p.uint256, "oracleIndex": p.uint256, "oracleEnabled": p.bool, "swapFeePercentage": p.uint256}),
    getNormalizedWeights: fun("0xf89f27ed", {}, p.array(p.uint256)),
    getOwner: fun("0x893d20e8", {}, p.address),
    getPastAccumulators: fun("0x6b843239", {"queries": p.array(p.struct({"variable": p.uint8, "ago": p.uint256}))}, p.array(p.int256)),
    getPausedState: fun("0x1c0de051", {}, {"paused": p.bool, "pauseWindowEndTime": p.uint256, "bufferPeriodEndTime": p.uint256}),
    getPoolId: fun("0x38fff2d0", {}, p.bytes32),
    getRate: fun("0x679aefce", {}, p.uint256),
    getSample: fun("0x60d1507c", {"index": p.uint256}, {"logPairPrice": p.int256, "accLogPairPrice": p.int256, "logBptPrice": p.int256, "accLogBptPrice": p.int256, "logInvariant": p.int256, "accLogInvariant": p.int256, "timestamp": p.uint256}),
    getSwapFeePercentage: fun("0x55c67628", {}, p.uint256),
    getTimeWeightedAverage: fun("0x1dccd830", {"queries": p.array(p.struct({"variable": p.uint8, "secs": p.uint256, "ago": p.uint256}))}, p.array(p.uint256)),
    getTotalSamples: fun("0xb48b5b40", {}, p.uint256),
    getVault: fun("0x8d928af8", {}, p.address),
    increaseApproval: fun("0xd73dd623", {"spender": p.address, "amount": p.uint256}, p.bool),
    name: fun("0x06fdde03", {}, p.string),
    nonces: fun("0x7ecebe00", {"owner": p.address}, p.uint256),
    onExitPool: fun("0x74f3b009", {"poolId": p.bytes32, "sender": p.address, "recipient": p.address, "balances": p.array(p.uint256), "lastChangeBlock": p.uint256, "protocolSwapFeePercentage": p.uint256, "userData": p.bytes}, {"_0": p.array(p.uint256), "_1": p.array(p.uint256)}),
    onJoinPool: fun("0xd5c096c4", {"poolId": p.bytes32, "sender": p.address, "recipient": p.address, "balances": p.array(p.uint256), "lastChangeBlock": p.uint256, "protocolSwapFeePercentage": p.uint256, "userData": p.bytes}, {"amountsIn": p.array(p.uint256), "dueProtocolFeeAmounts": p.array(p.uint256)}),
    onSwap: fun("0x9d2c110c", {"request": p.struct({"kind": p.uint8, "tokenIn": p.address, "tokenOut": p.address, "amount": p.uint256, "poolId": p.bytes32, "lastChangeBlock": p.uint256, "from": p.address, "to": p.address, "userData": p.bytes}), "balanceTokenIn": p.uint256, "balanceTokenOut": p.uint256}, p.uint256),
    permit: fun("0xd505accf", {"owner": p.address, "spender": p.address, "value": p.uint256, "deadline": p.uint256, "v": p.uint8, "r": p.bytes32, "s": p.bytes32}, ),
    queryExit: fun("0x6028bfd4", {"poolId": p.bytes32, "sender": p.address, "recipient": p.address, "balances": p.array(p.uint256), "lastChangeBlock": p.uint256, "protocolSwapFeePercentage": p.uint256, "userData": p.bytes}, {"bptIn": p.uint256, "amountsOut": p.array(p.uint256)}),
    queryJoin: fun("0x87ec6817", {"poolId": p.bytes32, "sender": p.address, "recipient": p.address, "balances": p.array(p.uint256), "lastChangeBlock": p.uint256, "protocolSwapFeePercentage": p.uint256, "userData": p.bytes}, {"bptOut": p.uint256, "amountsIn": p.array(p.uint256)}),
    setPaused: fun("0x16c38b3c", {"paused": p.bool}, ),
    setSwapFeePercentage: fun("0x38e9922e", {"swapFeePercentage": p.uint256}, ),
    symbol: fun("0x95d89b41", {}, p.string),
    totalSupply: fun("0x18160ddd", {}, p.uint256),
    transfer: fun("0xa9059cbb", {"recipient": p.address, "amount": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", {"sender": p.address, "recipient": p.address, "amount": p.uint256}, p.bool),
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

    getAuthorizer() {
        return this.eth_call(functions.getAuthorizer, {})
    }

    getInvariant() {
        return this.eth_call(functions.getInvariant, {})
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

    getMiscData() {
        return this.eth_call(functions.getMiscData, {})
    }

    getNormalizedWeights() {
        return this.eth_call(functions.getNormalizedWeights, {})
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

    getRate() {
        return this.eth_call(functions.getRate, {})
    }

    getSample(index: GetSampleParams["index"]) {
        return this.eth_call(functions.getSample, {index})
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
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type OracleEnabledChangedEventArgs = EParams<typeof events.OracleEnabledChanged>
export type PausedStateChangedEventArgs = EParams<typeof events.PausedStateChanged>
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

export type DecreaseApprovalParams = FunctionArguments<typeof functions.decreaseApproval>
export type DecreaseApprovalReturn = FunctionReturn<typeof functions.decreaseApproval>

export type EnableOracleParams = FunctionArguments<typeof functions.enableOracle>
export type EnableOracleReturn = FunctionReturn<typeof functions.enableOracle>

export type GetActionIdParams = FunctionArguments<typeof functions.getActionId>
export type GetActionIdReturn = FunctionReturn<typeof functions.getActionId>

export type GetAuthorizerParams = FunctionArguments<typeof functions.getAuthorizer>
export type GetAuthorizerReturn = FunctionReturn<typeof functions.getAuthorizer>

export type GetInvariantParams = FunctionArguments<typeof functions.getInvariant>
export type GetInvariantReturn = FunctionReturn<typeof functions.getInvariant>

export type GetLargestSafeQueryWindowParams = FunctionArguments<typeof functions.getLargestSafeQueryWindow>
export type GetLargestSafeQueryWindowReturn = FunctionReturn<typeof functions.getLargestSafeQueryWindow>

export type GetLastInvariantParams = FunctionArguments<typeof functions.getLastInvariant>
export type GetLastInvariantReturn = FunctionReturn<typeof functions.getLastInvariant>

export type GetLatestParams = FunctionArguments<typeof functions.getLatest>
export type GetLatestReturn = FunctionReturn<typeof functions.getLatest>

export type GetMiscDataParams = FunctionArguments<typeof functions.getMiscData>
export type GetMiscDataReturn = FunctionReturn<typeof functions.getMiscData>

export type GetNormalizedWeightsParams = FunctionArguments<typeof functions.getNormalizedWeights>
export type GetNormalizedWeightsReturn = FunctionReturn<typeof functions.getNormalizedWeights>

export type GetOwnerParams = FunctionArguments<typeof functions.getOwner>
export type GetOwnerReturn = FunctionReturn<typeof functions.getOwner>

export type GetPastAccumulatorsParams = FunctionArguments<typeof functions.getPastAccumulators>
export type GetPastAccumulatorsReturn = FunctionReturn<typeof functions.getPastAccumulators>

export type GetPausedStateParams = FunctionArguments<typeof functions.getPausedState>
export type GetPausedStateReturn = FunctionReturn<typeof functions.getPausedState>

export type GetPoolIdParams = FunctionArguments<typeof functions.getPoolId>
export type GetPoolIdReturn = FunctionReturn<typeof functions.getPoolId>

export type GetRateParams = FunctionArguments<typeof functions.getRate>
export type GetRateReturn = FunctionReturn<typeof functions.getRate>

export type GetSampleParams = FunctionArguments<typeof functions.getSample>
export type GetSampleReturn = FunctionReturn<typeof functions.getSample>

export type GetSwapFeePercentageParams = FunctionArguments<typeof functions.getSwapFeePercentage>
export type GetSwapFeePercentageReturn = FunctionReturn<typeof functions.getSwapFeePercentage>

export type GetTimeWeightedAverageParams = FunctionArguments<typeof functions.getTimeWeightedAverage>
export type GetTimeWeightedAverageReturn = FunctionReturn<typeof functions.getTimeWeightedAverage>

export type GetTotalSamplesParams = FunctionArguments<typeof functions.getTotalSamples>
export type GetTotalSamplesReturn = FunctionReturn<typeof functions.getTotalSamples>

export type GetVaultParams = FunctionArguments<typeof functions.getVault>
export type GetVaultReturn = FunctionReturn<typeof functions.getVault>

export type IncreaseApprovalParams = FunctionArguments<typeof functions.increaseApproval>
export type IncreaseApprovalReturn = FunctionReturn<typeof functions.increaseApproval>

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

export type PermitParams = FunctionArguments<typeof functions.permit>
export type PermitReturn = FunctionReturn<typeof functions.permit>

export type QueryExitParams = FunctionArguments<typeof functions.queryExit>
export type QueryExitReturn = FunctionReturn<typeof functions.queryExit>

export type QueryJoinParams = FunctionArguments<typeof functions.queryJoin>
export type QueryJoinReturn = FunctionReturn<typeof functions.queryJoin>

export type SetPausedParams = FunctionArguments<typeof functions.setPaused>
export type SetPausedReturn = FunctionReturn<typeof functions.setPaused>

export type SetSwapFeePercentageParams = FunctionArguments<typeof functions.setSwapFeePercentage>
export type SetSwapFeePercentageReturn = FunctionReturn<typeof functions.setSwapFeePercentage>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

