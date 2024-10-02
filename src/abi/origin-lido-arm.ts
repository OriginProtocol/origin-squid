import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AdminChanged: event("0x7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f", "AdminChanged(address,address)", {"previousAdmin": p.address, "newAdmin": p.address}),
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    FeeCalculated: event("0x30928e76c6a54d53276a61676fb8079d25925880e81e43eb0f66cc81a5fdd0c2", "FeeCalculated(uint256,uint256)", {"newFeesAccrued": p.uint256, "assetIncrease": p.uint256}),
    FeeCollected: event("0x06c5efeff5c320943d265dc4e5f1af95ad523555ce0c1957e367dda5514572df", "FeeCollected(address,uint256)", {"feeCollector": indexed(p.address), "fee": p.uint256}),
    FeeCollectorUpdated: event("0xe5693914d19c789bdee50a362998c0bc8d035a835f9871da5d51152f0582c34f", "FeeCollectorUpdated(address)", {"newFeeCollector": indexed(p.address)}),
    FeeUpdated: event("0x8c4d35e54a3f2ef1134138fd8ea3daee6a3c89e10d2665996babdf70261e2c76", "FeeUpdated(uint256)", {"fee": p.uint256}),
    Initialized: event("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", {"version": p.uint64}),
    LiquidityProviderControllerUpdated: event("0x98d12d173c55cf3e1d076b63bbbda9f9179886965369ed2a310dfee258d62485", "LiquidityProviderControllerUpdated(address)", {"liquidityProviderController": indexed(p.address)}),
    OperatorChanged: event("0x4721129e0e676ed6a92909bb24e853ccdd63ad72280cc2e974e38e480e0e6e54", "OperatorChanged(address)", {"newAdmin": p.address}),
    RedeemClaimed: event("0x36dd2c9b55f12509e3b5f4f4d765ddefc2776a28018b18da2335cf2ab93bb268", "RedeemClaimed(address,uint256,uint256)", {"withdrawer": indexed(p.address), "requestId": indexed(p.uint256), "assets": p.uint256}),
    RedeemRequested: event("0xc04c86cfd81036557541f9c68971ace59cbc9057ecab7d48874a6177ad117f4f", "RedeemRequested(address,uint256,uint256,uint256,uint256)", {"withdrawer": indexed(p.address), "requestId": indexed(p.uint256), "assets": p.uint256, "queued": p.uint256, "claimTimestamp": p.uint256}),
    TraderateChanged: event("0xa2136948fd1e5333c2ee27c9e48848a560b693e6bbd18082623a738179ff2952", "TraderateChanged(uint256,uint256)", {"traderate0": p.uint256, "traderate1": p.uint256}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "value": p.uint256}),
}

