import { address, fixedSizeArray, int128, uint256 } from '@subsquid/evm-codec'
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

/** AddLiquidity(address,uint256[2],uint256[2],uint256,uint256) */
export const AddLiquidity = event('0x26f55a85081d24974e85c6c00045d0f0453991e95873f52bff0d21af4079a768', {
    provider: indexed(address),
    token_amounts: fixedSizeArray(uint256, 2),
    fees: fixedSizeArray(uint256, 2),
    invariant: uint256,
    token_supply: uint256,
})
export type AddLiquidityEventArgs = EParams<typeof AddLiquidity>

/** RemoveLiquidity(address,uint256[2],uint256[2],uint256) */
export const RemoveLiquidity = event('0x7c363854ccf79623411f8995b362bce5eddff18c927edc6f5dbbb5e05819a82c', {
    provider: indexed(address),
    token_amounts: fixedSizeArray(uint256, 2),
    fees: fixedSizeArray(uint256, 2),
    token_supply: uint256,
})
export type RemoveLiquidityEventArgs = EParams<typeof RemoveLiquidity>

/** RemoveLiquidityOne(address,uint256,uint256,uint256) */
export const RemoveLiquidityOne = event('0x5ad056f2e28a8cec232015406b843668c1e36cda598127ec3b8c59b8c72773a0', {
    provider: indexed(address),
    token_amount: uint256,
    coin_amount: uint256,
    token_supply: uint256,
})
export type RemoveLiquidityOneEventArgs = EParams<typeof RemoveLiquidityOne>

/** RemoveLiquidityImbalance(address,uint256[2],uint256[2],uint256,uint256) */
export const RemoveLiquidityImbalance = event('0x2b5508378d7e19e0d5fa338419034731416c4f5b219a10379956f764317fd47e', {
    provider: indexed(address),
    token_amounts: fixedSizeArray(uint256, 2),
    fees: fixedSizeArray(uint256, 2),
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

/** CommitNewFee(uint256) */
export const CommitNewFee = event('0x878eb36b3f197f05821c06953d9bc8f14b332a227b1e26df06a4215bbfe5d73f', {
    new_fee: uint256,
})
export type CommitNewFeeEventArgs = EParams<typeof CommitNewFee>

/** ApplyNewFee(uint256) */
export const ApplyNewFee = event('0xa8715770654f54603947addf38c689adbd7182e21673b28bcf306a957aaba215', {
    fee: uint256,
})
export type ApplyNewFeeEventArgs = EParams<typeof ApplyNewFee>
