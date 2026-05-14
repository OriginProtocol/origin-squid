import { address, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** ExecutionRewardsCollected(address,uint256) */
export const ExecutionRewardsCollected = event('0xc2acb502a0dc166a61cd83b914b480d76050e91a6797d7a833be84c4eace1dfe', {
    strategy: indexed(address),
    amount: uint256,
})
export type ExecutionRewardsCollectedEventArgs = EParams<typeof ExecutionRewardsCollected>
