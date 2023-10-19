export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_aggregator"
            },
            {
                "type": "address",
                "name": "_accessController"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AnswerUpdated",
        "inputs": [
            {
                "type": "int256",
                "name": "current",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "roundId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "updatedAt",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewRound",
        "inputs": [
            {
                "type": "uint256",
                "name": "roundId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "startedBy",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "startedAt",
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
        "name": "accessController",
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
        "name": "aggregator",
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
        "name": "confirmAggregator",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_aggregator"
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
        "name": "description",
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
        "name": "getAnswer",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_roundId"
            }
        ],
        "outputs": [
            {
                "type": "int256",
                "name": ""
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
        "name": "getTimestamp",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_roundId"
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
        "name": "latestAnswer",
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
        "name": "latestRound",
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
        "name": "latestTimestamp",
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
        "name": "phaseAggregators",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint16",
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
        "name": "phaseId",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint16",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "proposeAggregator",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_aggregator"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "proposedAggregator",
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
        "name": "proposedGetRoundData",
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
        "name": "proposedLatestRoundData",
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
        "name": "setController",
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
                "name": "_to"
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
                "name": ""
            }
        ]
    }
]
