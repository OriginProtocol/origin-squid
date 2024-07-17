import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Zap: event("0x9d0b99c299bdb5656c0c9db6e1886c612db5c2881760ea54ab244f6338b4ebd6", "Zap(address,address,uint256)", {"minter": indexed(p.address), "asset": indexed(p.address), "amount": p.uint256}),
}

export const functions = {
    deposit: fun("0xd0e30db0", "deposit()", {}, p.uint256),
    depositSFRXETH: fun("0xd443e97d", "depositSFRXETH(uint256,uint256)", {"amount": p.uint256, "minOETH": p.uint256}, p.uint256),
    frxeth: viewFun("0x6f708a9d", "frxeth()", {}, p.address),
    oeth: viewFun("0xccfe2a69", "oeth()", {}, p.address),
    sfrxeth: viewFun("0xa07311af", "sfrxeth()", {}, p.address),
    vault: viewFun("0xfbfa77cf", "vault()", {}, p.address),
    weth: viewFun("0x3fc8cef3", "weth()", {}, p.address),
}

export class Contract extends ContractBase {

    frxeth() {
        return this.eth_call(functions.frxeth, {})
    }

    oeth() {
        return this.eth_call(functions.oeth, {})
    }

    sfrxeth() {
        return this.eth_call(functions.sfrxeth, {})
    }

    vault() {
        return this.eth_call(functions.vault, {})
    }

    weth() {
        return this.eth_call(functions.weth, {})
    }
}

/// Event types
export type ZapEventArgs = EParams<typeof events.Zap>

/// Function types
export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type DepositSFRXETHParams = FunctionArguments<typeof functions.depositSFRXETH>
export type DepositSFRXETHReturn = FunctionReturn<typeof functions.depositSFRXETH>

export type FrxethParams = FunctionArguments<typeof functions.frxeth>
export type FrxethReturn = FunctionReturn<typeof functions.frxeth>

export type OethParams = FunctionArguments<typeof functions.oeth>
export type OethReturn = FunctionReturn<typeof functions.oeth>

export type SfrxethParams = FunctionArguments<typeof functions.sfrxeth>
export type SfrxethReturn = FunctionReturn<typeof functions.sfrxeth>

export type VaultParams = FunctionArguments<typeof functions.vault>
export type VaultReturn = FunctionReturn<typeof functions.vault>

export type WethParams = FunctionArguments<typeof functions.weth>
export type WethReturn = FunctionReturn<typeof functions.weth>

