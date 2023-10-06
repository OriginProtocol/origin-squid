export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_oToken"
            }
        ]
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
        "name": "StrategyTypeChanged",
        "inputs": [
            {
                "type": "address",
                "name": "strategyAddr",
                "indexed": true
            },
            {
                "type": "uint8",
                "name": "kind",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "ETH_ADDR",
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
        "name": "WETH_ADDR",
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
        "name": "assetCount",
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
        "name": "assets",
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
        "name": "cacheStrategies",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
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
        "name": "curvePoolCoinCount",
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
        "name": "getStrategyAssetBalance",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "strategyAddr"
            },
            {
                "type": "address",
                "name": "asset"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "balance"
            }
        ]
    },
    {
        "type": "function",
        "name": "getStrategyBalances",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "strategyAddr"
            }
        ],
        "outputs": [
            {
                "type": "address[]",
                "name": "supportedAssets"
            },
            {
                "type": "uint256[]",
                "name": "assetBalances"
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
        "name": "initialize",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_strategistAddr"
            },
            {
                "type": "address[]",
                "name": "_strategies"
            },
            {
                "type": "uint8[]",
                "name": "strategyKinds"
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
        "name": "oToken",
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
        "name": "oracleRouter",
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
        "name": "setStrategyKind",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "strategy"
            },
            {
                "type": "uint8",
                "name": "kind"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "strategies",
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
        "name": "strategyConfig",
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
                "type": "bool",
                "name": "supported"
            },
            {
                "type": "uint8",
                "name": "kind"
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
        "name": "vault",
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
    }
]
