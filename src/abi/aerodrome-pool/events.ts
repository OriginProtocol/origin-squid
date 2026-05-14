import { address, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** Approval(address,address,uint256) */
export const Approval = event('0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', {
    owner: indexed(address),
    spender: indexed(address),
    value: uint256,
})
export type ApprovalEventArgs = EParams<typeof Approval>

/** Burn(address,address,uint256,uint256) */
export const Burn = event('0x5d624aa9c148153ab3446c1b154f660ee7701e549fe9b62dab7171b1c80e6fa2', {
    sender: indexed(address),
    to: indexed(address),
    amount0: uint256,
    amount1: uint256,
})
export type BurnEventArgs = EParams<typeof Burn>

/** Claim(address,address,uint256,uint256) */
export const Claim = event('0x865ca08d59f5cb456e85cd2f7ef63664ea4f73327414e9d8152c4158b0e94645', {
    sender: indexed(address),
    recipient: indexed(address),
    amount0: uint256,
    amount1: uint256,
})
export type ClaimEventArgs = EParams<typeof Claim>

/** EIP712DomainChanged() */
export const EIP712DomainChanged = event('0x0a6387c9ea3628b88a633bb4f3b151770f70085117a15f9bf3787cda53f13d31', {})
export type EIP712DomainChangedEventArgs = EParams<typeof EIP712DomainChanged>

/** Fees(address,uint256,uint256) */
export const Fees = event('0x112c256902bf554b6ed882d2936687aaeb4225e8cd5b51303c90ca6cf43a8602', {
    sender: indexed(address),
    amount0: uint256,
    amount1: uint256,
})
export type FeesEventArgs = EParams<typeof Fees>

/** Mint(address,uint256,uint256) */
export const Mint = event('0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f', {
    sender: indexed(address),
    amount0: uint256,
    amount1: uint256,
})
export type MintEventArgs = EParams<typeof Mint>

/** Swap(address,address,uint256,uint256,uint256,uint256) */
export const Swap = event('0xb3e2773606abfd36b5bd91394b3a54d1398336c65005baf7bf7a05efeffaf75b', {
    sender: indexed(address),
    to: indexed(address),
    amount0In: uint256,
    amount1In: uint256,
    amount0Out: uint256,
    amount1Out: uint256,
})
export type SwapEventArgs = EParams<typeof Swap>

/** Sync(uint256,uint256) */
export const Sync = event('0xcf2aa50876cdfbb541206f89af0ee78d44a2abf8d328e37fa4917f982149848a', {
    reserve0: uint256,
    reserve1: uint256,
})
export type SyncEventArgs = EParams<typeof Sync>

/** Transfer(address,address,uint256) */
export const Transfer = event('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', {
    from: indexed(address),
    to: indexed(address),
    value: uint256,
})
export type TransferEventArgs = EParams<typeof Transfer>
