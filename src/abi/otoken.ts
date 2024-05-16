import * as p from '@subsquid/evm-codec'
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AccountRebasingDisabled: event("0x201ace89ad3f5ab7428b91989f6a50d1998791c7b94a0fa812fd64a57687165e", {"account": p.address}),
    AccountRebasingEnabled: event("0x19a249fa2050bac8314ac10e3ad420bd9825574bf750f58810c3c7adfc7b1c6f", {"account": p.address}),
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    GovernorshipTransferred: event("0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    PendingGovernorshipTransfer: event("0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    TotalSupplyUpdatedHighres: event("0x41645eb819d3011b13f97696a8109d14bfcddfaca7d063ec0564d62a3e257235", {"totalSupply": p.uint256, "rebasingCredits": p.uint256, "rebasingCreditsPerToken": p.uint256}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", {"from": indexed(p.address), "to": indexed(p.address), "value": p.uint256}),
}

export const functions = {
    _totalSupply: fun("0x3eaaf86b", {}, p.uint256),
    allowance: fun("0xdd62ed3e", {"_owner": p.address, "_spender": p.address}, p.uint256),
    approve: fun("0x095ea7b3", {"_spender": p.address, "_value": p.uint256}, p.bool),
    balanceOf: fun("0x70a08231", {"_account": p.address}, p.uint256),
    burn: fun("0x9dc29fac", {"account": p.address, "amount": p.uint256}, ),
    changeSupply: fun("0x39a7919f", {"_newTotalSupply": p.uint256}, ),
    claimGovernance: fun("0x5d36b190", {}, ),
    creditsBalanceOf: fun("0xf9854bfc", {"_account": p.address}, {"_0": p.uint256, "_1": p.uint256}),
    creditsBalanceOfHighres: fun("0xe5c4fffe", {"_account": p.address}, {"_0": p.uint256, "_1": p.uint256, "_2": p.bool}),
    decimals: fun("0x313ce567", {}, p.uint8),
    decreaseAllowance: fun("0xa457c2d7", {"_spender": p.address, "_subtractedValue": p.uint256}, p.bool),
    governanceRebaseOptIn: fun("0xbaa9c9db", {"_account": p.address}, ),
    governor: fun("0x0c340a24", {}, p.address),
    increaseAllowance: fun("0x39509351", {"_spender": p.address, "_addedValue": p.uint256}, p.bool),
    initialize: fun("0xf542033f", {"_nameArg": p.string, "_symbolArg": p.string, "_vaultAddress": p.address, "_initialCreditsPerToken": p.uint256}, ),
    isGovernor: fun("0xc7af3352", {}, p.bool),
    isUpgraded: fun("0x95ef84b9", {"_0": p.address}, p.uint256),
    mint: fun("0x40c10f19", {"_account": p.address, "_amount": p.uint256}, ),
    name: fun("0x06fdde03", {}, p.string),
    nonRebasingCreditsPerToken: fun("0x609350cd", {"_0": p.address}, p.uint256),
    nonRebasingSupply: fun("0xe696393a", {}, p.uint256),
    rebaseOptIn: fun("0xf51b0fd4", {}, ),
    rebaseOptOut: fun("0xc2376dff", {}, ),
    rebaseState: fun("0x456ee286", {"_0": p.address}, p.uint8),
    rebasingCredits: fun("0x077f22b7", {}, p.uint256),
    rebasingCreditsHighres: fun("0x7d0d66ff", {}, p.uint256),
    rebasingCreditsPerToken: fun("0x6691cb3d", {}, p.uint256),
    rebasingCreditsPerTokenHighres: fun("0x7a46a9c5", {}, p.uint256),
    symbol: fun("0x95d89b41", {}, p.string),
    totalSupply: fun("0x18160ddd", {}, p.uint256),
    transfer: fun("0xa9059cbb", {"_to": p.address, "_value": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", {"_from": p.address, "_to": p.address, "_value": p.uint256}, p.bool),
    transferGovernance: fun("0xd38bfff4", {"_newGovernor": p.address}, ),
    vaultAddress: fun("0x430bf08a", {}, p.address),
}

export class Contract extends ContractBase {

    _totalSupply() {
        return this.eth_call(functions._totalSupply, {})
    }

    allowance(_owner: AllowanceParams["_owner"], _spender: AllowanceParams["_spender"]) {
        return this.eth_call(functions.allowance, {_owner, _spender})
    }

    balanceOf(_account: BalanceOfParams["_account"]) {
        return this.eth_call(functions.balanceOf, {_account})
    }

    creditsBalanceOf(_account: CreditsBalanceOfParams["_account"]) {
        return this.eth_call(functions.creditsBalanceOf, {_account})
    }

    creditsBalanceOfHighres(_account: CreditsBalanceOfHighresParams["_account"]) {
        return this.eth_call(functions.creditsBalanceOfHighres, {_account})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    governor() {
        return this.eth_call(functions.governor, {})
    }

    isGovernor() {
        return this.eth_call(functions.isGovernor, {})
    }

    isUpgraded(_0: IsUpgradedParams["_0"]) {
        return this.eth_call(functions.isUpgraded, {_0})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    nonRebasingCreditsPerToken(_0: NonRebasingCreditsPerTokenParams["_0"]) {
        return this.eth_call(functions.nonRebasingCreditsPerToken, {_0})
    }

    nonRebasingSupply() {
        return this.eth_call(functions.nonRebasingSupply, {})
    }

    rebaseState(_0: RebaseStateParams["_0"]) {
        return this.eth_call(functions.rebaseState, {_0})
    }

    rebasingCredits() {
        return this.eth_call(functions.rebasingCredits, {})
    }

    rebasingCreditsHighres() {
        return this.eth_call(functions.rebasingCreditsHighres, {})
    }

    rebasingCreditsPerToken() {
        return this.eth_call(functions.rebasingCreditsPerToken, {})
    }

    rebasingCreditsPerTokenHighres() {
        return this.eth_call(functions.rebasingCreditsPerTokenHighres, {})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    vaultAddress() {
        return this.eth_call(functions.vaultAddress, {})
    }
}

/// Event types
export type AccountRebasingDisabledEventArgs = EParams<typeof events.AccountRebasingDisabled>
export type AccountRebasingEnabledEventArgs = EParams<typeof events.AccountRebasingEnabled>
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type GovernorshipTransferredEventArgs = EParams<typeof events.GovernorshipTransferred>
export type PendingGovernorshipTransferEventArgs = EParams<typeof events.PendingGovernorshipTransfer>
export type TotalSupplyUpdatedHighresEventArgs = EParams<typeof events.TotalSupplyUpdatedHighres>
export type TransferEventArgs = EParams<typeof events.Transfer>

/// Function types
export type _totalSupplyParams = FunctionArguments<typeof functions._totalSupply>
export type _totalSupplyReturn = FunctionReturn<typeof functions._totalSupply>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type BurnParams = FunctionArguments<typeof functions.burn>
export type BurnReturn = FunctionReturn<typeof functions.burn>

export type ChangeSupplyParams = FunctionArguments<typeof functions.changeSupply>
export type ChangeSupplyReturn = FunctionReturn<typeof functions.changeSupply>

export type ClaimGovernanceParams = FunctionArguments<typeof functions.claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof functions.claimGovernance>

export type CreditsBalanceOfParams = FunctionArguments<typeof functions.creditsBalanceOf>
export type CreditsBalanceOfReturn = FunctionReturn<typeof functions.creditsBalanceOf>

export type CreditsBalanceOfHighresParams = FunctionArguments<typeof functions.creditsBalanceOfHighres>
export type CreditsBalanceOfHighresReturn = FunctionReturn<typeof functions.creditsBalanceOfHighres>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DecreaseAllowanceParams = FunctionArguments<typeof functions.decreaseAllowance>
export type DecreaseAllowanceReturn = FunctionReturn<typeof functions.decreaseAllowance>

export type GovernanceRebaseOptInParams = FunctionArguments<typeof functions.governanceRebaseOptIn>
export type GovernanceRebaseOptInReturn = FunctionReturn<typeof functions.governanceRebaseOptIn>

export type GovernorParams = FunctionArguments<typeof functions.governor>
export type GovernorReturn = FunctionReturn<typeof functions.governor>

export type IncreaseAllowanceParams = FunctionArguments<typeof functions.increaseAllowance>
export type IncreaseAllowanceReturn = FunctionReturn<typeof functions.increaseAllowance>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsGovernorParams = FunctionArguments<typeof functions.isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof functions.isGovernor>

export type IsUpgradedParams = FunctionArguments<typeof functions.isUpgraded>
export type IsUpgradedReturn = FunctionReturn<typeof functions.isUpgraded>

export type MintParams = FunctionArguments<typeof functions.mint>
export type MintReturn = FunctionReturn<typeof functions.mint>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type NonRebasingCreditsPerTokenParams = FunctionArguments<typeof functions.nonRebasingCreditsPerToken>
export type NonRebasingCreditsPerTokenReturn = FunctionReturn<typeof functions.nonRebasingCreditsPerToken>

export type NonRebasingSupplyParams = FunctionArguments<typeof functions.nonRebasingSupply>
export type NonRebasingSupplyReturn = FunctionReturn<typeof functions.nonRebasingSupply>

export type RebaseOptInParams = FunctionArguments<typeof functions.rebaseOptIn>
export type RebaseOptInReturn = FunctionReturn<typeof functions.rebaseOptIn>

export type RebaseOptOutParams = FunctionArguments<typeof functions.rebaseOptOut>
export type RebaseOptOutReturn = FunctionReturn<typeof functions.rebaseOptOut>

export type RebaseStateParams = FunctionArguments<typeof functions.rebaseState>
export type RebaseStateReturn = FunctionReturn<typeof functions.rebaseState>

export type RebasingCreditsParams = FunctionArguments<typeof functions.rebasingCredits>
export type RebasingCreditsReturn = FunctionReturn<typeof functions.rebasingCredits>

export type RebasingCreditsHighresParams = FunctionArguments<typeof functions.rebasingCreditsHighres>
export type RebasingCreditsHighresReturn = FunctionReturn<typeof functions.rebasingCreditsHighres>

export type RebasingCreditsPerTokenParams = FunctionArguments<typeof functions.rebasingCreditsPerToken>
export type RebasingCreditsPerTokenReturn = FunctionReturn<typeof functions.rebasingCreditsPerToken>

export type RebasingCreditsPerTokenHighresParams = FunctionArguments<typeof functions.rebasingCreditsPerTokenHighres>
export type RebasingCreditsPerTokenHighresReturn = FunctionReturn<typeof functions.rebasingCreditsPerTokenHighres>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type TransferGovernanceParams = FunctionArguments<typeof functions.transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof functions.transferGovernance>

export type VaultAddressParams = FunctionArguments<typeof functions.vaultAddress>
export type VaultAddressReturn = FunctionReturn<typeof functions.vaultAddress>

