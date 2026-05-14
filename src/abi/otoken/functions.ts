import { address, bool, string, struct, uint256, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** allowance(address,address) */
export const allowance = func('0xdd62ed3e', {
    _owner: address,
    _spender: address,
}, uint256)
export type AllowanceParams = FunctionArguments<typeof allowance>
export type AllowanceReturn = FunctionReturn<typeof allowance>

/** approve(address,uint256) */
export const approve = func('0x095ea7b3', {
    _spender: address,
    _value: uint256,
}, bool)
export type ApproveParams = FunctionArguments<typeof approve>
export type ApproveReturn = FunctionReturn<typeof approve>

/** balanceOf(address) */
export const balanceOf = func('0x70a08231', {
    _account: address,
}, uint256)
export type BalanceOfParams = FunctionArguments<typeof balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof balanceOf>

/** burn(address,uint256) */
export const burn = func('0x9dc29fac', {
    _account: address,
    _amount: uint256,
})
export type BurnParams = FunctionArguments<typeof burn>
export type BurnReturn = FunctionReturn<typeof burn>

/** changeSupply(uint256) */
export const changeSupply = func('0x39a7919f', {
    _newTotalSupply: uint256,
})
export type ChangeSupplyParams = FunctionArguments<typeof changeSupply>
export type ChangeSupplyReturn = FunctionReturn<typeof changeSupply>

/** claimGovernance() */
export const claimGovernance = func('0x5d36b190', {})
export type ClaimGovernanceParams = FunctionArguments<typeof claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof claimGovernance>

/** creditsBalanceOf(address) */
export const creditsBalanceOf = func('0xf9854bfc', {
    _account: address,
}, struct({
    _0: uint256,
    _1: uint256,
}))
export type CreditsBalanceOfParams = FunctionArguments<typeof creditsBalanceOf>
export type CreditsBalanceOfReturn = FunctionReturn<typeof creditsBalanceOf>

/** creditsBalanceOfHighres(address) */
export const creditsBalanceOfHighres = func('0xe5c4fffe', {
    _account: address,
}, struct({
    _0: uint256,
    _1: uint256,
    _2: bool,
}))
export type CreditsBalanceOfHighresParams = FunctionArguments<typeof creditsBalanceOfHighres>
export type CreditsBalanceOfHighresReturn = FunctionReturn<typeof creditsBalanceOfHighres>

/** decimals() */
export const decimals = func('0x313ce567', {}, uint8)
export type DecimalsParams = FunctionArguments<typeof decimals>
export type DecimalsReturn = FunctionReturn<typeof decimals>

/** delegateYield(address,address) */
export const delegateYield = func('0x9d01fc72', {
    _from: address,
    _to: address,
})
export type DelegateYieldParams = FunctionArguments<typeof delegateYield>
export type DelegateYieldReturn = FunctionReturn<typeof delegateYield>

/** governanceRebaseOptIn(address) */
export const governanceRebaseOptIn = func('0xbaa9c9db', {
    _account: address,
})
export type GovernanceRebaseOptInParams = FunctionArguments<typeof governanceRebaseOptIn>
export type GovernanceRebaseOptInReturn = FunctionReturn<typeof governanceRebaseOptIn>

/** governor() */
export const governor = func('0x0c340a24', {}, address)
export type GovernorParams = FunctionArguments<typeof governor>
export type GovernorReturn = FunctionReturn<typeof governor>

/** initialize(address,uint256) */
export const initialize = func('0xcd6dc687', {
    _vaultAddress: address,
    _initialCreditsPerToken: uint256,
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** isGovernor() */
export const isGovernor = func('0xc7af3352', {}, bool)
export type IsGovernorParams = FunctionArguments<typeof isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof isGovernor>

/** mint(address,uint256) */
export const mint = func('0x40c10f19', {
    _account: address,
    _amount: uint256,
})
export type MintParams = FunctionArguments<typeof mint>
export type MintReturn = FunctionReturn<typeof mint>

/** name() */
export const name = func('0x06fdde03', {}, string)
export type NameParams = FunctionArguments<typeof name>
export type NameReturn = FunctionReturn<typeof name>

/** nonRebasingCreditsPerToken(address) */
export const nonRebasingCreditsPerToken = func('0x609350cd', {
    _account: address,
}, uint256)
export type NonRebasingCreditsPerTokenParams = FunctionArguments<typeof nonRebasingCreditsPerToken>
export type NonRebasingCreditsPerTokenReturn = FunctionReturn<typeof nonRebasingCreditsPerToken>

/** nonRebasingSupply() */
export const nonRebasingSupply = func('0xe696393a', {}, uint256)
export type NonRebasingSupplyParams = FunctionArguments<typeof nonRebasingSupply>
export type NonRebasingSupplyReturn = FunctionReturn<typeof nonRebasingSupply>

/** rebaseOptIn() */
export const rebaseOptIn = func('0xf51b0fd4', {})
export type RebaseOptInParams = FunctionArguments<typeof rebaseOptIn>
export type RebaseOptInReturn = FunctionReturn<typeof rebaseOptIn>

/** rebaseOptOut() */
export const rebaseOptOut = func('0xc2376dff', {})
export type RebaseOptOutParams = FunctionArguments<typeof rebaseOptOut>
export type RebaseOptOutReturn = FunctionReturn<typeof rebaseOptOut>

/** rebaseState(address) */
export const rebaseState = func('0x456ee286', {
    _0: address,
}, uint8)
export type RebaseStateParams = FunctionArguments<typeof rebaseState>
export type RebaseStateReturn = FunctionReturn<typeof rebaseState>

/** rebasingCredits() */
export const rebasingCredits = func('0x077f22b7', {}, uint256)
export type RebasingCreditsParams = FunctionArguments<typeof rebasingCredits>
export type RebasingCreditsReturn = FunctionReturn<typeof rebasingCredits>

/** rebasingCreditsHighres() */
export const rebasingCreditsHighres = func('0x7d0d66ff', {}, uint256)
export type RebasingCreditsHighresParams = FunctionArguments<typeof rebasingCreditsHighres>
export type RebasingCreditsHighresReturn = FunctionReturn<typeof rebasingCreditsHighres>

/** rebasingCreditsPerToken() */
export const rebasingCreditsPerToken = func('0x6691cb3d', {}, uint256)
export type RebasingCreditsPerTokenParams = FunctionArguments<typeof rebasingCreditsPerToken>
export type RebasingCreditsPerTokenReturn = FunctionReturn<typeof rebasingCreditsPerToken>

/** rebasingCreditsPerTokenHighres() */
export const rebasingCreditsPerTokenHighres = func('0x7a46a9c5', {}, uint256)
export type RebasingCreditsPerTokenHighresParams = FunctionArguments<typeof rebasingCreditsPerTokenHighres>
export type RebasingCreditsPerTokenHighresReturn = FunctionReturn<typeof rebasingCreditsPerTokenHighres>

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
    _to: address,
    _value: uint256,
}, bool)
export type TransferParams = FunctionArguments<typeof transfer>
export type TransferReturn = FunctionReturn<typeof transfer>

/** transferFrom(address,address,uint256) */
export const transferFrom = func('0x23b872dd', {
    _from: address,
    _to: address,
    _value: uint256,
}, bool)
export type TransferFromParams = FunctionArguments<typeof transferFrom>
export type TransferFromReturn = FunctionReturn<typeof transferFrom>

/** transferGovernance(address) */
export const transferGovernance = func('0xd38bfff4', {
    _newGovernor: address,
})
export type TransferGovernanceParams = FunctionArguments<typeof transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof transferGovernance>

/** undelegateYield(address) */
export const undelegateYield = func('0x06a2da3d', {
    _from: address,
})
export type UndelegateYieldParams = FunctionArguments<typeof undelegateYield>
export type UndelegateYieldReturn = FunctionReturn<typeof undelegateYield>

/** vaultAddress() */
export const vaultAddress = func('0x430bf08a', {}, address)
export type VaultAddressParams = FunctionArguments<typeof vaultAddress>
export type VaultAddressReturn = FunctionReturn<typeof vaultAddress>

/** yieldFrom(address) */
export const yieldFrom = func('0x6b96be39', {
    _0: address,
}, address)
export type YieldFromParams = FunctionArguments<typeof yieldFrom>
export type YieldFromReturn = FunctionReturn<typeof yieldFrom>

/** yieldTo(address) */
export const yieldTo = func('0x5f5a8577', {
    _0: address,
}, address)
export type YieldToParams = FunctionArguments<typeof yieldTo>
export type YieldToReturn = FunctionReturn<typeof yieldTo>
