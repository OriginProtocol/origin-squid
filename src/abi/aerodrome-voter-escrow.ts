import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "approved": indexed(p.address), "tokenId": indexed(p.uint256)}),
    ApprovalForAll: event("0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31", "ApprovalForAll(address,address,bool)", {"owner": indexed(p.address), "operator": indexed(p.address), "approved": p.bool}),
    BatchMetadataUpdate: event("0x6bd5c950a8d8df17f772f5af37cb3655737899cbf903264b9795592da439661c", "BatchMetadataUpdate(uint256,uint256)", {"_fromTokenId": p.uint256, "_toTokenId": p.uint256}),
    CreateManaged: event("0xae65a147ec014982132ce8b32019735e3c5f41457848d2ce2e2c3e0cbc9df7bc", "CreateManaged(address,uint256,address,address,address)", {"_to": indexed(p.address), "_mTokenId": indexed(p.uint256), "_from": indexed(p.address), "_lockedManagedReward": p.address, "_freeManagedReward": p.address}),
    DelegateChanged: event("0xf1aa2a9e40138176a3ee6099df056f5c175f8511a0d8b8275d94d1ea5de46773", "DelegateChanged(address,uint256,uint256)", {"delegator": indexed(p.address), "fromDelegate": indexed(p.uint256), "toDelegate": indexed(p.uint256)}),
    DelegateVotesChanged: event("0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724", "DelegateVotesChanged(address,uint256,uint256)", {"delegate": indexed(p.address), "previousBalance": p.uint256, "newBalance": p.uint256}),
    Deposit: event("0x8835c22a0c751188de86681e15904223c054bedd5c68ec8858945b7831290273", "Deposit(address,uint256,uint8,uint256,uint256,uint256)", {"provider": indexed(p.address), "tokenId": indexed(p.uint256), "depositType": indexed(p.uint8), "value": p.uint256, "locktime": p.uint256, "ts": p.uint256}),
    DepositManaged: event("0xf7757ce35992f4ee014dee2e0c97ed6245758960a6ecc9e124897a5fb7b01423", "DepositManaged(address,uint256,uint256,uint256,uint256)", {"_owner": indexed(p.address), "_tokenId": indexed(p.uint256), "_mTokenId": indexed(p.uint256), "_weight": p.uint256, "_ts": p.uint256}),
    LockPermanent: event("0x793cb7a30a4bb8669ec607dfcbdc93f5a3e9d282f38191fddab43ccaf79efb80", "LockPermanent(address,uint256,uint256,uint256)", {"_owner": indexed(p.address), "_tokenId": indexed(p.uint256), "amount": p.uint256, "_ts": p.uint256}),
    Merge: event("0x986e3c958e3bdf1f58c2150357fc94624dd4e77b08f9802d8e2e885fa0d6a198", "Merge(address,uint256,uint256,uint256,uint256,uint256,uint256,uint256)", {"_sender": indexed(p.address), "_from": indexed(p.uint256), "_to": indexed(p.uint256), "_amountFrom": p.uint256, "_amountTo": p.uint256, "_amountFinal": p.uint256, "_locktime": p.uint256, "_ts": p.uint256}),
    MetadataUpdate: event("0xf8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7", "MetadataUpdate(uint256)", {"_tokenId": p.uint256}),
    SetAllowedManager: event("0x1a6ce72407c68def4b7d2e724c896070d89cf2b2a2dd56b6897b5febd88420f5", "SetAllowedManager(address)", {"_allowedManager": indexed(p.address)}),
    Split: event("0x8303de8187a6102fdc3fe20c756dddd68df0ae027b77e2391c19a855e0821f33", "Split(uint256,uint256,uint256,address,uint256,uint256,uint256,uint256)", {"_from": indexed(p.uint256), "_tokenId1": indexed(p.uint256), "_tokenId2": indexed(p.uint256), "_sender": p.address, "_splitAmount1": p.uint256, "_splitAmount2": p.uint256, "_locktime": p.uint256, "_ts": p.uint256}),
    Supply: event("0x5e2aa66efd74cce82b21852e317e5490d9ecc9e6bb953ae24d90851258cc2f5c", "Supply(uint256,uint256)", {"prevSupply": p.uint256, "supply": p.uint256}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "tokenId": indexed(p.uint256)}),
    UnlockPermanent: event("0x668d293c0a181c1f163fd0d3c757239a9c17bd26c5e483150e374455433b27fa", "UnlockPermanent(address,uint256,uint256,uint256)", {"_owner": indexed(p.address), "_tokenId": indexed(p.uint256), "amount": p.uint256, "_ts": p.uint256}),
    Withdraw: event("0x02f25270a4d87bea75db541cdfe559334a275b4a233520ed6c0a2429667cca94", "Withdraw(address,uint256,uint256,uint256)", {"provider": indexed(p.address), "tokenId": indexed(p.uint256), "value": p.uint256, "ts": p.uint256}),
    WithdrawManaged: event("0x5319474ec1e9d118585a40e615ea37be254007e6bb5b039756c3813c2d135489", "WithdrawManaged(address,uint256,uint256,uint256,uint256)", {"_owner": indexed(p.address), "_tokenId": indexed(p.uint256), "_mTokenId": indexed(p.uint256), "_weight": p.uint256, "_ts": p.uint256}),
}

