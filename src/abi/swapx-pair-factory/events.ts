import { address, bool, uint256, uint8 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** Initialized(uint8) */
export const Initialized = event('0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498', {
    version: uint8,
})
export type InitializedEventArgs = EParams<typeof Initialized>

/** OwnershipTransferred(address,address) */
export const OwnershipTransferred = event('0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0', {
    previousOwner: indexed(address),
    newOwner: indexed(address),
})
export type OwnershipTransferredEventArgs = EParams<typeof OwnershipTransferred>

/** PairCreated(address,address,bool,address,uint256) */
export const PairCreated = event('0xc4805696c66d7cf352fc1d6bb633ad5ee82f6cb577c453024b6e0eb8306c6fc9', {
    token0: indexed(address),
    token1: indexed(address),
    stable: bool,
    pair: address,
    _4: uint256,
})
export type PairCreatedEventArgs = EParams<typeof PairCreated>
