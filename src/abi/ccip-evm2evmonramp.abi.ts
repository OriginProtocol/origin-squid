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
                        "name": "linkToken"
                    },
                    {
                        "type": "uint64",
                        "name": "chainSelector"
                    },
                    {
                        "type": "uint64",
                        "name": "destChainSelector"
                    },
                    {
                        "type": "uint64",
                        "name": "defaultTxGasLimit"
                    },
                    {
                        "type": "uint96",
                        "name": "maxNopFeesJuels"
                    },
                    {
                        "type": "address",
                        "name": "prevOnRamp"
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
                "components": [
                    {
                        "type": "address",
                        "name": "router"
                    },
                    {
                        "type": "uint16",
                        "name": "maxNumberOfTokensPerMsg"
                    },
                    {
                        "type": "uint32",
                        "name": "destGasOverhead"
                    },
                    {
                        "type": "uint16",
                        "name": "destGasPerPayloadByte"
                    },
                    {
                        "type": "uint32",
                        "name": "destDataAvailabilityOverheadGas"
                    },
                    {
                        "type": "uint16",
                        "name": "destGasPerDataAvailabilityByte"
                    },
                    {
                        "type": "uint16",
                        "name": "destDataAvailabilityMultiplierBps"
                    },
                    {
                        "type": "address",
                        "name": "priceRegistry"
                    },
                    {
                        "type": "uint32",
                        "name": "maxDataBytes"
                    },
                    {
                        "type": "uint32",
                        "name": "maxPerMsgGasLimit"
                    }
                ]
            },
            {
                "type": "tuple[]",
                "name": "tokensAndPools",
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
            },
            {
                "type": "tuple[]",
                "name": "feeTokenConfigs",
                "components": [
                    {
                        "type": "address",
                        "name": "token"
                    },
                    {
                        "type": "uint32",
                        "name": "networkFeeUSDCents"
                    },
                    {
                        "type": "uint64",
                        "name": "gasMultiplierWeiPerEth"
                    },
                    {
                        "type": "uint64",
                        "name": "premiumMultiplierWeiPerEth"
                    },
                    {
                        "type": "bool",
                        "name": "enabled"
                    }
                ]
            },
            {
                "type": "tuple[]",
                "name": "tokenTransferFeeConfigArgs",
                "components": [
                    {
                        "type": "address",
                        "name": "token"
                    },
                    {
                        "type": "uint32",
                        "name": "minFeeUSDCents"
                    },
                    {
                        "type": "uint32",
                        "name": "maxFeeUSDCents"
                    },
                    {
                        "type": "uint16",
                        "name": "deciBps"
                    },
                    {
                        "type": "uint32",
                        "name": "destGasOverhead"
                    },
                    {
                        "type": "uint32",
                        "name": "destBytesOverhead"
                    }
                ]
            },
            {
                "type": "tuple[]",
                "name": "nopsAndWeights",
                "components": [
                    {
                        "type": "address",
                        "name": "nop"
                    },
                    {
                        "type": "uint16",
                        "name": "weight"
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
        "name": "CannotSendZeroTokens",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InsufficientBalance",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidAddress",
        "inputs": [
            {
                "type": "bytes",
                "name": "encodedAddress"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidChainSelector",
        "inputs": [
            {
                "type": "uint64",
                "name": "chainSelector"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidConfig",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidExtraArgsTag",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidNopAddress",
        "inputs": [
            {
                "type": "address",
                "name": "nop"
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
        "name": "InvalidWithdrawParams",
        "inputs": []
    },
    {
        "type": "error",
        "name": "LinkBalanceNotSettled",
        "inputs": []
    },
    {
        "type": "error",
        "name": "MaxFeeBalanceReached",
        "inputs": []
    },
    {
        "type": "error",
        "name": "MessageGasLimitTooHigh",
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
        "name": "MustBeCalledByRouter",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NoFeesToPay",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NoNopsToPay",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotAFeeToken",
        "inputs": [
            {
                "type": "address",
                "name": "token"
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
        "name": "OnlyCallableByOwnerOrAdmin",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OnlyCallableByOwnerOrAdminOrNop",
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
        "inputs": [
            {
                "type": "address",
                "name": "token"
            }
        ]
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
        "name": "RouterMustSetOriginalSender",
        "inputs": []
    },
    {
        "type": "error",
        "name": "SourceTokenDataTooLarge",
        "inputs": [
            {
                "type": "address",
                "name": "token"
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
        "name": "TooManyNops",
        "inputs": []
    },
    {
        "type": "error",
        "name": "UnsupportedNumberOfTokens",
        "inputs": []
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
        "name": "CCIPSendRequested",
        "inputs": [
            {
                "type": "tuple",
                "name": "message",
                "indexed": false,
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
                        "name": "linkToken"
                    },
                    {
                        "type": "uint64",
                        "name": "chainSelector"
                    },
                    {
                        "type": "uint64",
                        "name": "destChainSelector"
                    },
                    {
                        "type": "uint64",
                        "name": "defaultTxGasLimit"
                    },
                    {
                        "type": "uint96",
                        "name": "maxNopFeesJuels"
                    },
                    {
                        "type": "address",
                        "name": "prevOnRamp"
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
                        "type": "address",
                        "name": "router"
                    },
                    {
                        "type": "uint16",
                        "name": "maxNumberOfTokensPerMsg"
                    },
                    {
                        "type": "uint32",
                        "name": "destGasOverhead"
                    },
                    {
                        "type": "uint16",
                        "name": "destGasPerPayloadByte"
                    },
                    {
                        "type": "uint32",
                        "name": "destDataAvailabilityOverheadGas"
                    },
                    {
                        "type": "uint16",
                        "name": "destGasPerDataAvailabilityByte"
                    },
                    {
                        "type": "uint16",
                        "name": "destDataAvailabilityMultiplierBps"
                    },
                    {
                        "type": "address",
                        "name": "priceRegistry"
                    },
                    {
                        "type": "uint32",
                        "name": "maxDataBytes"
                    },
                    {
                        "type": "uint32",
                        "name": "maxPerMsgGasLimit"
                    }
                ]
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "FeeConfigSet",
        "inputs": [
            {
                "type": "tuple[]",
                "name": "feeConfig",
                "components": [
                    {
                        "type": "address",
                        "name": "token"
                    },
                    {
                        "type": "uint32",
                        "name": "networkFeeUSDCents"
                    },
                    {
                        "type": "uint64",
                        "name": "gasMultiplierWeiPerEth"
                    },
                    {
                        "type": "uint64",
                        "name": "premiumMultiplierWeiPerEth"
                    },
                    {
                        "type": "bool",
                        "name": "enabled"
                    }
                ]
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NopPaid",
        "inputs": [
            {
                "type": "address",
                "name": "nop",
                "indexed": true
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
        "name": "NopsSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "nopWeightsTotal",
                "indexed": false
            },
            {
                "type": "tuple[]",
                "name": "nopsAndWeights",
                "components": [
                    {
                        "type": "address",
                        "name": "nop"
                    },
                    {
                        "type": "uint16",
                        "name": "weight"
                    }
                ]
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
        "name": "TokenTransferFeeConfigSet",
        "inputs": [
            {
                "type": "tuple[]",
                "name": "transferFeeConfig",
                "components": [
                    {
                        "type": "address",
                        "name": "token"
                    },
                    {
                        "type": "uint32",
                        "name": "minFeeUSDCents"
                    },
                    {
                        "type": "uint32",
                        "name": "maxFeeUSDCents"
                    },
                    {
                        "type": "uint16",
                        "name": "deciBps"
                    },
                    {
                        "type": "uint32",
                        "name": "destGasOverhead"
                    },
                    {
                        "type": "uint32",
                        "name": "destBytesOverhead"
                    }
                ]
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
        "name": "forwardFromRouter",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint64",
                "name": "destChainSelector"
            },
            {
                "type": "tuple",
                "name": "message",
                "components": [
                    {
                        "type": "bytes",
                        "name": "receiver"
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
                        "type": "address",
                        "name": "feeToken"
                    },
                    {
                        "type": "bytes",
                        "name": "extraArgs"
                    }
                ]
            },
            {
                "type": "uint256",
                "name": "feeTokenAmount"
            },
            {
                "type": "address",
                "name": "originalSender"
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
        "name": "getDynamicConfig",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "tuple",
                "name": "dynamicConfig",
                "components": [
                    {
                        "type": "address",
                        "name": "router"
                    },
                    {
                        "type": "uint16",
                        "name": "maxNumberOfTokensPerMsg"
                    },
                    {
                        "type": "uint32",
                        "name": "destGasOverhead"
                    },
                    {
                        "type": "uint16",
                        "name": "destGasPerPayloadByte"
                    },
                    {
                        "type": "uint32",
                        "name": "destDataAvailabilityOverheadGas"
                    },
                    {
                        "type": "uint16",
                        "name": "destGasPerDataAvailabilityByte"
                    },
                    {
                        "type": "uint16",
                        "name": "destDataAvailabilityMultiplierBps"
                    },
                    {
                        "type": "address",
                        "name": "priceRegistry"
                    },
                    {
                        "type": "uint32",
                        "name": "maxDataBytes"
                    },
                    {
                        "type": "uint32",
                        "name": "maxPerMsgGasLimit"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getExpectedNextSequenceNumber",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint64",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getFee",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint64",
                "name": "destChainSelector"
            },
            {
                "type": "tuple",
                "name": "message",
                "components": [
                    {
                        "type": "bytes",
                        "name": "receiver"
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
                        "type": "address",
                        "name": "feeToken"
                    },
                    {
                        "type": "bytes",
                        "name": "extraArgs"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "feeTokenAmount"
            }
        ]
    },
    {
        "type": "function",
        "name": "getFeeTokenConfig",
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
                "type": "tuple",
                "name": "feeTokenConfig",
                "components": [
                    {
                        "type": "uint32",
                        "name": "networkFeeUSDCents"
                    },
                    {
                        "type": "uint64",
                        "name": "gasMultiplierWeiPerEth"
                    },
                    {
                        "type": "uint64",
                        "name": "premiumMultiplierWeiPerEth"
                    },
                    {
                        "type": "bool",
                        "name": "enabled"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getNopFeesJuels",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint96",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getNops",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "tuple[]",
                "name": "nopsAndWeights",
                "components": [
                    {
                        "type": "address",
                        "name": "nop"
                    },
                    {
                        "type": "uint16",
                        "name": "weight"
                    }
                ]
            },
            {
                "type": "uint256",
                "name": "weightsTotal"
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
                "type": "uint64",
                "name": ""
            },
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
                "name": ""
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
                        "name": "linkToken"
                    },
                    {
                        "type": "uint64",
                        "name": "chainSelector"
                    },
                    {
                        "type": "uint64",
                        "name": "destChainSelector"
                    },
                    {
                        "type": "uint64",
                        "name": "defaultTxGasLimit"
                    },
                    {
                        "type": "uint96",
                        "name": "maxNopFeesJuels"
                    },
                    {
                        "type": "address",
                        "name": "prevOnRamp"
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
        "inputs": [
            {
                "type": "uint64",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "address[]",
                "name": ""
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
        "name": "getTokenTransferFeeConfig",
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
                "type": "tuple",
                "name": "tokenTransferFeeConfig",
                "components": [
                    {
                        "type": "uint32",
                        "name": "minFeeUSDCents"
                    },
                    {
                        "type": "uint32",
                        "name": "maxFeeUSDCents"
                    },
                    {
                        "type": "uint16",
                        "name": "deciBps"
                    },
                    {
                        "type": "uint32",
                        "name": "destGasOverhead"
                    },
                    {
                        "type": "uint32",
                        "name": "destBytesOverhead"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "linkAvailableForPayment",
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
        "name": "payNops",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
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
        "name": "setDynamicConfig",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "dynamicConfig",
                "components": [
                    {
                        "type": "address",
                        "name": "router"
                    },
                    {
                        "type": "uint16",
                        "name": "maxNumberOfTokensPerMsg"
                    },
                    {
                        "type": "uint32",
                        "name": "destGasOverhead"
                    },
                    {
                        "type": "uint16",
                        "name": "destGasPerPayloadByte"
                    },
                    {
                        "type": "uint32",
                        "name": "destDataAvailabilityOverheadGas"
                    },
                    {
                        "type": "uint16",
                        "name": "destGasPerDataAvailabilityByte"
                    },
                    {
                        "type": "uint16",
                        "name": "destDataAvailabilityMultiplierBps"
                    },
                    {
                        "type": "address",
                        "name": "priceRegistry"
                    },
                    {
                        "type": "uint32",
                        "name": "maxDataBytes"
                    },
                    {
                        "type": "uint32",
                        "name": "maxPerMsgGasLimit"
                    }
                ]
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setFeeTokenConfig",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple[]",
                "name": "feeTokenConfigArgs",
                "components": [
                    {
                        "type": "address",
                        "name": "token"
                    },
                    {
                        "type": "uint32",
                        "name": "networkFeeUSDCents"
                    },
                    {
                        "type": "uint64",
                        "name": "gasMultiplierWeiPerEth"
                    },
                    {
                        "type": "uint64",
                        "name": "premiumMultiplierWeiPerEth"
                    },
                    {
                        "type": "bool",
                        "name": "enabled"
                    }
                ]
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setNops",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple[]",
                "name": "nopsAndWeights",
                "components": [
                    {
                        "type": "address",
                        "name": "nop"
                    },
                    {
                        "type": "uint16",
                        "name": "weight"
                    }
                ]
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
        "name": "setTokenTransferFeeConfig",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple[]",
                "name": "tokenTransferFeeConfigArgs",
                "components": [
                    {
                        "type": "address",
                        "name": "token"
                    },
                    {
                        "type": "uint32",
                        "name": "minFeeUSDCents"
                    },
                    {
                        "type": "uint32",
                        "name": "maxFeeUSDCents"
                    },
                    {
                        "type": "uint16",
                        "name": "deciBps"
                    },
                    {
                        "type": "uint32",
                        "name": "destGasOverhead"
                    },
                    {
                        "type": "uint32",
                        "name": "destBytesOverhead"
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
    },
    {
        "type": "function",
        "name": "withdrawNonLinkFees",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "feeToken"
            },
            {
                "type": "address",
                "name": "to"
            }
        ],
        "outputs": []
    }
]