export const functions = {
    CLOCK_MODE: viewFun("0x4bf5d7e9", "CLOCK_MODE()", {}, p.string),
    DELEGATION_TYPEHASH: viewFun("0xe7a324dc", "DELEGATION_TYPEHASH()", {}, p.bytes32),
    DOMAIN_TYPEHASH: viewFun("0x20606b70", "DOMAIN_TYPEHASH()", {}, p.bytes32),
    allowedManager: viewFun("0x2f7f9ba9", "allowedManager()", {}, p.address),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"_approved": p.address, "_tokenId": p.uint256}, ),
    artProxy: viewFun("0x5594a045", "artProxy()", {}, p.address),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"_owner": p.address}, p.uint256),
    balanceOfNFT: viewFun("0xe7e242d4", "balanceOfNFT(uint256)", {"_tokenId": p.uint256}, p.uint256),
    balanceOfNFTAt: viewFun("0xe0514aba", "balanceOfNFTAt(uint256,uint256)", {"_tokenId": p.uint256, "_t": p.uint256}, p.uint256),
    canSplit: viewFun("0x3d085a37", "canSplit(address)", {"_0": p.address}, p.bool),
    checkpoint: fun("0xc2c4c5c1", "checkpoint()", {}, ),
    checkpoints: viewFun("0xf04cb3a8", "checkpoints(uint256,uint48)", {"_tokenId": p.uint256, "_index": p.uint48}, p.struct({"fromTimestamp": p.uint256, "owner": p.address, "delegatedBalance": p.uint256, "delegatee": p.uint256})),
    clock: viewFun("0x91ddadf4", "clock()", {}, p.uint48),
    createLock: fun("0xb52c05fe", "createLock(uint256,uint256)", {"_value": p.uint256, "_lockDuration": p.uint256}, p.uint256),
    createLockFor: fun("0xec32e6df", "createLockFor(uint256,uint256,address)", {"_value": p.uint256, "_lockDuration": p.uint256, "_to": p.address}, p.uint256),
    createManagedLockFor: fun("0x3a6396a5", "createManagedLockFor(address)", {"_to": p.address}, p.uint256),
    deactivated: viewFun("0xa899b36c", "deactivated(uint256)", {"_0": p.uint256}, p.bool),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    delegate: fun("0xd9a34952", "delegate(uint256,uint256)", {"delegator": p.uint256, "delegatee": p.uint256}, ),
    delegateBySig: fun("0x834b0b69", "delegateBySig(uint256,uint256,uint256,uint256,uint8,bytes32,bytes32)", {"delegator": p.uint256, "delegatee": p.uint256, "nonce": p.uint256, "expiry": p.uint256, "v": p.uint8, "r": p.bytes32, "s": p.bytes32}, ),
    delegates: viewFun("0xb1548afc", "delegates(uint256)", {"delegator": p.uint256}, p.uint256),
    depositFor: fun("0x0ec84dda", "depositFor(uint256,uint256)", {"_tokenId": p.uint256, "_value": p.uint256}, ),
    depositManaged: fun("0xe0c11f9a", "depositManaged(uint256,uint256)", {"_tokenId": p.uint256, "_mTokenId": p.uint256}, ),
    distributor: viewFun("0xbfe10928", "distributor()", {}, p.address),
    epoch: viewFun("0x900cf0cf", "epoch()", {}, p.uint256),
    escrowType: viewFun("0x7c728000", "escrowType(uint256)", {"_0": p.uint256}, p.uint8),
    factoryRegistry: viewFun("0x3bf0c9fb", "factoryRegistry()", {}, p.address),
    forwarder: viewFun("0xf645d4f9", "forwarder()", {}, p.address),
    getApproved: viewFun("0x081812fc", "getApproved(uint256)", {"_tokenId": p.uint256}, p.address),
    getPastTotalSupply: viewFun("0x8e539e8c", "getPastTotalSupply(uint256)", {"_timestamp": p.uint256}, p.uint256),
    getPastVotes: viewFun("0x4d6fb775", "getPastVotes(address,uint256,uint256)", {"_account": p.address, "_tokenId": p.uint256, "_timestamp": p.uint256}, p.uint256),
    idToManaged: viewFun("0x19a0a9d5", "idToManaged(uint256)", {"_0": p.uint256}, p.uint256),
    increaseAmount: fun("0xb2383e55", "increaseAmount(uint256,uint256)", {"_tokenId": p.uint256, "_value": p.uint256}, ),
    increaseUnlockTime: fun("0x9d507b8b", "increaseUnlockTime(uint256,uint256)", {"_tokenId": p.uint256, "_lockDuration": p.uint256}, ),
    isApprovedForAll: viewFun("0xe985e9c5", "isApprovedForAll(address,address)", {"_owner": p.address, "_operator": p.address}, p.bool),
    isApprovedOrOwner: viewFun("0x430c2081", "isApprovedOrOwner(address,uint256)", {"_spender": p.address, "_tokenId": p.uint256}, p.bool),
    isTrustedForwarder: viewFun("0x572b6c05", "isTrustedForwarder(address)", {"forwarder": p.address}, p.bool),
    lockPermanent: fun("0xe75b1c2e", "lockPermanent(uint256)", {"_tokenId": p.uint256}, ),
    locked: viewFun("0xb45a3c0e", "locked(uint256)", {"_tokenId": p.uint256}, p.struct({"amount": p.int128, "end": p.uint256, "isPermanent": p.bool})),
    managedToFree: viewFun("0x27a6ee98", "managedToFree(uint256)", {"_0": p.uint256}, p.address),
    managedToLocked: viewFun("0xa738da82", "managedToLocked(uint256)", {"_0": p.uint256}, p.address),
    merge: fun("0xd1c2babb", "merge(uint256,uint256)", {"_from": p.uint256, "_to": p.uint256}, ),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    nonces: viewFun("0x7ecebe00", "nonces(address)", {"_0": p.address}, p.uint256),
    numCheckpoints: viewFun("0x50589793", "numCheckpoints(uint256)", {"_0": p.uint256}, p.uint48),
    ownerOf: viewFun("0x6352211e", "ownerOf(uint256)", {"_tokenId": p.uint256}, p.address),
    ownerToNFTokenIdList: viewFun("0x8bf9d84c", "ownerToNFTokenIdList(address,uint256)", {"_0": p.address, "_1": p.uint256}, p.uint256),
    permanentLockBalance: viewFun("0x4d01cb66", "permanentLockBalance()", {}, p.uint256),
    pointHistory: viewFun("0x8ad4c447", "pointHistory(uint256)", {"_loc": p.uint256}, p.struct({"bias": p.int128, "slope": p.int128, "ts": p.uint256, "blk": p.uint256, "permanentLockBalance": p.uint256})),
    "safeTransferFrom(address,address,uint256)": fun("0x42842e0e", "safeTransferFrom(address,address,uint256)", {"_from": p.address, "_to": p.address, "_tokenId": p.uint256}, ),
    "safeTransferFrom(address,address,uint256,bytes)": fun("0xb88d4fde", "safeTransferFrom(address,address,uint256,bytes)", {"_from": p.address, "_to": p.address, "_tokenId": p.uint256, "_data": p.bytes}, ),
    setAllowedManager: fun("0x9954a989", "setAllowedManager(address)", {"_allowedManager": p.address}, ),
    setApprovalForAll: fun("0xa22cb465", "setApprovalForAll(address,bool)", {"_operator": p.address, "_approved": p.bool}, ),
    setArtProxy: fun("0x2e720f7d", "setArtProxy(address)", {"_proxy": p.address}, ),
    setManagedState: fun("0x37b1f500", "setManagedState(uint256,bool)", {"_mTokenId": p.uint256, "_state": p.bool}, ),
    setTeam: fun("0x095cf5c6", "setTeam(address)", {"_team": p.address}, ),
    setVoterAndDistributor: fun("0x2d0485ec", "setVoterAndDistributor(address,address)", {"_voter": p.address, "_distributor": p.address}, ),
    slopeChanges: viewFun("0xf52a36f7", "slopeChanges(uint256)", {"_0": p.uint256}, p.int128),
    split: fun("0x4b19becc", "split(uint256,uint256)", {"_from": p.uint256, "_amount": p.uint256}, {"_tokenId1": p.uint256, "_tokenId2": p.uint256}),
    supply: viewFun("0x047fc9aa", "supply()", {}, p.uint256),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"_interfaceID": p.bytes4}, p.bool),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    team: viewFun("0x85f2aef2", "team()", {}, p.address),
    toggleSplit: fun("0x33230dc0", "toggleSplit(address,bool)", {"_account": p.address, "_bool": p.bool}, ),
    token: viewFun("0xfc0c546a", "token()", {}, p.address),
    tokenId: viewFun("0x17d70f7c", "tokenId()", {}, p.uint256),
    tokenURI: viewFun("0xc87b56dd", "tokenURI(uint256)", {"_tokenId": p.uint256}, p.string),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    totalSupplyAt: viewFun("0x981b24d0", "totalSupplyAt(uint256)", {"_timestamp": p.uint256}, p.uint256),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"_from": p.address, "_to": p.address, "_tokenId": p.uint256}, ),
    unlockPermanent: fun("0x35b0f6bd", "unlockPermanent(uint256)", {"_tokenId": p.uint256}, ),
    userPointEpoch: viewFun("0xe58f5947", "userPointEpoch(uint256)", {"_0": p.uint256}, p.uint256),
    userPointHistory: viewFun("0x44acb42a", "userPointHistory(uint256,uint256)", {"_tokenId": p.uint256, "_loc": p.uint256}, p.struct({"bias": p.int128, "slope": p.int128, "ts": p.uint256, "blk": p.uint256, "permanent": p.uint256})),
    version: viewFun("0x54fd4d50", "version()", {}, p.string),
    voted: viewFun("0x8fbb38ff", "voted(uint256)", {"_0": p.uint256}, p.bool),
    voter: viewFun("0x46c96aac", "voter()", {}, p.address),
    voting: fun("0x5a4f459a", "voting(uint256,bool)", {"_tokenId": p.uint256, "_voted": p.bool}, ),
    weights: viewFun("0x515857d4", "weights(uint256,uint256)", {"_0": p.uint256, "_1": p.uint256}, p.uint256),
    withdraw: fun("0x2e1a7d4d", "withdraw(uint256)", {"_tokenId": p.uint256}, ),
    withdrawManaged: fun("0x370fb5fa", "withdrawManaged(uint256)", {"_tokenId": p.uint256}, ),
}

