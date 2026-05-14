import { address, array, bool, bytes, bytes4, int128, int256, string, struct, uint128, uint16, uint256, uint40, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** FEE_SCALE() */
export const FEE_SCALE = func('0x8a5fddd8', {}, uint256)
export type FEE_SCALEParams = FunctionArguments<typeof FEE_SCALE>
export type FEE_SCALEReturn = FunctionReturn<typeof FEE_SCALE>

/** MAX_CROSS_PRICE_DEVIATION() */
export const MAX_CROSS_PRICE_DEVIATION = func('0x090b78c5', {}, uint256)
export type MAX_CROSS_PRICE_DEVIATIONParams = FunctionArguments<typeof MAX_CROSS_PRICE_DEVIATION>
export type MAX_CROSS_PRICE_DEVIATIONReturn = FunctionReturn<typeof MAX_CROSS_PRICE_DEVIATION>

/** PRICE_SCALE() */
export const PRICE_SCALE = func('0xc33f59d3', {}, uint256)
export type PRICE_SCALEParams = FunctionArguments<typeof PRICE_SCALE>
export type PRICE_SCALEReturn = FunctionReturn<typeof PRICE_SCALE>

/** activeMarket() */
export const activeMarket = func('0xce318c51', {}, address)
export type ActiveMarketParams = FunctionArguments<typeof activeMarket>
export type ActiveMarketReturn = FunctionReturn<typeof activeMarket>

/** addMarkets(address[]) */
export const addMarkets = func('0xda40385d', {
    _markets: array(address),
})
export type AddMarketsParams = FunctionArguments<typeof addMarkets>
export type AddMarketsReturn = FunctionReturn<typeof addMarkets>

/** allocate() */
export const allocate = func('0xabaa9916', {}, int256)
export type AllocateParams = FunctionArguments<typeof allocate>
export type AllocateReturn = FunctionReturn<typeof allocate>

/** allocateThreshold() */
export const allocateThreshold = func('0x4a8ff603', {}, int256)
export type AllocateThresholdParams = FunctionArguments<typeof allocateThreshold>
export type AllocateThresholdReturn = FunctionReturn<typeof allocateThreshold>

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
    value: uint256,
}, bool)
export type ApproveParams = FunctionArguments<typeof approve>
export type ApproveReturn = FunctionReturn<typeof approve>

/** armBuffer() */
export const armBuffer = func('0xa4c84f25', {}, uint256)
export type ArmBufferParams = FunctionArguments<typeof armBuffer>
export type ArmBufferReturn = FunctionReturn<typeof armBuffer>

/** asset() */
export const asset = func('0x38d52e0f', {}, address)
export type AssetParams = FunctionArguments<typeof asset>
export type AssetReturn = FunctionReturn<typeof asset>

/** balanceOf(address) */
export const balanceOf = func('0x70a08231', {
    account: address,
}, uint256)
export type BalanceOfParams = FunctionArguments<typeof balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof balanceOf>

/** baseAsset() */
export const baseAsset = func('0xcdf456e1', {}, address)
export type BaseAssetParams = FunctionArguments<typeof baseAsset>
export type BaseAssetReturn = FunctionReturn<typeof baseAsset>

/** capManager() */
export const capManager = func('0x6d785a87', {}, address)
export type CapManagerParams = FunctionArguments<typeof capManager>
export type CapManagerReturn = FunctionReturn<typeof capManager>

/** claimDelay() */
export const claimDelay = func('0x1c8ec299', {}, uint256)
export type ClaimDelayParams = FunctionArguments<typeof claimDelay>
export type ClaimDelayReturn = FunctionReturn<typeof claimDelay>

/** claimEtherFiWithdrawals(uint256[]) */
export const claimEtherFiWithdrawals = func('0xb45e2d75', {
    requestIds: array(uint256),
})
export type ClaimEtherFiWithdrawalsParams = FunctionArguments<typeof claimEtherFiWithdrawals>
export type ClaimEtherFiWithdrawalsReturn = FunctionReturn<typeof claimEtherFiWithdrawals>

/** claimRedeem(uint256) */
export const claimRedeem = func('0xe46cf747', {
    requestId: uint256,
}, uint256)
export type ClaimRedeemParams = FunctionArguments<typeof claimRedeem>
export type ClaimRedeemReturn = FunctionReturn<typeof claimRedeem>

