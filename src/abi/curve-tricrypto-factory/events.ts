import { address, bytes32, fixedSizeArray, string, uint256 } from '@subsquid/evm-codec'
import { event } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** TricryptoPoolDeployed(address,string,string,address,address[3],address,bytes32,uint256,uint256,uint256,uint256,uint256,address) */
export const TricryptoPoolDeployed = event('0xa307f5d0802489baddec443058a63ce115756de9020e2b07d3e2cd2f21269e2a', {
    pool: address,
    name: string,
    symbol: string,
    weth: address,
    coins: fixedSizeArray(address, 3),
    math: address,
    salt: bytes32,
    packed_precisions: uint256,
    packed_A_gamma: uint256,
    packed_fee_params: uint256,
    packed_rebalancing_params: uint256,
    packed_prices: uint256,
    deployer: address,
})
export type TricryptoPoolDeployedEventArgs = EParams<typeof TricryptoPoolDeployed>

/** LiquidityGaugeDeployed(address,address) */
export const LiquidityGaugeDeployed = event('0x656bb34c20491970a8c163f3bd62ead82022b379c3924960ec60f6dbfc5aab3b', {
    pool: address,
    gauge: address,
})
export type LiquidityGaugeDeployedEventArgs = EParams<typeof LiquidityGaugeDeployed>

/** UpdateFeeReceiver(address,address) */
export const UpdateFeeReceiver = event('0x2861448678f0be67f11bfb5481b3e3b4cfeb3acc6126ad60a05f95bfc6530666', {
    _old_fee_receiver: address,
    _new_fee_receiver: address,
})
export type UpdateFeeReceiverEventArgs = EParams<typeof UpdateFeeReceiver>

/** UpdatePoolImplementation(uint256,address,address) */
export const UpdatePoolImplementation = event('0x6a42ef9605e135afaf6ae4f3683b161a3b7369d07c9d52c701ab69553e04c3b6', {
    _implemention_id: uint256,
    _old_pool_implementation: address,
    _new_pool_implementation: address,
})
export type UpdatePoolImplementationEventArgs = EParams<typeof UpdatePoolImplementation>

/** UpdateGaugeImplementation(address,address) */
export const UpdateGaugeImplementation = event('0x1fd705f9c77053962a503f2f2f57f0862b4c3af687c25615c13817a86946c359', {
    _old_gauge_implementation: address,
    _new_gauge_implementation: address,
})
export type UpdateGaugeImplementationEventArgs = EParams<typeof UpdateGaugeImplementation>

/** UpdateMathImplementation(address,address) */
export const UpdateMathImplementation = event('0x68fe8fc3ac76ec17e21117df5e854c8c25b7b5f776aad2adc927fdd156bcd6de', {
    _old_math_implementation: address,
    _new_math_implementation: address,
})
export type UpdateMathImplementationEventArgs = EParams<typeof UpdateMathImplementation>

/** UpdateViewsImplementation(address,address) */
export const UpdateViewsImplementation = event('0xd84eb1ea70cda40a6bfaa11f4f69efa10cbc5eb82760b3058f440512ec1d6d1f', {
    _old_views_implementation: address,
    _new_views_implementation: address,
})
export type UpdateViewsImplementationEventArgs = EParams<typeof UpdateViewsImplementation>

/** TransferOwnership(address,address) */
export const TransferOwnership = event('0x5c486528ec3e3f0ea91181cff8116f02bfa350e03b8b6f12e00765adbb5af85c', {
    _old_owner: address,
    _new_owner: address,
})
export type TransferOwnershipEventArgs = EParams<typeof TransferOwnership>
