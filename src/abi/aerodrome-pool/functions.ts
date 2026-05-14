import { address, array, bool, bytes, bytes1, bytes32, string, struct, uint256, uint8 } from '@subsquid/evm-codec'
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

/** blockTimestampLast() */
export const blockTimestampLast = func('0xc5700a02', {}, uint256)
export type BlockTimestampLastParams = FunctionArguments<typeof blockTimestampLast>
export type BlockTimestampLastReturn = FunctionReturn<typeof blockTimestampLast>

/** burn(address) */
export const burn = func('0x89afcb44', {
    to: address,
}, struct({
    amount0: uint256,
    amount1: uint256,
}))
export type BurnParams = FunctionArguments<typeof burn>
export type BurnReturn = FunctionReturn<typeof burn>

/** claimFees() */
export const claimFees = func('0xd294f093', {}, struct({
    claimed0: uint256,
    claimed1: uint256,
}))
export type ClaimFeesParams = FunctionArguments<typeof claimFees>
export type ClaimFeesReturn = FunctionReturn<typeof claimFees>

/** claimable0(address) */
export const claimable0 = func('0x4d5a9f8a', {
    _0: address,
}, uint256)
export type Claimable0Params = FunctionArguments<typeof claimable0>
export type Claimable0Return = FunctionReturn<typeof claimable0>

/** claimable1(address) */
export const claimable1 = func('0xa1ac4d13', {
    _0: address,
}, uint256)
export type Claimable1Params = FunctionArguments<typeof claimable1>
export type Claimable1Return = FunctionReturn<typeof claimable1>

/** currentCumulativePrices() */
export const currentCumulativePrices = func('0x1df8c717', {}, struct({
    reserve0Cumulative: uint256,
    reserve1Cumulative: uint256,
    blockTimestamp: uint256,
}))
export type CurrentCumulativePricesParams = FunctionArguments<typeof currentCumulativePrices>
export type CurrentCumulativePricesReturn = FunctionReturn<typeof currentCumulativePrices>

/** decimals() */
export const decimals = func('0x313ce567', {}, uint8)
export type DecimalsParams = FunctionArguments<typeof decimals>
export type DecimalsReturn = FunctionReturn<typeof decimals>

/** decreaseAllowance(address,uint256) */
export const decreaseAllowance = func('0xa457c2d7', {
    spender: address,
    subtractedValue: uint256,
}, bool)
export type DecreaseAllowanceParams = FunctionArguments<typeof decreaseAllowance>
export type DecreaseAllowanceReturn = FunctionReturn<typeof decreaseAllowance>

/** eip712Domain() */
export const eip712Domain = func('0x84b0196e', {}, struct({
    fields: bytes1,
    name: string,
    version: string,
    chainId: uint256,
    verifyingContract: address,
    salt: bytes32,
    extensions: array(uint256),
}))
export type Eip712DomainParams = FunctionArguments<typeof eip712Domain>
export type Eip712DomainReturn = FunctionReturn<typeof eip712Domain>

/** factory() */
export const factory = func('0xc45a0155', {}, address)
export type FactoryParams = FunctionArguments<typeof factory>
export type FactoryReturn = FunctionReturn<typeof factory>

/** getAmountOut(uint256,address) */
export const getAmountOut = func('0xf140a35a', {
    amountIn: uint256,
    tokenIn: address,
}, uint256)
export type GetAmountOutParams = FunctionArguments<typeof getAmountOut>
export type GetAmountOutReturn = FunctionReturn<typeof getAmountOut>

/** getK() */
export const getK = func('0xee39e7a0', {}, uint256)
export type GetKParams = FunctionArguments<typeof getK>
export type GetKReturn = FunctionReturn<typeof getK>

/** getReserves() */
export const getReserves = func('0x0902f1ac', {}, struct({
    _reserve0: uint256,
    _reserve1: uint256,
    _blockTimestampLast: uint256,
}))
export type GetReservesParams = FunctionArguments<typeof getReserves>
export type GetReservesReturn = FunctionReturn<typeof getReserves>

