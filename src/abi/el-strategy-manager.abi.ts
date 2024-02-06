export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_delegation"
            },
            {
                "type": "address",
                "name": "_eigenPodManager"
            },
            {
                "type": "address",
                "name": "_slasher"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Deposit",
        "inputs": [
            {
                "type": "address",
                "name": "depositor",
                "indexed": false
            },
            {
                "type": "address",
                "name": "token",
                "indexed": false
            },
            {
                "type": "address",
                "name": "strategy",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "shares",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Initialized",
        "inputs": [
            {
                "type": "uint8",
                "name": "version",
                "indexed": false
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
                "name": "previousOwner",
                "indexed": true
            },
            {
                "type": "address",
                "name": "newOwner",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Paused",
        "inputs": [
            {
                "type": "address",
                "name": "account",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "newPausedStatus",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PauserRegistrySet",
        "inputs": [
            {
                "type": "address",
                "name": "pauserRegistry",
                "indexed": false
            },
            {
                "type": "address",
                "name": "newPauserRegistry",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ShareWithdrawalQueued",
        "inputs": [
            {
                "type": "address",
                "name": "depositor",
                "indexed": false
            },
            {
                "type": "uint96",
                "name": "nonce",
                "indexed": false
            },
            {
                "type": "address",
                "name": "strategy",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "shares",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "StrategyAddedToDepositWhitelist",
        "inputs": [
            {
                "type": "address",
                "name": "strategy",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "StrategyRemovedFromDepositWhitelist",
        "inputs": [
            {
                "type": "address",
                "name": "strategy",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "StrategyWhitelisterChanged",
        "inputs": [
            {
                "type": "address",
                "name": "previousAddress",
                "indexed": false
            },
            {
                "type": "address",
                "name": "newAddress",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Unpaused",
        "inputs": [
            {
                "type": "address",
                "name": "account",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "newPausedStatus",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "WithdrawalCompleted",
        "inputs": [
            {
                "type": "address",
                "name": "depositor",
                "indexed": true
            },
            {
                "type": "uint96",
                "name": "nonce",
                "indexed": false
            },
            {
                "type": "address",
                "name": "withdrawer",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "withdrawalRoot",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "WithdrawalDelayBlocksSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "previousValue",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newValue",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "WithdrawalQueued",
        "inputs": [
            {
                "type": "address",
                "name": "depositor",
                "indexed": false
            },
            {
                "type": "uint96",
                "name": "nonce",
                "indexed": false
            },
            {
                "type": "address",
                "name": "withdrawer",
                "indexed": false
            },
            {
                "type": "address",
                "name": "delegatedAddress",
                "indexed": false
            },
            {
                "type": "bytes32",
                "name": "withdrawalRoot",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "DEPOSIT_TYPEHASH",
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
        "name": "DOMAIN_TYPEHASH",
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
        "name": "MAX_WITHDRAWAL_DELAY_BLOCKS",
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
        "name": "addStrategiesToDepositWhitelist",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address[]",
                "name": "strategiesToWhitelist"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "beaconChainETHSharesToDecrementOnWithdrawal",
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
        "name": "beaconChainETHStrategy",
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
        "name": "calculateWithdrawalRoot",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "queuedWithdrawal",
                "components": [
                    {
                        "type": "address[]",
                        "name": "strategies"
                    },
                    {
                        "type": "uint256[]",
                        "name": "shares"
                    },
                    {
                        "type": "address",
                        "name": "depositor"
                    },
                    {
                        "type": "tuple",
                        "name": "withdrawerAndNonce",
                        "components": [
                            {
                                "type": "address",
                                "name": "withdrawer"
                            },
                            {
                                "type": "uint96",
                                "name": "nonce"
                            }
                        ]
                    },
                    {
                        "type": "uint32",
                        "name": "withdrawalStartBlock"
                    },
                    {
                        "type": "address",
                        "name": "delegatedAddress"
                    }
                ]
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
        "name": "completeQueuedWithdrawal",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "queuedWithdrawal",
                "components": [
                    {
                        "type": "address[]",
                        "name": "strategies"
                    },
                    {
                        "type": "uint256[]",
                        "name": "shares"
                    },
                    {
                        "type": "address",
                        "name": "depositor"
                    },
                    {
                        "type": "tuple",
                        "name": "withdrawerAndNonce",
                        "components": [
                            {
                                "type": "address",
                                "name": "withdrawer"
                            },
                            {
                                "type": "uint96",
                                "name": "nonce"
                            }
                        ]
                    },
                    {
                        "type": "uint32",
                        "name": "withdrawalStartBlock"
                    },
                    {
                        "type": "address",
                        "name": "delegatedAddress"
                    }
                ]
            },
            {
                "type": "address[]",
                "name": "tokens"
            },
            {
                "type": "uint256",
                "name": "middlewareTimesIndex"
            },
            {
                "type": "bool",
                "name": "receiveAsTokens"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "completeQueuedWithdrawals",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple[]",
                "name": "queuedWithdrawals",
                "components": [
                    {
                        "type": "address[]",
                        "name": "strategies"
                    },
                    {
                        "type": "uint256[]",
                        "name": "shares"
                    },
                    {
                        "type": "address",
                        "name": "depositor"
                    },
                    {
                        "type": "tuple",
                        "name": "withdrawerAndNonce",
                        "components": [
                            {
                                "type": "address",
                                "name": "withdrawer"
                            },
                            {
                                "type": "uint96",
                                "name": "nonce"
                            }
                        ]
                    },
                    {
                        "type": "uint32",
                        "name": "withdrawalStartBlock"
                    },
                    {
                        "type": "address",
                        "name": "delegatedAddress"
                    }
                ]
            },
            {
                "type": "address[][]",
                "name": "tokens"
            },
            {
                "type": "uint256[]",
                "name": "middlewareTimesIndexes"
            },
            {
                "type": "bool[]",
                "name": "receiveAsTokens"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "delegation",
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
        "name": "depositBeaconChainETH",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "staker"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "depositIntoStrategy",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "strategy"
            },
            {
                "type": "address",
                "name": "token"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "shares"
            }
        ]
    },
    {
        "type": "function",
        "name": "depositIntoStrategyWithSignature",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "strategy"
            },
            {
                "type": "address",
                "name": "token"
            },
            {
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "address",
                "name": "staker"
            },
            {
                "type": "uint256",
                "name": "expiry"
            },
            {
                "type": "bytes",
                "name": "signature"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "shares"
            }
        ]
    },
    {
        "type": "function",
        "name": "eigenPodManager",
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
        "name": "getDeposits",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "depositor"
            }
        ],
        "outputs": [
            {
                "type": "address[]",
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
        "name": "initialize",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "initialOwner"
            },
            {
                "type": "address",
                "name": "initialStrategyWhitelister"
            },
            {
                "type": "address",
                "name": "_pauserRegistry"
            },
            {
                "type": "uint256",
                "name": "initialPausedStatus"
            },
            {
                "type": "uint256",
                "name": "_withdrawalDelayBlocks"
            }
        ],
        "outputs": []
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
        "name": "numWithdrawalsQueued",
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
        "name": "pause",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "newPausedStatus"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "pauseAll",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "paused",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint8",
                "name": "index"
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
        "name": "paused",
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
        "name": "pauserRegistry",
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
        "name": "queueWithdrawal",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256[]",
                "name": "strategyIndexes"
            },
            {
                "type": "address[]",
                "name": "strategies"
            },
            {
                "type": "uint256[]",
                "name": "shares"
            },
            {
                "type": "address",
                "name": "withdrawer"
            },
            {
                "type": "bool",
                "name": "undelegateIfPossible"
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
        "name": "recordOvercommittedBeaconChainETH",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "overcommittedPodOwner"
            },
            {
                "type": "uint256",
                "name": "beaconChainETHStrategyIndex"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "removeStrategiesFromDepositWhitelist",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address[]",
                "name": "strategiesToRemoveFromWhitelist"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "renounceOwnership",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setPauserRegistry",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newPauserRegistry"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setStrategyWhitelister",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newStrategyWhitelister"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setWithdrawalDelayBlocks",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_withdrawalDelayBlocks"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "slashQueuedWithdrawal",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "recipient"
            },
            {
                "type": "tuple",
                "name": "queuedWithdrawal",
                "components": [
                    {
                        "type": "address[]",
                        "name": "strategies"
                    },
                    {
                        "type": "uint256[]",
                        "name": "shares"
                    },
                    {
                        "type": "address",
                        "name": "depositor"
                    },
                    {
                        "type": "tuple",
                        "name": "withdrawerAndNonce",
                        "components": [
                            {
                                "type": "address",
                                "name": "withdrawer"
                            },
                            {
                                "type": "uint96",
                                "name": "nonce"
                            }
                        ]
                    },
                    {
                        "type": "uint32",
                        "name": "withdrawalStartBlock"
                    },
                    {
                        "type": "address",
                        "name": "delegatedAddress"
                    }
                ]
            },
            {
                "type": "address[]",
                "name": "tokens"
            },
            {
                "type": "uint256[]",
                "name": "indicesToSkip"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "slashShares",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "slashedAddress"
            },
            {
                "type": "address",
                "name": "recipient"
            },
            {
                "type": "address[]",
                "name": "strategies"
            },
            {
                "type": "address[]",
                "name": "tokens"
            },
            {
                "type": "uint256[]",
                "name": "strategyIndexes"
            },
            {
                "type": "uint256[]",
                "name": "shareAmounts"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "slasher",
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
        "name": "stakerStrategyList",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": ""
            },
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
        "name": "stakerStrategyListLength",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "staker"
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
        "name": "stakerStrategyShares",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": ""
            },
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
        "name": "strategyIsWhitelistedForDeposit",
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
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "strategyWhitelister",
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
        "name": "transferOwnership",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newOwner"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "undelegate",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "unpause",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "newPausedStatus"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "withdrawalDelayBlocks",
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
        "name": "withdrawalRootPending",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    }
]
