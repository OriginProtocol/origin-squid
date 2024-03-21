export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "wrappedNative"
            },
            {
                "type": "address",
                "name": "armProxy"
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
        "name": "FailedToSendValue",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InsufficientFeeTokenAmount",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidMsgValue",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidRecipientAddress",
        "inputs": [
            {
                "type": "address",
                "name": "to"
            }
        ]
    },
    {
        "type": "error",
        "name": "OffRampMismatch",
        "inputs": [
            {
                "type": "uint64",
                "name": "chainSelector"
            },
            {
                "type": "address",
                "name": "offRamp"
            }
        ]
    },
    {
        "type": "error",
        "name": "OnlyOffRamp",
        "inputs": []
    },
    {
        "type": "error",
        "name": "UnsupportedDestinationChain",
        "inputs": [
            {
                "type": "uint64",
                "name": "destChainSelector"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MessageExecuted",
        "inputs": [
            {
                "type": "bytes32",
                "name": "messageId",
                "indexed": false
            },
            {
                "type": "uint64",
                "name": "sourceChainSelector",
                "indexed": false
            },
            {
                "type": "address",
                "name": "offRamp",
                "indexed": false
            },
            {
                "type": "bytes32",
                "name": "calldataHash",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OffRampAdded",
        "inputs": [
            {
                "type": "uint64",
                "name": "sourceChainSelector",
                "indexed": true
            },
            {
                "type": "address",
                "name": "offRamp",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OffRampRemoved",
        "inputs": [
            {
                "type": "uint64",
                "name": "sourceChainSelector",
                "indexed": true
            },
            {
                "type": "address",
                "name": "offRamp",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OnRampSet",
        "inputs": [
            {
                "type": "uint64",
                "name": "destChainSelector",
                "indexed": true
            },
            {
                "type": "address",
                "name": "onRamp",
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
        "name": "MAX_RET_BYTES",
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
        "name": "acceptOwnership",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "applyRampUpdates",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple[]",
                "name": "onRampUpdates",
                "components": [
                    {
                        "type": "uint64",
                        "name": "destChainSelector"
                    },
                    {
                        "type": "address",
                        "name": "onRamp"
                    }
                ]
            },
            {
                "type": "tuple[]",
                "name": "offRampRemoves",
                "components": [
                    {
                        "type": "uint64",
                        "name": "sourceChainSelector"
                    },
                    {
                        "type": "address",
                        "name": "offRamp"
                    }
                ]
            },
            {
                "type": "tuple[]",
                "name": "offRampAdds",
                "components": [
                    {
                        "type": "uint64",
                        "name": "sourceChainSelector"
                    },
                    {
                        "type": "address",
                        "name": "offRamp"
                    }
                ]
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "ccipSend",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "uint64",
                "name": "destinationChainSelector"
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
                "type": "bytes32",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getArmProxy",
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
        "name": "getFee",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint64",
                "name": "destinationChainSelector"
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
                "name": "fee"
            }
        ]
    },
    {
        "type": "function",
        "name": "getOffRamps",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "tuple[]",
                "name": "",
                "components": [
                    {
                        "type": "uint64",
                        "name": "sourceChainSelector"
                    },
                    {
                        "type": "address",
                        "name": "offRamp"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getOnRamp",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint64",
                "name": "destChainSelector"
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
        "name": "getSupportedTokens",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint64",
                "name": "chainSelector"
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
        "name": "getWrappedNative",
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
        "name": "isChainSupported",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint64",
                "name": "chainSelector"
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
        "name": "isOffRamp",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint64",
                "name": "sourceChainSelector"
            },
            {
                "type": "address",
                "name": "offRamp"
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
        "name": "recoverTokens",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "tokenAddress"
            },
            {
                "type": "address",
                "name": "to"
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
        "name": "routeMessage",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "message",
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
            },
            {
                "type": "uint16",
                "name": "gasForCallExactCheck"
            },
            {
                "type": "uint256",
                "name": "gasLimit"
            },
            {
                "type": "address",
                "name": "receiver"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": "success"
            },
            {
                "type": "bytes",
                "name": "retData"
            },
            {
                "type": "uint256",
                "name": "gasUsed"
            }
        ]
    },
    {
        "type": "function",
        "name": "setWrappedNative",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "wrappedNative"
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
    }
]
