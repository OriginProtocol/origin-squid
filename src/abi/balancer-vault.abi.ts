export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "authorizer"
            },
            {
                "type": "address",
                "name": "weth"
            },
            {
                "type": "uint256",
                "name": "pauseWindowDuration"
            },
            {
                "type": "uint256",
                "name": "bufferPeriodDuration"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AuthorizerChanged",
        "inputs": [
            {
                "type": "address",
                "name": "newAuthorizer",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ExternalBalanceTransfer",
        "inputs": [
            {
                "type": "address",
                "name": "token",
                "indexed": true
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            },
            {
                "type": "address",
                "name": "recipient",
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
        "name": "FlashLoan",
        "inputs": [
            {
                "type": "address",
                "name": "recipient",
                "indexed": true
            },
            {
                "type": "address",
                "name": "token",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "feeAmount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "InternalBalanceChanged",
        "inputs": [
            {
                "type": "address",
                "name": "user",
                "indexed": true
            },
            {
                "type": "address",
                "name": "token",
                "indexed": true
            },
            {
                "type": "int256",
                "name": "delta",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PausedStateChanged",
        "inputs": [
            {
                "type": "bool",
                "name": "paused",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolBalanceChanged",
        "inputs": [
            {
                "type": "bytes32",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "liquidityProvider",
                "indexed": true
            },
            {
                "type": "address[]",
                "name": "tokens"
            },
            {
                "type": "int256[]",
                "name": "deltas"
            },
            {
                "type": "uint256[]",
                "name": "protocolFeeAmounts"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolBalanceManaged",
        "inputs": [
            {
                "type": "bytes32",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "assetManager",
                "indexed": true
            },
            {
                "type": "address",
                "name": "token",
                "indexed": true
            },
            {
                "type": "int256",
                "name": "cashDelta",
                "indexed": false
            },
            {
                "type": "int256",
                "name": "managedDelta",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolRegistered",
        "inputs": [
            {
                "type": "bytes32",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "poolAddress",
                "indexed": true
            },
            {
                "type": "uint8",
                "name": "specialization",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RelayerApprovalChanged",
        "inputs": [
            {
                "type": "address",
                "name": "relayer",
                "indexed": true
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            },
            {
                "type": "bool",
                "name": "approved",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Swap",
        "inputs": [
            {
                "type": "bytes32",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "tokenIn",
                "indexed": true
            },
            {
                "type": "address",
                "name": "tokenOut",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amountIn",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "amountOut",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TokensDeregistered",
        "inputs": [
            {
                "type": "bytes32",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address[]",
                "name": "tokens"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TokensRegistered",
        "inputs": [
            {
                "type": "bytes32",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address[]",
                "name": "tokens"
            },
            {
                "type": "address[]",
                "name": "assetManagers"
            }
        ]
    },
    {
        "type": "function",
        "name": "WETH",
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
        "name": "batchSwap",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "uint8",
                "name": "kind"
            },
            {
                "type": "tuple[]",
                "name": "swaps",
                "components": [
                    {
                        "type": "bytes32",
                        "name": "poolId"
                    },
                    {
                        "type": "uint256",
                        "name": "assetInIndex"
                    },
                    {
                        "type": "uint256",
                        "name": "assetOutIndex"
                    },
                    {
                        "type": "uint256",
                        "name": "amount"
                    },
                    {
                        "type": "bytes",
                        "name": "userData"
                    }
                ]
            },
            {
                "type": "address[]",
                "name": "assets"
            },
            {
                "type": "tuple",
                "name": "funds",
                "components": [
                    {
                        "type": "address",
                        "name": "sender"
                    },
                    {
                        "type": "bool",
                        "name": "fromInternalBalance"
                    },
                    {
                        "type": "address",
                        "name": "recipient"
                    },
                    {
                        "type": "bool",
                        "name": "toInternalBalance"
                    }
                ]
            },
            {
                "type": "int256[]",
                "name": "limits"
            },
            {
                "type": "uint256",
                "name": "deadline"
            }
        ],
        "outputs": [
            {
                "type": "int256[]",
                "name": "assetDeltas"
            }
        ]
    },
    {
        "type": "function",
        "name": "deregisterTokens",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "poolId"
            },
            {
                "type": "address[]",
                "name": "tokens"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "exitPool",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "sender"
            },
            {
                "type": "address",
                "name": "recipient"
            },
            {
                "type": "tuple",
                "name": "request",
                "components": [
                    {
                        "type": "address[]",
                        "name": "assets"
                    },
                    {
                        "type": "uint256[]",
                        "name": "minAmountsOut"
                    },
                    {
                        "type": "bytes",
                        "name": "userData"
                    },
                    {
                        "type": "bool",
                        "name": "toInternalBalance"
                    }
                ]
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "flashLoan",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "recipient"
            },
            {
                "type": "address[]",
                "name": "tokens"
            },
            {
                "type": "uint256[]",
                "name": "amounts"
            },
            {
                "type": "bytes",
                "name": "userData"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getActionId",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes4",
                "name": "selector"
            }
        ],
        "outputs": [
            {
                "type": "bytes32",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getAuthorizer",
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
        "name": "getDomainSeparator",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes32",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getInternalBalance",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "user"
            },
            {
                "type": "address[]",
                "name": "tokens"
            }
        ],
        "outputs": [
            {
                "type": "uint256[]",
                "name": "balances"
            }
        ]
    },
    {
        "type": "function",
        "name": "getNextNonce",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "user"
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
        "name": "getPausedState",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bool",
                "name": "paused"
            },
            {
                "type": "uint256",
                "name": "pauseWindowEndTime"
            },
            {
                "type": "uint256",
                "name": "bufferPeriodEndTime"
            }
        ]
    },
    {
        "type": "function",
        "name": "getPool",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "poolId"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": ""
            },
            {
                "type": "uint8",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getPoolTokenInfo",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "token"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "cash"
            },
            {
                "type": "uint256",
                "name": "managed"
            },
            {
                "type": "uint256",
                "name": "lastChangeBlock"
            },
            {
                "type": "address",
                "name": "assetManager"
            }
        ]
    },
    {
        "type": "function",
        "name": "getPoolTokens",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "poolId"
            }
        ],
        "outputs": [
            {
                "type": "address[]",
                "name": "tokens"
            },
            {
                "type": "uint256[]",
                "name": "balances"
            },
            {
                "type": "uint256",
                "name": "lastChangeBlock"
            }
        ]
    },
    {
        "type": "function",
        "name": "getProtocolFeesCollector",
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
        "name": "hasApprovedRelayer",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "user"
            },
            {
                "type": "address",
                "name": "relayer"
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
        "name": "joinPool",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "bytes32",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "sender"
            },
            {
                "type": "address",
                "name": "recipient"
            },
            {
                "type": "tuple",
                "name": "request",
                "components": [
                    {
                        "type": "address[]",
                        "name": "assets"
                    },
                    {
                        "type": "uint256[]",
                        "name": "maxAmountsIn"
                    },
                    {
                        "type": "bytes",
                        "name": "userData"
                    },
                    {
                        "type": "bool",
                        "name": "fromInternalBalance"
                    }
                ]
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "managePoolBalance",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple[]",
                "name": "ops",
                "components": [
                    {
                        "type": "uint8",
                        "name": "kind"
                    },
                    {
                        "type": "bytes32",
                        "name": "poolId"
                    },
                    {
                        "type": "address",
                        "name": "token"
                    },
                    {
                        "type": "uint256",
                        "name": "amount"
                    }
                ]
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "manageUserBalance",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "tuple[]",
                "name": "ops",
                "components": [
                    {
                        "type": "uint8",
                        "name": "kind"
                    },
                    {
                        "type": "address",
                        "name": "asset"
                    },
                    {
                        "type": "uint256",
                        "name": "amount"
                    },
                    {
                        "type": "address",
                        "name": "sender"
                    },
                    {
                        "type": "address",
                        "name": "recipient"
                    }
                ]
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "queryBatchSwap",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint8",
                "name": "kind"
            },
            {
                "type": "tuple[]",
                "name": "swaps",
                "components": [
                    {
                        "type": "bytes32",
                        "name": "poolId"
                    },
                    {
                        "type": "uint256",
                        "name": "assetInIndex"
                    },
                    {
                        "type": "uint256",
                        "name": "assetOutIndex"
                    },
                    {
                        "type": "uint256",
                        "name": "amount"
                    },
                    {
                        "type": "bytes",
                        "name": "userData"
                    }
                ]
            },
            {
                "type": "address[]",
                "name": "assets"
            },
            {
                "type": "tuple",
                "name": "funds",
                "components": [
                    {
                        "type": "address",
                        "name": "sender"
                    },
                    {
                        "type": "bool",
                        "name": "fromInternalBalance"
                    },
                    {
                        "type": "address",
                        "name": "recipient"
                    },
                    {
                        "type": "bool",
                        "name": "toInternalBalance"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "type": "int256[]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "registerPool",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint8",
                "name": "specialization"
            }
        ],
        "outputs": [
            {
                "type": "bytes32",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "registerTokens",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "poolId"
            },
            {
                "type": "address[]",
                "name": "tokens"
            },
            {
                "type": "address[]",
                "name": "assetManagers"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setAuthorizer",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newAuthorizer"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setPaused",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bool",
                "name": "paused"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setRelayerApproval",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "sender"
            },
            {
                "type": "address",
                "name": "relayer"
            },
            {
                "type": "bool",
                "name": "approved"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "swap",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "tuple",
                "name": "singleSwap",
                "components": [
                    {
                        "type": "bytes32",
                        "name": "poolId"
                    },
                    {
                        "type": "uint8",
                        "name": "kind"
                    },
                    {
                        "type": "address",
                        "name": "assetIn"
                    },
                    {
                        "type": "address",
                        "name": "assetOut"
                    },
                    {
                        "type": "uint256",
                        "name": "amount"
                    },
                    {
                        "type": "bytes",
                        "name": "userData"
                    }
                ]
            },
            {
                "type": "tuple",
                "name": "funds",
                "components": [
                    {
                        "type": "address",
                        "name": "sender"
                    },
                    {
                        "type": "bool",
                        "name": "fromInternalBalance"
                    },
                    {
                        "type": "address",
                        "name": "recipient"
                    },
                    {
                        "type": "bool",
                        "name": "toInternalBalance"
                    }
                ]
            },
            {
                "type": "uint256",
                "name": "limit"
            },
            {
                "type": "uint256",
                "name": "deadline"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "amountCalculated"
            }
        ]
    },
    {
        "type": "receive",
        "stateMutability": "payable"
    }
]
