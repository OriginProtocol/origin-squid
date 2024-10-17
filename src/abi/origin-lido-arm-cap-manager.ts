import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AccountCapEnabled: event("0x4c563c575a56d9737f009e7e9c600134eb839aea992e7e6cae26a025f8c5574d", "AccountCapEnabled(bool)", {"enabled": p.bool}),
    AdminChanged: event("0x7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f", "AdminChanged(address,address)", {"previousAdmin": p.address, "newAdmin": p.address}),
    Initialized: event("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", {"version": p.uint64}),
    LiquidityProviderCap: event("0xd5641199fd66ba2e0225ec23448f19db5a5524b3133b8c21c462f32d61e29603", "LiquidityProviderCap(address,uint256)", {"liquidityProvider": indexed(p.address), "cap": p.uint256}),
    OperatorChanged: event("0x4721129e0e676ed6a92909bb24e853ccdd63ad72280cc2e974e38e480e0e6e54", "OperatorChanged(address)", {"newAdmin": p.address}),
    TotalAssetsCap: event("0xb237111e0971b3cc8dc65f6164aeb3bf03eabde0c4466dd4ce9e6973ee1a5354", "TotalAssetsCap(uint256)", {"cap": p.uint256}),
}

export const functions = {
    accountCapEnabled: viewFun("0x475b070c", "accountCapEnabled()", {}, p.bool),
    arm: viewFun("0x370419e5", "arm()", {}, p.address),
    initialize: fun("0xc4d66de8", "initialize(address)", {"_operator": p.address}, ),
    liquidityProviderCaps: viewFun("0xdb371e9c", "liquidityProviderCaps(address)", {"liquidityProvider": p.address}, p.uint256),
    operator: viewFun("0x570ca735", "operator()", {}, p.address),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    postDepositHook: fun("0x7dc46f61", "postDepositHook(address,uint256)", {"liquidityProvider": p.address, "assets": p.uint256}, ),
    setAccountCapEnabled: fun("0x1a0a4d9f", "setAccountCapEnabled(bool)", {"_accountCapEnabled": p.bool}, ),
    setLiquidityProviderCaps: fun("0xc3d97ad1", "setLiquidityProviderCaps(address[],uint256)", {"_liquidityProviders": p.array(p.address), "cap": p.uint256}, ),
    setOperator: fun("0xb3ab15fb", "setOperator(address)", {"newOperator": p.address}, ),
    setOwner: fun("0x13af4035", "setOwner(address)", {"newOwner": p.address}, ),
    setTotalAssetsCap: fun("0xfabd48ce", "setTotalAssetsCap(uint248)", {"_totalAssetsCap": p.uint248}, ),
    totalAssetsCap: viewFun("0x45f663dd", "totalAssetsCap()", {}, p.uint248),
}

export class Contract extends ContractBase {

    accountCapEnabled() {
        return this.eth_call(functions.accountCapEnabled, {})
    }

    arm() {
        return this.eth_call(functions.arm, {})
    }

    liquidityProviderCaps(liquidityProvider: LiquidityProviderCapsParams["liquidityProvider"]) {
        return this.eth_call(functions.liquidityProviderCaps, {liquidityProvider})
    }

    operator() {
        return this.eth_call(functions.operator, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    totalAssetsCap() {
        return this.eth_call(functions.totalAssetsCap, {})
    }
}

/// Event types
export type AccountCapEnabledEventArgs = EParams<typeof events.AccountCapEnabled>
export type AdminChangedEventArgs = EParams<typeof events.AdminChanged>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type LiquidityProviderCapEventArgs = EParams<typeof events.LiquidityProviderCap>
export type OperatorChangedEventArgs = EParams<typeof events.OperatorChanged>
export type TotalAssetsCapEventArgs = EParams<typeof events.TotalAssetsCap>

/// Function types
export type AccountCapEnabledParams = FunctionArguments<typeof functions.accountCapEnabled>
export type AccountCapEnabledReturn = FunctionReturn<typeof functions.accountCapEnabled>

export type ArmParams = FunctionArguments<typeof functions.arm>
export type ArmReturn = FunctionReturn<typeof functions.arm>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type LiquidityProviderCapsParams = FunctionArguments<typeof functions.liquidityProviderCaps>
export type LiquidityProviderCapsReturn = FunctionReturn<typeof functions.liquidityProviderCaps>

export type OperatorParams = FunctionArguments<typeof functions.operator>
export type OperatorReturn = FunctionReturn<typeof functions.operator>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PostDepositHookParams = FunctionArguments<typeof functions.postDepositHook>
export type PostDepositHookReturn = FunctionReturn<typeof functions.postDepositHook>

export type SetAccountCapEnabledParams = FunctionArguments<typeof functions.setAccountCapEnabled>
export type SetAccountCapEnabledReturn = FunctionReturn<typeof functions.setAccountCapEnabled>

export type SetLiquidityProviderCapsParams = FunctionArguments<typeof functions.setLiquidityProviderCaps>
export type SetLiquidityProviderCapsReturn = FunctionReturn<typeof functions.setLiquidityProviderCaps>

export type SetOperatorParams = FunctionArguments<typeof functions.setOperator>
export type SetOperatorReturn = FunctionReturn<typeof functions.setOperator>

export type SetOwnerParams = FunctionArguments<typeof functions.setOwner>
export type SetOwnerReturn = FunctionReturn<typeof functions.setOwner>

export type SetTotalAssetsCapParams = FunctionArguments<typeof functions.setTotalAssetsCap>
export type SetTotalAssetsCapReturn = FunctionReturn<typeof functions.setTotalAssetsCap>

export type TotalAssetsCapParams = FunctionArguments<typeof functions.totalAssetsCap>
export type TotalAssetsCapReturn = FunctionReturn<typeof functions.totalAssetsCap>

