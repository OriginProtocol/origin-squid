import { address, bool, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** PoolCreated(address,address,bool,address,uint256) */
export const PoolCreated = event('0x2128d88d14c80cb081c1252a5acff7a264671bf199ce226b53788fb26065005e', {
    token0: indexed(address),
    token1: indexed(address),
    stable: indexed(bool),
    pool: address,
    _4: uint256,
})
export type PoolCreatedEventArgs = EParams<typeof PoolCreated>

/** SetCustomFee(address,uint256) */
export const SetCustomFee = event('0xae468ce586f9a87660fdffc1448cee942042c16ae2f02046b134b5224f31936b', {
    pool: indexed(address),
    fee: uint256,
})
export type SetCustomFeeEventArgs = EParams<typeof SetCustomFee>

/** SetFeeManager(address) */
export const SetFeeManager = event('0x5d0517e3a4eabea892d9750138cd21d4a6cf3b935b43d0598df7055f463819b2', {
    feeManager: address,
})
export type SetFeeManagerEventArgs = EParams<typeof SetFeeManager>

/** SetPauseState(bool) */
export const SetPauseState = event('0x0d76538efc408318a051137c2720a9e82902acdbd46b802d488b74ca3a09a116', {
    state: bool,
})
export type SetPauseStateEventArgs = EParams<typeof SetPauseState>

/** SetPauser(address) */
export const SetPauser = event('0xe02efb9e8f0fc21546730ab32d594f62d586e1bbb15bb5045edd0b1878a77b35', {
    pauser: address,
})
export type SetPauserEventArgs = EParams<typeof SetPauser>

/** SetVoter(address) */
export const SetVoter = event('0xc6ff127433b785c51da9ae4088ee184c909b1a55b9afd82ae6c64224d3bc15d2', {
    voter: address,
})
export type SetVoterEventArgs = EParams<typeof SetVoter>
