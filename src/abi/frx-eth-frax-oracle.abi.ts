export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "_params",
                "components": [
                    {
                        "type": "address",
                        "name": "timelockAddress"
                    },
                    {
                        "type": "address",
                        "name": "baseErc20"
                    },
                    {
                        "type": "address",
                        "name": "quoteErc20"
                    },
                    {
                        "type": "address",
                        "name": "priceSource"
                    },
                    {
                        "type": "uint256",
                        "name": "maximumDeviation"
                    },
                    {
                        "type": "uint256",
                        "name": "maximumOracleDelay"
                    }
                ]
            }
        ]
    },
    {
        "type": "error",
        "name": "CalledWithFutureTimestamp",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CalledWithTimestampBeforePreviousRound",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NoPriceData",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OnlyPendingTimelock",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OnlyPriceSource",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OnlyTimelock",
        "inputs": []
    },
    {
        "type": "error",
        "name": "SameMaximumDeviation",
        "inputs": []
    },
    {
        "type": "error",
        "name": "SameMaximumOracleDelay",
        "inputs": []
    },
    {
        "type": "error",
        "name": "SamePriceSource",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SetMaximumDeviation",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldMaxDeviation",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newMaxDeviation",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SetMaximumOracleDelay",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldMaxOracleDelay",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newMaxOracleDelay",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SetPriceSource",
        "inputs": [
            {
                "type": "address",
                "name": "oldPriceSource",
                "indexed": false
            },
            {
                "type": "address",
                "name": "newPriceSource",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TimelockTransferStarted",
        "inputs": [
            {
                "type": "address",
                "name": "previousTimelock",
                "indexed": true
            },
            {
                "type": "address",
                "name": "newTimelock",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TimelockTransferred",
        "inputs": [
            {
                "type": "address",
                "name": "previousTimelock",
                "indexed": true
            },
            {
                "type": "address",
                "name": "newTimelock",
                "indexed": true
            }
        ]
    },
    {
        "type": "function",
        "name": "BASE_TOKEN",
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
        "name": "QUOTE_TOKEN",
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
        "name": "acceptTransferTimelock",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "addRoundData",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bool",
                "name": "_isBadData"
            },
            {
                "type": "uint104",
                "name": "_priceLow"
            },
            {
                "type": "uint104",
                "name": "_priceHigh"
            },
            {
                "type": "uint40",
                "name": "_timestamp"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "decimals",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint8",
                "name": "_decimals"
            }
        ]
    },
    {
        "type": "function",
        "name": "description",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "string",
                "name": "_description"
            }
        ]
    },
    {
        "type": "function",
        "name": "getPrices",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bool",
                "name": "_isBadData"
            },
            {
                "type": "uint256",
                "name": "_priceLow"
            },
            {
                "type": "uint256",
                "name": "_priceHigh"
            }
        ]
    },
    {
        "type": "function",
        "name": "getRoundData",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint80",
                "name": "_roundId"
            }
        ],
        "outputs": [
            {
                "type": "uint80",
                "name": "roundId"
            },
            {
                "type": "int256",
                "name": "answer"
            },
            {
                "type": "uint256",
                "name": "startedAt"
            },
            {
                "type": "uint256",
                "name": "updatedAt"
            },
            {
                "type": "uint80",
                "name": "answeredInRound"
            }
        ]
    },
    {
        "type": "function",
        "name": "lastCorrectRoundId",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint80",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "latestRoundData",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint80",
                "name": "roundId"
            },
            {
                "type": "int256",
                "name": "answer"
            },
            {
                "type": "uint256",
                "name": "startedAt"
            },
            {
                "type": "uint256",
                "name": "updatedAt"
            },
            {
                "type": "uint80",
                "name": "answeredInRound"
            }
        ]
    },
    {
        "type": "function",
        "name": "maximumDeviation",
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
        "name": "maximumOracleDelay",
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
        "name": "pendingTimelockAddress",
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
        "name": "priceSource",
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
        "name": "renounceTimelock",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "rounds",
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
                "type": "uint104",
                "name": "priceLow"
            },
            {
                "type": "uint104",
                "name": "priceHigh"
            },
            {
                "type": "uint40",
                "name": "timestamp"
            },
            {
                "type": "bool",
                "name": "isBadData"
            }
        ]
    },
    {
        "type": "function",
        "name": "setMaximumDeviation",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_newMaxDeviation"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMaximumOracleDelay",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_newMaxOracleDelay"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setPriceSource",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_newPriceSource"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "supportsInterface",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes4",
                "name": "interfaceId"
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
        "name": "timelockAddress",
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
        "name": "transferTimelock",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_newTimelock"
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
                "type": "uint256",
                "name": "_version"
            }
        ]
    }
]
