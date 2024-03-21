export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "staticConfig",
                "components": [
                    {
                        "type": "address",
                        "name": "commitStore"
                    },
                    {
                        "type": "uint64",
                        "name": "chainSelector"
                    },
                    {
                        "type": "uint64",
                        "name": "sourceChainSelector"
                    },
                    {
                        "type": "address",
                        "name": "onRamp"
                    },
                    {
                        "type": "address",
                        "name": "prevOffRamp"
                    },
                    {
                        "type": "address",
                        "name": "armProxy"
                    }
                ]
            },
            {
                "type": "address[]",
                "name": "sourceTokens"
            },
            {
                "type": "address[]",
                "name": "pools"
            },
            {
                "type": "tuple",
                "name": "rateLimiterConfig",
                "components": [
                    {
                        "type": "bool",
                        "name": "isEnabled"
                    },
                    {
                        "type": "uint128",
                        "name": "capacity"
                    },
                    {
                        "type": "uint128",
                        "name": "rate"
                    }
                ]
            }
        ]
    },
    {
        "type": "error",
        "name": "AggregateValueMaxCapacityExceeded",
        "inputs": [
            {
                "type": "uint256",
                "name": "capacity"
            },
            {
                "type": "uint256",
                "name": "requested"
            }
        ]
    },
    {
        "type": "error",
        "name": "AggregateValueRateLimitReached",
        "inputs": [
            {
                "type": "uint256",
                "name": "minWaitInSeconds"
            },
            {
                "type": "uint256",
                "name": "available"
            }
        ]
    },
    {
        "type": "error",
        "name": "AlreadyAttempted",
        "inputs": [
            {
                "type": "uint64",
                "name": "sequenceNumber"
            }
        ]
    },
    {
        "type": "error",
        "name": "AlreadyExecuted",
        "inputs": [
            {
                "type": "uint64",
                "name": "sequenceNumber"
            }
        ]
    },
    {
        "type": "error",
        "name": "BadARMSignal",
        "inputs": []
    },
    {
        "type": "error",
        "name": "BucketOverfilled",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CanOnlySelfCall",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CommitStoreAlreadyInUse",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ConfigDigestMismatch",
        "inputs": [
            {
                "type": "bytes32",
                "name": "expected"
            },
            {
                "type": "bytes32",
                "name": "actual"
            }
        ]
    },
    {
        "type": "error",
        "name": "EmptyReport",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ExecutionError",
        "inputs": [
            {
                "type": "bytes",
                "name": "error"
            }
        ]
    },
    {
        "type": "error",
        "name": "ForkedChain",
        "inputs": [
            {
                "type": "uint256",
                "name": "expected"
            },
            {
                "type": "uint256",
                "name": "actual"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidConfig",
        "inputs": [
            {
                "type": "string",
                "name": "message"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidManualExecutionGasLimit",
        "inputs": [
            {
                "type": "uint256",
                "name": "index"
            },
            {
                "type": "uint256",
                "name": "newLimit"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidMessageId",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidNewState",
        "inputs": [
            {
                "type": "uint64",
                "name": "sequenceNumber"
            },
            {
                "type": "uint8",
                "name": "newState"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidSourceChain",
        "inputs": [
            {
                "type": "uint64",
                "name": "sourceChainSelector"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidTokenPoolConfig",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ManualExecutionGasLimitMismatch",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ManualExecutionNotYetEnabled",
        "inputs": []
    },
    {
        "type": "error",
        "name": "MessageTooLarge",
        "inputs": [
            {
                "type": "uint256",
                "name": "maxSize"
            },
            {
                "type": "uint256",
                "name": "actualSize"
            }
        ]
    },
    {
        "type": "error",
        "name": "OnlyCallableByAdminOrOwner",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OracleCannotBeZeroAddress",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PoolAlreadyAdded",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PoolDoesNotExist",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PriceNotFoundForToken",
        "inputs": [
            {
                "type": "address",
                "name": "token"
            }
        ]
    },
    {
        "type": "error",
        "name": "ReceiverError",
        "inputs": [
            {
                "type": "bytes",
                "name": "error"
            }
        ]
    },
    {
        "type": "error",
        "name": "RootNotCommitted",
        "inputs": []
    },
    {
        "type": "error",
        "name": "TokenDataMismatch",
        "inputs": [
            {
                "type": "uint64",
                "name": "sequenceNumber"
            }
        ]
    },
    {
        "type": "error",
        "name": "TokenHandlingError",
        "inputs": [
            {
                "type": "bytes",
                "name": "error"
            }
        ]
    },
    {
        "type": "error",
        "name": "TokenMaxCapacityExceeded",
        "inputs": [
            {
                "type": "uint256",
                "name": "capacity"
            },
            {
                "type": "uint256",
                "name": "requested"
            },
            {
                "type": "address",
                "name": "tokenAddress"
            }
        ]
    },
    {
        "type": "error",
        "name": "TokenPoolMismatch",
        "inputs": []
    },
    {
        "type": "error",
        "name": "TokenRateLimitReached",
        "inputs": [
            {
                "type": "uint256",
                "name": "minWaitInSeconds"
            },
            {
                "type": "uint256",
                "name": "available"
            },
            {
                "type": "address",
                "name": "tokenAddress"
            }
        ]
    },
    {
        "type": "error",
        "name": "UnauthorizedTransmitter",
        "inputs": []
    },
    {
        "type": "error",
        "name": "UnexpectedTokenData",
        "inputs": []
    },
    {
        "type": "error",
        "name": "UnsupportedNumberOfTokens",
        "inputs": [
            {
                "type": "uint64",
                "name": "sequenceNumber"
            }
        ]
    },
    {
        "type": "error",
        "name": "UnsupportedToken",
        "inputs": [
            {
                "type": "address",
                "name": "token"
            }
        ]
    },
    {
        "type": "error",
        "name": "WrongMessageLength",
        "inputs": [
            {
                "type": "uint256",
                "name": "expected"
            },
            {
                "type": "uint256",
                "name": "actual"
            }
        ]
    },
    {
        "type": "error",
        "name": "ZeroAddressNotAllowed",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AdminSet",
        "inputs": [
            {
                "type": "address",
                "name": "newAdmin",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ConfigSet",
        "inputs": [
            {
                "type": "tuple",
                "name": "staticConfig",
                "indexed": false,
                "components": [
                    {
                        "type": "address",
                        "name": "commitStore"
                    },
                    {
                        "type": "uint64",
                        "name": "chainSelector"
                    },
                    {
                        "type": "uint64",
                        "name": "sourceChainSelector"
                    },
                    {
                        "type": "address",
                        "name": "onRamp"
                    },
                    {
                        "type": "address",
                        "name": "prevOffRamp"
                    },
                    {
                        "type": "address",
                        "name": "armProxy"
                    }
                ]
            },
            {
                "type": "tuple",
                "name": "dynamicConfig",
                "indexed": false,
                "components": [
                    {
                        "type": "uint32",
                        "name": "permissionLessExecutionThresholdSeconds"
                    },
                    {
                        "type": "address",
                        "name": "router"
                    },
                    {
                        "type": "address",
                        "name": "priceRegistry"
                    },
                    {
                        "type": "uint16",
                        "name": "maxNumberOfTokensPerMsg"
                    },
                    {
                        "type": "uint32",
                        "name": "maxDataBytes"
                    },
                    {
                        "type": "uint32",
                        "name": "maxPoolReleaseOrMintGas"
                    }
                ]
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ConfigSet",
        "inputs": [
            {
                "type": "uint32",
                "name": "previousConfigBlockNumber",
                "indexed": false
            },
            {
                "type": "bytes32",
                "name": "configDigest",
                "indexed": false
            },
            {
                "type": "uint64",
                "name": "configCount",
                "indexed": false
            },
            {
                "type": "address[]",
                "name": "signers"
            },
            {
                "type": "address[]",
                "name": "transmitters"
            },
            {
                "type": "uint8",
                "name": "f",
                "indexed": false
            },
            {
                "type": "bytes",
                "name": "onchainConfig",
                "indexed": false
            },
            {
                "type": "uint64",
                "name": "offchainConfigVersion",
                "indexed": false
            },
            {
                "type": "bytes",
                "name": "offchainConfig",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ExecutionStateChanged",
        "inputs": [
            {
                "type": "uint64",
                "name": "sequenceNumber",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "messageId",
                "indexed": true
            },
            {
                "type": "uint8",
                "name": "state",
                "indexed": false
            },
            {
                "type": "bytes",
                "name": "returnData",
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
        "type": "event",
        "anonymous": false,
        "name": "PoolAdded",
        "inputs": [
            {
                "type": "address",
                "name": "token",
                "indexed": false
            },
            {
                "type": "address",
                "name": "pool",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolRemoved",
        "inputs": [
            {
                "type": "address",
                "name": "token",
                "indexed": false
            },
            {
                "type": "address",
                "name": "pool",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SkippedIncorrectNonce",
        "inputs": [
            {
                "type": "uint64",
                "name": "nonce",
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
        "name": "SkippedSenderWithPreviousRampMessageInflight",
        "inputs": [
            {
                "type": "uint64",
                "name": "nonce",
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
        "name": "Transmitted",
        "inputs": [
            {
                "type": "bytes32",
                "name": "configDigest",
                "indexed": false
            },
            {
                "type": "uint32",
                "name": "epoch",
                "indexed": false
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
        "name": "applyPoolUpdates",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple[]",
                "name": "removes",
                "components": [
                    {
                        "type": "address",
                        "name": "token"
                    },
                    {
                        "type": "address",
                        "name": "pool"
                    }
                ]
            },
            {
                "type": "tuple[]",
                "name": "adds",
                "components": [
                    {
                        "type": "address",
                        "name": "token"
                    },
                    {
                        "type": "address",
                        "name": "pool"
                    }
                ]
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "ccipReceive",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "",
                "components": [
                    {
                        "type": "bytes32",
                        "name": "messageId"
                    },
                    {
                        "type": "uint64",
                        "name": "sourceChainSelector"
                    },
                    {
                        "type": "bytes",
                        "name": "sender"
                    },
                    {
                        "type": "bytes",
                        "name": "data"
                    },
                    {
                        "type": "tuple[]",
                        "name": "destTokenAmounts",
                        "components": [
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
                ]
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "currentRateLimiterState",
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
                        "type": "uint128",
                        "name": "tokens"
                    },
                    {
                        "type": "uint32",
                        "name": "lastUpdated"
                    },
                    {
                        "type": "bool",
                        "name": "isEnabled"
                    },
                    {
                        "type": "uint128",
                        "name": "capacity"
                    },
                    {
                        "type": "uint128",
                        "name": "rate"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "executeSingleMessage",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "message",
                "components": [
                    {
                        "type": "uint64",
                        "name": "sourceChainSelector"
                    },
                    {
                        "type": "address",
                        "name": "sender"
                    },
                    {
                        "type": "address",
                        "name": "receiver"
                    },
                    {
                        "type": "uint64",
                        "name": "sequenceNumber"
                    },
                    {
                        "type": "uint256",
                        "name": "gasLimit"
                    },
                    {
                        "type": "bool",
                        "name": "strict"
                    },
                    {
                        "type": "uint64",
                        "name": "nonce"
                    },
                    {
                        "type": "address",
                        "name": "feeToken"
                    },
                    {
                        "type": "uint256",
                        "name": "feeTokenAmount"
                    },
                    {
                        "type": "bytes",
                        "name": "data"
                    },
                    {
                        "type": "tuple[]",
                        "name": "tokenAmounts",
                        "components": [
                            {
                                "type": "address",
                                "name": "token"
                            },
                            {
                                "type": "uint256",
                                "name": "amount"
                            }
                        ]
                    },
                    {
                        "type": "bytes[]",
                        "name": "sourceTokenData"
                    },
                    {
                        "type": "bytes32",
                        "name": "messageId"
                    }
                ]
            },
            {
                "type": "bytes[]",
                "name": "offchainTokenData"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getDestinationToken",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "sourceToken"
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
        "name": "getDestinationTokens",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address[]",
                "name": "destTokens"
            }
        ]
    },
    {
        "type": "function",
        "name": "getDynamicConfig",
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
                        "type": "uint32",
                        "name": "permissionLessExecutionThresholdSeconds"
                    },
                    {
                        "type": "address",
                        "name": "router"
                    },
                    {
                        "type": "address",
                        "name": "priceRegistry"
                    },
                    {
                        "type": "uint16",
                        "name": "maxNumberOfTokensPerMsg"
                    },
                    {
                        "type": "uint32",
                        "name": "maxDataBytes"
                    },
                    {
                        "type": "uint32",
                        "name": "maxPoolReleaseOrMintGas"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getExecutionState",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint64",
                "name": "sequenceNumber"
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
        "name": "getPoolByDestToken",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "destToken"
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
        "name": "getPoolBySourceToken",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "sourceToken"
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
        "name": "getSenderNonce",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "sender"
            }
        ],
        "outputs": [
            {
                "type": "uint64",
                "name": "nonce"
            }
        ]
    },
    {
        "type": "function",
        "name": "getStaticConfig",
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
                        "type": "address",
                        "name": "commitStore"
                    },
                    {
                        "type": "uint64",
                        "name": "chainSelector"
                    },
                    {
                        "type": "uint64",
                        "name": "sourceChainSelector"
                    },
                    {
                        "type": "address",
                        "name": "onRamp"
                    },
                    {
                        "type": "address",
                        "name": "prevOffRamp"
                    },
                    {
                        "type": "address",
                        "name": "armProxy"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getSupportedTokens",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address[]",
                "name": "sourceTokens"
            }
        ]
    },
    {
        "type": "function",
        "name": "getTokenLimitAdmin",
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
        "name": "getTransmitters",
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
        "name": "latestConfigDetails",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint32",
                "name": "configCount"
            },
            {
                "type": "uint32",
                "name": "blockNumber"
            },
            {
                "type": "bytes32",
                "name": "configDigest"
            }
        ]
    },
    {
        "type": "function",
        "name": "latestConfigDigestAndEpoch",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bool",
                "name": "scanLogs"
            },
            {
                "type": "bytes32",
                "name": "configDigest"
            },
            {
                "type": "uint32",
                "name": "epoch"
            }
        ]
    },
    {
        "type": "function",
        "name": "manuallyExecute",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "report",
                "components": [
                    {
                        "type": "tuple[]",
                        "name": "messages",
                        "components": [
                            {
                                "type": "uint64",
                                "name": "sourceChainSelector"
                            },
                            {
                                "type": "address",
                                "name": "sender"
                            },
                            {
                                "type": "address",
                                "name": "receiver"
                            },
                            {
                                "type": "uint64",
                                "name": "sequenceNumber"
                            },
                            {
                                "type": "uint256",
                                "name": "gasLimit"
                            },
                            {
                                "type": "bool",
                                "name": "strict"
                            },
                            {
                                "type": "uint64",
                                "name": "nonce"
                            },
                            {
                                "type": "address",
                                "name": "feeToken"
                            },
                            {
                                "type": "uint256",
                                "name": "feeTokenAmount"
                            },
                            {
                                "type": "bytes",
                                "name": "data"
                            },
                            {
                                "type": "tuple[]",
                                "name": "tokenAmounts",
                                "components": [
                                    {
                                        "type": "address",
                                        "name": "token"
                                    },
                                    {
                                        "type": "uint256",
                                        "name": "amount"
                                    }
                                ]
                            },
                            {
                                "type": "bytes[]",
                                "name": "sourceTokenData"
                            },
                            {
                                "type": "bytes32",
                                "name": "messageId"
                            }
                        ]
                    },
                    {
                        "type": "bytes[][]",
                        "name": "offchainTokenData"
                    },
                    {
                        "type": "bytes32[]",
                        "name": "proofs"
                    },
                    {
                        "type": "uint256",
                        "name": "proofFlagBits"
                    }
                ]
            },
            {
                "type": "uint256[]",
                "name": "gasLimitOverrides"
            }
        ],
        "outputs": []
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
        "name": "setAdmin",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newAdmin"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setOCR2Config",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address[]",
                "name": "signers"
            },
            {
                "type": "address[]",
                "name": "transmitters"
            },
            {
                "type": "uint8",
                "name": "f"
            },
            {
                "type": "bytes",
                "name": "onchainConfig"
            },
            {
                "type": "uint64",
                "name": "offchainConfigVersion"
            },
            {
                "type": "bytes",
                "name": "offchainConfig"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setRateLimiterConfig",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "config",
                "components": [
                    {
                        "type": "bool",
                        "name": "isEnabled"
                    },
                    {
                        "type": "uint128",
                        "name": "capacity"
                    },
                    {
                        "type": "uint128",
                        "name": "rate"
                    }
                ]
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
        "name": "transmit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32[3]",
                "name": "reportContext"
            },
            {
                "type": "bytes",
                "name": "report"
            },
            {
                "type": "bytes32[]",
                "name": "rs"
            },
            {
                "type": "bytes32[]",
                "name": "ss"
            },
            {
                "type": "bytes32",
                "name": ""
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "typeAndVersion",
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
