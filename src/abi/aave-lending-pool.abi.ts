export const ABI_JSON = [
    {
        "type": "event",
        "anonymous": false,
        "name": "Borrow",
        "inputs": [
            {
                "type": "address",
                "name": "reserve",
                "indexed": true
            },
            {
                "type": "address",
                "name": "user",
                "indexed": false
            },
            {
                "type": "address",
                "name": "onBehalfOf",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "borrowRateMode",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "borrowRate",
                "indexed": false
            },
            {
                "type": "uint16",
                "name": "referral",
                "indexed": true
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
                "name": "reserve",
                "indexed": true
            },
            {
                "type": "address",
                "name": "user",
                "indexed": false
            },
            {
                "type": "address",
                "name": "onBehalfOf",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "uint16",
                "name": "referral",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "FlashLoan",
        "inputs": [
            {
                "type": "address",
                "name": "target",
                "indexed": true
            },
            {
                "type": "address",
                "name": "initiator",
                "indexed": true
            },
            {
                "type": "address",
                "name": "asset",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "premium",
                "indexed": false
            },
            {
                "type": "uint16",
                "name": "referralCode",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "LiquidationCall",
        "inputs": [
            {
                "type": "address",
                "name": "collateralAsset",
                "indexed": true
            },
            {
                "type": "address",
                "name": "debtAsset",
                "indexed": true
            },
            {
                "type": "address",
                "name": "user",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "debtToCover",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "liquidatedCollateralAmount",
                "indexed": false
            },
            {
                "type": "address",
                "name": "liquidator",
                "indexed": false
            },
            {
                "type": "bool",
                "name": "receiveAToken",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Paused",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RebalanceStableBorrowRate",
        "inputs": [
            {
                "type": "address",
                "name": "reserve",
                "indexed": true
            },
            {
                "type": "address",
                "name": "user",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Repay",
        "inputs": [
            {
                "type": "address",
                "name": "reserve",
                "indexed": true
            },
            {
                "type": "address",
                "name": "user",
                "indexed": true
            },
            {
                "type": "address",
                "name": "repayer",
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
        "name": "ReserveDataUpdated",
        "inputs": [
            {
                "type": "address",
                "name": "reserve",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "liquidityRate",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "stableBorrowRate",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "variableBorrowRate",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "liquidityIndex",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "variableBorrowIndex",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ReserveUsedAsCollateralDisabled",
        "inputs": [
            {
                "type": "address",
                "name": "reserve",
                "indexed": true
            },
            {
                "type": "address",
                "name": "user",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ReserveUsedAsCollateralEnabled",
        "inputs": [
            {
                "type": "address",
                "name": "reserve",
                "indexed": true
            },
            {
                "type": "address",
                "name": "user",
                "indexed": true
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
                "name": "reserve",
                "indexed": true
            },
            {
                "type": "address",
                "name": "user",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "rateMode",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TokensRescued",
        "inputs": [
            {
                "type": "address",
                "name": "tokenRescued",
                "indexed": true
            },
            {
                "type": "address",
                "name": "receiver",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amountRescued",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Unpaused",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Withdraw",
        "inputs": [
            {
                "type": "address",
                "name": "reserve",
                "indexed": true
            },
            {
                "type": "address",
                "name": "user",
                "indexed": true
            },
            {
                "type": "address",
                "name": "to",
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
        "type": "function",
        "name": "FLASHLOAN_PREMIUM_TOTAL",
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
        "name": "LENDINGPOOL_REVISION",
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
        "name": "MAX_NUMBER_RESERVES",
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
        "name": "MAX_STABLE_RATE_BORROW_SIZE_PERCENT",
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
        "name": "borrow",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            },
            {
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "uint256",
                "name": "interestRateMode"
            },
            {
                "type": "uint16",
                "name": "referralCode"
            },
            {
                "type": "address",
                "name": "onBehalfOf"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "deposit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            },
            {
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "address",
                "name": "onBehalfOf"
            },
            {
                "type": "uint16",
                "name": "referralCode"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "finalizeTransfer",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
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
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "uint256",
                "name": "balanceFromBefore"
            },
            {
                "type": "uint256",
                "name": "balanceToBefore"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "flashLoan",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "receiverAddress"
            },
            {
                "type": "address[]",
                "name": "assets"
            },
            {
                "type": "uint256[]",
                "name": "amounts"
            },
            {
                "type": "uint256[]",
                "name": "modes"
            },
            {
                "type": "address",
                "name": "onBehalfOf"
            },
            {
                "type": "bytes",
                "name": "params"
            },
            {
                "type": "uint16",
                "name": "referralCode"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getAddressesProvider",
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
        "name": "getConfiguration",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "",
                "components": [
                    {
                        "type": "uint256",
                        "name": "data"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getReserveData",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "",
                "components": [
                    {
                        "type": "tuple",
                        "name": "configuration",
                        "components": [
                            {
                                "type": "uint256",
                                "name": "data"
                            }
                        ]
                    },
                    {
                        "type": "uint128",
                        "name": "liquidityIndex"
                    },
                    {
                        "type": "uint128",
                        "name": "variableBorrowIndex"
                    },
                    {
                        "type": "uint128",
                        "name": "currentLiquidityRate"
                    },
                    {
                        "type": "uint128",
                        "name": "currentVariableBorrowRate"
                    },
                    {
                        "type": "uint128",
                        "name": "currentStableBorrowRate"
                    },
                    {
                        "type": "uint40",
                        "name": "lastUpdateTimestamp"
                    },
                    {
                        "type": "address",
                        "name": "aTokenAddress"
                    },
                    {
                        "type": "address",
                        "name": "stableDebtTokenAddress"
                    },
                    {
                        "type": "address",
                        "name": "variableDebtTokenAddress"
                    },
                    {
                        "type": "address",
                        "name": "interestRateStrategyAddress"
                    },
                    {
                        "type": "uint8",
                        "name": "id"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getReserveNormalizedIncome",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
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
        "name": "getReserveNormalizedVariableDebt",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
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
        "name": "getReservesList",
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
        "name": "getUserAccountData",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "user"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "totalCollateralETH"
            },
            {
                "type": "uint256",
                "name": "totalDebtETH"
            },
            {
                "type": "uint256",
                "name": "availableBorrowsETH"
            },
            {
                "type": "uint256",
                "name": "currentLiquidationThreshold"
            },
            {
                "type": "uint256",
                "name": "ltv"
            },
            {
                "type": "uint256",
                "name": "healthFactor"
            }
        ]
    },
    {
        "type": "function",
        "name": "getUserConfiguration",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "user"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "",
                "components": [
                    {
                        "type": "uint256",
                        "name": "data"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "initReserve",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            },
            {
                "type": "address",
                "name": "aTokenAddress"
            },
            {
                "type": "address",
                "name": "stableDebtAddress"
            },
            {
                "type": "address",
                "name": "variableDebtAddress"
            },
            {
                "type": "address",
                "name": "interestRateStrategyAddress"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "initialize",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "provider"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "liquidationCall",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "collateralAsset"
            },
            {
                "type": "address",
                "name": "debtAsset"
            },
            {
                "type": "address",
                "name": "user"
            },
            {
                "type": "uint256",
                "name": "debtToCover"
            },
            {
                "type": "bool",
                "name": "receiveAToken"
            }
        ],
        "outputs": []
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
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "rebalanceStableBorrowRate",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            },
            {
                "type": "address",
                "name": "user"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "repay",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            },
            {
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "uint256",
                "name": "rateMode"
            },
            {
                "type": "address",
                "name": "onBehalfOf"
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
        "name": "rescueTokens",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "token"
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
        "name": "setConfiguration",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            },
            {
                "type": "uint256",
                "name": "configuration"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setPause",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bool",
                "name": "val"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setReserveInterestRateStrategyAddress",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            },
            {
                "type": "address",
                "name": "rateStrategyAddress"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setUserUseReserveAsCollateral",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            },
            {
                "type": "bool",
                "name": "useAsCollateral"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "swapBorrowRateMode",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            },
            {
                "type": "uint256",
                "name": "rateMode"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "withdraw",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            },
            {
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "address",
                "name": "to"
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
