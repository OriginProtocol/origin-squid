import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    GovernorshipTransferred: event("0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a", "GovernorshipTransferred(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    NewAirDropRootHash: event("0x1ac9c006454d2d601a481473a37c95bf489c5923bd7c2a701757d4016a0f022d", "NewAirDropRootHash(uint8,bytes32,uint256)", {"stakeType": p.uint8, "rootHash": p.bytes32, "proofDepth": p.uint256}),
    NewDurations: event("0x180120279c2eb356244609197b5b64c0fbabd60f8d073b75aba771a296bb63d4", "NewDurations(address,uint256[])", {"user": indexed(p.address), "durations": p.array(p.uint256)}),
    NewRates: event("0xa804368c7f1a6216d92d17d9753b923dfc3da14ae33d231e8d79e39202e249c3", "NewRates(address,uint256[])", {"user": indexed(p.address), "rates": p.array(p.uint256)}),
    Paused: event("0xe8699cf681560fd07de85543bd994263f4557bdc5179dd702f256d15fd083e1d", "Paused(address,bool)", {"user": indexed(p.address), "yes": p.bool}),
    PendingGovernorshipTransfer: event("0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d", "PendingGovernorshipTransfer(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    "Staked(address,uint256,uint256,uint256)": event("0xb4caaf29adda3eefee3ad552a8e85058589bf834c7466cae4ee58787f70589ed", "Staked(address,uint256,uint256,uint256)", {"user": indexed(p.address), "amount": p.uint256, "duration": p.uint256, "rate": p.uint256}),
    StakesTransfered: event("0xd0ceb9c39a11711e51ee4b32b97b05d660d6229ecd8be94ce934fa9e77910263", "StakesTransfered(address,address,uint256)", {"fromUser": indexed(p.address), "toUser": p.address, "numStakes": p.uint256}),
    "Withdrawn(address,uint256,uint256)": event("0x92ccf450a286a957af52509bc1c9939d1a6a481783e142e41e2499f0bb66ebc6", "Withdrawn(address,uint256,uint256)", {"user": indexed(p.address), "amount": p.uint256, "stakedAmount": p.uint256}),
    Upgraded: event("0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b", "Upgraded(address)", {"implementation": indexed(p.address)}),
    "Staked(address,uint256)": event("0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d", "Staked(address,uint256)", {"user": indexed(p.address), "amount": p.uint256}),
    "Withdrawn(address,uint256)": event("0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5", "Withdrawn(address,uint256)", {"user": indexed(p.address), "amount": p.uint256}),
}

export class Contract extends ContractBase {
}

/// Event types
export type GovernorshipTransferredEventArgs = EParams<typeof events.GovernorshipTransferred>
export type NewAirDropRootHashEventArgs = EParams<typeof events.NewAirDropRootHash>
export type NewDurationsEventArgs = EParams<typeof events.NewDurations>
export type NewRatesEventArgs = EParams<typeof events.NewRates>
export type PausedEventArgs = EParams<typeof events.Paused>
export type PendingGovernorshipTransferEventArgs = EParams<typeof events.PendingGovernorshipTransfer>
export type StakedEventArgs_0 = EParams<typeof events["Staked(address,uint256,uint256,uint256)"]>
export type StakesTransferedEventArgs = EParams<typeof events.StakesTransfered>
export type WithdrawnEventArgs_0 = EParams<typeof events["Withdrawn(address,uint256,uint256)"]>
export type UpgradedEventArgs = EParams<typeof events.Upgraded>
export type StakedEventArgs_1 = EParams<typeof events["Staked(address,uint256)"]>
export type WithdrawnEventArgs_1 = EParams<typeof events["Withdrawn(address,uint256)"]>
