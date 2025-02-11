import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    CampaignClosed: event("0x5e6eb33a418de5dbbc17f989f7ae362cdfbb1748c5d603137c767027a354edbc", "CampaignClosed(uint256)", {"campaignId": p.uint256}),
    CampaignCreated: event("0xfe76983af97e70cb1d5a3f3b21250c6bd2b5b9216dd3829a1cdab060e17ab15b", "CampaignCreated(address,address,uint256,uint256)", {"gauge": p.address, "rewardToken": p.address, "maxRewardPerVote": p.uint256, "totalRewardAmount": p.uint256}),
    CampaignIdUpdated: event("0x53c4764ec903d5e515c69c93f0b9b2916f9aa3fa54b34caeeae7bb596d7ec0f6", "CampaignIdUpdated(uint256)", {"newId": p.uint256}),
    CampaignRemoteManagerUpdated: event("0x3647dc83747c62411c2c3b832d3b044db3479bebbaeb800e7eaf100d41d2038e", "CampaignRemoteManagerUpdated(address)", {"newCampaignRemoteManager": p.address}),
    FeeCollected: event("0x06c5efeff5c320943d265dc4e5f1af95ad523555ce0c1957e367dda5514572df", "FeeCollected(address,uint256)", {"feeCollector": p.address, "feeAmount": p.uint256}),
    FeeCollectorUpdated: event("0xe5693914d19c789bdee50a362998c0bc8d035a835f9871da5d51152f0582c34f", "FeeCollectorUpdated(address)", {"newFeeCollector": p.address}),
    FeeUpdated: event("0xc8fcf8ee1425e7e60b8af83735e1eb516d5b9ef05bfd6eece552ebaeb7c75b48", "FeeUpdated(uint16)", {"newFee": p.uint16}),
    GovernorshipTransferred: event("0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a", "GovernorshipTransferred(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    NumberOfPeriodsUpdated: event("0x71113ae8f52afc8062af1d0ec71513000c9a7b93eeb737ab8fb50f908445d78a", "NumberOfPeriodsUpdated(uint8)", {"extraNumberOfPeriods": p.uint8}),
    PendingGovernorshipTransfer: event("0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d", "PendingGovernorshipTransfer(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    RewardPerVoteUpdated: event("0x8f283dbedfa7a1926a86469a652c5f13e8f038708d78cbeb0e1950c9e0862502", "RewardPerVoteUpdated(uint256)", {"newMaxRewardPerVote": p.uint256}),
    StrategistUpdated: event("0x869e0abd13cc3a975de7b93be3df1cb2255c802b1cead85963cc79d99f131bee", "StrategistUpdated(address)", {"_address": p.address}),
    TokensRescued: event("0xfb475a842bad10d3800b61bd1a92e716051afba979b124b583bd99a2d1d7bfd5", "TokensRescued(address,uint256,address)", {"token": p.address, "amount": p.uint256, "receiver": p.address}),
    TotalRewardAmountUpdated: event("0xd922add93b22e9295e2ea259b37756ee2ccafa6872cccda342584d40c754c766", "TotalRewardAmountUpdated(uint256)", {"extraTotalRewardAmount": p.uint256}),
    VotemarketUpdated: event("0x4d91cd42ff82ea2004fe60a13788b0c4a8ea5cc08105cc9e21098a93547845ec", "VotemarketUpdated(address)", {"newVotemarket": p.address}),
}

export const functions = {
    FEE_BASE: viewFun("0xecefc705", "FEE_BASE()", {}, p.uint16),
    campaignId: viewFun("0x8ed5b0fc", "campaignId()", {}, p.uint256),
    campaignRemoteManager: viewFun("0x833f68c8", "campaignRemoteManager()", {}, p.address),
    claimGovernance: fun("0x5d36b190", "claimGovernance()", {}, ),
    closeCampaign: fun("0x14c89e17", "closeCampaign(uint256,uint256,uint256)", {"_campaignId": p.uint256, "bridgeFee": p.uint256, "additionalGasLimit": p.uint256}, ),
    createCampaign: fun("0xab34884c", "createCampaign(uint8,uint256,address[],uint256,uint256)", {"numberOfPeriods": p.uint8, "maxRewardPerVote": p.uint256, "blacklist": p.array(p.address), "bridgeFee": p.uint256, "additionalGasLimit": p.uint256}, ),
    fee: viewFun("0xddca3f43", "fee()", {}, p.uint16),
    feeCollector: viewFun("0xc415b95c", "feeCollector()", {}, p.address),
    gauge: viewFun("0xa6f19c84", "gauge()", {}, p.address),
    governor: viewFun("0x0c340a24", "governor()", {}, p.address),
    initialize: fun("0xb0c5b7d8", "initialize(address,uint16,address,address,address)", {"_strategist": p.address, "_fee": p.uint16, "_feeCollector": p.address, "_campaignRemoteManager": p.address, "_votemarket": p.address}, ),
    isGovernor: viewFun("0xc7af3352", "isGovernor()", {}, p.bool),
    manageNumberOfPeriods: fun("0xe9a02143", "manageNumberOfPeriods(uint8,uint256,uint256)", {"extraNumberOfPeriods": p.uint8, "bridgeFee": p.uint256, "additionalGasLimit": p.uint256}, ),
    manageRewardPerVote: fun("0x0aaef854", "manageRewardPerVote(uint256,uint256,uint256)", {"newMaxRewardPerVote": p.uint256, "bridgeFee": p.uint256, "additionalGasLimit": p.uint256}, ),
    manageTotalRewardAmount: fun("0x7039e002", "manageTotalRewardAmount(uint256,uint256)", {"bridgeFee": p.uint256, "additionalGasLimit": p.uint256}, ),
    rescueETH: fun("0x04824e70", "rescueETH(address)", {"receiver": p.address}, ),
    rescueToken: fun("0x4707d000", "rescueToken(address,address)", {"token": p.address, "receiver": p.address}, ),
    rewardToken: viewFun("0xf7c618c1", "rewardToken()", {}, p.address),
    setCampaignId: fun("0x94095c2d", "setCampaignId(uint256)", {"_campaignId": p.uint256}, ),
    setCampaignRemoteManager: fun("0xbcfb252c", "setCampaignRemoteManager(address)", {"_campaignRemoteManager": p.address}, ),
    setFee: fun("0x8e005553", "setFee(uint16)", {"_fee": p.uint16}, ),
    setFeeCollector: fun("0xa42dce80", "setFeeCollector(address)", {"_feeCollector": p.address}, ),
    setStrategistAddr: fun("0x773540b3", "setStrategistAddr(address)", {"_address": p.address}, ),
    setVotemarket: fun("0x05f56809", "setVotemarket(address)", {"_votemarket": p.address}, ),
    strategistAddr: viewFun("0x570d8e1d", "strategistAddr()", {}, p.address),
    targetChainId: viewFun("0x146ffb26", "targetChainId()", {}, p.uint256),
    transferGovernance: fun("0xd38bfff4", "transferGovernance(address)", {"_newGovernor": p.address}, ),
    votemarket: viewFun("0xd4629800", "votemarket()", {}, p.address),
}

export class Contract extends ContractBase {

    FEE_BASE() {
        return this.eth_call(functions.FEE_BASE, {})
    }

    campaignId() {
        return this.eth_call(functions.campaignId, {})
    }

    campaignRemoteManager() {
        return this.eth_call(functions.campaignRemoteManager, {})
    }

    fee() {
        return this.eth_call(functions.fee, {})
    }

    feeCollector() {
        return this.eth_call(functions.feeCollector, {})
    }

    gauge() {
        return this.eth_call(functions.gauge, {})
    }

    governor() {
        return this.eth_call(functions.governor, {})
    }

    isGovernor() {
        return this.eth_call(functions.isGovernor, {})
    }

    rewardToken() {
        return this.eth_call(functions.rewardToken, {})
    }

    strategistAddr() {
        return this.eth_call(functions.strategistAddr, {})
    }

    targetChainId() {
        return this.eth_call(functions.targetChainId, {})
    }

    votemarket() {
        return this.eth_call(functions.votemarket, {})
    }
}

/// Event types
export type CampaignClosedEventArgs = EParams<typeof events.CampaignClosed>
export type CampaignCreatedEventArgs = EParams<typeof events.CampaignCreated>
export type CampaignIdUpdatedEventArgs = EParams<typeof events.CampaignIdUpdated>
export type CampaignRemoteManagerUpdatedEventArgs = EParams<typeof events.CampaignRemoteManagerUpdated>
export type FeeCollectedEventArgs = EParams<typeof events.FeeCollected>
export type FeeCollectorUpdatedEventArgs = EParams<typeof events.FeeCollectorUpdated>
export type FeeUpdatedEventArgs = EParams<typeof events.FeeUpdated>
export type GovernorshipTransferredEventArgs = EParams<typeof events.GovernorshipTransferred>
export type NumberOfPeriodsUpdatedEventArgs = EParams<typeof events.NumberOfPeriodsUpdated>
export type PendingGovernorshipTransferEventArgs = EParams<typeof events.PendingGovernorshipTransfer>
export type RewardPerVoteUpdatedEventArgs = EParams<typeof events.RewardPerVoteUpdated>
export type StrategistUpdatedEventArgs = EParams<typeof events.StrategistUpdated>
export type TokensRescuedEventArgs = EParams<typeof events.TokensRescued>
export type TotalRewardAmountUpdatedEventArgs = EParams<typeof events.TotalRewardAmountUpdated>
export type VotemarketUpdatedEventArgs = EParams<typeof events.VotemarketUpdated>

/// Function types
export type FEE_BASEParams = FunctionArguments<typeof functions.FEE_BASE>
export type FEE_BASEReturn = FunctionReturn<typeof functions.FEE_BASE>

export type CampaignIdParams = FunctionArguments<typeof functions.campaignId>
export type CampaignIdReturn = FunctionReturn<typeof functions.campaignId>

export type CampaignRemoteManagerParams = FunctionArguments<typeof functions.campaignRemoteManager>
export type CampaignRemoteManagerReturn = FunctionReturn<typeof functions.campaignRemoteManager>

export type ClaimGovernanceParams = FunctionArguments<typeof functions.claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof functions.claimGovernance>

export type CloseCampaignParams = FunctionArguments<typeof functions.closeCampaign>
export type CloseCampaignReturn = FunctionReturn<typeof functions.closeCampaign>

export type CreateCampaignParams = FunctionArguments<typeof functions.createCampaign>
export type CreateCampaignReturn = FunctionReturn<typeof functions.createCampaign>

export type FeeParams = FunctionArguments<typeof functions.fee>
export type FeeReturn = FunctionReturn<typeof functions.fee>

export type FeeCollectorParams = FunctionArguments<typeof functions.feeCollector>
export type FeeCollectorReturn = FunctionReturn<typeof functions.feeCollector>

export type GaugeParams = FunctionArguments<typeof functions.gauge>
export type GaugeReturn = FunctionReturn<typeof functions.gauge>

export type GovernorParams = FunctionArguments<typeof functions.governor>
export type GovernorReturn = FunctionReturn<typeof functions.governor>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsGovernorParams = FunctionArguments<typeof functions.isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof functions.isGovernor>

export type ManageNumberOfPeriodsParams = FunctionArguments<typeof functions.manageNumberOfPeriods>
export type ManageNumberOfPeriodsReturn = FunctionReturn<typeof functions.manageNumberOfPeriods>

export type ManageRewardPerVoteParams = FunctionArguments<typeof functions.manageRewardPerVote>
export type ManageRewardPerVoteReturn = FunctionReturn<typeof functions.manageRewardPerVote>

export type ManageTotalRewardAmountParams = FunctionArguments<typeof functions.manageTotalRewardAmount>
export type ManageTotalRewardAmountReturn = FunctionReturn<typeof functions.manageTotalRewardAmount>

export type RescueETHParams = FunctionArguments<typeof functions.rescueETH>
export type RescueETHReturn = FunctionReturn<typeof functions.rescueETH>

export type RescueTokenParams = FunctionArguments<typeof functions.rescueToken>
export type RescueTokenReturn = FunctionReturn<typeof functions.rescueToken>

export type RewardTokenParams = FunctionArguments<typeof functions.rewardToken>
export type RewardTokenReturn = FunctionReturn<typeof functions.rewardToken>

export type SetCampaignIdParams = FunctionArguments<typeof functions.setCampaignId>
export type SetCampaignIdReturn = FunctionReturn<typeof functions.setCampaignId>

export type SetCampaignRemoteManagerParams = FunctionArguments<typeof functions.setCampaignRemoteManager>
export type SetCampaignRemoteManagerReturn = FunctionReturn<typeof functions.setCampaignRemoteManager>

export type SetFeeParams = FunctionArguments<typeof functions.setFee>
export type SetFeeReturn = FunctionReturn<typeof functions.setFee>

export type SetFeeCollectorParams = FunctionArguments<typeof functions.setFeeCollector>
export type SetFeeCollectorReturn = FunctionReturn<typeof functions.setFeeCollector>

export type SetStrategistAddrParams = FunctionArguments<typeof functions.setStrategistAddr>
export type SetStrategistAddrReturn = FunctionReturn<typeof functions.setStrategistAddr>

export type SetVotemarketParams = FunctionArguments<typeof functions.setVotemarket>
export type SetVotemarketReturn = FunctionReturn<typeof functions.setVotemarket>

export type StrategistAddrParams = FunctionArguments<typeof functions.strategistAddr>
export type StrategistAddrReturn = FunctionReturn<typeof functions.strategistAddr>

export type TargetChainIdParams = FunctionArguments<typeof functions.targetChainId>
export type TargetChainIdReturn = FunctionReturn<typeof functions.targetChainId>

export type TransferGovernanceParams = FunctionArguments<typeof functions.transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof functions.transferGovernance>

export type VotemarketParams = FunctionArguments<typeof functions.votemarket>
export type VotemarketReturn = FunctionReturn<typeof functions.votemarket>

