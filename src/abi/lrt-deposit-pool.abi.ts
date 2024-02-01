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
        "name": "InvalidAmountToDeposit",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidMaximumNodeDelegatorLimit",
        "inputs": []
    },
    {
        "type": "error",
        "name": "MaximumDepositLimitReached",
        "inputs": []
    },
    {
        "type": "error",
        "name": "MaximumNodeDelegatorLimitReached",
        "inputs": []
    },
    {
        "type": "error",
        "name": "MinimumAmountToReceiveNotMet",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotEnoughAssetToTransfer",
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
        "name": "AssetDeposit",
        "inputs": [
            {
                "type": "address",
                "name": "depositor",
                "indexed": true
            },
            {
                "type": "address",
                "name": "asset",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "depositAmount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "rsethMintAmount",
                "indexed": false
            },
            {
                "type": "string",
                "name": "referralId",
                "indexed": false
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
        "name": "MaxNodeDelegatorLimitUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "maxNodeDelegatorLimit",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MinAmountToDepositUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "minAmountToDeposit",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NodeDelegatorAddedinQueue",
        "inputs": [
            {
                "type": "address[]",
                "name": "nodeDelegatorContracts"
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
        "name": "addNodeDelegatorContractToQueue",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address[]",
                "name": "nodeDelegatorContracts"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "depositAsset",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            },
            {
                "type": "uint256",
                "name": "depositAmount"
            },
            {
                "type": "uint256",
                "name": "minRSETHAmountToReceive"
            },
            {
                "type": "string",
                "name": "referralId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getAssetCurrentLimit",
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
        "name": "getAssetDistributionData",
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
                "name": "assetLyingInDepositPool"
            },
            {
                "type": "uint256",
                "name": "assetLyingInNDCs"
            },
            {
                "type": "uint256",
                "name": "assetStakedInEigenLayer"
            }
        ]
    },
    {
        "type": "function",
        "name": "getNodeDelegatorQueue",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address[]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getRsETHAmountToMint",
        "constant": true,
        "stateMutability": "view",
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
        "outputs": [
            {
                "type": "uint256",
                "name": "rsethAmountToMint"
            }
        ]
    },
    {
        "type": "function",
        "name": "getTotalAssetDeposits",
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
                "name": "totalAssetDeposit"
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
        "name": "isNodeDelegator",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": ""
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
        "name": "maxNodeDelegatorLimit",
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
        "name": "minAmountToDeposit",
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
        "name": "nodeDelegatorQueue",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
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
        "name": "setMinAmountToDeposit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "minAmountToDeposit_"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "transferAssetToNodeDelegator",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "ndcIndex"
            },
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
        "name": "updateMaxNodeDelegatorLimit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "maxNodeDelegatorLimit_"
            }
        ],
        "outputs": []
    }
]
