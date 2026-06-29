import { address, bytes, bytes32, struct, uint256, uint32 } from '@subsquid/evm-codec'
import { event } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** NewCampaign((bytes32,address,address,uint256,uint32,uint32,uint32,bytes)) */
export const NewCampaign = event('0x6e3c6fa6d4815a856783888c5c3ea2ad7e7303ac0cca66c99f5bd93502c44299', {
    campaign: struct({
        campaignId: bytes32,
        creator: address,
        rewardToken: address,
        amount: uint256,
        campaignType: uint32,
        startTimestamp: uint32,
        duration: uint32,
        campaignData: bytes,
    }),
})
export type NewCampaignEventArgs = EParams<typeof NewCampaign>

/** CampaignOverride(bytes32,(bytes32,address,address,uint256,uint32,uint32,uint32,bytes)) */
export const CampaignOverride = event('0x498dd5714cfae17b608b5c0e95dd223dec5bdd052a793a9e22f3f5d5a20c63d8', {
    _campaignId: bytes32,
    campaign: struct({
        campaignId: bytes32,
        creator: address,
        rewardToken: address,
        amount: uint256,
        campaignType: uint32,
        startTimestamp: uint32,
        duration: uint32,
        campaignData: bytes,
    }),
})
export type CampaignOverrideEventArgs = EParams<typeof CampaignOverride>
