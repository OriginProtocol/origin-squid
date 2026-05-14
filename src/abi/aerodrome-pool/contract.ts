import { ContractBase } from '../abi.support.js'
import { DOMAIN_SEPARATOR, allowance, approve, balanceOf, blockTimestampLast, burn, claimFees, claimable0, claimable1, currentCumulativePrices, decimals, decreaseAllowance, eip712Domain, factory, getAmountOut, getK, getReserves, increaseAllowance, index0, index1, lastObservation, metadata, mint, name, nonces, observationLength, observations, periodSize, poolFees, prices, quote, reserve0, reserve0CumulativeLast, reserve1, reserve1CumulativeLast, sample, stable, supplyIndex0, supplyIndex1, symbol, token0, token1, tokens, totalSupply, transfer, transferFrom } from './functions.js'
import type { AllowanceParams, ApproveParams, BalanceOfParams, BurnParams, Claimable0Params, Claimable1Params, DecreaseAllowanceParams, GetAmountOutParams, IncreaseAllowanceParams, MintParams, NoncesParams, ObservationsParams, PricesParams, QuoteParams, SampleParams, SupplyIndex0Params, SupplyIndex1Params, TransferFromParams, TransferParams } from './functions.js'

export class Contract extends ContractBase {
    DOMAIN_SEPARATOR() {
        return this.eth_call(DOMAIN_SEPARATOR, {})
    }

    allowance(owner: AllowanceParams["owner"], spender: AllowanceParams["spender"]) {
        return this.eth_call(allowance, {owner, spender})
    }

    approve(spender: ApproveParams["spender"], amount: ApproveParams["amount"]) {
        return this.eth_call(approve, {spender, amount})
    }

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(balanceOf, {account})
    }

    blockTimestampLast() {
        return this.eth_call(blockTimestampLast, {})
    }

    burn(to: BurnParams["to"]) {
        return this.eth_call(burn, {to})
    }

    claimFees() {
        return this.eth_call(claimFees, {})
    }

    claimable0(_0: Claimable0Params["_0"]) {
        return this.eth_call(claimable0, {_0})
    }

    claimable1(_0: Claimable1Params["_0"]) {
        return this.eth_call(claimable1, {_0})
    }

    currentCumulativePrices() {
        return this.eth_call(currentCumulativePrices, {})
    }

    decimals() {
        return this.eth_call(decimals, {})
    }

    decreaseAllowance(spender: DecreaseAllowanceParams["spender"], subtractedValue: DecreaseAllowanceParams["subtractedValue"]) {
        return this.eth_call(decreaseAllowance, {spender, subtractedValue})
    }

    eip712Domain() {
        return this.eth_call(eip712Domain, {})
    }

    factory() {
        return this.eth_call(factory, {})
    }

    getAmountOut(amountIn: GetAmountOutParams["amountIn"], tokenIn: GetAmountOutParams["tokenIn"]) {
        return this.eth_call(getAmountOut, {amountIn, tokenIn})
    }

    getK() {
        return this.eth_call(getK, {})
    }

    getReserves() {
        return this.eth_call(getReserves, {})
    }

    increaseAllowance(spender: IncreaseAllowanceParams["spender"], addedValue: IncreaseAllowanceParams["addedValue"]) {
        return this.eth_call(increaseAllowance, {spender, addedValue})
    }

    index0() {
        return this.eth_call(index0, {})
    }

    index1() {
        return this.eth_call(index1, {})
    }

    lastObservation() {
        return this.eth_call(lastObservation, {})
    }

    metadata() {
        return this.eth_call(metadata, {})
    }

    mint(to: MintParams["to"]) {
        return this.eth_call(mint, {to})
    }

    name() {
        return this.eth_call(name, {})
    }

    nonces(owner: NoncesParams["owner"]) {
        return this.eth_call(nonces, {owner})
    }

    observationLength() {
        return this.eth_call(observationLength, {})
    }

    observations(_0: ObservationsParams["_0"]) {
        return this.eth_call(observations, {_0})
    }

    periodSize() {
        return this.eth_call(periodSize, {})
    }

    poolFees() {
        return this.eth_call(poolFees, {})
    }

    prices(tokenIn: PricesParams["tokenIn"], amountIn: PricesParams["amountIn"], points: PricesParams["points"]) {
        return this.eth_call(prices, {tokenIn, amountIn, points})
    }

    quote(tokenIn: QuoteParams["tokenIn"], amountIn: QuoteParams["amountIn"], granularity: QuoteParams["granularity"]) {
        return this.eth_call(quote, {tokenIn, amountIn, granularity})
    }

    reserve0() {
        return this.eth_call(reserve0, {})
    }

    reserve0CumulativeLast() {
        return this.eth_call(reserve0CumulativeLast, {})
    }

    reserve1() {
        return this.eth_call(reserve1, {})
    }

    reserve1CumulativeLast() {
        return this.eth_call(reserve1CumulativeLast, {})
    }

    sample(tokenIn: SampleParams["tokenIn"], amountIn: SampleParams["amountIn"], points: SampleParams["points"], window: SampleParams["window"]) {
        return this.eth_call(sample, {tokenIn, amountIn, points, window})
    }

    stable() {
        return this.eth_call(stable, {})
    }

    supplyIndex0(_0: SupplyIndex0Params["_0"]) {
        return this.eth_call(supplyIndex0, {_0})
    }

    supplyIndex1(_0: SupplyIndex1Params["_0"]) {
        return this.eth_call(supplyIndex1, {_0})
    }

    symbol() {
        return this.eth_call(symbol, {})
    }

    token0() {
        return this.eth_call(token0, {})
    }

    token1() {
        return this.eth_call(token1, {})
    }

    tokens() {
        return this.eth_call(tokens, {})
    }

    totalSupply() {
        return this.eth_call(totalSupply, {})
    }

    transfer(to: TransferParams["to"], amount: TransferParams["amount"]) {
        return this.eth_call(transfer, {to, amount})
    }

    transferFrom(from: TransferFromParams["from"], to: TransferFromParams["to"], amount: TransferFromParams["amount"]) {
        return this.eth_call(transferFrom, {from, to, amount})
    }
}
