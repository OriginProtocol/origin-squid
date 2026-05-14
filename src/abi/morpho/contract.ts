import { ContractBase } from '../abi.support.js'
import { DOMAIN_SEPARATOR, borrow, extSloads, feeRecipient, idToMarketParams, isAuthorized, isIrmEnabled, isLltvEnabled, liquidate, market, nonce, owner, position, repay, supply, withdraw } from './functions.js'
import type { BorrowParams, ExtSloadsParams, IdToMarketParamsParams, IsAuthorizedParams, IsIrmEnabledParams, IsLltvEnabledParams, LiquidateParams, MarketParams, NonceParams, PositionParams, RepayParams, SupplyParams, WithdrawParams } from './functions.js'

export class Contract extends ContractBase {
    DOMAIN_SEPARATOR() {
        return this.eth_call(DOMAIN_SEPARATOR, {})
    }

    borrow(marketParams: BorrowParams["marketParams"], assets: BorrowParams["assets"], shares: BorrowParams["shares"], onBehalf: BorrowParams["onBehalf"], receiver: BorrowParams["receiver"]) {
        return this.eth_call(borrow, {marketParams, assets, shares, onBehalf, receiver})
    }

    extSloads(slots: ExtSloadsParams["slots"]) {
        return this.eth_call(extSloads, {slots})
    }

    feeRecipient() {
        return this.eth_call(feeRecipient, {})
    }

    idToMarketParams(_0: IdToMarketParamsParams["_0"]) {
        return this.eth_call(idToMarketParams, {_0})
    }

    isAuthorized(_0: IsAuthorizedParams["_0"], _1: IsAuthorizedParams["_1"]) {
        return this.eth_call(isAuthorized, {_0, _1})
    }

    isIrmEnabled(_0: IsIrmEnabledParams["_0"]) {
        return this.eth_call(isIrmEnabled, {_0})
    }

    isLltvEnabled(_0: IsLltvEnabledParams["_0"]) {
        return this.eth_call(isLltvEnabled, {_0})
    }

    liquidate(marketParams: LiquidateParams["marketParams"], borrower: LiquidateParams["borrower"], seizedAssets: LiquidateParams["seizedAssets"], repaidShares: LiquidateParams["repaidShares"], data: LiquidateParams["data"]) {
        return this.eth_call(liquidate, {marketParams, borrower, seizedAssets, repaidShares, data})
    }

    market(_0: MarketParams["_0"]) {
        return this.eth_call(market, {_0})
    }

    nonce(_0: NonceParams["_0"]) {
        return this.eth_call(nonce, {_0})
    }

    owner() {
        return this.eth_call(owner, {})
    }

    position(_0: PositionParams["_0"], _1: PositionParams["_1"]) {
        return this.eth_call(position, {_0, _1})
    }

    repay(marketParams: RepayParams["marketParams"], assets: RepayParams["assets"], shares: RepayParams["shares"], onBehalf: RepayParams["onBehalf"], data: RepayParams["data"]) {
        return this.eth_call(repay, {marketParams, assets, shares, onBehalf, data})
    }

    supply(marketParams: SupplyParams["marketParams"], assets: SupplyParams["assets"], shares: SupplyParams["shares"], onBehalf: SupplyParams["onBehalf"], data: SupplyParams["data"]) {
        return this.eth_call(supply, {marketParams, assets, shares, onBehalf, data})
    }

    withdraw(marketParams: WithdrawParams["marketParams"], assets: WithdrawParams["assets"], shares: WithdrawParams["shares"], onBehalf: WithdrawParams["onBehalf"], receiver: WithdrawParams["receiver"]) {
        return this.eth_call(withdraw, {marketParams, assets, shares, onBehalf, receiver})
    }
}
