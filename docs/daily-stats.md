# Daily Stats type

This type should be able to handle most of the charts and stats for oeth.com.
Stats for today would be kept up to date in real time.

## Definition

```graphql
dailyStats {
  id: ID!              """Timestamp, eg 2023-10-17"""
  blockNumber: Int!    """Last block number stats were updated"""
  timestamp: DateTime! """Timestamp of block number stats were updated"""

  apr: Float!
  apy: Float!
  apy7DayAvg: Float!
  apy14DayAvg: Float!
  apy30DayAvg: Float!

  totalSupply: BigInt!
  totalSupplyUSD: Float!
  rebasingSupply: BigInt!
  nonRebasingSupply: BigInt!
  amoSupply: BigInt!

  yield: BigInt!
  fees: BigInt!
  revenue: BigInt!
  revenue7DayAvg: BigInt!
  revenue7DayTotal: BigInt!
  revenueAllTime: BigInt!

  pegPrice: BigInt! """Price of OETH in ETH"""

  strategies {
    id: String!
    name: String!
    address: String!  """Contract address of the strategy"""
    total: BigInt!    """Sum of tokens in strategy"""
    tvl: BigInt!      """Total ETH value"""
    holdings {
      symbol: String! """Token symbol"""
      amount: BigInt! """Amount held"""
      value: BigInt!  """Total ETH value"""
    }
  }

  collateral {
    symbol: String! """Token symbol"""
    amount: BigInt! """Amount held"""
    price: BigInt!  """Price in ETH"""
    value: BigInt!  """Total ETH value"""
  }
}
```

## Example response

```json
{
  "dailyStats": [
    {
      "id": "2023-10-17",
      "blockNumber": 18361379,
      "timestamp": "2023-10-16T07:15:11.000Z",

      "apr": 0.14973706558715433,
      "apy": 0.16144112845098268,
      "apy7DayAvg": 0.12818496009582647,
      "apy14DayAvg": 0.12818496009582647,
      "apy30DayAvg": 0.12818496009582647,

      "totalSupply": "40087773441569861381365",
      "totalSupplyUSD": 63231.0153,
      "rebasingSupply": "25361442351482631876504",
      "nonRebasingSupply": "14726331090087229504861",
      "amoSupply": "10070572720887441843875",

      "yield": "3247579150222815340",
      "fees": "811894787555703834",
      "revenue": "811894787555703834",
      "revenue7DayAvg": "811894787555703834",
      "revenue7DayTotal": "811894787555703834",
      "revenueAllTime": "811894787555703834",

      "pegPrice": "1001212340964123876",

      "strategies": [
        {
          "id": "frax_eth_strat",
          "name": "FraxETH",
          "address": "0x3ff8654d633d4ea0fae24c52aec73b4a20d0d0e5",
          "total": "14874775157977805",
          "tvl": "14874775157977805",
          "holdings": [
            {
              "symbol": "FRXETH",
              "amount": "14874775157977805",
              "value": "14874775157977805"
            }
          ]
        }
      ],

      "collateral": [
        {
          "name": "ETH",
          "total": "90660812201004131466148",
          "price": "1000000000000000000",
          "value": "90660812201004131466148"
        },
        {
          "name": "WETH",
          "total": "618599415045049672320",
          "price": "1000000000000000000",
          "value": "618599415045049672320"
        },
        {
          "name": "FRXETH",
          "total": "14874776250683471078445",
          "price": "1000000000000000000",
          "value": "14874776250683471078445"
        },
        {
          "name": "RETH",
          "total": "3872976488796949771439",
          "price": "1087282384391932999",
          "value": "4211019111433044129729"
        }
      ]
    }
  ]
}

```