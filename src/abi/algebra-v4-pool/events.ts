import { address, int24, int256, uint128, uint16, uint160, uint256, uint8 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** Burn(address,int24,int24,uint128,uint256,uint256) */
export const Burn = event('0x0c396cd989a39f4459b5fa1aed6a9a8dcdbc45908acfd67e028cd568da98982c', {
    owner: indexed(address),
    bottomTick: indexed(int24),
    topTick: indexed(int24),
    liquidityAmount: uint128,
    amount0: uint256,
    amount1: uint256,
})
export type BurnEventArgs = EParams<typeof Burn>

/** Collect(address,address,int24,int24,uint128,uint128) */
export const Collect = event('0x70935338e69775456a85ddef226c395fb668b63fa0115f5f20610b388e6ca9c0', {
    owner: indexed(address),
    recipient: address,
    bottomTick: indexed(int24),
    topTick: indexed(int24),
    amount0: uint128,
    amount1: uint128,
})
export type CollectEventArgs = EParams<typeof Collect>

/** CommunityFee(uint16) */
export const CommunityFee = event('0x3647dccc990d4941b0b05b32527ef493a98d6187b20639ca2f9743f3b55ca5e1', {
    communityFeeNew: uint16,
})
export type CommunityFeeEventArgs = EParams<typeof CommunityFee>

/** CommunityVault(address) */
export const CommunityVault = event('0xb0b573c1f636e1f8bd9b415ba6c04d6dd49100bc25493fc6305b65ec0e581df3', {
    newCommunityVault: address,
})
export type CommunityVaultEventArgs = EParams<typeof CommunityVault>

/** Fee(uint16) */
export const Fee = event('0x598b9f043c813aa6be3426ca60d1c65d17256312890be5118dab55b0775ebe2a', {
    fee: uint16,
})
export type FeeEventArgs = EParams<typeof Fee>

/** Flash(address,address,uint256,uint256,uint256,uint256) */
export const Flash = event('0xbdbdb71d7860376ba52b25a5028beea23581364a40522f6bcfb86bb1f2dca633', {
    sender: indexed(address),
    recipient: indexed(address),
    amount0: uint256,
    amount1: uint256,
    paid0: uint256,
    paid1: uint256,
})
export type FlashEventArgs = EParams<typeof Flash>

/** Initialize(uint160,int24) */
export const Initialize = event('0x98636036cb66a9c19a37435efc1e90142190214e8abeb821bdba3f2990dd4c95', {
    price: uint160,
    tick: int24,
})
export type InitializeEventArgs = EParams<typeof Initialize>

/** Mint(address,address,int24,int24,uint128,uint256,uint256) */
export const Mint = event('0x7a53080ba414158be7ec69b987b5fb7d07dee101fe85488f0853ae16239d0bde', {
    sender: address,
    owner: indexed(address),
    bottomTick: indexed(int24),
    topTick: indexed(int24),
    liquidityAmount: uint128,
    amount0: uint256,
    amount1: uint256,
})
export type MintEventArgs = EParams<typeof Mint>

/** Plugin(address) */
export const Plugin = event('0x27a3944eff2135a57675f17e72501038982b73620d01f794c72e93d61a3932a2', {
    newPluginAddress: address,
})
export type PluginEventArgs = EParams<typeof Plugin>

/** PluginConfig(uint8) */
export const PluginConfig = event('0x3a6271b36c1b44bd6a0a0d56230602dc6919b7c17af57254306fadf5fee69dc3', {
    newPluginConfig: uint8,
})
export type PluginConfigEventArgs = EParams<typeof PluginConfig>

/** Swap(address,address,int256,int256,uint160,uint128,int24) */
export const Swap = event('0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67', {
    sender: indexed(address),
    recipient: indexed(address),
    amount0: int256,
    amount1: int256,
    price: uint160,
    liquidity: uint128,
    tick: int24,
})
export type SwapEventArgs = EParams<typeof Swap>

/** TickSpacing(int24) */
export const TickSpacing = event('0x01413b1d5d4c359e9a0daa7909ecda165f6e8c51fe2ff529d74b22a5a7c02645', {
    newTickSpacing: int24,
})
export type TickSpacingEventArgs = EParams<typeof TickSpacing>
