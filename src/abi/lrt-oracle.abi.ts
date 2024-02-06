export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": []
    },
    {
        "type": "error",
        "name": "AssetNotSupported",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CallerNotLRTConfigAdmin",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CallerNotLRTConfigManager",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ZeroAddressNotAllowed",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AssetPriceOracleUpdate",
        "inputs": [
            {
                "type": "address",
                "name": "asset",
                "indexed": true
            },
            {
                "type": "address",
                "name": "priceOracle",
                "indexed": true
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
        "name": "UpdatedLRTConfig",
        "inputs": [
            {
                "type": "address",
                "name": "lrtConfig",
                "indexed": true
            }
        ]
    },
    {
        "type": "function",
        "name": "assetPriceOracle",
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
                "type": "address",
                "name": "priceOracle"
            }
        ]
    },
    {
        "type": "function",
        "name": "getAssetPrice",
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
        "name": "initialize",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "lrtConfigAddr"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "lrtConfig",
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
        "name": "primeETHPrice",
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
        "name": "updateLRTConfig",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "lrtConfigAddr"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "updatePriceOracleFor",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            },
            {
                "type": "address",
                "name": "priceOracle"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "updatePrimeETHPrice",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": "price_"
            }
        ]
    }
]
