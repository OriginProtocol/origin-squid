import { address, string, uint128 } from '@subsquid/evm-codec'
import { event } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** OracleUpdate(string,uint128,uint128) */
export const OracleUpdate = event('0xa7fc99ed7617309ee23f63ae90196a1e490d362e6f6a547a59bc809ee2291782', {
    key: string,
    value: uint128,
    timestamp: uint128,
})
export type OracleUpdateEventArgs = EParams<typeof OracleUpdate>

/** UpdaterAddressChange(address) */
export const UpdaterAddressChange = event('0x121e958a4cadf7f8dadefa22cc019700365240223668418faebed197da07089f', {
    newUpdater: address,
})
export type UpdaterAddressChangeEventArgs = EParams<typeof UpdaterAddressChange>
