import { bytes } from '@subsquid/evm-codec'
import { event } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** DepositEvent(bytes,bytes,bytes,bytes,bytes) */
export const DepositEvent = event('0x649bbc62d0e31342afea4e5cd82d4049e7e1ee912fc0889aa790803be39038c5', {
    pubkey: bytes,
    withdrawal_credentials: bytes,
    amount: bytes,
    signature: bytes,
    index: bytes,
})
export type DepositEventEventArgs = EParams<typeof DepositEvent>
