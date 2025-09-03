```sql
with

origin_tokens AS (
  SELECT
    date_trunc('day', timestamp) AS day,
    total_supply / 1e18 AS supply,
    (total_supply - amo_supply) / 1e18 AS tvl,
    fees / 1e18 AS token_fees,
    rate_usd / NULLIF(rate_eth, 0) AS eth_usd,
    CASE '${rate_unit}' WHEN 'USD' THEN rate_usd / 1e18 ELSE rate_eth / 1e18 END AS rate_base,
    otoken AS token
  FROM o_token_daily_stat
  WHERE date_trunc('day', timestamp) > DATE '2021-07-26'
  AND $__timeFilter(timestamp)
),

strategy_balances AS (
  SELECT 
    date_trunc('day', timestamp) AS day,
    timestamp,
    otoken,
    strategy,
    balance / 1e18 AS balance,
    (balance / 1e18) / o.tvl AS balance_pct,
    token_fees
  FROM strategy_daily_yield s
  LEFT JOIN origin_tokens o ON date_trunc('day', s.timestamp) = o.day AND token = '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3' -- OETH
  WHERE strategy IN (
     '0x80c864704dd06c3693ed5179190786ee38acf835' -- Base
    ,'0x1e3edd5e019207d6355ea77f724b1f1bf639b569' -- Plume
  )
  AND $__timeFilter(timestamp)
),

arm_metrics AS (
  SELECT
    date_trunc('day', a.timestamp) AS day,
    e.symbol,
    a.address,
    CASE '${rate_unit}' WHEN 'USD' THEN (total_assets * rate_usd) / 1e18 ELSE (total_assets * rate_eth) / 1e18 END AS tvl_value,
    CASE '${rate_unit}' WHEN 'USD' THEN (fees * rate_usd) / 1e18 ELSE (fees * rate_eth) / 1e18 END AS total_fees
  FROM arm_daily_stat a
  LEFT JOIN erc20 e ON a.address = e.address
  WHERE $__timeFilter(timestamp)
),

arm_fees AS (
  SELECT
    day,
    MAX(CASE WHEN symbol = 'ARM-WETH-stETH' THEN total_fees ELSE 0 END) AS lido_arm,
    MAX(CASE WHEN symbol = 'ARM-WETH-stETH' THEN tvl_value ELSE 0 END) AS lido_arm_tvl,
    MAX(CASE WHEN symbol = 'ARM-WS-OS' THEN total_fees ELSE 0 END) AS os_arm,
    MAX(CASE WHEN symbol = 'ARM-WS-OS' THEN tvl_value ELSE 0 END) AS os_arm_tvl
  FROM arm_metrics
  GROUP BY day
),

oeth_attribution AS (
  SELECT
    day,
    SUM(CASE WHEN otoken = '0xdbfefd2e8460a6ee4955a68582f85708baea60a3' THEN balance_pct ELSE 0 END) AS pct_base,
    SUM(CASE WHEN otoken = '0xfcbe50dbe43bf7e5c88c6f6fb9ef432d4165406e' THEN balance_pct ELSE 0 END) AS pct_plume
  FROM strategy_balances
  GROUP BY day
),

token_metrics AS (
  SELECT
    t.day,
    t.token,
    e.symbol,
    eth_usd,
    rate_base * t.tvl AS tvl_value,
    rate_base * t.token_fees AS total_fees,
    -- Percentage attribution for fees
    CASE WHEN t.token = '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3' THEN t.token_fees * COALESCE(oa.pct_base, 0) ELSE 0 END AS super_base_fees,
    CASE WHEN t.token = '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3' THEN t.token_fees * COALESCE(oa.pct_plume, 0) ELSE 0 END AS super_plume_fees,
    -- Percentage attribution for TVL
    CASE WHEN t.token = '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3' THEN (rate_base * t.tvl) * COALESCE(oa.pct_base, 0) ELSE 0 END AS super_base_tvl,
	CASE WHEN t.token = '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3' THEN (rate_base * t.tvl) * COALESCE(oa.pct_plume, 0) ELSE 0 END AS super_plume_tvl
  FROM origin_tokens t
  LEFT JOIN erc20 e ON t.token = e.address
  LEFT JOIN oeth_attribution oa ON t.day = oa.day
),

data AS (
  SELECT
    t.day,
    AVG(eth_usd) AS eth_usd,
    -- ARMs
    COALESCE(a.lido_arm, 0) AS lido_arm,
    COALESCE(a.lido_arm_tvl, 0) AS lido_arm_tvl,
    COALESCE(a.os_arm, 0) AS os_arm,
    COALESCE(a.os_arm_tvl, 0) AS os_arm_tvl,
    
    -- TVLs
	COALESCE(SUM(t.tvl_value) FILTER (WHERE t.symbol = 'OUSD'), 0) AS ousd_tvl,
	COALESCE(SUM(t.tvl_value) FILTER (WHERE t.symbol = 'OS'), 0) AS os_tvl,
	
	-- Adjusted OETH TVL (removes double counting)
	COALESCE(SUM(t.tvl_value) FILTER (WHERE t.symbol = 'OETH'), 0)
	  - COALESCE(SUM(t.super_base_tvl), 0)
	  - COALESCE(SUM(t.super_plume_tvl), 0) AS oeth_tvl,
	
	COALESCE(SUM(t.tvl_value) FILTER (WHERE t.symbol = 'superOETHb'), 0) AS super_oeth_base_tvl,
	COALESCE(SUM(t.tvl_value) FILTER (WHERE t.symbol = 'superOETHp'), 0) AS super_oeth_plume_tvl,
    
    -- Tokens
    COALESCE(SUM(t.total_fees) FILTER (WHERE t.symbol = 'OUSD'), 0) AS ousd,
    COALESCE(SUM(t.total_fees) FILTER (WHERE t.symbol = 'OS'), 0) AS os,

    -- Adjusted OETH (after removing attributed fees)
    COALESCE(SUM(t.total_fees) FILTER (WHERE t.symbol = 'OETH'), 0)
      - COALESCE(SUM(t.super_base_fees), 0)
      - COALESCE(SUM(t.super_plume_fees), 0) AS oeth,

    -- Super tokens include both direct fees and attributed
    COALESCE(SUM(t.total_fees) FILTER (WHERE t.symbol = 'superOETHb'), 0)
      + COALESCE(SUM(t.super_base_fees), 0) AS super_oeth_base,

    COALESCE(SUM(t.total_fees) FILTER (WHERE t.symbol = 'superOETHp'), 0)
      + COALESCE(SUM(t.super_plume_fees), 0) AS super_oeth_plume

  FROM token_metrics t
  LEFT JOIN arm_fees a ON t.day = a.day
  GROUP BY t.day, a.lido_arm, a.lido_arm_tvl, a.os_arm, a.os_arm_tvl
),

query AS (
  SELECT
    *,
    AVG(total) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma_7d,
    AVG(total) OVER (ORDER BY day ROWS BETWEEN 29 PRECEDING AND CURRENT ROW) AS ma_30d,
    AVG(total_tvl) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma_7d_tvl,
    AVG(total_tvl) OVER (ORDER BY day ROWS BETWEEN 29 PRECEDING AND CURRENT ROW) AS ma_30d_tvl,
    CASE
      WHEN day >= to_timestamp(${__to} / 1000) - INTERVAL '30 day' THEN 'current'
      WHEN day >= to_timestamp(${__to} / 1000) - INTERVAL '60 day' THEN 'previous'
      ELSE 'other'
    END AS period
  FROM (
    SELECT 
      day,
      eth_usd,
      ousd,
      ousd_tvl,
      lido_arm,
      lido_arm_tvl,
      os_arm,
      os_arm_tvl,
      oeth,
      oeth_tvl,
      super_oeth_base,
      super_oeth_base_tvl,
      super_oeth_plume,
      super_oeth_plume_tvl,
      os,
      os_tvl,
      (ousd + lido_arm + os_arm + oeth + super_oeth_base + super_oeth_plume + os) as total,
      (ousd_tvl + lido_arm_tvl + os_arm_tvl + oeth_tvl + super_oeth_base_tvl + super_oeth_plume_tvl) as total_tvl
    FROM data
  ) sq
)

SELECT *
FROM query
WHERE '${rate_unit}' != ''
```