export class Contract extends ContractBase {

    CLOCK_MODE() {
        return this.eth_call(functions.CLOCK_MODE, {})
    }

    DELEGATION_TYPEHASH() {
        return this.eth_call(functions.DELEGATION_TYPEHASH, {})
    }

    DOMAIN_TYPEHASH() {
        return this.eth_call(functions.DOMAIN_TYPEHASH, {})
    }

    allowedManager() {
        return this.eth_call(functions.allowedManager, {})
    }

    artProxy() {
        return this.eth_call(functions.artProxy, {})
    }

    balanceOf(_owner: BalanceOfParams["_owner"]) {
        return this.eth_call(functions.balanceOf, {_owner})
    }

    balanceOfNFT(_tokenId: BalanceOfNFTParams["_tokenId"]) {
        return this.eth_call(functions.balanceOfNFT, {_tokenId})
    }

    balanceOfNFTAt(_tokenId: BalanceOfNFTAtParams["_tokenId"], _t: BalanceOfNFTAtParams["_t"]) {
        return this.eth_call(functions.balanceOfNFTAt, {_tokenId, _t})
    }

    canSplit(_0: CanSplitParams["_0"]) {
        return this.eth_call(functions.canSplit, {_0})
    }

    checkpoints(_tokenId: CheckpointsParams["_tokenId"], _index: CheckpointsParams["_index"]) {
        return this.eth_call(functions.checkpoints, {_tokenId, _index})
    }

