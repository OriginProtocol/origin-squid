export const ABI_JSON = [
    {
        "type": "event",
        "anonymous": false,
        "name": "Transfer",
        "inputs": [
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            },
            {
                "type": "address",
                "name": "receiver",
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
        "name": "TokenExchange",
        "inputs": [
            {
                "type": "address",
                "name": "buyer",
                "indexed": true
            },
            {
                "type": "int128",
                "name": "sold_id",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "tokens_sold",
                "indexed": false
            },
            {
                "type": "int128",
                "name": "bought_id",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "tokens_bought",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AddLiquidity",
        "inputs": [
            {
                "type": "address",
                "name": "provider",
                "indexed": true
            },
            {
                "type": "uint256[2]",
                "name": "token_amounts"
            },
            {
                "type": "uint256[2]",
                "name": "fees"
            },
            {
                "type": "uint256",
                "name": "invariant",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "token_supply",
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
                "name": "provider",
                "indexed": true
            },
            {
                "type": "uint256[2]",
                "name": "token_amounts"
            },
            {
                "type": "uint256[2]",
                "name": "fees"
            },
            {
                "type": "uint256",
                "name": "token_supply",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RemoveLiquidityOne",
        "inputs": [
            {
                "type": "address",
                "name": "provider",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "token_amount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "coin_amount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "token_supply",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RemoveLiquidityImbalance",
        "inputs": [
            {
                "type": "address",
                "name": "provider",
                "indexed": true
            },
            {
                "type": "uint256[2]",
                "name": "token_amounts"
            },
            {
                "type": "uint256[2]",
                "name": "fees"
            },
            {
                "type": "uint256",
                "name": "invariant",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "token_supply",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RampA",
        "inputs": [
            {
                "type": "uint256",
                "name": "old_A",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "new_A",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "initial_time",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "future_time",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "StopRampA",
        "inputs": [
            {
                "type": "uint256",
                "name": "A",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "t",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CommitNewFee",
        "inputs": [
            {
                "type": "uint256",
                "name": "new_fee",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ApplyNewFee",
        "inputs": [
            {
                "type": "uint256",
                "name": "fee",
                "indexed": false
            }
        ]
    },
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": []
    },
    {
        "type": "function",
        "name": "initialize",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "string",
                "name": "_name"
            },
            {
                "type": "string",
                "name": "_symbol"
            },
            {
                "type": "address[4]",
                "name": "_coins"
            },
            {
                "type": "uint256[4]",
                "name": "_rate_multipliers"
            },
            {
                "type": "uint256",
                "name": "_A"
            },
            {
                "type": "uint256",
                "name": "_fee"
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
                "type": "uint256",
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
                "name": "_to"
            },
            {
                "type": "uint256",
                "name": "_value"
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
        "name": "transferFrom",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_from"
            },
            {
                "type": "address",
                "name": "_to"
            },
            {
                "type": "uint256",
                "name": "_value"
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
                "name": "_value"
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
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "last_price",
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
        "name": "ema_price",
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
        "name": "get_balances",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256[2]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "admin_fee",
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
        "name": "A",
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
        "name": "A_precise",
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
        "name": "get_p",
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
        "name": "price_oracle",
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
        "name": "get_virtual_price",
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
        "name": "calc_token_amount",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256[2]",
                "name": "_amounts"
            },
            {
                "type": "bool",
                "name": "_is_deposit"
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
        "name": "add_liquidity",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "uint256[2]",
                "name": "_amounts"
            },
            {
                "type": "uint256",
                "name": "_min_mint_amount"
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
        "name": "add_liquidity",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "uint256[2]",
                "name": "_amounts"
            },
            {
                "type": "uint256",
                "name": "_min_mint_amount"
            },
            {
                "type": "address",
                "name": "_receiver"
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
        "name": "get_dy",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "int128",
                "name": "i"
            },
            {
                "type": "int128",
                "name": "j"
            },
            {
                "type": "uint256",
                "name": "dx"
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
        "name": "exchange",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "int128",
                "name": "i"
            },
            {
                "type": "int128",
                "name": "j"
            },
            {
                "type": "uint256",
                "name": "_dx"
            },
            {
                "type": "uint256",
                "name": "_min_dy"
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
        "name": "exchange",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "int128",
                "name": "i"
            },
            {
                "type": "int128",
                "name": "j"
            },
            {
                "type": "uint256",
                "name": "_dx"
            },
            {
                "type": "uint256",
                "name": "_min_dy"
            },
            {
                "type": "address",
                "name": "_receiver"
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
        "name": "remove_liquidity",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_burn_amount"
            },
            {
                "type": "uint256[2]",
                "name": "_min_amounts"
            }
        ],
        "outputs": [
            {
                "type": "uint256[2]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "remove_liquidity",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_burn_amount"
            },
            {
                "type": "uint256[2]",
                "name": "_min_amounts"
            },
            {
                "type": "address",
                "name": "_receiver"
            }
        ],
        "outputs": [
            {
                "type": "uint256[2]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "remove_liquidity_imbalance",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256[2]",
                "name": "_amounts"
            },
            {
                "type": "uint256",
                "name": "_max_burn_amount"
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
        "name": "remove_liquidity_imbalance",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256[2]",
                "name": "_amounts"
            },
            {
                "type": "uint256",
                "name": "_max_burn_amount"
            },
            {
                "type": "address",
                "name": "_receiver"
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
        "name": "calc_withdraw_one_coin",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_burn_amount"
            },
            {
                "type": "int128",
                "name": "i"
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
        "name": "remove_liquidity_one_coin",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_burn_amount"
            },
            {
                "type": "int128",
                "name": "i"
            },
            {
                "type": "uint256",
                "name": "_min_received"
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
        "name": "remove_liquidity_one_coin",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_burn_amount"
            },
            {
                "type": "int128",
                "name": "i"
            },
            {
                "type": "uint256",
                "name": "_min_received"
            },
            {
                "type": "address",
                "name": "_receiver"
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
        "name": "ramp_A",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_future_A"
            },
            {
                "type": "uint256",
                "name": "_future_time"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "stop_ramp_A",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "admin_balances",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "i"
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
        "name": "withdraw_admin_fees",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "commit_new_fee",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_new_fee"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "apply_new_fee",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "set_ma_exp_time",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_ma_exp_time"
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
                "type": "string",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "coins",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "arg0"
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
        "name": "balances",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "arg0"
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
        "name": "future_fee",
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
        "name": "admin_action_deadline",
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
        "name": "initial_A",
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
        "name": "future_A",
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
        "name": "initial_A_time",
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
        "name": "future_A_time",
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
        "name": "name",
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
        "name": "symbol",
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
        "name": "balanceOf",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "arg0"
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
        "name": "allowance",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "arg0"
            },
            {
                "type": "address",
                "name": "arg1"
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
        "name": "nonces",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "arg0"
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
        "name": "ma_exp_time",
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
        "name": "ma_last_time",
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
