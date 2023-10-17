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
        "type": "function",
        "name": "approveStrategy",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_addr"
            }
        ],
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
        "name": "cacheDecimals",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_asset"
            }
        ],
        "outputs": []
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
        "name": "claimGovernance",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "depositToStrategy",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_strategyToAddress"
            },
            {
                "type": "address[]",
                "name": "_assets"
            },
            {
                "type": "uint256[]",
                "name": "_amounts"
            }
        ],
        "outputs": []
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
        "name": "initialize",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_priceProvider"
            },
            {
                "type": "address",
                "name": "_ousd"
            }
        ],
        "outputs": []
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
        "name": "pauseCapital",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "pauseRebase",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
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
        "name": "reallocate",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_strategyFromAddress"
            },
            {
                "type": "address",
                "name": "_strategyToAddress"
            },
            {
                "type": "address[]",
                "name": "_assets"
            },
            {
                "type": "uint256[]",
                "name": "_amounts"
            }
        ],
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
        "name": "removeStrategy",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_addr"
            }
        ],
        "outputs": []
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
        "name": "setAssetDefaultStrategy",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_asset"
            },
            {
                "type": "address",
                "name": "_strategy"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setAutoAllocateThreshold",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_threshold"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMaxSupplyDiff",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_maxSupplyDiff"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setNetOusdMintForStrategyThreshold",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_threshold"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setOusdMetaStrategy",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_ousdMetaStrategy"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setPriceProvider",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_priceProvider"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setRebaseThreshold",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_threshold"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setRedeemFeeBps",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_redeemFeeBps"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setStrategistAddr",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_address"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setTrusteeAddress",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_address"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setTrusteeFeeBps",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_basis"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setVaultBuffer",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_vaultBuffer"
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
        "name": "supportAsset",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_asset"
            },
            {
                "type": "uint8",
                "name": "_unitConversion"
            }
        ],
        "outputs": []
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
        "name": "transferToken",
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
        "name": "unpauseCapital",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "unpauseRebase",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
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
    },
    {
        "type": "function",
        "name": "withdrawAllFromStrategies",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "withdrawAllFromStrategy",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_strategyAddr"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "withdrawFromStrategy",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_strategyFromAddress"
            },
            {
                "type": "address[]",
                "name": "_assets"
            },
            {
                "type": "uint256[]",
                "name": "_amounts"
            }
        ],
        "outputs": []
    }
]