export const functions = {
    CLAIM_DELAY: viewFun("0xe18132c4", "CLAIM_DELAY()", {}, p.uint256),
    FEE_SCALE: viewFun("0x8a5fddd8", "FEE_SCALE()", {}, p.uint256),
    MAX_PRICE_DEVIATION: viewFun("0x96f277b7", "MAX_PRICE_DEVIATION()", {}, p.uint256),
    PRICE_SCALE: viewFun("0xc33f59d3", "PRICE_SCALE()", {}, p.uint256),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"owner": p.address, "spender": p.address}, p.uint256),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"spender": p.address, "value": p.uint256}, p.bool),
    approveStETH: fun("0x6e4f252d", "approveStETH()", {}, ),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"account": p.address}, p.uint256),
    claimRedeem: fun("0xe46cf747", "claimRedeem(uint256)", {"requestId": p.uint256}, p.uint256),
    claimStETHWithdrawalForWETH: fun("0xdbd5697e", "claimStETHWithdrawalForWETH(uint256[])", {"requestIds": p.array(p.uint256)}, ),
    collectFees: fun("0xc8796572", "collectFees()", {}, p.uint256),
    convertToAssets: viewFun("0x07a2d13a", "convertToAssets(uint256)", {"shares": p.uint256}, p.uint256),
    convertToShares: viewFun("0xc6e6f592", "convertToShares(uint256)", {"assets": p.uint256}, p.uint256),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    deposit: fun("0xb6b55f25", "deposit(uint256)", {"assets": p.uint256}, p.uint256),
    fee: viewFun("0xddca3f43", "fee()", {}, p.uint16),
    feeCollector: viewFun("0xc415b95c", "feeCollector()", {}, p.address),
    feesAccrued: viewFun("0x94db0595", "feesAccrued()", {}, p.uint112),
    initialize: fun("0xb3ddda2a", "initialize(string,string,address,uint256,address,address)", {"_name": p.string, "_symbol": p.string, "_operator": p.address, "_fee": p.uint256, "_feeCollector": p.address, "_liquidityProviderController": p.address}, ),
    lastTotalAssets: viewFun("0x568efc07", "lastTotalAssets()", {}, p.uint128),
    liquidityAsset: viewFun("0x209b2bca", "liquidityAsset()", {}, p.address),
    liquidityProviderController: viewFun("0x84da5fb1", "liquidityProviderController()", {}, p.address),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    nextWithdrawalIndex: viewFun("0xbba9282e", "nextWithdrawalIndex()", {}, p.uint128),
    operator: viewFun("0x570ca735", "operator()", {}, p.address),
    outstandingEther: viewFun("0x548b273a", "outstandingEther()", {}, p.uint256),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    previewDeposit: viewFun("0xef8b30f7", "previewDeposit(uint256)", {"assets": p.uint256}, p.uint256),
    previewRedeem: viewFun("0x4cdad506", "previewRedeem(uint256)", {"shares": p.uint256}, p.uint256),
    requestRedeem: fun("0xaa2f892d", "requestRedeem(uint256)", {"shares": p.uint256}, {"requestId": p.uint256, "assets": p.uint256}),
    requestStETHWithdrawalForETH: fun("0xf33d679e", "requestStETHWithdrawalForETH(uint256[])", {"amounts": p.array(p.uint256)}, p.array(p.uint256)),
    setFee: fun("0x69fe0e2d", "setFee(uint256)", {"_fee": p.uint256}, ),
    setFeeCollector: fun("0xa42dce80", "setFeeCollector(address)", {"_feeCollector": p.address}, ),
    setLiquidityProviderController: fun("0x472c3085", "setLiquidityProviderController(address)", {"_liquidityProviderController": p.address}, ),
    setOperator: fun("0xb3ab15fb", "setOperator(address)", {"newOperator": p.address}, ),
    setOwner: fun("0x13af4035", "setOwner(address)", {"newOwner": p.address}, ),
    setPrices: fun("0x05fefda7", "setPrices(uint256,uint256)", {"buyT1": p.uint256, "sellT1": p.uint256}, ),
    steth: viewFun("0x953d7ee2", "steth()", {}, p.address),
    'swapExactTokensForTokens(uint256,uint256,address[],address,uint256)': fun("0x38ed1739", "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)", {"amountIn": p.uint256, "amountOutMin": p.uint256, "path": p.array(p.address), "to": p.address, "deadline": p.uint256}, p.array(p.uint256)),
    'swapExactTokensForTokens(address,address,uint256,uint256,address)': fun("0x6c08c57e", "swapExactTokensForTokens(address,address,uint256,uint256,address)", {"inToken": p.address, "outToken": p.address, "amountIn": p.uint256, "amountOutMin": p.uint256, "to": p.address}, ),
    'swapTokensForExactTokens(uint256,uint256,address[],address,uint256)': fun("0x8803dbee", "swapTokensForExactTokens(uint256,uint256,address[],address,uint256)", {"amountOut": p.uint256, "amountInMax": p.uint256, "path": p.array(p.address), "to": p.address, "deadline": p.uint256}, p.array(p.uint256)),
    'swapTokensForExactTokens(address,address,uint256,uint256,address)': fun("0xf7d31809", "swapTokensForExactTokens(address,address,uint256,uint256,address)", {"inToken": p.address, "outToken": p.address, "amountOut": p.uint256, "amountInMax": p.uint256, "to": p.address}, ),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    token0: viewFun("0x0dfe1681", "token0()", {}, p.address),
    token1: viewFun("0xd21220a7", "token1()", {}, p.address),
    totalAssets: viewFun("0x01e1d114", "totalAssets()", {}, p.uint256),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    traderate0: viewFun("0x45059a6b", "traderate0()", {}, p.uint256),
    traderate1: viewFun("0xcf1de5d8", "traderate1()", {}, p.uint256),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"to": p.address, "value": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"from": p.address, "to": p.address, "value": p.uint256}, p.bool),
    weth: viewFun("0x3fc8cef3", "weth()", {}, p.address),
    withdrawalQueue: viewFun("0x37d5fe99", "withdrawalQueue()", {}, p.address),
    withdrawalRequests: viewFun("0x937b2581", "withdrawalRequests(uint256)", {"requestId": p.uint256}, {"withdrawer": p.address, "claimed": p.bool, "claimTimestamp": p.uint40, "assets": p.uint128, "queued": p.uint128}),
    withdrawsClaimable: viewFun("0x9fa3df9f", "withdrawsClaimable()", {}, p.uint128),
    withdrawsClaimed: viewFun("0x35ce81c4", "withdrawsClaimed()", {}, p.uint128),
    withdrawsQueued: viewFun("0x6ec68625", "withdrawsQueued()", {}, p.uint128),
}

