# Requirements

Catalog of data requirements.

## oeth.com

### ousd.com/ogv-dashboard

[schema-ogv.graphql](..%2Fschema-ogv.graphql)

- OGV Price (5m?)
- OGV Market Cap (5m?)
- OGV Circulating Supply
- OGV Total Supply
- OGV Staking APY
- OGV Amount Staked & Percentage
- OGV Registered Voters
- OGV Open-source contributors
- OGV Improvement proposals

## oeth.com/analytics

[schema-oeth.graphql](..%2Fschema-oeth.graphql)

- APY (as 7/14/30 day MA)
- Total Supply
    - OETH
    - Protocol Owned
    - Circulating Supply
- Daily Protocol Revenue (as 7/14/30 day MA)
    - ETH Value
    - 7-day trailing average (ETH)
    - Yield Distributed (ETH)
    - Fees Collected (ETH)
- Current Collateral
    - Frax ETH (frxETH)
    - ETH
    - Rocket Pool ETH (rETH)
    - Lido Staked ETH (stETH)
    - Wrapped Ether (WETH)
- ETH_OETH Rate
- Exchange Rates
- Collateral Distribution
    - Convex OETH
    - FraxETH
    - Origin Vault
    - Aura OETH
    - Morpho AAVE
- Revenue Sums
    - 24H
    - 7D
    - All-time
- Balance Sheet
    - Vault (WETH, stETH, rETH, frxETH)
    - Convex (ETH, OETH)
    - Frax Staking (sfrxETH)
    - Morpho Aave (WETH)
    - Aura (rETH, WETH)
    - Dripper (WETH)
    - Total Supply (OETH)
- Strategies
    - Convex Finance
        - Convex ETH+OETH
    - Frax
        - Staked Frax Ether (sfrxETH)
    - Rocket Pool
        - Rocket Pool Ether (rETH)
    - Lido
        - Lido Staked Ether (stETH)
    - Unallocated
        - Showing WETH and frxETH as of writing this.
- Dripper
    - Funds held by dripper
    - Available for collection
    - Drip rate (1d, 1h, 1m)

