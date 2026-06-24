export const ABI_JSON = [
    {
        "anonymous": false,
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "campaignId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "rewardToken",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint32",
                        "name": "campaignType",
                        "type": "uint32"
                    },
                    {
                        "internalType": "uint32",
                        "name": "startTimestamp",
                        "type": "uint32"
                    },
                    {
                        "internalType": "uint32",
                        "name": "duration",
                        "type": "uint32"
                    },
                    {
                        "internalType": "bytes",
                        "name": "campaignData",
                        "type": "bytes"
                    }
                ],
                "indexed": false,
                "internalType": "struct CampaignParameters",
                "name": "campaign",
                "type": "tuple"
            }
        ],
        "name": "NewCampaign",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "_campaignId",
                "type": "bytes32"
            },
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "campaignId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "rewardToken",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint32",
                        "name": "campaignType",
                        "type": "uint32"
                    },
                    {
                        "internalType": "uint32",
                        "name": "startTimestamp",
                        "type": "uint32"
                    },
                    {
                        "internalType": "uint32",
                        "name": "duration",
                        "type": "uint32"
                    },
                    {
                        "internalType": "bytes",
                        "name": "campaignData",
                        "type": "bytes"
                    }
                ],
                "indexed": false,
                "internalType": "struct CampaignParameters",
                "name": "campaign",
                "type": "tuple"
            }
        ],
        "name": "CampaignOverride",
        "type": "event"
    }
] as const
