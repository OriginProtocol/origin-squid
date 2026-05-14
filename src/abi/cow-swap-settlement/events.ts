import { address, bool, bytes, bytes4, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** Interaction(address,uint256,bytes4) */
export const Interaction = event('0xed99827efb37016f2275f98c4bcf71c7551c75d59e9b450f79fa32e60be672c2', {
    target: indexed(address),
    value: uint256,
    selector: bytes4,
})
export type InteractionEventArgs = EParams<typeof Interaction>

/** OrderInvalidated(address,bytes) */
export const OrderInvalidated = event('0x875b6cb035bbd4ac6500fabc6d1e4ca5bdc58a3e2b424ccb5c24cdbebeb009a9', {
    owner: indexed(address),
    orderUid: bytes,
})
export type OrderInvalidatedEventArgs = EParams<typeof OrderInvalidated>

/** PreSignature(address,bytes,bool) */
export const PreSignature = event('0x01bf7c8b0ca55deecbea89d7e58295b7ffbf685fd0d96801034ba8c6ffe1c68d', {
    owner: indexed(address),
    orderUid: bytes,
    signed: bool,
})
export type PreSignatureEventArgs = EParams<typeof PreSignature>

/** Settlement(address) */
export const Settlement = event('0x40338ce1a7c49204f0099533b1e9a7ee0a3d261f84974ab7af36105b8c4e9db4', {
    solver: indexed(address),
})
export type SettlementEventArgs = EParams<typeof Settlement>

/** Trade(address,address,address,uint256,uint256,uint256,bytes) */
export const Trade = event('0xa07a543ab8a018198e99ca0184c93fe9050a79400a0a723441f84de1d972cc17', {
    owner: indexed(address),
    sellToken: address,
    buyToken: address,
    sellAmount: uint256,
    buyAmount: uint256,
    feeAmount: uint256,
    orderUid: bytes,
})
export type TradeEventArgs = EParams<typeof Trade>
