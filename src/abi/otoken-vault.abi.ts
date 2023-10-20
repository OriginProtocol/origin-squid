export const ABI_JSON = [
    {
        "type": "event",
        "anonymous": false,
        "name": "AllocateThresholdUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "_threshold",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AssetAllocated",
        "inputs": [
            {
                "type": "address",
                "name": "_asset",
                "indexed": false
            },
            {
                "type": "address",
                "name": "_strategy",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "_amount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AssetDefaultStrategyUpdated",
        "inputs": [
            {
                "type": "address",
                "name": "_asset",
                "indexed": false
            },
            {
                "type": "address",
                "name": "_strategy",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AssetSupported",
        "inputs": [
            {
                "type": "address",
                "name": "_asset",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CapitalPaused",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CapitalUnpaused",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "GovernorshipTransferred",
        "inputs": [
            {
                "type": "address",
                "name": "previousGovernor",
                "indexed": true
            },
            {
                "type": "address",
                "name": "newGovernor",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MaxSupplyDiffChanged",
        "inputs": [
            {
                "type": "uint256",
                "name": "maxSupplyDiff",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Mint",
        "inputs": [
            {
                "type": "address",
                "name": "_addr",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "_value",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NetOusdMintForStrategyThresholdChanged",
        "inputs": [
            {
                "type": "uint256",
                "name": "_threshold",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OusdMetaStrategyUpdated",
        "inputs": [
            {
                "type": "address",
                "name": "_ousdMetaStrategy",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PendingGovernorshipTransfer",
        "inputs": [
            {
                "type": "address",
                "name": "previousGovernor",
                "indexed": true
            },
            {
                "type": "address",
                "name": "newGovernor",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PriceProviderUpdated",
        "inputs": [
            {
                "type": "address",
                "name": "_priceProvider",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RebasePaused",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RebaseThresholdUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "_threshold",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RebaseUnpaused",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Redeem",
        "inputs": [
            {
                "type": "address",
                "name": "_addr",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "_value",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RedeemFeeUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "_redeemFeeBps",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "StrategistUpdated",
        "inputs": [
            {
                "type": "address",
                "name": "_address",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "StrategyApproved",
        "inputs": [
            {
                "type": "address",
                "name": "_addr",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "StrategyRemoved",
        "inputs": [
            {
                "type": "address",
                "name": "_addr",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SwapAllowedUndervalueChanged",
        "inputs": [
            {
                "type": "uint256",
                "name": "_basis",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SwapSlippageChanged",
        "inputs": [
            {
                "type": "address",
                "name": "_asset",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "_basis",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Swapped",
        "inputs": [
            {
                "type": "address",
                "name": "_fromAsset",
                "indexed": true
            },
            {
                "type": "address",
                "name": "_toAsset",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "_fromAssetAmount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "_toAssetAmount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SwapperChanged",
        "inputs": [
            {
                "type": "address",
                "name": "_address",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TrusteeAddressChanged",
        "inputs": [
            {
                "type": "address",
                "name": "_address",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TrusteeFeeBpsChanged",
        "inputs": [
            {
                "type": "uint256",
                "name": "_basis",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "VaultBufferUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "_vaultBuffer",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "YieldDistribution",
        "inputs": [
            {
                "type": "address",
                "name": "_to",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "_yield",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "_fee",
                "indexed": false
            }
        ]
    },
    {
        "type": "fallback",
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "allocate",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "assetDefaultStrategies",
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
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "autoAllocateThreshold",
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
        "name": "burnForStrategy",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_amount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "calculateRedeemOutputs",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_amount"
            }
        ],
        "outputs": [
            {
                "type": "uint256[]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "capitalPaused",
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
        "name": "checkBalance",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_asset"
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
        "name": "claimGovernance",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getAllAssets",
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
        "name": "getAllStrategies",
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
        "name": "getAssetConfig",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_asset"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "config",
                "components": [
                    {
                        "type": "bool",
                        "name": "isSupported"
                    },
                    {
                        "type": "uint8",
                        "name": "unitConversion"
                    },
                    {
                        "type": "uint8",
                        "name": "decimals"
                    },
                    {
                        "type": "uint16",
                        "name": "allowedOracleSlippageBps"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getAssetCount",
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
        "name": "getStrategyCount",
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
        "name": "governor",
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
        "name": "isGovernor",
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
        "name": "isSupportedAsset",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_asset"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "maxSupplyDiff",
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
        "name": "mint",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_asset"
            },
            {
                "type": "uint256",
                "name": "_amount"
            },
            {
                "type": "uint256",
                "name": "_minimumOusdAmount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "mintForStrategy",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_amount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "netOusdMintForStrategyThreshold",
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
        "name": "netOusdMintedForStrategy",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "int256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "ousdMetaStrategy",
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
        "name": "priceProvider",
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
        "name": "priceUnitMint",
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
                "name": "price"
            }
        ]
    },
    {
        "type": "function",
        "name": "priceUnitRedeem",
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
                "name": "price"
            }
        ]
    },
    {
        "type": "function",
        "name": "rebase",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "rebasePaused",
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
        "name": "rebaseThreshold",
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
        "name": "redeem",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_amount"
            },
            {
                "type": "uint256",
                "name": "_minimumUnitAmount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "redeemAll",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_minimumUnitAmount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "redeemFeeBps",
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
        "name": "setAdminImpl",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newImpl"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "strategistAddr",
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
        "name": "totalValue",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": "value"
            }
        ]
    },
    {
        "type": "function",
        "name": "transferGovernance",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_newGovernor"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "trusteeAddress",
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
        "name": "trusteeFeeBps",
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
        "name": "vaultBuffer",
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
    }
]
