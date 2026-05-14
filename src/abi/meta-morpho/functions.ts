import { address, array, bool, bytes, bytes1, bytes32, string, struct, uint184, uint192, uint256, uint64, uint8, uint96 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** DECIMALS_OFFSET() */
export const DECIMALS_OFFSET = func('0xaea70acc', {}, uint8)
export type DECIMALS_OFFSETParams = FunctionArguments<typeof DECIMALS_OFFSET>
export type DECIMALS_OFFSETReturn = FunctionReturn<typeof DECIMALS_OFFSET>

/** DOMAIN_SEPARATOR() */
export const DOMAIN_SEPARATOR = func('0x3644e515', {}, bytes32)
export type DOMAIN_SEPARATORParams = FunctionArguments<typeof DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof DOMAIN_SEPARATOR>

/** MORPHO() */
export const MORPHO = func('0x3acb5624', {}, address)
export type MORPHOParams = FunctionArguments<typeof MORPHO>
export type MORPHOReturn = FunctionReturn<typeof MORPHO>

/** acceptCap((address,address,address,address,uint256)) */
export const acceptCap = func('0x6fda3868', {
    marketParams: struct({
        loanToken: address,
        collateralToken: address,
        oracle: address,
        irm: address,
        lltv: uint256,
    }),
})
export type AcceptCapParams = FunctionArguments<typeof acceptCap>
export type AcceptCapReturn = FunctionReturn<typeof acceptCap>

/** acceptGuardian() */
export const acceptGuardian = func('0xa5f31d61', {})
export type AcceptGuardianParams = FunctionArguments<typeof acceptGuardian>
export type AcceptGuardianReturn = FunctionReturn<typeof acceptGuardian>

/** acceptOwnership() */
export const acceptOwnership = func('0x79ba5097', {})
export type AcceptOwnershipParams = FunctionArguments<typeof acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof acceptOwnership>

/** acceptTimelock() */
export const acceptTimelock = func('0x8a2c7b39', {})
export type AcceptTimelockParams = FunctionArguments<typeof acceptTimelock>
export type AcceptTimelockReturn = FunctionReturn<typeof acceptTimelock>

/** allowance(address,address) */
export const allowance = func('0xdd62ed3e', {
    owner: address,
    spender: address,
}, uint256)
export type AllowanceParams = FunctionArguments<typeof allowance>
export type AllowanceReturn = FunctionReturn<typeof allowance>

/** approve(address,uint256) */
export const approve = func('0x095ea7b3', {
    spender: address,
    value: uint256,
}, bool)
export type ApproveParams = FunctionArguments<typeof approve>
export type ApproveReturn = FunctionReturn<typeof approve>

/** asset() */
export const asset = func('0x38d52e0f', {}, address)
export type AssetParams = FunctionArguments<typeof asset>
export type AssetReturn = FunctionReturn<typeof asset>

/** balanceOf(address) */
export const balanceOf = func('0x70a08231', {
    account: address,
}, uint256)
export type BalanceOfParams = FunctionArguments<typeof balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof balanceOf>

/** config(bytes32) */
export const config = func('0xcc718f76', {
    _0: bytes32,
}, struct({
    cap: uint184,
    enabled: bool,
    removableAt: uint64,
}))
export type ConfigParams = FunctionArguments<typeof config>
export type ConfigReturn = FunctionReturn<typeof config>

/** convertToAssets(uint256) */
export const convertToAssets = func('0x07a2d13a', {
    shares: uint256,
}, uint256)
export type ConvertToAssetsParams = FunctionArguments<typeof convertToAssets>
export type ConvertToAssetsReturn = FunctionReturn<typeof convertToAssets>

/** convertToShares(uint256) */
export const convertToShares = func('0xc6e6f592', {
    assets: uint256,
}, uint256)
export type ConvertToSharesParams = FunctionArguments<typeof convertToShares>
export type ConvertToSharesReturn = FunctionReturn<typeof convertToShares>

/** curator() */
export const curator = func('0xe66f53b7', {}, address)
export type CuratorParams = FunctionArguments<typeof curator>
export type CuratorReturn = FunctionReturn<typeof curator>

/** decimals() */
export const decimals = func('0x313ce567', {}, uint8)
export type DecimalsParams = FunctionArguments<typeof decimals>
export type DecimalsReturn = FunctionReturn<typeof decimals>

/** deposit(uint256,address) */
export const deposit = func('0x6e553f65', {
    assets: uint256,
    receiver: address,
}, uint256)
export type DepositParams = FunctionArguments<typeof deposit>
export type DepositReturn = FunctionReturn<typeof deposit>

/** eip712Domain() */
export const eip712Domain = func('0x84b0196e', {}, struct({
    fields: bytes1,
    name: string,
    version: string,
    chainId: uint256,
    verifyingContract: address,
    salt: bytes32,
    extensions: array(uint256),
}))
export type Eip712DomainParams = FunctionArguments<typeof eip712Domain>
export type Eip712DomainReturn = FunctionReturn<typeof eip712Domain>

/** fee() */
export const fee = func('0xddca3f43', {}, uint96)
export type FeeParams = FunctionArguments<typeof fee>
export type FeeReturn = FunctionReturn<typeof fee>

/** feeRecipient() */
export const feeRecipient = func('0x46904840', {}, address)
export type FeeRecipientParams = FunctionArguments<typeof feeRecipient>
export type FeeRecipientReturn = FunctionReturn<typeof feeRecipient>

/** guardian() */
export const guardian = func('0x452a9320', {}, address)
export type GuardianParams = FunctionArguments<typeof guardian>
export type GuardianReturn = FunctionReturn<typeof guardian>

/** isAllocator(address) */
export const isAllocator = func('0x4dedf20e', {
    _0: address,
}, bool)
export type IsAllocatorParams = FunctionArguments<typeof isAllocator>
export type IsAllocatorReturn = FunctionReturn<typeof isAllocator>

/** lastTotalAssets() */
export const lastTotalAssets = func('0x568efc07', {}, uint256)
export type LastTotalAssetsParams = FunctionArguments<typeof lastTotalAssets>
export type LastTotalAssetsReturn = FunctionReturn<typeof lastTotalAssets>

/** maxDeposit(address) */
export const maxDeposit = func('0x402d267d', {
    _0: address,
}, uint256)
export type MaxDepositParams = FunctionArguments<typeof maxDeposit>
export type MaxDepositReturn = FunctionReturn<typeof maxDeposit>

/** maxMint(address) */
export const maxMint = func('0xc63d75b6', {
    _0: address,
}, uint256)
export type MaxMintParams = FunctionArguments<typeof maxMint>
export type MaxMintReturn = FunctionReturn<typeof maxMint>

/** maxRedeem(address) */
export const maxRedeem = func('0xd905777e', {
    owner: address,
}, uint256)
export type MaxRedeemParams = FunctionArguments<typeof maxRedeem>
export type MaxRedeemReturn = FunctionReturn<typeof maxRedeem>

/** maxWithdraw(address) */
export const maxWithdraw = func('0xce96cb77', {
    owner: address,
}, uint256)
export type MaxWithdrawParams = FunctionArguments<typeof maxWithdraw>
export type MaxWithdrawReturn = FunctionReturn<typeof maxWithdraw>

/** mint(uint256,address) */
export const mint = func('0x94bf804d', {
    shares: uint256,
    receiver: address,
}, uint256)
export type MintParams = FunctionArguments<typeof mint>
export type MintReturn = FunctionReturn<typeof mint>

/** multicall(bytes[]) */
export const multicall = func('0xac9650d8', {
    data: array(bytes),
}, array(bytes))
export type MulticallParams = FunctionArguments<typeof multicall>
export type MulticallReturn = FunctionReturn<typeof multicall>

/** name() */
export const name = func('0x06fdde03', {}, string)
export type NameParams = FunctionArguments<typeof name>
export type NameReturn = FunctionReturn<typeof name>

/** nonces(address) */
export const nonces = func('0x7ecebe00', {
    owner: address,
}, uint256)
export type NoncesParams = FunctionArguments<typeof nonces>
export type NoncesReturn = FunctionReturn<typeof nonces>

/** owner() */
export const owner = func('0x8da5cb5b', {}, address)
export type OwnerParams = FunctionArguments<typeof owner>
export type OwnerReturn = FunctionReturn<typeof owner>

/** pendingCap(bytes32) */
export const pendingCap = func('0xa31be5d6', {
    _0: bytes32,
}, struct({
    value: uint192,
    validAt: uint64,
}))
export type PendingCapParams = FunctionArguments<typeof pendingCap>
export type PendingCapReturn = FunctionReturn<typeof pendingCap>

/** pendingGuardian() */
export const pendingGuardian = func('0x762c31ba', {}, struct({
    value: address,
    validAt: uint64,
}))
export type PendingGuardianParams = FunctionArguments<typeof pendingGuardian>
export type PendingGuardianReturn = FunctionReturn<typeof pendingGuardian>

/** pendingOwner() */
export const pendingOwner = func('0xe30c3978', {}, address)
export type PendingOwnerParams = FunctionArguments<typeof pendingOwner>
export type PendingOwnerReturn = FunctionReturn<typeof pendingOwner>

/** pendingTimelock() */
export const pendingTimelock = func('0x7cc4d9a1', {}, struct({
    value: uint192,
    validAt: uint64,
}))
export type PendingTimelockParams = FunctionArguments<typeof pendingTimelock>
export type PendingTimelockReturn = FunctionReturn<typeof pendingTimelock>

/** permit(address,address,uint256,uint256,uint8,bytes32,bytes32) */
export const permit = func('0xd505accf', {
    owner: address,
    spender: address,
    value: uint256,
    deadline: uint256,
    v: uint8,
    r: bytes32,
    s: bytes32,
})
export type PermitParams = FunctionArguments<typeof permit>
export type PermitReturn = FunctionReturn<typeof permit>

/** previewDeposit(uint256) */
export const previewDeposit = func('0xef8b30f7', {
    assets: uint256,
}, uint256)
export type PreviewDepositParams = FunctionArguments<typeof previewDeposit>
export type PreviewDepositReturn = FunctionReturn<typeof previewDeposit>

/** previewMint(uint256) */
export const previewMint = func('0xb3d7f6b9', {
    shares: uint256,
}, uint256)
export type PreviewMintParams = FunctionArguments<typeof previewMint>
export type PreviewMintReturn = FunctionReturn<typeof previewMint>

/** previewRedeem(uint256) */
export const previewRedeem = func('0x4cdad506', {
    shares: uint256,
}, uint256)
export type PreviewRedeemParams = FunctionArguments<typeof previewRedeem>
export type PreviewRedeemReturn = FunctionReturn<typeof previewRedeem>

/** previewWithdraw(uint256) */
export const previewWithdraw = func('0x0a28a477', {
    assets: uint256,
}, uint256)
export type PreviewWithdrawParams = FunctionArguments<typeof previewWithdraw>
export type PreviewWithdrawReturn = FunctionReturn<typeof previewWithdraw>

/** reallocate(((address,address,address,address,uint256),uint256)[]) */
export const reallocate = func('0x7299aa31', {
    allocations: array(struct({
        marketParams: struct({
            loanToken: address,
            collateralToken: address,
            oracle: address,
            irm: address,
            lltv: uint256,
        }),
        assets: uint256,
    })),
})
export type ReallocateParams = FunctionArguments<typeof reallocate>
export type ReallocateReturn = FunctionReturn<typeof reallocate>

/** redeem(uint256,address,address) */
export const redeem = func('0xba087652', {
    shares: uint256,
    receiver: address,
    owner: address,
}, uint256)
export type RedeemParams = FunctionArguments<typeof redeem>
export type RedeemReturn = FunctionReturn<typeof redeem>

/** renounceOwnership() */
export const renounceOwnership = func('0x715018a6', {})
export type RenounceOwnershipParams = FunctionArguments<typeof renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof renounceOwnership>

/** revokePendingCap(bytes32) */
export const revokePendingCap = func('0x102f7b6c', {
    id: bytes32,
})
export type RevokePendingCapParams = FunctionArguments<typeof revokePendingCap>
export type RevokePendingCapReturn = FunctionReturn<typeof revokePendingCap>

/** revokePendingGuardian() */
export const revokePendingGuardian = func('0x1ecca77c', {})
export type RevokePendingGuardianParams = FunctionArguments<typeof revokePendingGuardian>
export type RevokePendingGuardianReturn = FunctionReturn<typeof revokePendingGuardian>

/** revokePendingMarketRemoval(bytes32) */
export const revokePendingMarketRemoval = func('0x4b998de5', {
    id: bytes32,
})
export type RevokePendingMarketRemovalParams = FunctionArguments<typeof revokePendingMarketRemoval>
export type RevokePendingMarketRemovalReturn = FunctionReturn<typeof revokePendingMarketRemoval>

/** revokePendingTimelock() */
export const revokePendingTimelock = func('0xc9649aa9', {})
export type RevokePendingTimelockParams = FunctionArguments<typeof revokePendingTimelock>
export type RevokePendingTimelockReturn = FunctionReturn<typeof revokePendingTimelock>

/** setCurator(address) */
export const setCurator = func('0xe90956cf', {
    newCurator: address,
})
export type SetCuratorParams = FunctionArguments<typeof setCurator>
export type SetCuratorReturn = FunctionReturn<typeof setCurator>

/** setFee(uint256) */
export const setFee = func('0x69fe0e2d', {
    newFee: uint256,
})
export type SetFeeParams = FunctionArguments<typeof setFee>
export type SetFeeReturn = FunctionReturn<typeof setFee>

/** setFeeRecipient(address) */
export const setFeeRecipient = func('0xe74b981b', {
    newFeeRecipient: address,
})
export type SetFeeRecipientParams = FunctionArguments<typeof setFeeRecipient>
export type SetFeeRecipientReturn = FunctionReturn<typeof setFeeRecipient>

/** setIsAllocator(address,bool) */
export const setIsAllocator = func('0xb192a84a', {
    newAllocator: address,
    newIsAllocator: bool,
})
export type SetIsAllocatorParams = FunctionArguments<typeof setIsAllocator>
export type SetIsAllocatorReturn = FunctionReturn<typeof setIsAllocator>

/** setSkimRecipient(address) */
export const setSkimRecipient = func('0x2b30997b', {
    newSkimRecipient: address,
})
export type SetSkimRecipientParams = FunctionArguments<typeof setSkimRecipient>
export type SetSkimRecipientReturn = FunctionReturn<typeof setSkimRecipient>

/** setSupplyQueue(bytes32[]) */
export const setSupplyQueue = func('0x2acc56f9', {
    newSupplyQueue: array(bytes32),
})
export type SetSupplyQueueParams = FunctionArguments<typeof setSupplyQueue>
export type SetSupplyQueueReturn = FunctionReturn<typeof setSupplyQueue>

/** skim(address) */
export const skim = func('0xbc25cf77', {
    token: address,
})
export type SkimParams = FunctionArguments<typeof skim>
export type SkimReturn = FunctionReturn<typeof skim>

/** skimRecipient() */
export const skimRecipient = func('0x388af5b5', {}, address)
export type SkimRecipientParams = FunctionArguments<typeof skimRecipient>
export type SkimRecipientReturn = FunctionReturn<typeof skimRecipient>

/** submitCap((address,address,address,address,uint256),uint256) */
export const submitCap = func('0x3b24c2bf', {
    marketParams: struct({
        loanToken: address,
        collateralToken: address,
        oracle: address,
        irm: address,
        lltv: uint256,
    }),
    newSupplyCap: uint256,
})
export type SubmitCapParams = FunctionArguments<typeof submitCap>
export type SubmitCapReturn = FunctionReturn<typeof submitCap>

/** submitGuardian(address) */
export const submitGuardian = func('0x9d6b4a45', {
    newGuardian: address,
})
export type SubmitGuardianParams = FunctionArguments<typeof submitGuardian>
export type SubmitGuardianReturn = FunctionReturn<typeof submitGuardian>

/** submitMarketRemoval((address,address,address,address,uint256)) */
export const submitMarketRemoval = func('0x84755b5f', {
    marketParams: struct({
        loanToken: address,
        collateralToken: address,
        oracle: address,
        irm: address,
        lltv: uint256,
    }),
})
export type SubmitMarketRemovalParams = FunctionArguments<typeof submitMarketRemoval>
export type SubmitMarketRemovalReturn = FunctionReturn<typeof submitMarketRemoval>

/** submitTimelock(uint256) */
export const submitTimelock = func('0x7224a512', {
    newTimelock: uint256,
})
export type SubmitTimelockParams = FunctionArguments<typeof submitTimelock>
export type SubmitTimelockReturn = FunctionReturn<typeof submitTimelock>

/** supplyQueue(uint256) */
export const supplyQueue = func('0xf7d18521', {
    _0: uint256,
}, bytes32)
export type SupplyQueueParams = FunctionArguments<typeof supplyQueue>
export type SupplyQueueReturn = FunctionReturn<typeof supplyQueue>

/** supplyQueueLength() */
export const supplyQueueLength = func('0xa17b3130', {}, uint256)
export type SupplyQueueLengthParams = FunctionArguments<typeof supplyQueueLength>
export type SupplyQueueLengthReturn = FunctionReturn<typeof supplyQueueLength>

/** symbol() */
export const symbol = func('0x95d89b41', {}, string)
export type SymbolParams = FunctionArguments<typeof symbol>
export type SymbolReturn = FunctionReturn<typeof symbol>

/** timelock() */
export const timelock = func('0xd33219b4', {}, uint256)
export type TimelockParams = FunctionArguments<typeof timelock>
export type TimelockReturn = FunctionReturn<typeof timelock>

/** totalAssets() */
export const totalAssets = func('0x01e1d114', {}, uint256)
export type TotalAssetsParams = FunctionArguments<typeof totalAssets>
export type TotalAssetsReturn = FunctionReturn<typeof totalAssets>

/** totalSupply() */
export const totalSupply = func('0x18160ddd', {}, uint256)
export type TotalSupplyParams = FunctionArguments<typeof totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof totalSupply>

/** transfer(address,uint256) */
export const transfer = func('0xa9059cbb', {
    to: address,
    value: uint256,
}, bool)
export type TransferParams = FunctionArguments<typeof transfer>
export type TransferReturn = FunctionReturn<typeof transfer>

/** transferFrom(address,address,uint256) */
export const transferFrom = func('0x23b872dd', {
    from: address,
    to: address,
    value: uint256,
}, bool)
export type TransferFromParams = FunctionArguments<typeof transferFrom>
export type TransferFromReturn = FunctionReturn<typeof transferFrom>

/** transferOwnership(address) */
export const transferOwnership = func('0xf2fde38b', {
    newOwner: address,
})
export type TransferOwnershipParams = FunctionArguments<typeof transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof transferOwnership>

/** updateWithdrawQueue(uint256[]) */
export const updateWithdrawQueue = func('0x41b67833', {
    indexes: array(uint256),
})
export type UpdateWithdrawQueueParams = FunctionArguments<typeof updateWithdrawQueue>
export type UpdateWithdrawQueueReturn = FunctionReturn<typeof updateWithdrawQueue>

/** withdraw(uint256,address,address) */
export const withdraw = func('0xb460af94', {
    assets: uint256,
    receiver: address,
    owner: address,
}, uint256)
export type WithdrawParams = FunctionArguments<typeof withdraw>
export type WithdrawReturn = FunctionReturn<typeof withdraw>

/** withdrawQueue(uint256) */
export const withdrawQueue = func('0x62518ddf', {
    _0: uint256,
}, bytes32)
export type WithdrawQueueParams = FunctionArguments<typeof withdrawQueue>
export type WithdrawQueueReturn = FunctionReturn<typeof withdrawQueue>

/** withdrawQueueLength() */
export const withdrawQueueLength = func('0x33f91ebb', {}, uint256)
export type WithdrawQueueLengthParams = FunctionArguments<typeof withdrawQueueLength>
export type WithdrawQueueLengthReturn = FunctionReturn<typeof withdrawQueueLength>
