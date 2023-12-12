export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "params",
                "components": [
                    {
                        "type": "address",
                        "name": "vault"
                    },
                    {
                        "type": "string",
                        "name": "name"
                    },
                    {
                        "type": "string",
                        "name": "symbol"
                    },
                    {
                        "type": "address[]",
                        "name": "tokens"
                    },
                    {
                        "type": "address[]",
                        "name": "rateProviders"
                    },
                    {
                        "type": "uint256[]",
                        "name": "priceRateCacheDuration"
                    },
                    {
                        "type": "uint256",
                        "name": "amplificationParameter"
                    },
                    {
                        "type": "uint256",
                        "name": "swapFeePercentage"
                    },
                    {
                        "type": "uint256",
                        "name": "pauseWindowDuration"
                    },
                    {
                        "type": "uint256",
                        "name": "bufferPeriodDuration"
                    },
                    {
                        "type": "bool",
                        "name": "oracleEnabled"
                    },
                    {
                        "type": "address",
                        "name": "owner"
                    }
                ]
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AmpUpdateStarted",
        "inputs": [
            {
                "type": "uint256",
                "name": "startValue",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "endValue",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "startTime",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "endTime",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AmpUpdateStopped",
        "inputs": [
            {
                "type": "uint256",
                "name": "currentValue",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Approval",
        "inputs": [
            {
                "type": "address",
                "name": "owner",
                "indexed": true
            },
            {
                "type": "address",
                "name": "spender",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "value",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OracleEnabledChanged",
        "inputs": [
            {
                "type": "bool",
                "name": "enabled",
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
        "name": "PriceRateCacheUpdated",
        "inputs": [
            {
                "type": "address",
                "name": "token",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "rate",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PriceRateProviderSet",
        "inputs": [
            {
                "type": "address",
                "name": "token",
                "indexed": true
            },
            {
                "type": "address",
                "name": "provider",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "cacheDuration",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SwapFeePercentageChanged",
        "inputs": [
            {
                "type": "uint256",
                "name": "swapFeePercentage",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Transfer",
        "inputs": [
            {
                "type": "address",
                "name": "from",
                "indexed": true
            },
            {
                "type": "address",
                "name": "to",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "value",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "DOMAIN_SEPARATOR",
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
        "name": "allowance",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "owner"
            },
            {
                "type": "address",
                "name": "spender"
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
        "name": "approve",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "spender"
            },
            {
                "type": "uint256",
                "name": "amount"
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
        "name": "balanceOf",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "account"
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
        "name": "decimals",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint8",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "decreaseAllowance",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "spender"
            },
            {
                "type": "uint256",
                "name": "amount"
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
        "name": "enableOracle",
        "constant": false,
        "payable": false,
        "inputs": [],
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
        "name": "getAmplificationParameter",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": "value"
            },
            {
                "type": "bool",
                "name": "isUpdating"
            },
            {
                "type": "uint256",
                "name": "precision"
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
        "name": "getLargestSafeQueryWindow",
        "constant": true,
        "stateMutability": "pure",
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
        "name": "getLastInvariant",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": "lastInvariant"
            },
            {
                "type": "uint256",
                "name": "lastInvariantAmp"
            }
        ]
    },
    {
        "type": "function",
        "name": "getLatest",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint8",
                "name": "variable"
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
        "name": "getOracleMiscData",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "int256",
                "name": "logInvariant"
            },
            {
                "type": "int256",
                "name": "logTotalSupply"
            },
            {
                "type": "uint256",
                "name": "oracleSampleCreationTimestamp"
            },
            {
                "type": "uint256",
                "name": "oracleIndex"
            },
            {
                "type": "bool",
                "name": "oracleEnabled"
            }
        ]
    },
    {
        "type": "function",
        "name": "getOwner",
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
        "name": "getPastAccumulators",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "tuple[]",
                "name": "queries",
                "components": [
                    {
                        "type": "uint8",
                        "name": "variable"
                    },
                    {
                        "type": "uint256",
                        "name": "ago"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "type": "int256[]",
                "name": "results"
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
        "name": "getPoolId",
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
        "name": "getPriceRateCache",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "token"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "rate"
            },
            {
                "type": "uint256",
                "name": "duration"
            },
            {
                "type": "uint256",
                "name": "expires"
            }
        ]
    },
    {
        "type": "function",
        "name": "getRate",
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
        "name": "getRateProviders",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address[]",
                "name": "providers"
            }
        ]
    },
    {
        "type": "function",
        "name": "getSample",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "index"
            }
        ],
        "outputs": [
            {
                "type": "int256",
                "name": "logPairPrice"
            },
            {
                "type": "int256",
                "name": "accLogPairPrice"
            },
            {
                "type": "int256",
                "name": "logBptPrice"
            },
            {
                "type": "int256",
                "name": "accLogBptPrice"
            },
            {
                "type": "int256",
                "name": "logInvariant"
            },
            {
                "type": "int256",
                "name": "accLogInvariant"
            },
            {
                "type": "uint256",
                "name": "timestamp"
            }
        ]
    },
    {
        "type": "function",
        "name": "getScalingFactors",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256[]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getSwapFeePercentage",
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
        "name": "getTimeWeightedAverage",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "tuple[]",
                "name": "queries",
                "components": [
                    {
                        "type": "uint8",
                        "name": "variable"
                    },
                    {
                        "type": "uint256",
                        "name": "secs"
                    },
                    {
                        "type": "uint256",
                        "name": "ago"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "type": "uint256[]",
                "name": "results"
            }
        ]
    },
    {
        "type": "function",
        "name": "getTotalSamples",
        "constant": true,
        "stateMutability": "pure",
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
        "name": "getVault",
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
        "name": "increaseAllowance",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "spender"
            },
            {
                "type": "uint256",
                "name": "addedValue"
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
        "name": "name",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "string",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "nonces",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "owner"
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
        "name": "onExitPool",
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
                "type": "uint256[]",
                "name": "balances"
            },
            {
                "type": "uint256",
                "name": "lastChangeBlock"
            },
            {
                "type": "uint256",
                "name": "protocolSwapFeePercentage"
            },
            {
                "type": "bytes",
                "name": "userData"
            }
        ],
        "outputs": [
            {
                "type": "uint256[]",
                "name": "amountsOut"
            },
            {
                "type": "uint256[]",
                "name": "dueProtocolFeeAmounts"
            }
        ]
    },
    {
        "type": "function",
        "name": "onJoinPool",
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
                "type": "uint256[]",
                "name": "balances"
            },
            {
                "type": "uint256",
                "name": "lastChangeBlock"
            },
            {
                "type": "uint256",
                "name": "protocolSwapFeePercentage"
            },
            {
                "type": "bytes",
                "name": "userData"
            }
        ],
        "outputs": [
            {
                "type": "uint256[]",
                "name": "amountsIn"
            },
            {
                "type": "uint256[]",
                "name": "dueProtocolFeeAmounts"
            }
        ]
    },
    {
        "type": "function",
        "name": "onSwap",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "request",
                "components": [
                    {
                        "type": "uint8",
                        "name": "kind"
                    },
                    {
                        "type": "address",
                        "name": "tokenIn"
                    },
                    {
                        "type": "address",
                        "name": "tokenOut"
                    },
                    {
                        "type": "uint256",
                        "name": "amount"
                    },
                    {
                        "type": "bytes32",
                        "name": "poolId"
                    },
                    {
                        "type": "uint256",
                        "name": "lastChangeBlock"
                    },
                    {
                        "type": "address",
                        "name": "from"
                    },
                    {
                        "type": "address",
                        "name": "to"
                    },
                    {
                        "type": "bytes",
                        "name": "userData"
                    }
                ]
            },
            {
                "type": "uint256[]",
                "name": "balances"
            },
            {
                "type": "uint256",
                "name": "indexIn"
            },
            {
                "type": "uint256",
                "name": "indexOut"
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
        "name": "onSwap",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "request",
                "components": [
                    {
                        "type": "uint8",
                        "name": "kind"
                    },
                    {
                        "type": "address",
                        "name": "tokenIn"
                    },
                    {
                        "type": "address",
                        "name": "tokenOut"
                    },
                    {
                        "type": "uint256",
                        "name": "amount"
                    },
                    {
                        "type": "bytes32",
                        "name": "poolId"
                    },
                    {
                        "type": "uint256",
                        "name": "lastChangeBlock"
                    },
                    {
                        "type": "address",
                        "name": "from"
                    },
                    {
                        "type": "address",
                        "name": "to"
                    },
                    {
                        "type": "bytes",
                        "name": "userData"
                    }
                ]
            },
            {
                "type": "uint256",
                "name": "balanceTokenIn"
            },
            {
                "type": "uint256",
                "name": "balanceTokenOut"
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
        "name": "permit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "owner"
            },
            {
                "type": "address",
                "name": "spender"
            },
            {
                "type": "uint256",
                "name": "value"
            },
            {
                "type": "uint256",
                "name": "deadline"
            },
            {
                "type": "uint8",
                "name": "v"
            },
            {
                "type": "bytes32",
                "name": "r"
            },
            {
                "type": "bytes32",
                "name": "s"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "queryExit",
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
                "type": "uint256[]",
                "name": "balances"
            },
            {
                "type": "uint256",
                "name": "lastChangeBlock"
            },
            {
                "type": "uint256",
                "name": "protocolSwapFeePercentage"
            },
            {
                "type": "bytes",
                "name": "userData"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "bptIn"
            },
            {
                "type": "uint256[]",
                "name": "amountsOut"
            }
        ]
    },
    {
        "type": "function",
        "name": "queryJoin",
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
                "type": "uint256[]",
                "name": "balances"
            },
            {
                "type": "uint256",
                "name": "lastChangeBlock"
            },
            {
                "type": "uint256",
                "name": "protocolSwapFeePercentage"
            },
            {
                "type": "bytes",
                "name": "userData"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "bptOut"
            },
            {
                "type": "uint256[]",
                "name": "amountsIn"
            }
        ]
    },
    {
        "type": "function",
        "name": "setAssetManagerPoolConfig",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "token"
            },
            {
                "type": "bytes",
                "name": "poolConfig"
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
        "name": "setPriceRateCacheDuration",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "token"
            },
            {
                "type": "uint256",
                "name": "duration"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setSwapFeePercentage",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "swapFeePercentage"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "startAmplificationParameterUpdate",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "rawEndValue"
            },
            {
                "type": "uint256",
                "name": "endTime"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "stopAmplificationParameterUpdate",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "symbol",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "string",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "totalSupply",
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
        "name": "transfer",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "recipient"
            },
            {
                "type": "uint256",
                "name": "amount"
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
        "name": "transferFrom",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "sender"
            },
            {
                "type": "address",
                "name": "recipient"
            },
            {
                "type": "uint256",
                "name": "amount"
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
        "name": "updatePriceRateCache",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "token"
            }
        ],
        "outputs": []
    }
]
