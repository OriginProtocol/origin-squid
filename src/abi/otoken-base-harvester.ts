import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    GovernorshipTransferred: event("0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a", "GovernorshipTransferred(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    OperatorChanged: event("0xd58299b712891143e76310d5e664c4203c940a67db37cf856bdaa3c5c76a802c", "OperatorChanged(address,address)", {"oldOperator": p.address, "newOperator": p.address}),
    PendingGovernorshipTransfer: event("0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d", "PendingGovernorshipTransfer(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    RewardTokenSwapped: event("0xa861903141bc68b536d5048a576afcc645630e1b18a4296ef34cbd4d1407f709", "RewardTokenSwapped(address,address,uint8,uint256,uint256)", {"rewardToken": indexed(p.address), "swappedInto": indexed(p.address), "swapPlatform": p.uint8, "amountIn": p.uint256, "amountOut": p.uint256}),
    YieldSent: event("0x4c70885488a444f9f6af8660e35d1c356100677dff981e92b57e4be32d6619d1", "YieldSent(address,uint256,uint256)", {"recipient": p.address, "yield": p.uint256, "fee": p.uint256}),
}

export const functions = {
    aero: viewFun("0x26837eda", "aero()", {}, p.address),
    amoStrategy: viewFun("0xf6aa085d", "amoStrategy()", {}, p.address),
    claimGovernance: fun("0x5d36b190", "claimGovernance()", {}, ),
    governor: viewFun("0x0c340a24", "governor()", {}, p.address),
    harvest: fun("0x4641257d", "harvest()", {}, ),
    harvestAndSwap: fun("0x859e4b81", "harvestAndSwap(uint256,uint256,uint256,bool)", {"aeroToSwap": p.uint256, "minWETHExpected": p.uint256, "feeBps": p.uint256, "sendYieldToDripper": p.bool}, ),
    isGovernor: viewFun("0xc7af3352", "isGovernor()", {}, p.bool),
    operatorAddr: viewFun("0xf3f18c37", "operatorAddr()", {}, p.address),
    setOperatorAddr: fun("0x9e428552", "setOperatorAddr(address)", {"_operatorAddr": p.address}, ),
    swapRouter: viewFun("0xc31c9c07", "swapRouter()", {}, p.address),
    transferGovernance: fun("0xd38bfff4", "transferGovernance(address)", {"_newGovernor": p.address}, ),
    transferToken: fun("0x1072cbea", "transferToken(address,uint256)", {"_asset": p.address, "_amount": p.uint256}, ),
    vault: viewFun("0xfbfa77cf", "vault()", {}, p.address),
    weth: viewFun("0x3fc8cef3", "weth()", {}, p.address),
}

export class Contract extends ContractBase {

    aero() {
        return this.eth_call(functions.aero, {})
    }

    amoStrategy() {
        return this.eth_call(functions.amoStrategy, {})
    }

    governor() {
        return this.eth_call(functions.governor, {})
    }

    isGovernor() {
        return this.eth_call(functions.isGovernor, {})
    }

    operatorAddr() {
        return this.eth_call(functions.operatorAddr, {})
    }

    swapRouter() {
        return this.eth_call(functions.swapRouter, {})
    }

    vault() {
        return this.eth_call(functions.vault, {})
    }

    weth() {
        return this.eth_call(functions.weth, {})
    }
}

/// Event types
export type GovernorshipTransferredEventArgs = EParams<typeof events.GovernorshipTransferred>
export type OperatorChangedEventArgs = EParams<typeof events.OperatorChanged>
export type PendingGovernorshipTransferEventArgs = EParams<typeof events.PendingGovernorshipTransfer>
export type RewardTokenSwappedEventArgs = EParams<typeof events.RewardTokenSwapped>
export type YieldSentEventArgs = EParams<typeof events.YieldSent>

/// Function types
export type AeroParams = FunctionArguments<typeof functions.aero>
export type AeroReturn = FunctionReturn<typeof functions.aero>

export type AmoStrategyParams = FunctionArguments<typeof functions.amoStrategy>
export type AmoStrategyReturn = FunctionReturn<typeof functions.amoStrategy>

export type ClaimGovernanceParams = FunctionArguments<typeof functions.claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof functions.claimGovernance>

export type GovernorParams = FunctionArguments<typeof functions.governor>
export type GovernorReturn = FunctionReturn<typeof functions.governor>

export type HarvestParams = FunctionArguments<typeof functions.harvest>
export type HarvestReturn = FunctionReturn<typeof functions.harvest>

export type HarvestAndSwapParams = FunctionArguments<typeof functions.harvestAndSwap>
export type HarvestAndSwapReturn = FunctionReturn<typeof functions.harvestAndSwap>

export type IsGovernorParams = FunctionArguments<typeof functions.isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof functions.isGovernor>

export type OperatorAddrParams = FunctionArguments<typeof functions.operatorAddr>
export type OperatorAddrReturn = FunctionReturn<typeof functions.operatorAddr>

export type SetOperatorAddrParams = FunctionArguments<typeof functions.setOperatorAddr>
export type SetOperatorAddrReturn = FunctionReturn<typeof functions.setOperatorAddr>

export type SwapRouterParams = FunctionArguments<typeof functions.swapRouter>
export type SwapRouterReturn = FunctionReturn<typeof functions.swapRouter>

export type TransferGovernanceParams = FunctionArguments<typeof functions.transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof functions.transferGovernance>

export type TransferTokenParams = FunctionArguments<typeof functions.transferToken>
export type TransferTokenReturn = FunctionReturn<typeof functions.transferToken>

export type VaultParams = FunctionArguments<typeof functions.vault>
export type VaultReturn = FunctionReturn<typeof functions.vault>

export type WethParams = FunctionArguments<typeof functions.weth>
export type WethReturn = FunctionReturn<typeof functions.weth>