/** claimable() */
export const claimable = func('0xaf38d757', {}, uint256)
export type ClaimableParams = FunctionArguments<typeof claimable>
export type ClaimableReturn = FunctionReturn<typeof claimable>

/** collectFees() */
export const collectFees = func('0xc8796572', {}, uint256)
export type CollectFeesParams = FunctionArguments<typeof collectFees>
export type CollectFeesReturn = FunctionReturn<typeof collectFees>

/** convertToAssets(uint256) */
export const convertToAssets = func('0x07a2d13a', {
    shares: uint256,
}, uint256)
export type ConvertToAssetsParams = FunctionArguments<typeof convertToAssets>
export type ConvertToAssetsReturn = FunctionReturn<typeof convertToAssets>

/** convertToShares(uint256) */
export const convertToShares = func('0xc6e6f592', {
    assets: uint256,
}, uint256)
export type ConvertToSharesParams = FunctionArguments<typeof convertToShares>
export type ConvertToSharesReturn = FunctionReturn<typeof convertToShares>

/** crossPrice() */
export const crossPrice = func('0xf5488330', {}, uint256)
export type CrossPriceParams = FunctionArguments<typeof crossPrice>
export type CrossPriceReturn = FunctionReturn<typeof crossPrice>

/** decimals() */
export const decimals = func('0x313ce567', {}, uint8)
export type DecimalsParams = FunctionArguments<typeof decimals>
export type DecimalsReturn = FunctionReturn<typeof decimals>

/** deposit(uint256,address) */
export const deposit = func('0x6e553f65', {
    assets: uint256,
    receiver: address,
}, uint256)
export type DepositParams = FunctionArguments<typeof deposit>
export type DepositReturn = FunctionReturn<typeof deposit>

/** deposit(uint256) */
export const deposit_1 = func('0xb6b55f25', {
    assets: uint256,
}, uint256)
export type DepositParams_1 = FunctionArguments<typeof deposit_1>
export type DepositReturn_1 = FunctionReturn<typeof deposit_1>

/** eeth() */
export const eeth = func('0x7f09217b', {}, address)
export type EethParams = FunctionArguments<typeof eeth>
export type EethReturn = FunctionReturn<typeof eeth>

/** etherfiRedemptionManager() */
export const etherfiRedemptionManager = func('0x92a97e1a', {}, address)
export type EtherfiRedemptionManagerParams = FunctionArguments<typeof etherfiRedemptionManager>
export type EtherfiRedemptionManagerReturn = FunctionReturn<typeof etherfiRedemptionManager>

/** etherfiWithdrawalNFT() */
export const etherfiWithdrawalNFT = func('0xa6b4d947', {}, address)
export type EtherfiWithdrawalNFTParams = FunctionArguments<typeof etherfiWithdrawalNFT>
export type EtherfiWithdrawalNFTReturn = FunctionReturn<typeof etherfiWithdrawalNFT>

/** etherfiWithdrawalQueue() */
export const etherfiWithdrawalQueue = func('0xf0b9510a', {}, address)
export type EtherfiWithdrawalQueueParams = FunctionArguments<typeof etherfiWithdrawalQueue>
export type EtherfiWithdrawalQueueReturn = FunctionReturn<typeof etherfiWithdrawalQueue>

/** etherfiWithdrawalQueueAmount() */
export const etherfiWithdrawalQueueAmount = func('0x9f809234', {}, uint256)
export type EtherfiWithdrawalQueueAmountParams = FunctionArguments<typeof etherfiWithdrawalQueueAmount>
export type EtherfiWithdrawalQueueAmountReturn = FunctionReturn<typeof etherfiWithdrawalQueueAmount>

/** etherfiWithdrawalRequests(uint256) */
export const etherfiWithdrawalRequests = func('0x56049dd9', {
    id: uint256,
}, uint256)
export type EtherfiWithdrawalRequestsParams = FunctionArguments<typeof etherfiWithdrawalRequests>
export type EtherfiWithdrawalRequestsReturn = FunctionReturn<typeof etherfiWithdrawalRequests>

/** fee() */
export const fee = func('0xddca3f43', {}, uint16)
export type FeeParams = FunctionArguments<typeof fee>
export type FeeReturn = FunctionReturn<typeof fee>

