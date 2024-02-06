export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": []
    },
    {
        "type": "error",
        "name": "AssetNotSupported",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CallerNotLRTConfigAdmin",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CallerNotLRTConfigManager",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CallerNotLRTConfigOperator",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidETHSender",
        "inputs": []
    },
    {
        "type": "error",
        "name": "StrategyIsNotSetForAsset",
        "inputs": []
    },
    {
        "type": "error",
        "name": "TokenTransferFailed",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ZeroAddressNotAllowed",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AssetDepositIntoStrategy",
        "inputs": [
            {
                "type": "address",
                "name": "asset",
                "indexed": true
            },
            {
                "type": "address",
                "name": "strategy",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "depositAmount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ETHDepositFromDepositPool",
        "inputs": [
            {
                "type": "uint256",
                "name": "depositAmount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ETHRewardsReceived",
        "inputs": [
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ETHStaked",
        "inputs": [
            {
                "type": "bytes",
                "name": "valPubKey",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "EigenPodCreated",
        "inputs": [
            {
                "type": "address",
                "name": "eigenPod",
                "indexed": true
            },
            {
                "type": "address",
                "name": "podOwner",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Initialized",
        "inputs": [
            {
                "type": "uint8",
                "name": "version",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Paused",
        "inputs": [
            {
                "type": "address",
                "name": "account",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Unpaused",
        "inputs": [
            {
                "type": "address",
                "name": "account",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "UpdatedLRTConfig",
        "inputs": [
            {
                "type": "address",
                "name": "lrtConfig",
                "indexed": true
            }
        ]
    },
    {
        "type": "function",
        "name": "createEigenPod",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "depositAssetIntoStrategy",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "eigenPod",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getAssetBalance",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getAssetBalances",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address[]",
                "name": "assets"
            },
            {
                "type": "uint256[]",
                "name": "assetBalances"
            }
        ]
    },
    {
        "type": "function",
        "name": "getETHEigenPodBalance",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": "ethStaked"
            }
        ]
    },
    {
        "type": "function",
        "name": "initialize",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "lrtConfigAddr"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "lrtConfig",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "maxApproveToEigenStrategyManager",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "pause",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "paused",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "sendETHFromDepositPoolToNDC",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "stakeEth",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "pubkey"
            },
            {
                "type": "bytes",
                "name": "signature"
            },
            {
                "type": "bytes32",
                "name": "depositDataRoot"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "stakedButNotVerifiedEth",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "transferBackToLRTDepositPool",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "unpause",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "updateLRTConfig",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "lrtConfigAddr"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "verifyWithdrawalCredentials",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint64",
                "name": "oracleBlockNumber"
            },
            {
                "type": "uint40",
                "name": "validatorIndex"
            },
            {
                "type": "tuple",
                "name": "proofs",
                "components": [
                    {
                        "type": "bytes",
                        "name": "validatorFieldsProof"
                    },
                    {
                        "type": "bytes",
                        "name": "validatorBalanceProof"
                    },
                    {
                        "type": "bytes32",
                        "name": "balanceRoot"
                    }
                ]
            },
            {
                "type": "bytes32[]",
                "name": "validatorFields"
            }
        ],
        "outputs": []
    },
    {
        "type": "receive",
        "stateMutability": "payable"
    }
]
