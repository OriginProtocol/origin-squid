import { ContractBase } from '../abi.support.js'
import { accountCapEnabled, arm, liquidityProviderCaps, operator, owner, totalAssetsCap } from './functions.js'
import type { LiquidityProviderCapsParams } from './functions.js'

export class Contract extends ContractBase {
    accountCapEnabled() {
        return this.eth_call(accountCapEnabled, {})
    }

    arm() {
        return this.eth_call(arm, {})
    }

    liquidityProviderCaps(liquidityProvider: LiquidityProviderCapsParams["liquidityProvider"]) {
        return this.eth_call(liquidityProviderCaps, {liquidityProvider})
    }

    operator() {
        return this.eth_call(operator, {})
    }

    owner() {
        return this.eth_call(owner, {})
    }

    totalAssetsCap() {
        return this.eth_call(totalAssetsCap, {})
    }
}
