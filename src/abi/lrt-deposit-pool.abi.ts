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
        "name": "NodeDelegatorHasAssetBalance",
        "inputs": [
            {
                "type": "address",
                "name": "assetAddress"
            },
            {
                "type": "uint256",
                "name": "assetBalance"
            }
        ]
    },
    {
        "type": "error",
        "name": "NodeDelegatorNotFound",
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
                "name": "primeEthMintAmount",
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
        "name": "AssetSwapped",
        "inputs": [
            {
                "type": "address",
                "name": "fromAsset",
                "indexed": true
            },
            {
                "type": "address",
                "name": "toAsset",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "fromAssetAmount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "toAssetAmount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ETHDeposit",
        "inputs": [
            {
                "type": "address",
                "name": "depositor",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "depositAmount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "primeEthMintAmount",
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
        "name": "NodeDelegatorAddedInQueue",
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
        "name": "NodeDelegatorRemovedFromQueue",
        "inputs": [
            {
                "type": "address",
                "name": "nodeDelegatorContracts",
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
                "name": "minPrimeETH"
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
        "name": "depositETH",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "uint256",
                "name": "minPrimeETHAmountExpected"
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
        "name": "getETHDistributionData",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": "ethLyingInDepositPool"
            },
            {
                "type": "uint256",
                "name": "ethLyingInNDCs"
            },
            {
                "type": "uint256",
                "name": "ethStakedInEigenLayer"
            }
        ]
    },
    {
        "type": "function",
        "name": "getMintAmount",
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
                "name": "primeEthAmount"
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
        "name": "getSwapAssetReturnAmount",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "fromAsset"
            },
            {
                "type": "address",
                "name": "toAsset"
            },
            {
                "type": "uint256",
                "name": "fromAssetAmount"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "returnAmount"
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
        "name": "removeManyNodeDelegatorContractsFromQueue",
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
        "name": "removeNodeDelegatorContractFromQueue",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "nodeDelegatorAddress"
            }
        ],
        "outputs": []
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
        "name": "swapAssetWithinDepositPool",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "fromAsset"
            },
            {
                "type": "address",
                "name": "toAsset"
            },
            {
                "type": "uint256",
                "name": "fromAssetAmount"
            },
            {
                "type": "uint256",
                "name": "minToAssetAmount"
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
        "name": "transferETHToNodeDelegator",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "ndcIndex"
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
    },
    {
        "type": "receive",
        "stateMutability": "payable"
    }
]
