import { address, array, uint256 } from '@subsquid/evm-codec'
import { event } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** BasePoolAdded(address) */
export const BasePoolAdded = event('0xcc6afdfec79da6be08142ecee25cf14b665961e25d30d8eba45959be9547635f', {
    base_pool: address,
})
export type BasePoolAddedEventArgs = EParams<typeof BasePoolAdded>

/** PlainPoolDeployed(address[],uint256,uint256,address) */
export const PlainPoolDeployed = event('0xd1d60d4611e4091bb2e5f699eeb79136c21ac2305ad609f3de569afc3471eecc', {
    coins: array(address),
    A: uint256,
    fee: uint256,
    deployer: address,
})
export type PlainPoolDeployedEventArgs = EParams<typeof PlainPoolDeployed>

/** MetaPoolDeployed(address,address,uint256,uint256,address) */
export const MetaPoolDeployed = event('0x01f31cd2abdeb4e5e10ba500f2db0f937d9e8c735ab04681925441b4ea37eda5', {
    coin: address,
    base_pool: address,
    A: uint256,
    fee: uint256,
    deployer: address,
})
export type MetaPoolDeployedEventArgs = EParams<typeof MetaPoolDeployed>

/** LiquidityGaugeDeployed(address,address) */
export const LiquidityGaugeDeployed = event('0x656bb34c20491970a8c163f3bd62ead82022b379c3924960ec60f6dbfc5aab3b', {
    pool: address,
    gauge: address,
})
export type LiquidityGaugeDeployedEventArgs = EParams<typeof LiquidityGaugeDeployed>
