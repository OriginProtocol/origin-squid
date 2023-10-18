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

## [prometheus-monitoring](https://github.com/oplabs/prometheus-monitoring)

### [Metrics](https://github.com/oplabs/prometheus-monitoring/blob/2ef3f67ccd88a965c67553457a265b9853c57b33/lambda-scrapers/exporters/src/utils/prometheus.js)

#### total_supply

Track total supply for **OUSD** ✅, **OGV** ⚠️, and **OETH** ✅.

#### vault

Vault price metrics for: `["USDC", "USDT", "DAI"]` ⚠️

- `vault.priceUnitMint(assetAddress)`
- `vault.priceUnitRedeem(assetAddress)`

Vault holdings (`balanceOf`) for: ✅

- OUSD: `["USDC", "USDT", "DAI"]`
- OETH: `["WETH", "stETH", "rETH", "frxETH"]`

#### strategies

OUSD Holdings: `["USDC", "USDT", "DAI"]`

- ✅ [ousd](..%2Fsrc%2Fprocessors%2Fousd) (vault holdings)

TODO: ⚠️

- Compound
- Aave
- Convex
- MorphoCompound
- MorphoAave
- OUSDMeta
- LUSDMeta

OETH Holdings: `["frxETH", "rETH", "stETH", "WETH"]`

- ✅ [oeth](..%2Fsrc%2Fprocessors%2Foeth) (vault holdings)

TODO: ⚠️

- FraxETH
- CurveAMO

#### threePool ✅ [curve](..%2Fsrc%2Fprocessors%2Fcurve)

Assets: `["USDC", "USDT", "DAI"]`

```javascript
const threepoolCoinIndexMap = {
  DAI: 0,
  USDC: 1,
  USDT: 2,
};

contracts.ThreePool

contract.balances(threepoolCoinIndexMap[asset])
```

#### metapools ✅ [curve](..%2Fsrc%2Fprocessors%2Fcurve)

- `curveMetapoolBalanceMetric`
    - addresses.OUSDMetapool: 0xed279fdd11ca84beef15af5d39bb4d4bee23f0ca
        - OUSD: `main_coin_balance = await poolContract.balances(0)`
        - ThreePoolLP: `three_crv_balance = await poolContract.balances(1)`
    - addresses.LUSDMetapool: 0xed279fdd11ca84beef15af5d39bb4d4bee23f0ca
        - LUSD: `main_coin_balance = await poolContract.balances(0)`
        - ThreePoolLP: `three_crv_balance = await poolContract.balances(1)`
- `balancerPoolMetric`
    - Here we save the **rate** and **balance** for each pool.
        - If an asset doesn't have a rate provider (zero address) default to 1e18 as suggested by
          Balancer: https://docs.balancer.fi/reference/contracts/rate-providers.html
        - rETH_sfrxETH_wstETH
            - balancerPoolId: 0x42ed016f826165c2e5976fe5bc3df540c5ad0af700000000000000000000058b
            - poolAddress: 0x42ED016F826165C2e5976fe5bC3df540C5aD0Af7
    - rETH_WETH
        - balancerPoolId: 0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112
        - poolAddress: 0x1E19CF2D73a72Ef1332C882F20534B6519Be0276

```javascript
const [tokens, balances] = await balancerVault.getPoolTokens(poolId);
const rateProviders = await getBalancerPoolRateProviders(poolAddress);
rateProvider.getRate()
const balancerMetaStablePoolABI = [
  "function getRateProviders() external view returns (address[])",
];
```

#### oeth ✅ [curve](..%2Fsrc%2Fprocessors%2Fcurve)

- curvePoolBalanceMetric: `poolContract.balances(0) or poolContract.balances(1)`
    - EthFrxEthPool: "0xa1f8a6807c402e4a15ef4eba36528a3fed24e577" - ETH frxETH
    - REthEthPool: "0x0f3159811670c117c372428d4e69ac32325e4d0f" - ETH stETH
    - EthStEthPool: "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022" - rETH ETH
    - WEthStEthPool: "0x828b154032950c8ff7cf8085d841723db2696056" - WETH stETH
    - OEthEthPool: "0x94B17476A93b3262d87B9a326965D1E91f9c13E7" - OETH ETH

#### aave_comp_platforms ✅ [aave-compound](..%2Fsrc%2Fprocessors%2Faave-compound)

- AaveCompoundBorrowableMetric:  `"USDC", "USDT", "DAI"`
    - For each of the below:

```javascript
balance = await assetContract.balanceOf(address)
```

`assetContract` being USDC, USDT, or DAI
balanceOf `address` from the map below.

```javascript
const aaveAssetToPlatformMap = {
  USDT: { // 0xdac17f958d2ee523a2206206994597c13d831ec7
    token: "aUSDT",
    address: addresses.aUSDT, // 0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811
  },
  USDC: { // 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
    token: "aUSDC",
    address: addresses.aUSDC, // 0xBcca60bB61934080951369a648Fb03DF4F96263C
  },
  DAI: { // 0x6b175474e89094c44da98b954eedeac495271d0f
    token: "aDAI",
    address: addresses.aDAI, // 0x028171bca77440897b824ca71d1c56cac55b68a3
  },
};
```

#### rebasing_credits

- ✅ OETH [oeth](..%2Fsrc%2Fprocessors%2Foeth)
    - This is done for OETH in Subsquid.
- ✅⚠️ OUSD [ousd](..%2Fsrc%2Fprocessors%2Fousd)
    - A virtually identical implementation should work for OUSD.
    - TODO items exist

For each of the above:

- `rebasingCreditsPerTokenMetric`
    - `event TotalSupplyUpdatedHighres(uint256 totalSupply, uint256 rebasingCredits, uint256 rebasingCreditsPerToken)`
- `rebasingCreditsMetric`
    - `function rebasingCredits() external view returns (uint256)`
- `nonRebasingSupplyMetric`
    - `function nonRebasingSupply() external view returns (uint256)`

##### Ramblings

- AaveCompoundBorrowableMetric
    - TRACK ERC20 BALANCES
        - Is this as simple as tracking transfers or do some of these receive balance in other ways? (magical rebasing,
          etc...)
    - cUSDT: "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9"
    - cUSDC: "0x39aa39c021dfbae8fac545936693ac917d5e7563"
    - cDAI: "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643"
    - aUSDT: "0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811"
    - aUSDC: "0xBcca60bB61934080951369a648Fb03DF4F96263C"
    - aDAI: "0x028171bca77440897b824ca71d1c56cac55b68a3"
- balancerPoolMetric
    - balancer vault `getPoolTokens(poolId)` data
    -
- curveMetapoolBalanceMetric
- curvePoolBalanceMetric
- nonRebasingSupplyMetric
- rebasingCreditsMetric
- rebasingCreditsPerTokenMetric
- strategyHoldingMetric
- threepoolBalanceMetric
- totalSupplyMetric
- vaultHoldingMetric
- vaultUSDPriceMetric