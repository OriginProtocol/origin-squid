export const ABI_JSON = [
    {
        "type": "function",
        "name": "resume",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "name",
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
        "name": "stop",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "hasInitialized",
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
        "name": "approve",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_spender"
            },
            {
                "type": "uint256",
                "name": "_amount"
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
        "name": "STAKING_CONTROL_ROLE",
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
        "name": "getSharesByPooledEth",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_ethAmount"
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
        "name": "isStakingPaused",
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
        "name": "transferFrom",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_sender"
            },
            {
                "type": "address",
                "name": "_recipient"
            },
            {
                "type": "uint256",
                "name": "_amount"
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
        "name": "getEVMScriptExecutor",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "_script"
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
        "name": "setStakingLimit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_maxStakeLimit"
            },
            {
                "type": "uint256",
                "name": "_stakeLimitIncreasePerBlock"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "RESUME_ROLE",
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
        "name": "finalizeUpgrade_v2",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_lidoLocator"
            },
            {
                "type": "address",
                "name": "_eip712StETH"
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
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getRecoveryVault",
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
        "name": "getTotalPooledEther",
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
        "name": "unsafeChangeDepositedValidators",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_newDepositedValidators"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "PAUSE_ROLE",
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
        "name": "increaseAllowance",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_spender"
            },
            {
                "type": "uint256",
                "name": "_addedValue"
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
        "name": "getTreasury",
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
        "name": "isStopped",
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
        "name": "getBufferedEther",
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
        "name": "initialize",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "address",
                "name": "_lidoLocator"
            },
            {
                "type": "address",
                "name": "_eip712StETH"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "receiveELRewards",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getWithdrawalCredentials",
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
        "name": "getCurrentStakeLimit",
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
        "name": "getStakeLimitFullInfo",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bool",
                "name": "isStakingPaused"
            },
            {
                "type": "bool",
                "name": "isStakingLimitSet"
            },
            {
                "type": "uint256",
                "name": "currentStakeLimit"
            },
            {
                "type": "uint256",
                "name": "maxStakeLimit"
            },
            {
                "type": "uint256",
                "name": "maxStakeLimitGrowthBlocks"
            },
            {
                "type": "uint256",
                "name": "prevStakeLimit"
            },
            {
                "type": "uint256",
                "name": "prevStakeBlockNumber"
            }
        ]
    },
    {
        "type": "function",
        "name": "transferSharesFrom",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_sender"
            },
            {
                "type": "address",
                "name": "_recipient"
            },
            {
                "type": "uint256",
                "name": "_sharesAmount"
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
        "name": "balanceOf",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_account"
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
        "name": "resumeStaking",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getFeeDistribution",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint16",
                "name": "treasuryFeeBasisPoints"
            },
            {
                "type": "uint16",
                "name": "insuranceFeeBasisPoints"
            },
            {
                "type": "uint16",
                "name": "operatorsFeeBasisPoints"
            }
        ]
    },
    {
        "type": "function",
        "name": "receiveWithdrawals",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getPooledEthByShares",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_sharesAmount"
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
        "name": "allowRecoverability",
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
        "name": "appId",
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
        "name": "getOracle",
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
        "name": "eip712Domain",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "string",
                "name": "name"
            },
            {
                "type": "string",
                "name": "version"
            },
            {
                "type": "uint256",
                "name": "chainId"
            },
            {
                "type": "address",
                "name": "verifyingContract"
            }
        ]
    },
    {
        "type": "function",
        "name": "getContractVersion",
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
        "name": "getInitializationBlock",
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
        "name": "transferShares",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_recipient"
            },
            {
                "type": "uint256",
                "name": "_sharesAmount"
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
        "name": "symbol",
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
        "name": "getEIP712StETH",
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
        "name": "transferToVault",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": ""
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "canPerform",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_sender"
            },
            {
                "type": "bytes32",
                "name": "_role"
            },
            {
                "type": "uint256[]",
                "name": "_params"
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
        "name": "submit",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "address",
                "name": "_referral"
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
        "name": "decreaseAllowance",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_spender"
            },
            {
                "type": "uint256",
                "name": "_subtractedValue"
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
        "name": "getEVMScriptRegistry",
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
        "name": "transfer",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_recipient"
            },
            {
                "type": "uint256",
                "name": "_amount"
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
        "name": "deposit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_maxDepositsCount"
            },
            {
                "type": "uint256",
                "name": "_stakingModuleId"
            },
            {
                "type": "bytes",
                "name": "_depositCalldata"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLE",
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
        "name": "getBeaconStat",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": "depositedValidators"
            },
            {
                "type": "uint256",
                "name": "beaconValidators"
            },
            {
                "type": "uint256",
                "name": "beaconBalance"
            }
        ]
    },
    {
        "type": "function",
        "name": "removeStakingLimit",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "handleOracleReport",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_reportTimestamp"
            },
            {
                "type": "uint256",
                "name": "_timeElapsed"
            },
            {
                "type": "uint256",
                "name": "_clValidators"
            },
            {
                "type": "uint256",
                "name": "_clBalance"
            },
            {
                "type": "uint256",
                "name": "_withdrawalVaultBalance"
            },
            {
                "type": "uint256",
                "name": "_elRewardsVaultBalance"
            },
            {
                "type": "uint256",
                "name": "_sharesRequestedToBurn"
            },
            {
                "type": "uint256[]",
                "name": "_withdrawalFinalizationBatches"
            },
            {
                "type": "uint256",
                "name": "_simulatedShareRate"
            }
        ],
        "outputs": [
            {
                "type": "uint256[4]",
                "name": "postRebaseAmounts"
            }
        ]
    },
    {
        "type": "function",
        "name": "getFee",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint16",
                "name": "totalFee"
            }
        ]
    },
    {
        "type": "function",
        "name": "kernel",
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
        "name": "getTotalShares",
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
        "name": "permit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_owner"
            },
            {
                "type": "address",
                "name": "_spender"
            },
            {
                "type": "uint256",
                "name": "_value"
            },
            {
                "type": "uint256",
                "name": "_deadline"
            },
            {
                "type": "uint8",
                "name": "_v"
            },
            {
                "type": "bytes32",
                "name": "_r"
            },
            {
                "type": "bytes32",
                "name": "_s"
            }
        ],
        "outputs": []
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
                "name": "_owner"
            },
            {
                "type": "address",
                "name": "_spender"
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
        "name": "isPetrified",
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
        "name": "getLidoLocator",
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
        "name": "canDeposit",
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
        "name": "STAKING_PAUSE_ROLE",
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
        "name": "getDepositableEther",
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
        "name": "sharesOf",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_account"
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
        "name": "pauseStaking",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getTotalELRewardsCollected",
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
        "type": "fallback",
        "stateMutability": "payable"
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "StakingPaused",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "StakingResumed",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "StakingLimitSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "maxStakeLimit",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "stakeLimitIncreasePerBlock",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "StakingLimitRemoved",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CLValidatorsUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "reportTimestamp",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "preCLValidators",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "postCLValidators",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "DepositedValidatorsChanged",
        "inputs": [
            {
                "type": "uint256",
                "name": "depositedValidators",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ETHDistributed",
        "inputs": [
            {
                "type": "uint256",
                "name": "reportTimestamp",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "preCLBalance",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "postCLBalance",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "withdrawalsWithdrawn",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "executionLayerRewardsWithdrawn",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "postBufferedEther",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TokenRebased",
        "inputs": [
            {
                "type": "uint256",
                "name": "reportTimestamp",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "timeElapsed",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "preTotalShares",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "preTotalEther",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "postTotalShares",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "postTotalEther",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "sharesMintedAsFees",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "LidoLocatorSet",
        "inputs": [
            {
                "type": "address",
                "name": "lidoLocator",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ELRewardsReceived",
        "inputs": [
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
        "name": "WithdrawalsReceived",
        "inputs": [
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
        "name": "Submitted",
        "inputs": [
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "address",
                "name": "referral",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Unbuffered",
        "inputs": [
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
        "name": "ScriptResult",
        "inputs": [
            {
                "type": "address",
                "name": "executor",
                "indexed": true
            },
            {
                "type": "bytes",
                "name": "script",
                "indexed": false
            },
            {
                "type": "bytes",
                "name": "input",
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
        "name": "RecoverToVault",
        "inputs": [
            {
                "type": "address",
                "name": "vault",
                "indexed": true
            },
            {
                "type": "address",
                "name": "token",
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
        "name": "EIP712StETHInitialized",
        "inputs": [
            {
                "type": "address",
                "name": "eip712StETH",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TransferShares",
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
                "name": "sharesValue",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SharesBurnt",
        "inputs": [
            {
                "type": "address",
                "name": "account",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "preRebaseTokenAmount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "postRebaseTokenAmount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "sharesAmount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Stopped",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Resumed",
        "inputs": []
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
        "name": "ContractVersionSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "version",
                "indexed": false
            }
        ]
    }
]