export class Contract extends ContractBase {

    CLAIM_DELAY() {
        return this.eth_call(functions.CLAIM_DELAY, {})
    }

    FEE_SCALE() {
        return this.eth_call(functions.FEE_SCALE, {})
    }

    MAX_PRICE_DEVIATION() {
        return this.eth_call(functions.MAX_PRICE_DEVIATION, {})
    }

    PRICE_SCALE() {
        return this.eth_call(functions.PRICE_SCALE, {})
    }

    allowance(owner: AllowanceParams["owner"], spender: AllowanceParams["spender"]) {
        return this.eth_call(functions.allowance, {owner, spender})
    }

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(functions.balanceOf, {account})
    }

    convertToAssets(shares: ConvertToAssetsParams["shares"]) {
        return this.eth_call(functions.convertToAssets, {shares})
    }

    convertToShares(assets: ConvertToSharesParams["assets"]) {
        return this.eth_call(functions.convertToShares, {assets})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    fee() {
        return this.eth_call(functions.fee, {})
    }

    feeCollector() {
        return this.eth_call(functions.feeCollector, {})
    }

    feesAccrued() {
        return this.eth_call(functions.feesAccrued, {})
    }

    lastTotalAssets() {
        return this.eth_call(functions.lastTotalAssets, {})
    }

    liquidityAsset() {
        return this.eth_call(functions.liquidityAsset, {})
    }

    liquidityProviderController() {
        return this.eth_call(functions.liquidityProviderController, {})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    nextWithdrawalIndex() {
        return this.eth_call(functions.nextWithdrawalIndex, {})
    }

    operator() {
        return this.eth_call(functions.operator, {})
    }

    outstandingEther() {
        return this.eth_call(functions.outstandingEther, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    previewDeposit(assets: PreviewDepositParams["assets"]) {
        return this.eth_call(functions.previewDeposit, {assets})
    }

    previewRedeem(shares: PreviewRedeemParams["shares"]) {
        return this.eth_call(functions.previewRedeem, {shares})
    }

    steth() {
        return this.eth_call(functions.steth, {})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    token0() {
        return this.eth_call(functions.token0, {})
    }

    token1() {
        return this.eth_call(functions.token1, {})
    }

    totalAssets() {
        return this.eth_call(functions.totalAssets, {})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    traderate0() {
        return this.eth_call(functions.traderate0, {})
    }

    traderate1() {
        return this.eth_call(functions.traderate1, {})
    }

    weth() {
        return this.eth_call(functions.weth, {})
    }

    withdrawalQueue() {
        return this.eth_call(functions.withdrawalQueue, {})
    }

    withdrawalRequests(requestId: WithdrawalRequestsParams["requestId"]) {
        return this.eth_call(functions.withdrawalRequests, {requestId})
    }

    withdrawsClaimable() {
        return this.eth_call(functions.withdrawsClaimable, {})
    }

    withdrawsClaimed() {
        return this.eth_call(functions.withdrawsClaimed, {})
    }

    withdrawsQueued() {
        return this.eth_call(functions.withdrawsQueued, {})
    }
}

/// Event types
export type AdminChangedEventArgs = EParams<typeof events.AdminChanged>
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type FeeCalculatedEventArgs = EParams<typeof events.FeeCalculated>
export type FeeCollectedEventArgs = EParams<typeof events.FeeCollected>
export type FeeCollectorUpdatedEventArgs = EParams<typeof events.FeeCollectorUpdated>
export type FeeUpdatedEventArgs = EParams<typeof events.FeeUpdated>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type LiquidityProviderControllerUpdatedEventArgs = EParams<typeof events.LiquidityProviderControllerUpdated>
export type OperatorChangedEventArgs = EParams<typeof events.OperatorChanged>
export type RedeemClaimedEventArgs = EParams<typeof events.RedeemClaimed>
export type RedeemRequestedEventArgs = EParams<typeof events.RedeemRequested>
export type TraderateChangedEventArgs = EParams<typeof events.TraderateChanged>
export type TransferEventArgs = EParams<typeof events.Transfer>

/// Function types
export type CLAIM_DELAYParams = FunctionArguments<typeof functions.CLAIM_DELAY>
export type CLAIM_DELAYReturn = FunctionReturn<typeof functions.CLAIM_DELAY>

export type FEE_SCALEParams = FunctionArguments<typeof functions.FEE_SCALE>
export type FEE_SCALEReturn = FunctionReturn<typeof functions.FEE_SCALE>

export type MAX_PRICE_DEVIATIONParams = FunctionArguments<typeof functions.MAX_PRICE_DEVIATION>
export type MAX_PRICE_DEVIATIONReturn = FunctionReturn<typeof functions.MAX_PRICE_DEVIATION>

export type PRICE_SCALEParams = FunctionArguments<typeof functions.PRICE_SCALE>
export type PRICE_SCALEReturn = FunctionReturn<typeof functions.PRICE_SCALE>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type ApproveStETHParams = FunctionArguments<typeof functions.approveStETH>
export type ApproveStETHReturn = FunctionReturn<typeof functions.approveStETH>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type ClaimRedeemParams = FunctionArguments<typeof functions.claimRedeem>
export type ClaimRedeemReturn = FunctionReturn<typeof functions.claimRedeem>

export type ClaimStETHWithdrawalForWETHParams = FunctionArguments<typeof functions.claimStETHWithdrawalForWETH>
export type ClaimStETHWithdrawalForWETHReturn = FunctionReturn<typeof functions.claimStETHWithdrawalForWETH>

export type CollectFeesParams = FunctionArguments<typeof functions.collectFees>
export type CollectFeesReturn = FunctionReturn<typeof functions.collectFees>

export type ConvertToAssetsParams = FunctionArguments<typeof functions.convertToAssets>
export type ConvertToAssetsReturn = FunctionReturn<typeof functions.convertToAssets>

export type ConvertToSharesParams = FunctionArguments<typeof functions.convertToShares>
export type ConvertToSharesReturn = FunctionReturn<typeof functions.convertToShares>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type FeeParams = FunctionArguments<typeof functions.fee>
export type FeeReturn = FunctionReturn<typeof functions.fee>

export type FeeCollectorParams = FunctionArguments<typeof functions.feeCollector>
export type FeeCollectorReturn = FunctionReturn<typeof functions.feeCollector>

export type FeesAccruedParams = FunctionArguments<typeof functions.feesAccrued>
export type FeesAccruedReturn = FunctionReturn<typeof functions.feesAccrued>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type LastTotalAssetsParams = FunctionArguments<typeof functions.lastTotalAssets>
export type LastTotalAssetsReturn = FunctionReturn<typeof functions.lastTotalAssets>

export type LiquidityAssetParams = FunctionArguments<typeof functions.liquidityAsset>
export type LiquidityAssetReturn = FunctionReturn<typeof functions.liquidityAsset>

export type LiquidityProviderControllerParams = FunctionArguments<typeof functions.liquidityProviderController>
export type LiquidityProviderControllerReturn = FunctionReturn<typeof functions.liquidityProviderController>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type NextWithdrawalIndexParams = FunctionArguments<typeof functions.nextWithdrawalIndex>
export type NextWithdrawalIndexReturn = FunctionReturn<typeof functions.nextWithdrawalIndex>

export type OperatorParams = FunctionArguments<typeof functions.operator>
export type OperatorReturn = FunctionReturn<typeof functions.operator>

export type OutstandingEtherParams = FunctionArguments<typeof functions.outstandingEther>
export type OutstandingEtherReturn = FunctionReturn<typeof functions.outstandingEther>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PreviewDepositParams = FunctionArguments<typeof functions.previewDeposit>
export type PreviewDepositReturn = FunctionReturn<typeof functions.previewDeposit>

export type PreviewRedeemParams = FunctionArguments<typeof functions.previewRedeem>
export type PreviewRedeemReturn = FunctionReturn<typeof functions.previewRedeem>

export type RequestRedeemParams = FunctionArguments<typeof functions.requestRedeem>
export type RequestRedeemReturn = FunctionReturn<typeof functions.requestRedeem>

export type RequestStETHWithdrawalForETHParams = FunctionArguments<typeof functions.requestStETHWithdrawalForETH>
export type RequestStETHWithdrawalForETHReturn = FunctionReturn<typeof functions.requestStETHWithdrawalForETH>

export type SetFeeParams = FunctionArguments<typeof functions.setFee>
export type SetFeeReturn = FunctionReturn<typeof functions.setFee>

export type SetFeeCollectorParams = FunctionArguments<typeof functions.setFeeCollector>
export type SetFeeCollectorReturn = FunctionReturn<typeof functions.setFeeCollector>

export type SetLiquidityProviderControllerParams = FunctionArguments<typeof functions.setLiquidityProviderController>
export type SetLiquidityProviderControllerReturn = FunctionReturn<typeof functions.setLiquidityProviderController>

export type SetOperatorParams = FunctionArguments<typeof functions.setOperator>
export type SetOperatorReturn = FunctionReturn<typeof functions.setOperator>

export type SetOwnerParams = FunctionArguments<typeof functions.setOwner>
export type SetOwnerReturn = FunctionReturn<typeof functions.setOwner>

export type SetPricesParams = FunctionArguments<typeof functions.setPrices>
export type SetPricesReturn = FunctionReturn<typeof functions.setPrices>

export type StethParams = FunctionArguments<typeof functions.steth>
export type StethReturn = FunctionReturn<typeof functions.steth>

export type SwapExactTokensForTokensParams_0 = FunctionArguments<typeof functions['swapExactTokensForTokens(uint256,uint256,address[],address,uint256)']>
export type SwapExactTokensForTokensReturn_0 = FunctionReturn<typeof functions['swapExactTokensForTokens(uint256,uint256,address[],address,uint256)']>

export type SwapExactTokensForTokensParams_1 = FunctionArguments<typeof functions['swapExactTokensForTokens(address,address,uint256,uint256,address)']>
export type SwapExactTokensForTokensReturn_1 = FunctionReturn<typeof functions['swapExactTokensForTokens(address,address,uint256,uint256,address)']>

export type SwapTokensForExactTokensParams_0 = FunctionArguments<typeof functions['swapTokensForExactTokens(uint256,uint256,address[],address,uint256)']>
export type SwapTokensForExactTokensReturn_0 = FunctionReturn<typeof functions['swapTokensForExactTokens(uint256,uint256,address[],address,uint256)']>

export type SwapTokensForExactTokensParams_1 = FunctionArguments<typeof functions['swapTokensForExactTokens(address,address,uint256,uint256,address)']>
export type SwapTokensForExactTokensReturn_1 = FunctionReturn<typeof functions['swapTokensForExactTokens(address,address,uint256,uint256,address)']>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type Token0Params = FunctionArguments<typeof functions.token0>
export type Token0Return = FunctionReturn<typeof functions.token0>

export type Token1Params = FunctionArguments<typeof functions.token1>
export type Token1Return = FunctionReturn<typeof functions.token1>

export type TotalAssetsParams = FunctionArguments<typeof functions.totalAssets>
export type TotalAssetsReturn = FunctionReturn<typeof functions.totalAssets>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type Traderate0Params = FunctionArguments<typeof functions.traderate0>
export type Traderate0Return = FunctionReturn<typeof functions.traderate0>

export type Traderate1Params = FunctionArguments<typeof functions.traderate1>
export type Traderate1Return = FunctionReturn<typeof functions.traderate1>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type WethParams = FunctionArguments<typeof functions.weth>
export type WethReturn = FunctionReturn<typeof functions.weth>

export type WithdrawalQueueParams = FunctionArguments<typeof functions.withdrawalQueue>
export type WithdrawalQueueReturn = FunctionReturn<typeof functions.withdrawalQueue>

export type WithdrawalRequestsParams = FunctionArguments<typeof functions.withdrawalRequests>
export type WithdrawalRequestsReturn = FunctionReturn<typeof functions.withdrawalRequests>

export type WithdrawsClaimableParams = FunctionArguments<typeof functions.withdrawsClaimable>
export type WithdrawsClaimableReturn = FunctionReturn<typeof functions.withdrawsClaimable>

export type WithdrawsClaimedParams = FunctionArguments<typeof functions.withdrawsClaimed>
export type WithdrawsClaimedReturn = FunctionReturn<typeof functions.withdrawsClaimed>

export type WithdrawsQueuedParams = FunctionArguments<typeof functions.withdrawsQueued>
export type WithdrawsQueuedReturn = FunctionReturn<typeof functions.withdrawsQueued>

