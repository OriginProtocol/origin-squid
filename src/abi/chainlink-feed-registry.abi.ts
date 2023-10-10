export const ABI_JSON = [
    {
        "type": "event",
        "anonymous": false,
        "name": "AccessControllerSet",
        "inputs": [
            {
                "type": "address",
                "name": "accessController",
                "indexed": true
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "FeedConfirmed",
        "inputs": [
            {
                "type": "address",
                "name": "asset",
                "indexed": true
            },
            {
                "type": "address",
                "name": "denomination",
                "indexed": true
            },
            {
                "type": "address",
                "name": "latestAggregator",
                "indexed": true
            },
            {
                "type": "address",
                "name": "previousAggregator",
                "indexed": false
            },
            {
                "type": "uint16",
                "name": "nextPhaseId",
                "indexed": false
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "FeedProposed",
        "inputs": [
            {
                "type": "address",
                "name": "asset",
                "indexed": true
            },
            {
                "type": "address",
                "name": "denomination",
                "indexed": true
            },
            {
                "type": "address",
                "name": "proposedAggregator",
                "indexed": true
            },
            {
                "type": "address",
                "name": "currentAggregator",
                "indexed": false
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OwnershipTransferRequested",
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
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OwnershipTransferred",
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
            }
        ]
    },
    {
        "type": "function",
        "name": "acceptOwnership",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "confirmFeed",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            },
            {
                "type": "address",
                "name": "aggregator"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "decimals",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            }
        ],
        "outputs": [
            {
                "type": "uint8",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "description",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            }
        ],
        "outputs": [
            {
                "type": "string",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getAccessController",
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
        "name": "getAnswer",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            },
            {
                "type": "uint256",
                "name": "roundId"
            }
        ],
        "outputs": [
            {
                "type": "int256",
                "name": "answer"
            }
        ]
    },
    {
        "type": "function",
        "name": "getCurrentPhaseId",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            }
        ],
        "outputs": [
            {
                "type": "uint16",
                "name": "currentPhaseId"
            }
        ]
    },
    {
        "type": "function",
        "name": "getFeed",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "aggregator"
            }
        ]
    },
    {
        "type": "function",
        "name": "getNextRoundId",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            },
            {
                "type": "uint80",
                "name": "roundId"
            }
        ],
        "outputs": [
            {
                "type": "uint80",
                "name": "nextRoundId"
            }
        ]
    },
    {
        "type": "function",
        "name": "getPhase",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            },
            {
                "type": "uint16",
                "name": "phaseId"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "phase",
                "components": [
                    {
                        "type": "uint16",
                        "name": "phaseId"
                    },
                    {
                        "type": "uint80",
                        "name": "startingAggregatorRoundId"
                    },
                    {
                        "type": "uint80",
                        "name": "endingAggregatorRoundId"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getPhaseFeed",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            },
            {
                "type": "uint16",
                "name": "phaseId"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "aggregator"
            }
        ]
    },
    {
        "type": "function",
        "name": "getPhaseRange",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            },
            {
                "type": "uint16",
                "name": "phaseId"
            }
        ],
        "outputs": [
            {
                "type": "uint80",
                "name": "startingRoundId"
            },
            {
                "type": "uint80",
                "name": "endingRoundId"
            }
        ]
    },
    {
        "type": "function",
        "name": "getPreviousRoundId",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            },
            {
                "type": "uint80",
                "name": "roundId"
            }
        ],
        "outputs": [
            {
                "type": "uint80",
                "name": "previousRoundId"
            }
        ]
    },
    {
        "type": "function",
        "name": "getProposedFeed",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "proposedAggregator"
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
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            },
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
        "name": "getRoundFeed",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            },
            {
                "type": "uint80",
                "name": "roundId"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "aggregator"
            }
        ]
    },
    {
        "type": "function",
        "name": "getTimestamp",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            },
            {
                "type": "uint256",
                "name": "roundId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "timestamp"
            }
        ]
    },
    {
        "type": "function",
        "name": "isFeedEnabled",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "aggregator"
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
        "name": "latestAnswer",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            }
        ],
        "outputs": [
            {
                "type": "int256",
                "name": "answer"
            }
        ]
    },
    {
        "type": "function",
        "name": "latestRound",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "roundId"
            }
        ]
    },
    {
        "type": "function",
        "name": "latestRoundData",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
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
        "name": "latestTimestamp",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "timestamp"
            }
        ]
    },
    {
        "type": "function",
        "name": "owner",
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
        "name": "proposeFeed",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            },
            {
                "type": "address",
                "name": "aggregator"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "proposedGetRoundData",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            },
            {
                "type": "uint80",
                "name": "roundId"
            }
        ],
        "outputs": [
            {
                "type": "uint80",
                "name": "id"
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
        "name": "proposedLatestRoundData",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            }
        ],
        "outputs": [
            {
                "type": "uint80",
                "name": "id"
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
        "name": "setAccessController",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_accessController"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "transferOwnership",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "to"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "typeAndVersion",
        "constant": true,
        "stateMutability": "pure",
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
        "name": "version",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "base"
            },
            {
                "type": "address",
                "name": "quote"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    }
]
