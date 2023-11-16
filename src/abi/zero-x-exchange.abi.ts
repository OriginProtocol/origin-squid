export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "weth"
            },
            {
                "type": "address",
                "name": "uniFactory"
            },
            {
                "type": "bytes32",
                "name": "poolInitCodeHash"
            }
        ]
    },
    {
        "type": "function",
        "name": "FEATURE_NAME",
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
        "name": "FEATURE_VERSION",
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
        "name": "_sellHeldTokenForTokenToUniswapV3",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "encodedPath"
            },
            {
                "type": "uint256",
                "name": "sellAmount"
            },
            {
                "type": "uint256",
                "name": "minBuyAmount"
            },
            {
                "type": "address",
                "name": "recipient"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "buyAmount"
            }
        ]
    },
    {
        "type": "function",
        "name": "_sellTokenForTokenToUniswapV3",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "encodedPath"
            },
            {
                "type": "uint256",
                "name": "sellAmount"
            },
            {
                "type": "uint256",
                "name": "minBuyAmount"
            },
            {
                "type": "address",
                "name": "recipient"
            },
            {
                "type": "address",
                "name": "payer"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "buyAmount"
            }
        ]
    },
    {
        "type": "function",
        "name": "migrate",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes4",
                "name": "success"
            }
        ]
    },
    {
        "type": "function",
        "name": "sellEthForTokenToUniswapV3",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "bytes",
                "name": "encodedPath"
            },
            {
                "type": "uint256",
                "name": "minBuyAmount"
            },
            {
                "type": "address",
                "name": "recipient"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "buyAmount"
            }
        ]
    },
    {
        "type": "function",
        "name": "sellTokenForEthToUniswapV3",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "encodedPath"
            },
            {
                "type": "uint256",
                "name": "sellAmount"
            },
            {
                "type": "uint256",
                "name": "minBuyAmount"
            },
            {
                "type": "address",
                "name": "recipient"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "buyAmount"
            }
        ]
    },
    {
        "type": "function",
        "name": "sellTokenForTokenToUniswapV3",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "encodedPath"
            },
            {
                "type": "uint256",
                "name": "sellAmount"
            },
            {
                "type": "uint256",
                "name": "minBuyAmount"
            },
            {
                "type": "address",
                "name": "recipient"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "buyAmount"
            }
        ]
    },
    {
        "type": "function",
        "name": "uniswapV3SwapCallback",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "int256",
                "name": "amount0Delta"
            },
            {
                "type": "int256",
                "name": "amount1Delta"
            },
            {
                "type": "bytes",
                "name": "data"
            }
        ],
        "outputs": []
    }
]
