export const ABI_JSON = [
    {
        "type": "event",
        "anonymous": false,
        "name": "Deposit",
        "inputs": [
            {
                "type": "address",
                "name": "_asset",
                "indexed": true
            },
            {
                "type": "address",
                "name": "_pToken",
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
        "name": "HarvesterAddressesUpdated",
        "inputs": [
            {
                "type": "address",
                "name": "_oldHarvesterAddress",
                "indexed": false
            },
            {
                "type": "address",
                "name": "_newHarvesterAddress",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PTokenAdded",
        "inputs": [
            {
                "type": "address",
                "name": "_asset",
                "indexed": true
            },
            {
                "type": "address",
                "name": "_pToken",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PTokenRemoved",
        "inputs": [
            {
                "type": "address",
                "name": "_asset",
                "indexed": true
            },
            {
                "type": "address",
                "name": "_pToken",
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
        "name": "RewardTokenAddressesUpdated",
        "inputs": [
            {
                "type": "address[]",
                "name": "_oldAddresses"
            },
            {
                "type": "address[]",
                "name": "_newAddresses"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RewardTokenCollected",
        "inputs": [
            {
                "type": "address",
                "name": "recipient",
                "indexed": false
            },
            {
                "type": "address",
                "name": "rewardToken",
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
        "name": "Withdrawal",
        "inputs": [
            {
                "type": "address",
                "name": "_asset",
                "indexed": true
            },
            {
                "type": "address",
                "name": "_pToken",
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
        "type": "function",
        "name": "assetToPToken",
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
                "name": "balance"
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
        "name": "collectRewardTokens",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "deposit",
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
        "name": "depositAll",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getRewardTokenAddresses",
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
        "name": "harvesterAddress",
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
                "type": "address[]",
                "name": "_rewardTokenAddresses"
            },
            {
                "type": "address[]",
                "name": "_assets"
            },
            {
                "type": "address[]",
                "name": "_pTokens"
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
        "name": "platformAddress",
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
        "name": "removePToken",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_assetIndex"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "rewardTokenAddresses",
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
        "name": "safeApproveAllTokens",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setHarvesterAddress",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_harvesterAddress"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setPTokenAddress",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_asset"
            },
            {
                "type": "address",
                "name": "_pToken"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setRewardTokenAddresses",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address[]",
                "name": "_rewardTokenAddresses"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "supportsAsset",
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
        "name": "vaultAddress",
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
        "name": "withdraw",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_recipient"
            },
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
        "name": "withdrawAll",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    }
]
