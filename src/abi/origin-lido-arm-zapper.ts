import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AdminChanged: event("0x7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f", "AdminChanged(address,address)", {"previousAdmin": p.address, "newAdmin": p.address}),
    Zap: event("0x4a5e9c74490922edc73617d3f521bffd83682ac8c6d5bfe58d1386853c483dff", "Zap(address,uint256,uint256)", {"sender": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
}

export const functions = {
    deposit: fun("0xd0e30db0", "deposit()", {}, p.uint256),
    lidoArm: viewFun("0x0569dcad", "lidoArm()", {}, p.address),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    rescueERC20: fun("0x8cd4426d", "rescueERC20(address,uint256)", {"token": p.address, "amount": p.uint256}, ),
    setOwner: fun("0x13af4035", "setOwner(address)", {"newOwner": p.address}, ),
    weth: viewFun("0x3fc8cef3", "weth()", {}, p.address),
}

export class Contract extends ContractBase {

    lidoArm() {
        return this.eth_call(functions.lidoArm, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    weth() {
        return this.eth_call(functions.weth, {})
    }
}

/// Event types
export type AdminChangedEventArgs = EParams<typeof events.AdminChanged>
export type ZapEventArgs = EParams<typeof events.Zap>

/// Function types
export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type LidoArmParams = FunctionArguments<typeof functions.lidoArm>
export type LidoArmReturn = FunctionReturn<typeof functions.lidoArm>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type RescueERC20Params = FunctionArguments<typeof functions.rescueERC20>
export type RescueERC20Return = FunctionReturn<typeof functions.rescueERC20>

export type SetOwnerParams = FunctionArguments<typeof functions.setOwner>
export type SetOwnerReturn = FunctionReturn<typeof functions.setOwner>

export type WethParams = FunctionArguments<typeof functions.weth>
export type WethReturn = FunctionReturn<typeof functions.weth>