    clock() {
        return this.eth_call(functions.clock, {})
    }

    deactivated(_0: DeactivatedParams["_0"]) {
        return this.eth_call(functions.deactivated, {_0})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    delegates(delegator: DelegatesParams["delegator"]) {
        return this.eth_call(functions.delegates, {delegator})
    }

    distributor() {
        return this.eth_call(functions.distributor, {})
    }

    epoch() {
        return this.eth_call(functions.epoch, {})
    }

    escrowType(_0: EscrowTypeParams["_0"]) {
        return this.eth_call(functions.escrowType, {_0})
    }

    factoryRegistry() {
        return this.eth_call(functions.factoryRegistry, {})
    }

    forwarder() {
        return this.eth_call(functions.forwarder, {})
    }

    getApproved(_tokenId: GetApprovedParams["_tokenId"]) {
        return this.eth_call(functions.getApproved, {_tokenId})
    }

    getPastTotalSupply(_timestamp: GetPastTotalSupplyParams["_timestamp"]) {
        return this.eth_call(functions.getPastTotalSupply, {_timestamp})
    }

    getPastVotes(_account: GetPastVotesParams["_account"], _tokenId: GetPastVotesParams["_tokenId"], _timestamp: GetPastVotesParams["_timestamp"]) {
        return this.eth_call(functions.getPastVotes, {_account, _tokenId, _timestamp})
    }

    idToManaged(_0: IdToManagedParams["_0"]) {
        return this.eth_call(functions.idToManaged, {_0})
    }

    isApprovedForAll(_owner: IsApprovedForAllParams["_owner"], _operator: IsApprovedForAllParams["_operator"]) {
        return this.eth_call(functions.isApprovedForAll, {_owner, _operator})
    }

    isApprovedOrOwner(_spender: IsApprovedOrOwnerParams["_spender"], _tokenId: IsApprovedOrOwnerParams["_tokenId"]) {
        return this.eth_call(functions.isApprovedOrOwner, {_spender, _tokenId})
    }

    isTrustedForwarder(forwarder: IsTrustedForwarderParams["forwarder"]) {
        return this.eth_call(functions.isTrustedForwarder, {forwarder})
    }

    locked(_tokenId: LockedParams["_tokenId"]) {
        return this.eth_call(functions.locked, {_tokenId})
    }

    managedToFree(_0: ManagedToFreeParams["_0"]) {
        return this.eth_call(functions.managedToFree, {_0})
    }

    managedToLocked(_0: ManagedToLockedParams["_0"]) {
        return this.eth_call(functions.managedToLocked, {_0})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    nonces(_0: NoncesParams["_0"]) {
        return this.eth_call(functions.nonces, {_0})
    }

    numCheckpoints(_0: NumCheckpointsParams["_0"]) {
        return this.eth_call(functions.numCheckpoints, {_0})
    }

    ownerOf(_tokenId: OwnerOfParams["_tokenId"]) {
        return this.eth_call(functions.ownerOf, {_tokenId})
    }

    ownerToNFTokenIdList(_0: OwnerToNFTokenIdListParams["_0"], _1: OwnerToNFTokenIdListParams["_1"]) {
        return this.eth_call(functions.ownerToNFTokenIdList, {_0, _1})
    }

    permanentLockBalance() {
        return this.eth_call(functions.permanentLockBalance, {})
    }

    pointHistory(_loc: PointHistoryParams["_loc"]) {
        return this.eth_call(functions.pointHistory, {_loc})
    }

    slopeChanges(_0: SlopeChangesParams["_0"]) {
        return this.eth_call(functions.slopeChanges, {_0})
    }

    supply() {
        return this.eth_call(functions.supply, {})
    }

    supportsInterface(_interfaceID: SupportsInterfaceParams["_interfaceID"]) {
        return this.eth_call(functions.supportsInterface, {_interfaceID})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    team() {
        return this.eth_call(functions.team, {})
    }

    token() {
        return this.eth_call(functions.token, {})
    }

    tokenId() {
        return this.eth_call(functions.tokenId, {})
    }

    tokenURI(_tokenId: TokenURIParams["_tokenId"]) {
        return this.eth_call(functions.tokenURI, {_tokenId})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    totalSupplyAt(_timestamp: TotalSupplyAtParams["_timestamp"]) {
        return this.eth_call(functions.totalSupplyAt, {_timestamp})
    }

    userPointEpoch(_0: UserPointEpochParams["_0"]) {
        return this.eth_call(functions.userPointEpoch, {_0})
    }

    userPointHistory(_tokenId: UserPointHistoryParams["_tokenId"], _loc: UserPointHistoryParams["_loc"]) {
        return this.eth_call(functions.userPointHistory, {_tokenId, _loc})
    }

    version() {
        return this.eth_call(functions.version, {})
    }

    voted(_0: VotedParams["_0"]) {
        return this.eth_call(functions.voted, {_0})
    }

    voter() {
        return this.eth_call(functions.voter, {})
    }

    weights(_0: WeightsParams["_0"], _1: WeightsParams["_1"]) {
        return this.eth_call(functions.weights, {_0, _1})
    }
}

/// Event types
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type ApprovalForAllEventArgs = EParams<typeof events.ApprovalForAll>
export type BatchMetadataUpdateEventArgs = EParams<typeof events.BatchMetadataUpdate>
export type CreateManagedEventArgs = EParams<typeof events.CreateManaged>
export type DelegateChangedEventArgs = EParams<typeof events.DelegateChanged>
export type DelegateVotesChangedEventArgs = EParams<typeof events.DelegateVotesChanged>
export type DepositEventArgs = EParams<typeof events.Deposit>
export type DepositManagedEventArgs = EParams<typeof events.DepositManaged>
export type LockPermanentEventArgs = EParams<typeof events.LockPermanent>
export type MergeEventArgs = EParams<typeof events.Merge>
export type MetadataUpdateEventArgs = EParams<typeof events.MetadataUpdate>
export type SetAllowedManagerEventArgs = EParams<typeof events.SetAllowedManager>
export type SplitEventArgs = EParams<typeof events.Split>
export type SupplyEventArgs = EParams<typeof events.Supply>
export type TransferEventArgs = EParams<typeof events.Transfer>
export type UnlockPermanentEventArgs = EParams<typeof events.UnlockPermanent>
export type WithdrawEventArgs = EParams<typeof events.Withdraw>
export type WithdrawManagedEventArgs = EParams<typeof events.WithdrawManaged>

/// Function types
export type CLOCK_MODEParams = FunctionArguments<typeof functions.CLOCK_MODE>
export type CLOCK_MODEReturn = FunctionReturn<typeof functions.CLOCK_MODE>

export type DELEGATION_TYPEHASHParams = FunctionArguments<typeof functions.DELEGATION_TYPEHASH>
export type DELEGATION_TYPEHASHReturn = FunctionReturn<typeof functions.DELEGATION_TYPEHASH>

export type DOMAIN_TYPEHASHParams = FunctionArguments<typeof functions.DOMAIN_TYPEHASH>
export type DOMAIN_TYPEHASHReturn = FunctionReturn<typeof functions.DOMAIN_TYPEHASH>

export type AllowedManagerParams = FunctionArguments<typeof functions.allowedManager>
export type AllowedManagerReturn = FunctionReturn<typeof functions.allowedManager>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type ArtProxyParams = FunctionArguments<typeof functions.artProxy>
export type ArtProxyReturn = FunctionReturn<typeof functions.artProxy>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type BalanceOfNFTParams = FunctionArguments<typeof functions.balanceOfNFT>
export type BalanceOfNFTReturn = FunctionReturn<typeof functions.balanceOfNFT>

export type BalanceOfNFTAtParams = FunctionArguments<typeof functions.balanceOfNFTAt>
export type BalanceOfNFTAtReturn = FunctionReturn<typeof functions.balanceOfNFTAt>

export type CanSplitParams = FunctionArguments<typeof functions.canSplit>
export type CanSplitReturn = FunctionReturn<typeof functions.canSplit>

export type CheckpointParams = FunctionArguments<typeof functions.checkpoint>
export type CheckpointReturn = FunctionReturn<typeof functions.checkpoint>

export type CheckpointsParams = FunctionArguments<typeof functions.checkpoints>
export type CheckpointsReturn = FunctionReturn<typeof functions.checkpoints>

export type ClockParams = FunctionArguments<typeof functions.clock>
export type ClockReturn = FunctionReturn<typeof functions.clock>

export type CreateLockParams = FunctionArguments<typeof functions.createLock>
export type CreateLockReturn = FunctionReturn<typeof functions.createLock>

export type CreateLockForParams = FunctionArguments<typeof functions.createLockFor>
export type CreateLockForReturn = FunctionReturn<typeof functions.createLockFor>

export type CreateManagedLockForParams = FunctionArguments<typeof functions.createManagedLockFor>
export type CreateManagedLockForReturn = FunctionReturn<typeof functions.createManagedLockFor>

export type DeactivatedParams = FunctionArguments<typeof functions.deactivated>
export type DeactivatedReturn = FunctionReturn<typeof functions.deactivated>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DelegateParams = FunctionArguments<typeof functions.delegate>
export type DelegateReturn = FunctionReturn<typeof functions.delegate>

export type DelegateBySigParams = FunctionArguments<typeof functions.delegateBySig>
export type DelegateBySigReturn = FunctionReturn<typeof functions.delegateBySig>

export type DelegatesParams = FunctionArguments<typeof functions.delegates>
export type DelegatesReturn = FunctionReturn<typeof functions.delegates>

export type DepositForParams = FunctionArguments<typeof functions.depositFor>
export type DepositForReturn = FunctionReturn<typeof functions.depositFor>

export type DepositManagedParams = FunctionArguments<typeof functions.depositManaged>
export type DepositManagedReturn = FunctionReturn<typeof functions.depositManaged>

export type DistributorParams = FunctionArguments<typeof functions.distributor>
export type DistributorReturn = FunctionReturn<typeof functions.distributor>

export type EpochParams = FunctionArguments<typeof functions.epoch>
export type EpochReturn = FunctionReturn<typeof functions.epoch>

export type EscrowTypeParams = FunctionArguments<typeof functions.escrowType>
export type EscrowTypeReturn = FunctionReturn<typeof functions.escrowType>

export type FactoryRegistryParams = FunctionArguments<typeof functions.factoryRegistry>
export type FactoryRegistryReturn = FunctionReturn<typeof functions.factoryRegistry>

export type ForwarderParams = FunctionArguments<typeof functions.forwarder>
export type ForwarderReturn = FunctionReturn<typeof functions.forwarder>

export type GetApprovedParams = FunctionArguments<typeof functions.getApproved>
export type GetApprovedReturn = FunctionReturn<typeof functions.getApproved>

export type GetPastTotalSupplyParams = FunctionArguments<typeof functions.getPastTotalSupply>
export type GetPastTotalSupplyReturn = FunctionReturn<typeof functions.getPastTotalSupply>

export type GetPastVotesParams = FunctionArguments<typeof functions.getPastVotes>
export type GetPastVotesReturn = FunctionReturn<typeof functions.getPastVotes>

export type IdToManagedParams = FunctionArguments<typeof functions.idToManaged>
export type IdToManagedReturn = FunctionReturn<typeof functions.idToManaged>

export type IncreaseAmountParams = FunctionArguments<typeof functions.increaseAmount>
export type IncreaseAmountReturn = FunctionReturn<typeof functions.increaseAmount>

export type IncreaseUnlockTimeParams = FunctionArguments<typeof functions.increaseUnlockTime>
export type IncreaseUnlockTimeReturn = FunctionReturn<typeof functions.increaseUnlockTime>

export type IsApprovedForAllParams = FunctionArguments<typeof functions.isApprovedForAll>
export type IsApprovedForAllReturn = FunctionReturn<typeof functions.isApprovedForAll>

export type IsApprovedOrOwnerParams = FunctionArguments<typeof functions.isApprovedOrOwner>
export type IsApprovedOrOwnerReturn = FunctionReturn<typeof functions.isApprovedOrOwner>

export type IsTrustedForwarderParams = FunctionArguments<typeof functions.isTrustedForwarder>
export type IsTrustedForwarderReturn = FunctionReturn<typeof functions.isTrustedForwarder>

export type LockPermanentParams = FunctionArguments<typeof functions.lockPermanent>
export type LockPermanentReturn = FunctionReturn<typeof functions.lockPermanent>

export type LockedParams = FunctionArguments<typeof functions.locked>
export type LockedReturn = FunctionReturn<typeof functions.locked>

export type ManagedToFreeParams = FunctionArguments<typeof functions.managedToFree>
export type ManagedToFreeReturn = FunctionReturn<typeof functions.managedToFree>

export type ManagedToLockedParams = FunctionArguments<typeof functions.managedToLocked>
export type ManagedToLockedReturn = FunctionReturn<typeof functions.managedToLocked>

export type MergeParams = FunctionArguments<typeof functions.merge>
export type MergeReturn = FunctionReturn<typeof functions.merge>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type NoncesParams = FunctionArguments<typeof functions.nonces>
export type NoncesReturn = FunctionReturn<typeof functions.nonces>

export type NumCheckpointsParams = FunctionArguments<typeof functions.numCheckpoints>
export type NumCheckpointsReturn = FunctionReturn<typeof functions.numCheckpoints>

export type OwnerOfParams = FunctionArguments<typeof functions.ownerOf>
export type OwnerOfReturn = FunctionReturn<typeof functions.ownerOf>

export type OwnerToNFTokenIdListParams = FunctionArguments<typeof functions.ownerToNFTokenIdList>
export type OwnerToNFTokenIdListReturn = FunctionReturn<typeof functions.ownerToNFTokenIdList>

export type PermanentLockBalanceParams = FunctionArguments<typeof functions.permanentLockBalance>
export type PermanentLockBalanceReturn = FunctionReturn<typeof functions.permanentLockBalance>

export type PointHistoryParams = FunctionArguments<typeof functions.pointHistory>
export type PointHistoryReturn = FunctionReturn<typeof functions.pointHistory>

export type SafeTransferFromParams_0 = FunctionArguments<typeof functions["safeTransferFrom(address,address,uint256)"]>
export type SafeTransferFromReturn_0 = FunctionReturn<typeof functions["safeTransferFrom(address,address,uint256)"]>

export type SafeTransferFromParams_1 = FunctionArguments<typeof functions["safeTransferFrom(address,address,uint256,bytes)"]>
export type SafeTransferFromReturn_1 = FunctionReturn<typeof functions["safeTransferFrom(address,address,uint256,bytes)"]>

export type SetAllowedManagerParams = FunctionArguments<typeof functions.setAllowedManager>
export type SetAllowedManagerReturn = FunctionReturn<typeof functions.setAllowedManager>

export type SetApprovalForAllParams = FunctionArguments<typeof functions.setApprovalForAll>
export type SetApprovalForAllReturn = FunctionReturn<typeof functions.setApprovalForAll>

export type SetArtProxyParams = FunctionArguments<typeof functions.setArtProxy>
export type SetArtProxyReturn = FunctionReturn<typeof functions.setArtProxy>

export type SetManagedStateParams = FunctionArguments<typeof functions.setManagedState>
export type SetManagedStateReturn = FunctionReturn<typeof functions.setManagedState>

export type SetTeamParams = FunctionArguments<typeof functions.setTeam>
export type SetTeamReturn = FunctionReturn<typeof functions.setTeam>

export type SetVoterAndDistributorParams = FunctionArguments<typeof functions.setVoterAndDistributor>
export type SetVoterAndDistributorReturn = FunctionReturn<typeof functions.setVoterAndDistributor>

export type SlopeChangesParams = FunctionArguments<typeof functions.slopeChanges>
export type SlopeChangesReturn = FunctionReturn<typeof functions.slopeChanges>

export type SplitParams = FunctionArguments<typeof functions.split>
export type SplitReturn = FunctionReturn<typeof functions.split>

export type SupplyParams = FunctionArguments<typeof functions.supply>
export type SupplyReturn = FunctionReturn<typeof functions.supply>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TeamParams = FunctionArguments<typeof functions.team>
export type TeamReturn = FunctionReturn<typeof functions.team>

export type ToggleSplitParams = FunctionArguments<typeof functions.toggleSplit>
export type ToggleSplitReturn = FunctionReturn<typeof functions.toggleSplit>

export type TokenParams = FunctionArguments<typeof functions.token>
export type TokenReturn = FunctionReturn<typeof functions.token>

export type TokenIdParams = FunctionArguments<typeof functions.tokenId>
export type TokenIdReturn = FunctionReturn<typeof functions.tokenId>

export type TokenURIParams = FunctionArguments<typeof functions.tokenURI>
export type TokenURIReturn = FunctionReturn<typeof functions.tokenURI>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TotalSupplyAtParams = FunctionArguments<typeof functions.totalSupplyAt>
export type TotalSupplyAtReturn = FunctionReturn<typeof functions.totalSupplyAt>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type UnlockPermanentParams = FunctionArguments<typeof functions.unlockPermanent>
export type UnlockPermanentReturn = FunctionReturn<typeof functions.unlockPermanent>

export type UserPointEpochParams = FunctionArguments<typeof functions.userPointEpoch>
export type UserPointEpochReturn = FunctionReturn<typeof functions.userPointEpoch>

export type UserPointHistoryParams = FunctionArguments<typeof functions.userPointHistory>
export type UserPointHistoryReturn = FunctionReturn<typeof functions.userPointHistory>

export type VersionParams = FunctionArguments<typeof functions.version>
export type VersionReturn = FunctionReturn<typeof functions.version>

export type VotedParams = FunctionArguments<typeof functions.voted>
export type VotedReturn = FunctionReturn<typeof functions.voted>

export type VoterParams = FunctionArguments<typeof functions.voter>
export type VoterReturn = FunctionReturn<typeof functions.voter>

export type VotingParams = FunctionArguments<typeof functions.voting>
export type VotingReturn = FunctionReturn<typeof functions.voting>

export type WeightsParams = FunctionArguments<typeof functions.weights>
export type WeightsReturn = FunctionReturn<typeof functions.weights>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

export type WithdrawManagedParams = FunctionArguments<typeof functions.withdrawManaged>
export type WithdrawManagedReturn = FunctionReturn<typeof functions.withdrawManaged>