/** increaseAllowance(address,uint256) */
export const increaseAllowance = func('0x39509351', {
    spender: address,
    addedValue: uint256,
}, bool)
export type IncreaseAllowanceParams = FunctionArguments<typeof increaseAllowance>
export type IncreaseAllowanceReturn = FunctionReturn<typeof increaseAllowance>

/** index0() */
export const index0 = func('0x32c0defd', {}, uint256)
export type Index0Params = FunctionArguments<typeof index0>
export type Index0Return = FunctionReturn<typeof index0>

/** index1() */
export const index1 = func('0xbda39cad', {}, uint256)
export type Index1Params = FunctionArguments<typeof index1>
export type Index1Return = FunctionReturn<typeof index1>

/** initialize(address,address,bool) */
export const initialize = func('0xe4bbb5a8', {
    _token0: address,
    _token1: address,
    _stable: bool,
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** lastObservation() */
export const lastObservation = func('0x8a7b8cf2', {}, struct({
    timestamp: uint256,
    reserve0Cumulative: uint256,
    reserve1Cumulative: uint256,
}))
export type LastObservationParams = FunctionArguments<typeof lastObservation>
export type LastObservationReturn = FunctionReturn<typeof lastObservation>

/** metadata() */
export const metadata = func('0x392f37e9', {}, struct({
    dec0: uint256,
    dec1: uint256,
    r0: uint256,
    r1: uint256,
    st: bool,
    t0: address,
    t1: address,
}))
export type MetadataParams = FunctionArguments<typeof metadata>
export type MetadataReturn = FunctionReturn<typeof metadata>

/** mint(address) */
export const mint = func('0x6a627842', {
    to: address,
}, uint256)
export type MintParams = FunctionArguments<typeof mint>
export type MintReturn = FunctionReturn<typeof mint>

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

/** observationLength() */
export const observationLength = func('0xebeb31db', {}, uint256)
export type ObservationLengthParams = FunctionArguments<typeof observationLength>
export type ObservationLengthReturn = FunctionReturn<typeof observationLength>

/** observations(uint256) */
export const observations = func('0x252c09d7', {
    _0: uint256,
}, struct({
    timestamp: uint256,
    reserve0Cumulative: uint256,
    reserve1Cumulative: uint256,
}))
export type ObservationsParams = FunctionArguments<typeof observations>
export type ObservationsReturn = FunctionReturn<typeof observations>

/** periodSize() */
export const periodSize = func('0xe4463eb2', {}, uint256)
export type PeriodSizeParams = FunctionArguments<typeof periodSize>
export type PeriodSizeReturn = FunctionReturn<typeof periodSize>

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

/** poolFees() */
export const poolFees = func('0x33580959', {}, address)
export type PoolFeesParams = FunctionArguments<typeof poolFees>
export type PoolFeesReturn = FunctionReturn<typeof poolFees>

/** prices(address,uint256,uint256) */
export const prices = func('0x5881c475', {
    tokenIn: address,
    amountIn: uint256,
    points: uint256,
}, array(uint256))
export type PricesParams = FunctionArguments<typeof prices>
export type PricesReturn = FunctionReturn<typeof prices>

/** quote(address,uint256,uint256) */
export const quote = func('0x9e8cc04b', {
    tokenIn: address,
    amountIn: uint256,
    granularity: uint256,
}, uint256)
export type QuoteParams = FunctionArguments<typeof quote>
export type QuoteReturn = FunctionReturn<typeof quote>

/** reserve0() */
export const reserve0 = func('0x443cb4bc', {}, uint256)
export type Reserve0Params = FunctionArguments<typeof reserve0>
export type Reserve0Return = FunctionReturn<typeof reserve0>

/** reserve0CumulativeLast() */
export const reserve0CumulativeLast = func('0xbf944dbc', {}, uint256)
export type Reserve0CumulativeLastParams = FunctionArguments<typeof reserve0CumulativeLast>
export type Reserve0CumulativeLastReturn = FunctionReturn<typeof reserve0CumulativeLast>

/** reserve1() */
export const reserve1 = func('0x5a76f25e', {}, uint256)
export type Reserve1Params = FunctionArguments<typeof reserve1>
export type Reserve1Return = FunctionReturn<typeof reserve1>

/** reserve1CumulativeLast() */
export const reserve1CumulativeLast = func('0xc245febc', {}, uint256)
export type Reserve1CumulativeLastParams = FunctionArguments<typeof reserve1CumulativeLast>
export type Reserve1CumulativeLastReturn = FunctionReturn<typeof reserve1CumulativeLast>

/** sample(address,uint256,uint256,uint256) */
export const sample = func('0x13345fe1', {
    tokenIn: address,
    amountIn: uint256,
    points: uint256,
    window: uint256,
}, array(uint256))
export type SampleParams = FunctionArguments<typeof sample>
export type SampleReturn = FunctionReturn<typeof sample>

/** setName(string) */
export const setName = func('0xc47f0027', {
    __name: string,
})
export type SetNameParams = FunctionArguments<typeof setName>
export type SetNameReturn = FunctionReturn<typeof setName>

/** setSymbol(string) */
export const setSymbol = func('0xb84c8246', {
    __symbol: string,
})
export type SetSymbolParams = FunctionArguments<typeof setSymbol>
export type SetSymbolReturn = FunctionReturn<typeof setSymbol>

/** skim(address) */
export const skim = func('0xbc25cf77', {
    to: address,
})
export type SkimParams = FunctionArguments<typeof skim>
export type SkimReturn = FunctionReturn<typeof skim>

/** stable() */
export const stable = func('0x22be3de1', {}, bool)
export type StableParams = FunctionArguments<typeof stable>
export type StableReturn = FunctionReturn<typeof stable>

/** supplyIndex0(address) */
export const supplyIndex0 = func('0x9f767c88', {
    _0: address,
}, uint256)
export type SupplyIndex0Params = FunctionArguments<typeof supplyIndex0>
export type SupplyIndex0Return = FunctionReturn<typeof supplyIndex0>

/** supplyIndex1(address) */
export const supplyIndex1 = func('0x205aabf1', {
    _0: address,
}, uint256)
export type SupplyIndex1Params = FunctionArguments<typeof supplyIndex1>
export type SupplyIndex1Return = FunctionReturn<typeof supplyIndex1>

/** swap(uint256,uint256,address,bytes) */
export const swap = func('0x022c0d9f', {
    amount0Out: uint256,
    amount1Out: uint256,
    to: address,
    data: bytes,
})
export type SwapParams = FunctionArguments<typeof swap>
export type SwapReturn = FunctionReturn<typeof swap>

/** symbol() */
export const symbol = func('0x95d89b41', {}, string)
export type SymbolParams = FunctionArguments<typeof symbol>
export type SymbolReturn = FunctionReturn<typeof symbol>

/** sync() */
export const sync = func('0xfff6cae9', {})
export type SyncParams = FunctionArguments<typeof sync>
export type SyncReturn = FunctionReturn<typeof sync>

/** token0() */
export const token0 = func('0x0dfe1681', {}, address)
export type Token0Params = FunctionArguments<typeof token0>
export type Token0Return = FunctionReturn<typeof token0>

/** token1() */
export const token1 = func('0xd21220a7', {}, address)
export type Token1Params = FunctionArguments<typeof token1>
export type Token1Return = FunctionReturn<typeof token1>

/** tokens() */
export const tokens = func('0x9d63848a', {}, struct({
    _0: address,
    _1: address,
}))
export type TokensParams = FunctionArguments<typeof tokens>
export type TokensReturn = FunctionReturn<typeof tokens>

/** totalSupply() */
export const totalSupply = func('0x18160ddd', {}, uint256)
export type TotalSupplyParams = FunctionArguments<typeof totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof totalSupply>

/** transfer(address,uint256) */
export const transfer = func('0xa9059cbb', {
    to: address,
    amount: uint256,
}, bool)
export type TransferParams = FunctionArguments<typeof transfer>
export type TransferReturn = FunctionReturn<typeof transfer>

/** transferFrom(address,address,uint256) */
export const transferFrom = func('0x23b872dd', {
    from: address,
    to: address,
    amount: uint256,
}, bool)
export type TransferFromParams = FunctionArguments<typeof transferFrom>
export type TransferFromReturn = FunctionReturn<typeof transferFrom>
