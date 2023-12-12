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
                        "type": "address",
                        "name": "protocolFeeProvider"
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
                        "name": "tokenRateCacheDurations"
                    },
                    {
                        "type": "bool",
                        "name": "exemptFromYieldProtocolFeeFlag"
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
                        "type": "address",
                        "name": "owner"
                    },
                    {
                        "type": "string",
                        "name": "version"
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
        "name": "ProtocolFeePercentageCacheUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "feeType",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "protocolFeePercentage",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RecoveryModeStateChanged",
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
        "name": "TokenRateCacheUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "tokenIndex",
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
        "name": "TokenRateProviderSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "tokenIndex",
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
        "name": "DELEGATE_PROTOCOL_SWAP_FEES_SENTINEL",
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
        "name": "disableRecoveryMode",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "enableRecoveryMode",
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
        "name": "getActualSupply",
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
        "name": "getBptIndex",
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
        "name": "getLastJoinExitData",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": "lastJoinExitAmplification"
            },
            {
                "type": "uint256",
                "name": "lastPostJoinExitInvariant"
            }
        ]
    },
    {
        "type": "function",
        "name": "getMinimumBpt",
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
        "name": "getNextNonce",
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
        "name": "getProtocolFeePercentageCache",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "feeType"
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
        "name": "getProtocolSwapFeeDelegation",
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
                "name": ""
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
        "name": "getTokenRate",
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
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getTokenRateCache",
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
                "name": "oldRate"
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
        "name": "inRecoveryMode",
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
        "name": "isExemptFromYieldProtocolFee",
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
        "name": "isTokenExemptFromYieldProtocolFee",
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
                "name": ""
            },
            {
                "type": "uint256[]",
                "name": ""
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
                "name": ""
            },
            {
                "type": "uint256[]",
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
                "name": "swapRequest",
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
        "name": "pause",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
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
        "name": "setTokenRateCacheDuration",
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
        "name": "unpause",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "updateProtocolFeePercentageCache",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "updateTokenRateCache",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "token"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "version",
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
    }
]
