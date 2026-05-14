import { address, array, bool, bytes32, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** AccrueInterest(uint256,uint256) */
export const AccrueInterest = event('0xf66f28b40975dbb933913542c7e6a0f50a1d0f20aa74ea6e0efe65ab616323ec', {
    newTotalAssets: uint256,
    feeShares: uint256,
})
export type AccrueInterestEventArgs = EParams<typeof AccrueInterest>

/** Approval(address,address,uint256) */
export const Approval = event('0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', {
    owner: indexed(address),
    spender: indexed(address),
    value: uint256,
})
export type ApprovalEventArgs = EParams<typeof Approval>

/** Deposit(address,address,uint256,uint256) */
export const Deposit = event('0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7', {
    sender: indexed(address),
    owner: indexed(address),
    assets: uint256,
    shares: uint256,
})
export type DepositEventArgs = EParams<typeof Deposit>

/** EIP712DomainChanged() */
export const EIP712DomainChanged = event('0x0a6387c9ea3628b88a633bb4f3b151770f70085117a15f9bf3787cda53f13d31', {})
export type EIP712DomainChangedEventArgs = EParams<typeof EIP712DomainChanged>

/** OwnershipTransferStarted(address,address) */
export const OwnershipTransferStarted = event('0x38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e22700', {
    previousOwner: indexed(address),
    newOwner: indexed(address),
})
export type OwnershipTransferStartedEventArgs = EParams<typeof OwnershipTransferStarted>

/** OwnershipTransferred(address,address) */
export const OwnershipTransferred = event('0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0', {
    previousOwner: indexed(address),
    newOwner: indexed(address),
})
export type OwnershipTransferredEventArgs = EParams<typeof OwnershipTransferred>

/** ReallocateSupply(address,bytes32,uint256,uint256) */
export const ReallocateSupply = event('0x89bf199df65bf65155e3e0a8abc4ad4a1be606220c8295840dba2ab5656c1f6d', {
    caller: indexed(address),
    id: indexed(bytes32),
    suppliedAssets: uint256,
    suppliedShares: uint256,
})
export type ReallocateSupplyEventArgs = EParams<typeof ReallocateSupply>

/** ReallocateWithdraw(address,bytes32,uint256,uint256) */
export const ReallocateWithdraw = event('0xdd8bf5226dff861316e0fa7863fdb7dc7b87c614eb29a135f524eb79d5a1189a', {
    caller: indexed(address),
    id: indexed(bytes32),
    withdrawnAssets: uint256,
    withdrawnShares: uint256,
})
export type ReallocateWithdrawEventArgs = EParams<typeof ReallocateWithdraw>

/** RevokePendingCap(address,bytes32) */
export const RevokePendingCap = event('0x1026ceca5ed3747eb5edec555732d4a6f901ce1a875ecf981064628cadde1120', {
    caller: indexed(address),
    id: indexed(bytes32),
})
export type RevokePendingCapEventArgs = EParams<typeof RevokePendingCap>

/** RevokePendingGuardian(address) */
export const RevokePendingGuardian = event('0xc40a085ccfa20f5fd518ade5c3a77a7ecbdfbb4c75efcdca6146a8e3c841d663', {
    caller: indexed(address),
})
export type RevokePendingGuardianEventArgs = EParams<typeof RevokePendingGuardian>

/** RevokePendingMarketRemoval(address,bytes32) */
export const RevokePendingMarketRemoval = event('0xcbeb8ecdaa5a3c133e62219b63bfc35bce3fda13065d2bed32e3b7dde60a59f4', {
    caller: indexed(address),
    id: indexed(bytes32),
})
export type RevokePendingMarketRemovalEventArgs = EParams<typeof RevokePendingMarketRemoval>

/** RevokePendingTimelock(address) */
export const RevokePendingTimelock = event('0x921828337692c347c634c5d2aacbc7b756014674bd236f3cc2058d8e284a951b', {
    caller: indexed(address),
})
export type RevokePendingTimelockEventArgs = EParams<typeof RevokePendingTimelock>

/** SetCap(address,bytes32,uint256) */
export const SetCap = event('0xe86b6d3313d3098f4c5f689c935de8fde876a597c185def2cedab85efedac686', {
    caller: indexed(address),
    id: indexed(bytes32),
    cap: uint256,
})
export type SetCapEventArgs = EParams<typeof SetCap>

/** SetCurator(address) */
export const SetCurator = event('0xbd0a63c12948fbc9194a5839019f99c9d71db924e5c70018265bc778b8f1a506', {
    newCurator: indexed(address),
})
export type SetCuratorEventArgs = EParams<typeof SetCurator>

/** SetFee(address,uint256) */
export const SetFee = event('0x01fe2943baee27f47add82886c2200f910c749c461c9b63c5fe83901a53bdb49', {
    caller: indexed(address),
    newFee: uint256,
})
export type SetFeeEventArgs = EParams<typeof SetFee>

/** SetFeeRecipient(address) */
export const SetFeeRecipient = event('0x2e979f80fe4d43055c584cf4a8467c55875ea36728fc37176c05acd784eb7a73', {
    newFeeRecipient: indexed(address),
})
export type SetFeeRecipientEventArgs = EParams<typeof SetFeeRecipient>

/** SetGuardian(address,address) */
export const SetGuardian = event('0xcb11cc8aade2f5a556749d1b2380d108a16fac3431e6a5d5ce12ef9de0bd76e3', {
    caller: indexed(address),
    guardian: indexed(address),
})
export type SetGuardianEventArgs = EParams<typeof SetGuardian>

/** SetIsAllocator(address,bool) */
export const SetIsAllocator = event('0x74dc60cbc81a9472d04ad1d20e151d369c41104d655ed3f2f3091166a502cd8d', {
    allocator: indexed(address),
    isAllocator: bool,
})
export type SetIsAllocatorEventArgs = EParams<typeof SetIsAllocator>

/** SetSkimRecipient(address) */
export const SetSkimRecipient = event('0x2e7908865670e21b9779422cadf5f1cba271a62bb95c71eaaf615c0a1c48ebee', {
    newSkimRecipient: indexed(address),
})
export type SetSkimRecipientEventArgs = EParams<typeof SetSkimRecipient>

/** SetSupplyQueue(address,bytes32[]) */
export const SetSupplyQueue = event('0x6ce31538fc7fba95714ddc8a275a09252b4b1fb8f33d2550aa58a5f62ad934de', {
    caller: indexed(address),
    newSupplyQueue: array(bytes32),
})
export type SetSupplyQueueEventArgs = EParams<typeof SetSupplyQueue>

/** SetTimelock(address,uint256) */
export const SetTimelock = event('0xd28e9b90ee9b37c5936ff84392d71f29ff18117d7e76bcee60615262a90a3f75', {
    caller: indexed(address),
    newTimelock: uint256,
})
export type SetTimelockEventArgs = EParams<typeof SetTimelock>

/** SetWithdrawQueue(address,bytes32[]) */
export const SetWithdrawQueue = event('0xe0c2db6b54586be6d7d49943139fccf0dd315ba63e55364a76c73cd8fdba724d', {
    caller: indexed(address),
    newWithdrawQueue: array(bytes32),
})
export type SetWithdrawQueueEventArgs = EParams<typeof SetWithdrawQueue>

/** Skim(address,address,uint256) */
export const Skim = event('0x2ae72b44f59d038340fca5739135a1d51fc5ab720bb02d983e4c5ff4119ca7b8', {
    caller: indexed(address),
    token: indexed(address),
    amount: uint256,
})
export type SkimEventArgs = EParams<typeof Skim>

/** SubmitCap(address,bytes32,uint256) */
export const SubmitCap = event('0xe851bb5856808a50efd748be463b8f35bcfb5ec74c5bfde776fe0a4d2a26db27', {
    caller: indexed(address),
    id: indexed(bytes32),
    cap: uint256,
})
export type SubmitCapEventArgs = EParams<typeof SubmitCap>

/** SubmitGuardian(address) */
export const SubmitGuardian = event('0x7633313af54753bce8a149927263b1a55eba857ba4ef1d13c6aee25d384d3c4b', {
    newGuardian: indexed(address),
})
export type SubmitGuardianEventArgs = EParams<typeof SubmitGuardian>

/** SubmitMarketRemoval(address,bytes32) */
export const SubmitMarketRemoval = event('0x3240fc70754c5a2b4dab10bf7081a00024bfc8491581ee3d355360ec0dd91f16', {
    caller: indexed(address),
    id: indexed(bytes32),
})
export type SubmitMarketRemovalEventArgs = EParams<typeof SubmitMarketRemoval>

/** SubmitTimelock(uint256) */
export const SubmitTimelock = event('0xb3aa0ade2442acf51d06713c2d1a5a3ec0373cce969d42b53f4689f97bccf380', {
    newTimelock: uint256,
})
export type SubmitTimelockEventArgs = EParams<typeof SubmitTimelock>

/** Transfer(address,address,uint256) */
export const Transfer = event('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', {
    from: indexed(address),
    to: indexed(address),
    value: uint256,
})
export type TransferEventArgs = EParams<typeof Transfer>

/** UpdateLastTotalAssets(uint256) */
export const UpdateLastTotalAssets = event('0x15c027cc4fd826d986cad358803439f7326d3aa4ed969ff90dbee4bc150f68e9', {
    updatedTotalAssets: uint256,
})
export type UpdateLastTotalAssetsEventArgs = EParams<typeof UpdateLastTotalAssets>

/** Withdraw(address,address,address,uint256,uint256) */
export const Withdraw = event('0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db', {
    sender: indexed(address),
    receiver: indexed(address),
    owner: indexed(address),
    assets: uint256,
    shares: uint256,
})
export type WithdrawEventArgs = EParams<typeof Withdraw>
