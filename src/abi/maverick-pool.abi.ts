export const ABI_JSON = [
    {
        "type": "event",
        "anonymous": false,
        "name": "AddLiquidity",
        "inputs": [
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokenId",
                "indexed": true
            },
            {
                "type": "tuple[]",
                "name": "binDeltas",
                "components": [
                    {
                        "type": "uint128",
                        "name": "deltaA"
                    },
                    {
                        "type": "uint128",
                        "name": "deltaB"
                    },
                    {
                        "type": "uint256",
                        "name": "deltaLpBalance"
                    },
                    {
                        "type": "uint128",
                        "name": "binId"
                    },
                    {
                        "type": "uint8",
                        "name": "kind"
                    },
                    {
                        "type": "int32",
                        "name": "lowerTick"
                    },
                    {
                        "type": "bool",
                        "name": "isActive"
                    }
                ]
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "BinMerged",
        "inputs": [
            {
                "type": "uint128",
                "name": "binId",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "reserveA",
                "indexed": false
            },
            {
                "type": "uint128",
                "name": "reserveB",
                "indexed": false
            },
            {
                "type": "uint128",
                "name": "mergeId",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "BinMoved",
        "inputs": [
            {
                "type": "uint128",
                "name": "binId",
                "indexed": true
            },
            {
                "type": "int128",
                "name": "previousTick",
                "indexed": false
            },
            {
                "type": "int128",
                "name": "newTick",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MigrateBinsUpStack",
        "inputs": [
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "binId",
                "indexed": false
            },
            {
                "type": "uint32",
                "name": "maxRecursion",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ProtocolFeeCollected",
        "inputs": [
            {
                "type": "uint256",
                "name": "protocolFee",
                "indexed": false
            },
            {
                "type": "bool",
                "name": "isTokenA",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RemoveLiquidity",
        "inputs": [
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            },
            {
                "type": "address",
                "name": "recipient",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokenId",
                "indexed": true
            },
            {
                "type": "tuple[]",
                "name": "binDeltas",
                "components": [
                    {
                        "type": "uint128",
                        "name": "deltaA"
                    },
                    {
                        "type": "uint128",
                        "name": "deltaB"
                    },
                    {
                        "type": "uint256",
                        "name": "deltaLpBalance"
                    },
                    {
                        "type": "uint128",
                        "name": "binId"
                    },
                    {
                        "type": "uint8",
                        "name": "kind"
                    },
                    {
                        "type": "int32",
                        "name": "lowerTick"
                    },
                    {
                        "type": "bool",
                        "name": "isActive"
                    }
                ]
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SetProtocolFeeRatio",
        "inputs": [
            {
                "type": "uint256",
                "name": "protocolFee",
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
                "type": "address",
                "name": "sender",
                "indexed": false
            },
            {
                "type": "address",
                "name": "recipient",
                "indexed": false
            },
            {
                "type": "bool",
                "name": "tokenAIn",
                "indexed": false
            },
            {
                "type": "bool",
                "name": "exactOutput",
                "indexed": false
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
            },
            {
                "type": "int32",
                "name": "activeTick",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TransferLiquidity",
        "inputs": [
            {
                "type": "uint256",
                "name": "fromTokenId",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "toTokenId",
                "indexed": false
            },
            {
                "type": "tuple[]",
                "name": "params",
                "components": [
                    {
                        "type": "uint128",
                        "name": "binId"
                    },
                    {
                        "type": "uint128",
                        "name": "amount"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "addLiquidity",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "tokenId"
            },
            {
                "type": "tuple[]",
                "name": "params",
                "components": [
                    {
                        "type": "uint8",
                        "name": "kind"
                    },
                    {
                        "type": "int32",
                        "name": "pos"
                    },
                    {
                        "type": "bool",
                        "name": "isDelta"
                    },
                    {
                        "type": "uint128",
                        "name": "deltaA"
                    },
                    {
                        "type": "uint128",
                        "name": "deltaB"
                    }
                ]
            },
            {
                "type": "bytes",
                "name": "data"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "tokenAAmount"
            },
            {
                "type": "uint256",
                "name": "tokenBAmount"
            },
            {
                "type": "tuple[]",
                "name": "binDeltas",
                "components": [
                    {
                        "type": "uint128",
                        "name": "deltaA"
                    },
                    {
                        "type": "uint128",
                        "name": "deltaB"
                    },
                    {
                        "type": "uint256",
                        "name": "deltaLpBalance"
                    },
                    {
                        "type": "uint128",
                        "name": "binId"
                    },
                    {
                        "type": "uint8",
                        "name": "kind"
                    },
                    {
                        "type": "int32",
                        "name": "lowerTick"
                    },
                    {
                        "type": "bool",
                        "name": "isActive"
                    }
                ]
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
                "type": "uint256",
                "name": "tokenId"
            },
            {
                "type": "uint128",
                "name": "binId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "lpToken"
            }
        ]
    },
    {
        "type": "function",
        "name": "binBalanceA",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint128",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "binBalanceB",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint128",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "binMap",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "int32",
                "name": "tick"
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
        "name": "binPositions",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "int32",
                "name": "tick"
            },
            {
                "type": "uint256",
                "name": "kind"
            }
        ],
        "outputs": [
            {
                "type": "uint128",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "factory",
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
        "name": "fee",
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
        "name": "lookback",
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
        "name": "getBin",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "binId"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "bin",
                "components": [
                    {
                        "type": "uint128",
                        "name": "reserveA"
                    },
                    {
                        "type": "uint128",
                        "name": "reserveB"
                    },
                    {
                        "type": "uint128",
                        "name": "mergeBinBalance"
                    },
                    {
                        "type": "uint128",
                        "name": "mergeId"
                    },
                    {
                        "type": "uint128",
                        "name": "totalSupply"
                    },
                    {
                        "type": "uint8",
                        "name": "kind"
                    },
                    {
                        "type": "int32",
                        "name": "lowerTick"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getCurrentTwa",
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
        "name": "getState",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "tuple",
                "name": "",
                "components": [
                    {
                        "type": "int32",
                        "name": "activeTick"
                    },
                    {
                        "type": "uint8",
                        "name": "status"
                    },
                    {
                        "type": "uint128",
                        "name": "binCounter"
                    },
                    {
                        "type": "uint64",
                        "name": "protocolFeeRatio"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getTwa",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "tuple",
                "name": "",
                "components": [
                    {
                        "type": "int96",
                        "name": "twa"
                    },
                    {
                        "type": "int96",
                        "name": "value"
                    },
                    {
                        "type": "uint64",
                        "name": "lastTimestamp"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "migrateBinUpStack",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "binId"
            },
            {
                "type": "uint32",
                "name": "maxRecursion"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "removeLiquidity",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "recipient"
            },
            {
                "type": "uint256",
                "name": "tokenId"
            },
            {
                "type": "tuple[]",
                "name": "params",
                "components": [
                    {
                        "type": "uint128",
                        "name": "binId"
                    },
                    {
                        "type": "uint128",
                        "name": "amount"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "tokenAOut"
            },
            {
                "type": "uint256",
                "name": "tokenBOut"
            },
            {
                "type": "tuple[]",
                "name": "binDeltas",
                "components": [
                    {
                        "type": "uint128",
                        "name": "deltaA"
                    },
                    {
                        "type": "uint128",
                        "name": "deltaB"
                    },
                    {
                        "type": "uint256",
                        "name": "deltaLpBalance"
                    },
                    {
                        "type": "uint128",
                        "name": "binId"
                    },
                    {
                        "type": "uint8",
                        "name": "kind"
                    },
                    {
                        "type": "int32",
                        "name": "lowerTick"
                    },
                    {
                        "type": "bool",
                        "name": "isActive"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "swap",
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
            },
            {
                "type": "bool",
                "name": "tokenAIn"
            },
            {
                "type": "bool",
                "name": "exactOutput"
            },
            {
                "type": "uint256",
                "name": "sqrtPriceLimit"
            },
            {
                "type": "bytes",
                "name": "data"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "amountIn"
            },
            {
                "type": "uint256",
                "name": "amountOut"
            }
        ]
    },
    {
        "type": "function",
        "name": "tickSpacing",
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
        "name": "tokenA",
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
        "name": "tokenAScale",
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
        "name": "tokenB",
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
        "name": "tokenBScale",
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
        "name": "transferLiquidity",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "fromTokenId"
            },
            {
                "type": "uint256",
                "name": "toTokenId"
            },
            {
                "type": "tuple[]",
                "name": "params",
                "components": [
                    {
                        "type": "uint128",
                        "name": "binId"
                    },
                    {
                        "type": "uint128",
                        "name": "amount"
                    }
                ]
            }
        ],
        "outputs": []
    }
]
