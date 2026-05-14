import { address, array, int128, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** Transfer(address,address,uint256) */
export const Transfer = event('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', {
    sender: indexed(address),
    receiver: indexed(address),
    value: uint256,
})
export type TransferEventArgs = EParams<typeof Transfer>

/** Approval(address,address,uint256) */
export const Approval = event('0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', {
    owner: indexed(address),
    spender: indexed(address),
    value: uint256,
})
export type ApprovalEventArgs = EParams<typeof Approval>

/** TokenExchange(address,int128,uint256,int128,uint256) */
export const TokenExchange = event('0x8b3e96f2b889fa771c53c981b40daf005f63f637f1869f707052d15a3dd97140', {
    buyer: indexed(address),
    sold_id: int128,
    tokens_sold: uint256,
    bought_id: int128,
    tokens_bought: uint256,
})
export type TokenExchangeEventArgs = EParams<typeof TokenExchange>

/** TokenExchangeUnderlying(address,int128,uint256,int128,uint256) */
export const TokenExchangeUnderlying = event('0xd013ca23e77a65003c2c659c5442c00c805371b7fc1ebd4c206c41d1536bd90b', {
    buyer: indexed(address),
    sold_id: int128,
    tokens_sold: uint256,
    bought_id: int128,
    tokens_bought: uint256,
})
export type TokenExchangeUnderlyingEventArgs = EParams<typeof TokenExchangeUnderlying>

/** AddLiquidity(address,uint256[],uint256[],uint256,uint256) */
export const AddLiquidity = event('0x189c623b666b1b45b83d7178f39b8c087cb09774317ca2f53c2d3c3726f222a2', {
    provider: indexed(address),
    token_amounts: array(uint256),
    fees: array(uint256),
    invariant: uint256,
    token_supply: uint256,
})
export type AddLiquidityEventArgs = EParams<typeof AddLiquidity>

/** RemoveLiquidity(address,uint256[],uint256[],uint256) */
export const RemoveLiquidity = event('0x347ad828e58cbe534d8f6b67985d791360756b18f0d95fd9f197a66cc46480ea', {
    provider: indexed(address),
    token_amounts: array(uint256),
    fees: array(uint256),
    token_supply: uint256,
})
export type RemoveLiquidityEventArgs = EParams<typeof RemoveLiquidity>

/** RemoveLiquidityOne(address,int128,uint256,uint256,uint256) */
export const RemoveLiquidityOne = event('0x6f48129db1f37ccb9cc5dd7e119cb32750cabdf75b48375d730d26ce3659bbe1', {
    provider: indexed(address),
    token_id: int128,
    token_amount: uint256,
    coin_amount: uint256,
    token_supply: uint256,
})
export type RemoveLiquidityOneEventArgs = EParams<typeof RemoveLiquidityOne>

/** RemoveLiquidityImbalance(address,uint256[],uint256[],uint256,uint256) */
export const RemoveLiquidityImbalance = event('0x3631c28b1f9dd213e0319fb167b554d76b6c283a41143eb400a0d1adb1af1755', {
    provider: indexed(address),
    token_amounts: array(uint256),
    fees: array(uint256),
    invariant: uint256,
    token_supply: uint256,
})
export type RemoveLiquidityImbalanceEventArgs = EParams<typeof RemoveLiquidityImbalance>

/** RampA(uint256,uint256,uint256,uint256) */
export const RampA = event('0xa2b71ec6df949300b59aab36b55e189697b750119dd349fcfa8c0f779e83c254', {
    old_A: uint256,
    new_A: uint256,
    initial_time: uint256,
    future_time: uint256,
})
export type RampAEventArgs = EParams<typeof RampA>

/** StopRampA(uint256,uint256) */
export const StopRampA = event('0x46e22fb3709ad289f62ce63d469248536dbc78d82b84a3d7e74ad606dc201938', {
    A: uint256,
    t: uint256,
})
export type StopRampAEventArgs = EParams<typeof StopRampA>

/** ApplyNewFee(uint256,uint256) */
export const ApplyNewFee = event('0x750d10a7f37466ce785ee6bcb604aac543358db42afbcc332a3c12a49c80bf6d', {
    fee: uint256,
    offpeg_fee_multiplier: uint256,
})
export type ApplyNewFeeEventArgs = EParams<typeof ApplyNewFee>

/** SetNewMATime(uint256,uint256) */
export const SetNewMATime = event('0x68dc4e067dff1862b896b7a0faf55f97df1a60d0aaa79481b69d675f2026a28c', {
    ma_exp_time: uint256,
    D_ma_time: uint256,
})
export type SetNewMATimeEventArgs = EParams<typeof SetNewMATime>
