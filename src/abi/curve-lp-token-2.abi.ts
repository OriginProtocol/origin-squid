export const ABI_JSON = [
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
                "type": "uint256",
                "name": "sold_id",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "tokens_sold",
                "indexed": false
            },
            {
                "type": "uint256",
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
                "type": "uint256",
                "name": "fee",
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
                "name": "coin_index",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "coin_amount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CommitNewParameters",
        "inputs": [
            {
                "type": "uint256",
                "name": "deadline",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "admin_fee",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "mid_fee",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "out_fee",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "fee_gamma",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "allowed_extra_profit",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "adjustment_step",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "ma_half_time",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewParameters",
        "inputs": [
            {
                "type": "uint256",
                "name": "admin_fee",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "mid_fee",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "out_fee",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "fee_gamma",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "allowed_extra_profit",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "adjustment_step",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "ma_half_time",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RampAgamma",
        "inputs": [
            {
                "type": "uint256",
                "name": "initial_A",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "future_A",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "initial_gamma",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "future_gamma",
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
                "name": "current_A",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "current_gamma",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "time",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ClaimAdminFee",
        "inputs": [
            {
                "type": "address",
                "name": "admin",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokens",
                "indexed": false
            }
        ]
    },
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_weth"
            }
        ]
    },
    {
        "type": "fallback",
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "exchange",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "uint256",
                "name": "i"
            },
            {
                "type": "uint256",
                "name": "j"
            },
            {
                "type": "uint256",
                "name": "dx"
            },
            {
                "type": "uint256",
                "name": "min_dy"
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
                "type": "uint256",
                "name": "i"
            },
            {
                "type": "uint256",
                "name": "j"
            },
            {
                "type": "uint256",
                "name": "dx"
            },
            {
                "type": "uint256",
                "name": "min_dy"
            },
            {
                "type": "bool",
                "name": "use_eth"
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
                "type": "uint256",
                "name": "i"
            },
            {
                "type": "uint256",
                "name": "j"
            },
            {
                "type": "uint256",
                "name": "dx"
            },
            {
                "type": "uint256",
                "name": "min_dy"
            },
            {
                "type": "bool",
                "name": "use_eth"
            },
            {
                "type": "address",
                "name": "receiver"
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
        "name": "exchange_underlying",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "uint256",
                "name": "i"
            },
            {
                "type": "uint256",
                "name": "j"
            },
            {
                "type": "uint256",
                "name": "dx"
            },
            {
                "type": "uint256",
                "name": "min_dy"
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
        "name": "exchange_underlying",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "uint256",
                "name": "i"
            },
            {
                "type": "uint256",
                "name": "j"
            },
            {
                "type": "uint256",
                "name": "dx"
            },
            {
                "type": "uint256",
                "name": "min_dy"
            },
            {
                "type": "address",
                "name": "receiver"
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
        "name": "exchange_extended",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "uint256",
                "name": "i"
            },
            {
                "type": "uint256",
                "name": "j"
            },
            {
                "type": "uint256",
                "name": "dx"
            },
            {
                "type": "uint256",
                "name": "min_dy"
            },
            {
                "type": "bool",
                "name": "use_eth"
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
                "type": "bytes32",
                "name": "cb"
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
                "name": "amounts"
            },
            {
                "type": "uint256",
                "name": "min_mint_amount"
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
                "name": "amounts"
            },
            {
                "type": "uint256",
                "name": "min_mint_amount"
            },
            {
                "type": "bool",
                "name": "use_eth"
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
                "name": "amounts"
            },
            {
                "type": "uint256",
                "name": "min_mint_amount"
            },
            {
                "type": "bool",
                "name": "use_eth"
            },
            {
                "type": "address",
                "name": "receiver"
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
                "name": "_amount"
            },
            {
                "type": "uint256[2]",
                "name": "min_amounts"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "remove_liquidity",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_amount"
            },
            {
                "type": "uint256[2]",
                "name": "min_amounts"
            },
            {
                "type": "bool",
                "name": "use_eth"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "remove_liquidity",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_amount"
            },
            {
                "type": "uint256[2]",
                "name": "min_amounts"
            },
            {
                "type": "bool",
                "name": "use_eth"
            },
            {
                "type": "address",
                "name": "receiver"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "remove_liquidity_one_coin",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "token_amount"
            },
            {
                "type": "uint256",
                "name": "i"
            },
            {
                "type": "uint256",
                "name": "min_amount"
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
                "name": "token_amount"
            },
            {
                "type": "uint256",
                "name": "i"
            },
            {
                "type": "uint256",
                "name": "min_amount"
            },
            {
                "type": "bool",
                "name": "use_eth"
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
                "name": "token_amount"
            },
            {
                "type": "uint256",
                "name": "i"
            },
            {
                "type": "uint256",
                "name": "min_amount"
            },
            {
                "type": "bool",
                "name": "use_eth"
            },
            {
                "type": "address",
                "name": "receiver"
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
        "name": "claim_admin_fees",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "ramp_A_gamma",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "future_A"
            },
            {
                "type": "uint256",
                "name": "future_gamma"
            },
            {
                "type": "uint256",
                "name": "future_time"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "stop_ramp_A_gamma",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "commit_new_parameters",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_new_mid_fee"
            },
            {
                "type": "uint256",
                "name": "_new_out_fee"
            },
            {
                "type": "uint256",
                "name": "_new_admin_fee"
            },
            {
                "type": "uint256",
                "name": "_new_fee_gamma"
            },
            {
                "type": "uint256",
                "name": "_new_allowed_extra_profit"
            },
            {
                "type": "uint256",
                "name": "_new_adjustment_step"
            },
            {
                "type": "uint256",
                "name": "_new_ma_half_time"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "apply_new_parameters",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "revert_new_parameters",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "get_dy",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "i"
            },
            {
                "type": "uint256",
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
        "name": "calc_token_amount",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256[2]",
                "name": "amounts"
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
                "name": "token_amount"
            },
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
        "name": "lp_price",
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
        "name": "gamma",
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
        "name": "initialize",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "A"
            },
            {
                "type": "uint256",
                "name": "gamma"
            },
            {
                "type": "uint256",
                "name": "mid_fee"
            },
            {
                "type": "uint256",
                "name": "out_fee"
            },
            {
                "type": "uint256",
                "name": "allowed_extra_profit"
            },
            {
                "type": "uint256",
                "name": "fee_gamma"
            },
            {
                "type": "uint256",
                "name": "adjustment_step"
            },
            {
                "type": "uint256",
                "name": "admin_fee"
            },
            {
                "type": "uint256",
                "name": "ma_half_time"
            },
            {
                "type": "uint256",
                "name": "initial_price"
            },
            {
                "type": "address",
                "name": "_token"
            },
            {
                "type": "address[2]",
                "name": "_coins"
            },
            {
                "type": "uint256",
                "name": "_precisions"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "token",
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
        "name": "price_scale",
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
        "name": "last_prices",
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
        "name": "last_prices_timestamp",
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
        "name": "initial_A_gamma",
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
        "name": "future_A_gamma",
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
        "name": "initial_A_gamma_time",
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
        "name": "future_A_gamma_time",
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
        "name": "allowed_extra_profit",
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
        "name": "future_allowed_extra_profit",
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
        "name": "fee_gamma",
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
        "name": "future_fee_gamma",
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
        "name": "adjustment_step",
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
        "name": "future_adjustment_step",
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
        "name": "ma_half_time",
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
        "name": "future_ma_half_time",
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
        "name": "mid_fee",
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
        "name": "out_fee",
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
        "name": "future_mid_fee",
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
        "name": "future_out_fee",
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
        "name": "future_admin_fee",
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
        "name": "D",
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
        "name": "factory",
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
        "name": "xcp_profit",
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
        "name": "xcp_profit_a",
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
        "name": "virtual_price",
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
        "name": "admin_actions_deadline",
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