/** feeCollector() */
export const feeCollector = func('0xc415b95c', {}, address)
export type FeeCollectorParams = FunctionArguments<typeof feeCollector>
export type FeeCollectorReturn = FunctionReturn<typeof feeCollector>

/** feesAccrued() */
export const feesAccrued = func('0x94db0595', {}, uint256)
export type FeesAccruedParams = FunctionArguments<typeof feesAccrued>
export type FeesAccruedReturn = FunctionReturn<typeof feesAccrued>

/** getReserves() */
export const getReserves = func('0x0902f1ac', {}, struct({
    reserve0: uint256,
    reserve1: uint256,
}))
export type GetReservesParams = FunctionArguments<typeof getReserves>
export type GetReservesReturn = FunctionReturn<typeof getReserves>

/** initialize(string,string,address,uint256,address,address) */
export const initialize = func('0xb3ddda2a', {
    _name: string,
    _symbol: string,
    _operator: address,
    _fee: uint256,
    _feeCollector: address,
    _capManager: address,
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** lastAvailableAssets() */
export const lastAvailableAssets = func('0x2eb6328b', {}, int128)
export type LastAvailableAssetsParams = FunctionArguments<typeof lastAvailableAssets>
export type LastAvailableAssetsReturn = FunctionReturn<typeof lastAvailableAssets>

/** liquidityAsset() */
export const liquidityAsset = func('0x209b2bca', {}, address)
export type LiquidityAssetParams = FunctionArguments<typeof liquidityAsset>
export type LiquidityAssetReturn = FunctionReturn<typeof liquidityAsset>

/** minSharesToRedeem() */
export const minSharesToRedeem = func('0x50d0ea39', {}, uint256)
export type MinSharesToRedeemParams = FunctionArguments<typeof minSharesToRedeem>
export type MinSharesToRedeemReturn = FunctionReturn<typeof minSharesToRedeem>

/** name() */
export const name = func('0x06fdde03', {}, string)
export type NameParams = FunctionArguments<typeof name>
export type NameReturn = FunctionReturn<typeof name>

/** nextWithdrawalIndex() */
export const nextWithdrawalIndex = func('0xbba9282e', {}, uint256)
export type NextWithdrawalIndexParams = FunctionArguments<typeof nextWithdrawalIndex>
export type NextWithdrawalIndexReturn = FunctionReturn<typeof nextWithdrawalIndex>

/** onERC721Received(address,address,uint256,bytes) */
export const onERC721Received = func('0x150b7a02', {
    operator: address,
    from: address,
    tokenId: uint256,
    data: bytes,
}, bytes4)
export type OnERC721ReceivedParams = FunctionArguments<typeof onERC721Received>
export type OnERC721ReceivedReturn = FunctionReturn<typeof onERC721Received>

/** operator() */
export const operator = func('0x570ca735', {}, address)
export type OperatorParams = FunctionArguments<typeof operator>
export type OperatorReturn = FunctionReturn<typeof operator>

/** owner() */
export const owner = func('0x8da5cb5b', {}, address)
export type OwnerParams = FunctionArguments<typeof owner>
export type OwnerReturn = FunctionReturn<typeof owner>

/** previewDeposit(uint256) */
export const previewDeposit = func('0xef8b30f7', {
    assets: uint256,
}, uint256)
export type PreviewDepositParams = FunctionArguments<typeof previewDeposit>
export type PreviewDepositReturn = FunctionReturn<typeof previewDeposit>

/** previewRedeem(uint256) */
export const previewRedeem = func('0x4cdad506', {
    shares: uint256,
}, uint256)
export type PreviewRedeemParams = FunctionArguments<typeof previewRedeem>
export type PreviewRedeemReturn = FunctionReturn<typeof previewRedeem>

/** removeMarket(address) */
export const removeMarket = func('0xdb913236', {
    _market: address,
})
export type RemoveMarketParams = FunctionArguments<typeof removeMarket>
export type RemoveMarketReturn = FunctionReturn<typeof removeMarket>

/** requestEtherFiWithdrawal(uint256) */
export const requestEtherFiWithdrawal = func('0xad93a6aa', {
    amount: uint256,
}, uint256)
export type RequestEtherFiWithdrawalParams = FunctionArguments<typeof requestEtherFiWithdrawal>
export type RequestEtherFiWithdrawalReturn = FunctionReturn<typeof requestEtherFiWithdrawal>

/** requestRedeem(uint256) */
export const requestRedeem = func('0xaa2f892d', {
    shares: uint256,
}, struct({
    requestId: uint256,
    assets: uint256,
}))
export type RequestRedeemParams = FunctionArguments<typeof requestRedeem>
export type RequestRedeemReturn = FunctionReturn<typeof requestRedeem>

/** setARMBuffer(uint256) */
export const setARMBuffer = func('0x95f9e9e6', {
    _armBuffer: uint256,
})
export type SetARMBufferParams = FunctionArguments<typeof setARMBuffer>
export type SetARMBufferReturn = FunctionReturn<typeof setARMBuffer>

/** setActiveMarket(address) */
export const setActiveMarket = func('0xab710b24', {
    _market: address,
})
export type SetActiveMarketParams = FunctionArguments<typeof setActiveMarket>
export type SetActiveMarketReturn = FunctionReturn<typeof setActiveMarket>

/** setCapManager(address) */
export const setCapManager = func('0x0e608b30', {
    _capManager: address,
})
export type SetCapManagerParams = FunctionArguments<typeof setCapManager>
export type SetCapManagerReturn = FunctionReturn<typeof setCapManager>

/** setCrossPrice(uint256) */
export const setCrossPrice = func('0x30486f3c', {
    newCrossPrice: uint256,
})
export type SetCrossPriceParams = FunctionArguments<typeof setCrossPrice>
export type SetCrossPriceReturn = FunctionReturn<typeof setCrossPrice>

/** setFee(uint256) */
export const setFee = func('0x69fe0e2d', {
    _fee: uint256,
})
export type SetFeeParams = FunctionArguments<typeof setFee>
export type SetFeeReturn = FunctionReturn<typeof setFee>

/** setFeeCollector(address) */
export const setFeeCollector = func('0xa42dce80', {
    _feeCollector: address,
})
export type SetFeeCollectorParams = FunctionArguments<typeof setFeeCollector>
export type SetFeeCollectorReturn = FunctionReturn<typeof setFeeCollector>

/** setOperator(address) */
export const setOperator = func('0xb3ab15fb', {
    newOperator: address,
})
export type SetOperatorParams = FunctionArguments<typeof setOperator>
export type SetOperatorReturn = FunctionReturn<typeof setOperator>

/** setOwner(address) */
export const setOwner = func('0x13af4035', {
    newOwner: address,
})
export type SetOwnerParams = FunctionArguments<typeof setOwner>
export type SetOwnerReturn = FunctionReturn<typeof setOwner>

/** setPrices(uint256,uint256) */
export const setPrices = func('0x05fefda7', {
    buyT1: uint256,
    sellT1: uint256,
})
export type SetPricesParams = FunctionArguments<typeof setPrices>
export type SetPricesReturn = FunctionReturn<typeof setPrices>

/** supportedMarkets(address) */
export const supportedMarkets = func('0x20761fc4', {
    market: address,
}, bool)
export type SupportedMarketsParams = FunctionArguments<typeof supportedMarkets>
export type SupportedMarketsReturn = FunctionReturn<typeof supportedMarkets>

/** swapExactTokensForTokens(uint256,uint256,address[],address,uint256) */
export const swapExactTokensForTokens = func('0x38ed1739', {
    amountIn: uint256,
    amountOutMin: uint256,
    path: array(address),
    to: address,
    deadline: uint256,
}, array(uint256))
export type SwapExactTokensForTokensParams = FunctionArguments<typeof swapExactTokensForTokens>
export type SwapExactTokensForTokensReturn = FunctionReturn<typeof swapExactTokensForTokens>

/** swapExactTokensForTokens(address,address,uint256,uint256,address) */
export const swapExactTokensForTokens_1 = func('0x6c08c57e', {
    inToken: address,
    outToken: address,
    amountIn: uint256,
    amountOutMin: uint256,
    to: address,
})
export type SwapExactTokensForTokensParams_1 = FunctionArguments<typeof swapExactTokensForTokens_1>
export type SwapExactTokensForTokensReturn_1 = FunctionReturn<typeof swapExactTokensForTokens_1>

/** swapTokensForExactTokens(uint256,uint256,address[],address,uint256) */
export const swapTokensForExactTokens = func('0x8803dbee', {
    amountOut: uint256,
    amountInMax: uint256,
    path: array(address),
    to: address,
    deadline: uint256,
}, array(uint256))
export type SwapTokensForExactTokensParams = FunctionArguments<typeof swapTokensForExactTokens>
export type SwapTokensForExactTokensReturn = FunctionReturn<typeof swapTokensForExactTokens>

/** swapTokensForExactTokens(address,address,uint256,uint256,address) */
export const swapTokensForExactTokens_1 = func('0xf7d31809', {
    inToken: address,
    outToken: address,
    amountOut: uint256,
    amountInMax: uint256,
    to: address,
})
export type SwapTokensForExactTokensParams_1 = FunctionArguments<typeof swapTokensForExactTokens_1>
export type SwapTokensForExactTokensReturn_1 = FunctionReturn<typeof swapTokensForExactTokens_1>

/** symbol() */
export const symbol = func('0x95d89b41', {}, string)
export type SymbolParams = FunctionArguments<typeof symbol>
export type SymbolReturn = FunctionReturn<typeof symbol>

/** token0() */
export const token0 = func('0x0dfe1681', {}, address)
export type Token0Params = FunctionArguments<typeof token0>
export type Token0Return = FunctionReturn<typeof token0>

/** token1() */
export const token1 = func('0xd21220a7', {}, address)
export type Token1Params = FunctionArguments<typeof token1>
export type Token1Return = FunctionReturn<typeof token1>

/** totalAssets() */
export const totalAssets = func('0x01e1d114', {}, uint256)
export type TotalAssetsParams = FunctionArguments<typeof totalAssets>
export type TotalAssetsReturn = FunctionReturn<typeof totalAssets>

/** totalSupply() */
export const totalSupply = func('0x18160ddd', {}, uint256)
export type TotalSupplyParams = FunctionArguments<typeof totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof totalSupply>

/** traderate0() */
export const traderate0 = func('0x45059a6b', {}, uint256)
export type Traderate0Params = FunctionArguments<typeof traderate0>
export type Traderate0Return = FunctionReturn<typeof traderate0>

/** traderate1() */
export const traderate1 = func('0xcf1de5d8', {}, uint256)
export type Traderate1Params = FunctionArguments<typeof traderate1>
export type Traderate1Return = FunctionReturn<typeof traderate1>

/** transfer(address,uint256) */
export const transfer = func('0xa9059cbb', {
    to: address,
    value: uint256,
}, bool)
export type TransferParams = FunctionArguments<typeof transfer>
export type TransferReturn = FunctionReturn<typeof transfer>

/** transferFrom(address,address,uint256) */
export const transferFrom = func('0x23b872dd', {
    from: address,
    to: address,
    value: uint256,
}, bool)
export type TransferFromParams = FunctionArguments<typeof transferFrom>
export type TransferFromReturn = FunctionReturn<typeof transferFrom>

/** weth() */
export const weth = func('0x3fc8cef3', {}, address)
export type WethParams = FunctionArguments<typeof weth>
export type WethReturn = FunctionReturn<typeof weth>

/** withdrawalRequests(uint256) */
export const withdrawalRequests = func('0x937b2581', {
    requestId: uint256,
}, struct({
    withdrawer: address,
    claimed: bool,
    claimTimestamp: uint40,
    assets: uint128,
    queued: uint128,
}))
export type WithdrawalRequestsParams = FunctionArguments<typeof withdrawalRequests>
export type WithdrawalRequestsReturn = FunctionReturn<typeof withdrawalRequests>

/** withdrawsClaimed() */
export const withdrawsClaimed = func('0x35ce81c4', {}, uint128)
export type WithdrawsClaimedParams = FunctionArguments<typeof withdrawsClaimed>
export type WithdrawsClaimedReturn = FunctionReturn<typeof withdrawsClaimed>

/** withdrawsQueued() */
export const withdrawsQueued = func('0x6ec68625', {}, uint128)
export type WithdrawsQueuedParams = FunctionArguments<typeof withdrawsQueued>
export type WithdrawsQueuedReturn = FunctionReturn<typeof withdrawsQueued>
