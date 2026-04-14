import { Context, defineProcessor } from '@originprotocol/squid-utils'
import { armProducts, otokenProducts } from '@utils/products'

const startDate = '2022-01-01'
const allProducts = [...otokenProducts, ...armProducts]

const productIdCaseSql = (column: string) => {
  return `
    CASE ${column}
      ${allProducts.map((product) => `WHEN '${product.product}' THEN '${product.productId}'`).join('\n      ')}
      ELSE '0:UNKNOWN'
    END
  `
}

const ethUsdByDayCteSql = (fromDate: string) => `
  eth_usd_by_day AS (
    SELECT
      d.date,
      COALESCE((
        SELECT rate
        FROM exchange_rate er
        WHERE er.pair = 'OETH_USD'
          AND er.chain_id = 1
          AND er.timestamp <= (d.date::date + interval '1 day')::timestamp
        ORDER BY er.timestamp DESC
        LIMIT 1
      ), 0) as rate_usd
    FROM (SELECT DISTINCT date FROM protocol_daily_stat_detail WHERE date >= '${fromDate}') d
  )
`

export const protocolSqlSimpleProcessor = defineProcessor({
  name: 'protocol-sql-simple',
  from: 15000000,
  setup: (processor) => {
    processor.includeAllBlocks({ from: 15000000 })
  },
  process: async (ctx: Context) => {
    // Update at head once every ~10 minutes.
    if (ctx.isHead && ctx.blocks.find((b) => b.header.height % 50 === 0)) {
      const minDate = startDate
      await upsertProtocolDailyStatDetails(ctx, minDate)
      await upsertProtocolDailyStats(ctx, minDate)
      await upsertProtocolDailyRevenue(ctx, minDate)
      await upsertProtocolDailyTvl(ctx, minDate)
      await upsertProtocolDailyTokenSupply(ctx, minDate)
    }
  },
})

const upsertProtocolDailyStatDetails = async (ctx: Context, fromDate: string) => {
  const runner = (ctx.store as any).em().queryRunner as {
    query: (sql: string) => Promise<any>
  }

  // Step 1: Create basic stats for all otokens (without inheritance calculations)
  for (const product of otokenProducts) {
    const sql = `
      INSERT INTO protocol_daily_stat_detail (
        id, date, product_id, product, timestamp, rate_usd, earning_tvl, tvl, supply, yield, revenue, apy,
        inherited_tvl, inherited_yield, inherited_revenue, bridged_tvl
      )
      SELECT 
        o.date || '-${product.product}' as id,
        o.date,
        '${product.productId}' as product_id,
        '${product.product}' as product,
        (o.date::date + interval '1 day' - interval '1 second')::timestamp as timestamp,
        COALESCE(o.rate_usd, 0) as rate_usd,
        COALESCE(o.rebasing_supply * o.rate_eth / 1e18, 0) as earning_tvl,
        COALESCE((o.total_supply - COALESCE(o.amo_supply, 0)) * o.rate_eth / 1e18, 0) as tvl,
        COALESCE(o.total_supply * o.rate_eth / 1e18, 0) as supply,
        COALESCE((o.yield + o.fees) * o.rate_eth / 1e18, 0) as yield,
        COALESCE(o.fees * o.rate_eth / 1e18, 0) as revenue,
        COALESCE(o.apy, 0) as apy,
        0 as inherited_tvl,
        0 as inherited_yield, 
        0 as inherited_revenue,
        0 as bridged_tvl
      FROM o_token_daily_stat o 
      WHERE o.otoken = '${product.otokenAddress}' 
        AND o.date >= '${fromDate}'
      ON CONFLICT (id) DO UPDATE SET
        timestamp = EXCLUDED.timestamp,
        product_id = EXCLUDED.product_id,
        rate_usd = EXCLUDED.rate_usd,
        earning_tvl = EXCLUDED.earning_tvl,
        tvl = EXCLUDED.tvl,
        supply = EXCLUDED.supply,
        yield = EXCLUDED.yield,
        revenue = EXCLUDED.revenue,
        apy = EXCLUDED.apy;
    `
    await runner.query(sql)
  }

  // Step 2: Create basic stats for all ARM products
  for (const product of armProducts) {
    const sql = `
      INSERT INTO protocol_daily_stat_detail (
        id, date, product_id, product, timestamp, rate_usd, earning_tvl, tvl, supply, yield, revenue, apy,
        inherited_tvl, inherited_yield, inherited_revenue, bridged_tvl
      )
      SELECT 
        a.date || '-${product.product}' as id,
        a.date,
        '${product.productId}' as product_id,
        '${product.product}' as product,
        (a.date::date + interval '1 day' - interval '1 second')::timestamp as timestamp,
        COALESCE(ROUND(a.rate_usd * 1e18), 0) as rate_usd,
        COALESCE(a.total_assets * a.rate_eth, 0) as earning_tvl,
        COALESCE(a.total_assets * a.rate_eth, 0) as tvl,
        COALESCE(a.total_supply * a.rate_eth, 0) as supply,
        COALESCE((a.yield + a.fees) * a.rate_eth, 0) as yield,
        COALESCE(a.fees * a.rate_eth, 0) as revenue,
        COALESCE(a.apy, 0) as apy,
        0 as inherited_tvl,
        0 as inherited_yield,
        0 as inherited_revenue,
        0 as bridged_tvl
      FROM arm_daily_stat a 
      WHERE a.address = '${product.armAddress}' 
        AND a.date >= '${fromDate}'
      ON CONFLICT (id) DO UPDATE SET
        timestamp = EXCLUDED.timestamp,
        product_id = EXCLUDED.product_id,
        rate_usd = EXCLUDED.rate_usd,
        earning_tvl = EXCLUDED.earning_tvl,
        tvl = EXCLUDED.tvl,
        supply = EXCLUDED.supply,
        yield = EXCLUDED.yield,
        revenue = EXCLUDED.revenue,
        apy = EXCLUDED.apy;
    `
    await runner.query(sql)
  }

  // Step 3: Calculate bridged TVL for super tokens
  // Using LATERAL join for efficiency - finds latest balance at or before end of each day
  await runner.query(`
    UPDATE protocol_daily_stat_detail p
    SET bridged_tvl = COALESCE(latest.balance_eth, 0)
    FROM (
      SELECT p2.date, sb.balance_eth
      FROM protocol_daily_stat_detail p2
      LEFT JOIN LATERAL (
        SELECT balance_eth
        FROM strategy_balance
        WHERE strategy = '0x80c864704dd06c3693ed5179190786ee38acf835'
          AND timestamp <= (p2.date::date + interval '1 day')::timestamp
        ORDER BY timestamp DESC
        LIMIT 1
      ) sb ON true
      WHERE p2.product = 'superOETHb' AND p2.date >= '${fromDate}'
    ) latest
    WHERE p.product = 'superOETHb'
      AND p.date = latest.date
      AND p.date >= '${fromDate}';
  `)

  await runner.query(`
    UPDATE protocol_daily_stat_detail p
    SET bridged_tvl = COALESCE(latest.balance_eth, 0)
    FROM (
      SELECT p2.date, sb.balance_eth
      FROM protocol_daily_stat_detail p2
      LEFT JOIN LATERAL (
        SELECT balance_eth
        FROM strategy_balance
        WHERE strategy = '0x1e3edd5e019207d6355ea77f724b1f1bf639b569'
          AND timestamp <= (p2.date::date + interval '1 day')::timestamp
        ORDER BY timestamp DESC
        LIMIT 1
      ) sb ON true
      WHERE p2.product = 'superOETHp' AND p2.date >= '${fromDate}'
    ) latest
    WHERE p.product = 'superOETHp'
      AND p.date = latest.date
      AND p.date >= '${fromDate}';
  `)

  // Step 4: Calculate OETH inherited stats (sum of super token bridged TVL)
  await runner.query(`
    UPDATE protocol_daily_stat_detail 
    SET 
      inherited_tvl = COALESCE((
        SELECT SUM(p2.bridged_tvl) 
        FROM protocol_daily_stat_detail p2 
        WHERE p2.product IN ('superOETHb', 'superOETHp') 
        AND p2.date = protocol_daily_stat_detail.date
      ), 0)
    WHERE product = 'OETH' AND date >= '${fromDate}';
  `)

  // Step 5: Calculate proportional yield/revenue for super tokens
  await runner.query(`
    UPDATE protocol_daily_stat_detail 
    SET 
      yield = protocol_daily_stat_detail.yield + CASE 
        WHEN protocol_daily_stat_detail.bridged_tvl > 0 AND oeth.tvl > 0 THEN 
          (oeth.yield * protocol_daily_stat_detail.bridged_tvl / oeth.tvl)
        ELSE 0 
      END,
      revenue = protocol_daily_stat_detail.revenue +CASE 
        WHEN protocol_daily_stat_detail.bridged_tvl > 0 AND oeth.tvl > 0 THEN 
          (oeth.revenue * protocol_daily_stat_detail.bridged_tvl / oeth.tvl)
        ELSE 0 
      END
    FROM protocol_daily_stat_detail oeth
    WHERE protocol_daily_stat_detail.product IN ('superOETHb', 'superOETHp')
      AND oeth.product = 'OETH' 
      AND oeth.date = protocol_daily_stat_detail.date
      AND protocol_daily_stat_detail.date >= '${fromDate}';
  `)

  // Step 6: Calculate OETH inherited yield/revenue (what was transferred out)
  await runner.query(`
    UPDATE protocol_daily_stat_detail 
    SET 
      inherited_yield = CASE WHEN tvl > 0 THEN 
        (yield * inherited_tvl / tvl)
      ELSE 0 
      END,
      inherited_revenue = CASE WHEN tvl > 0 THEN 
        (revenue * inherited_tvl / tvl)
      ELSE 0 
      END
    WHERE product = 'OETH' AND date >= '${fromDate}';
  `)
}

const upsertProtocolDailyStats = async (ctx: Context, fromDate: string) => {
  const runner = (ctx.store as any).em().queryRunner as {
    query: (sql: string) => Promise<any>
  }

  const sql = `
    INSERT INTO protocol_daily_stat (
      id, date, timestamp, rate_usd, supply, earning_tvl, tvl, yield, revenue, apy, meta
    )
    SELECT 
      date as id,
      date,
      (date::date + interval '1 day' - interval '1 second')::timestamp as timestamp,
      
      -- Get ETH/USD rate
      COALESCE((
        SELECT rate
        FROM exchange_rate 
        WHERE pair = 'OETH_USD' -- use OETH/USD which is same as ETH/USD but has end-of-day resolution
        AND chain_id = 1
        AND timestamp <= (date::date + interval '1 day')::timestamp
        ORDER BY timestamp DESC 
        LIMIT 1
      ), 0) as rate_usd,
      
      SUM(supply) as supply,
      SUM(earning_tvl - inherited_tvl) as earning_tvl,
      SUM(tvl - inherited_tvl) as tvl,
      SUM(yield - inherited_yield) as yield,
      SUM(revenue - inherited_revenue) as revenue,
      
      -- Calculate APY: (yield - revenue) / earning_tvl * 365
      CASE 
        WHEN SUM(earning_tvl) > 0 THEN 
          ((SUM(yield) - SUM(revenue))::numeric / SUM(earning_tvl)::numeric * 365)::real
        ELSE 0 
      END as apy,
      '{}' as meta
      
    FROM protocol_daily_stat_detail 
    WHERE date >= '${fromDate}'
    GROUP BY date
    
    ON CONFLICT (id) DO UPDATE SET
      timestamp = EXCLUDED.timestamp,
      rate_usd = EXCLUDED.rate_usd,
      supply = EXCLUDED.supply,
      earning_tvl = EXCLUDED.earning_tvl,
      tvl = EXCLUDED.tvl,
      yield = EXCLUDED.yield,
      revenue = EXCLUDED.revenue,
      apy = EXCLUDED.apy,
      meta = EXCLUDED.meta;
  `

  await runner.query(sql)
}

const upsertProtocolDailyRevenue = async (ctx: Context, fromDate: string) => {
  const runner = (ctx.store as any).em().queryRunner as {
    query: (sql: string) => Promise<any>
  }

  const productIdSql = productIdCaseSql('d.product')
  const productIdsValuesSql = allProducts.map((product) => `('${product.productId}')`).join(',\n        ')
  const sql = `
    WITH ${ethUsdByDayCteSql(fromDate)},
    product_data AS (
      SELECT
        d.date,
        ${productIdSql} as product_id,
        d.product,
        (d.yield - d.inherited_yield) as total_eth,
        ((d.yield - d.inherited_yield) * e.rate_usd / 1e18) as total_usd
      FROM protocol_daily_stat_detail d
      INNER JOIN eth_usd_by_day e ON e.date = d.date
      WHERE d.date >= '${fromDate}'
    ),
    product_catalog AS (
      SELECT product_id
      FROM (VALUES
        ${productIdsValuesSql}
      ) AS products(product_id)
    ),
    dates AS (
      SELECT DISTINCT date
      FROM product_data
    ),
    daily_totals AS (
      SELECT
        p.date,
        (p.date::date + interval '1 day' - interval '1 second')::timestamp as timestamp,
        SUM(p.total_eth) as total_eth,
        SUM(p.total_usd) as total_usd
      FROM product_data p
      GROUP BY p.date
    ),
    split_data AS (
      SELECT
        d.date,
        c.product_id,
        COALESCE(p.total_eth, 0) as total_eth,
        COALESCE(p.total_usd, 0) as total_usd
      FROM dates d
      CROSS JOIN product_catalog c
      LEFT JOIN product_data p ON p.date = d.date AND p.product_id = c.product_id
    ),
    daily_data AS (
      SELECT
        t.date,
        t.timestamp,
        t.total_eth,
        t.total_usd,
        jsonb_agg(
          jsonb_build_object(
            'productId', s.product_id,
            'totalEth', ROUND(s.total_eth)::text,
            'totalUsd', ROUND(s.total_usd)::text
          )
          ORDER BY s.product_id
        ) as split
      FROM daily_totals t
      INNER JOIN split_data s ON s.date = t.date
      GROUP BY t.date, t.timestamp, t.total_eth, t.total_usd
    )
    INSERT INTO protocol_daily_revenue (
      id, date, timestamp, total_eth, total_usd, avg7_eth, avg14_eth, avg30_eth, avg7_usd, avg14_usd, avg30_usd, split
    )
    SELECT
      d.date as id,
      d.date,
      d.timestamp,
      ROUND(d.total_eth),
      ROUND(d.total_usd),
      ROUND(AVG(d.total_eth) OVER (ORDER BY d.date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)) as avg7_eth,
      ROUND(AVG(d.total_eth) OVER (ORDER BY d.date ROWS BETWEEN 13 PRECEDING AND CURRENT ROW)) as avg14_eth,
      ROUND(AVG(d.total_eth) OVER (ORDER BY d.date ROWS BETWEEN 29 PRECEDING AND CURRENT ROW)) as avg30_eth,
      ROUND(AVG(d.total_usd) OVER (ORDER BY d.date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)) as avg7_usd,
      ROUND(AVG(d.total_usd) OVER (ORDER BY d.date ROWS BETWEEN 13 PRECEDING AND CURRENT ROW)) as avg14_usd,
      ROUND(AVG(d.total_usd) OVER (ORDER BY d.date ROWS BETWEEN 29 PRECEDING AND CURRENT ROW)) as avg30_usd,
      d.split
    FROM daily_data d
    ON CONFLICT (id) DO UPDATE SET
      timestamp = EXCLUDED.timestamp,
      total_eth = EXCLUDED.total_eth,
      total_usd = EXCLUDED.total_usd,
      avg7_eth = EXCLUDED.avg7_eth,
      avg14_eth = EXCLUDED.avg14_eth,
      avg30_eth = EXCLUDED.avg30_eth,
      avg7_usd = EXCLUDED.avg7_usd,
      avg14_usd = EXCLUDED.avg14_usd,
      avg30_usd = EXCLUDED.avg30_usd,
      split = EXCLUDED.split;
  `

  await runner.query(sql)
}

const upsertProtocolDailyTvl = async (ctx: Context, fromDate: string) => {
  const runner = (ctx.store as any).em().queryRunner as {
    query: (sql: string) => Promise<any>
  }

  const productIdSql = productIdCaseSql('d.product')
  const productIdsValuesSql = allProducts.map((product) => `('${product.productId}')`).join(',\n        ')
  const sql = `
    WITH ${ethUsdByDayCteSql(fromDate)},
    product_data AS (
      SELECT
        d.date,
        ${productIdSql} as product_id,
        d.product,
        (d.tvl - d.inherited_tvl) as total_eth,
        ((d.tvl - d.inherited_tvl) * e.rate_usd / 1e18) as total_usd
      FROM protocol_daily_stat_detail d
      INNER JOIN eth_usd_by_day e ON e.date = d.date
      WHERE d.date >= '${fromDate}'
    ),
    product_catalog AS (
      SELECT product_id
      FROM (VALUES
        ${productIdsValuesSql}
      ) AS products(product_id)
    ),
    dates AS (
      SELECT DISTINCT date
      FROM product_data
    ),
    daily_totals AS (
      SELECT
        p.date,
        (p.date::date + interval '1 day' - interval '1 second')::timestamp as timestamp,
        SUM(p.total_eth) as total_eth,
        SUM(p.total_usd) as total_usd
      FROM product_data p
      GROUP BY p.date
    ),
    split_data AS (
      SELECT
        d.date,
        c.product_id,
        COALESCE(p.total_eth, 0) as total_eth,
        COALESCE(p.total_usd, 0) as total_usd
      FROM dates d
      CROSS JOIN product_catalog c
      LEFT JOIN product_data p ON p.date = d.date AND p.product_id = c.product_id
    ),
    daily_data AS (
      SELECT
        t.date,
        t.timestamp,
        t.total_eth,
        t.total_usd,
        jsonb_agg(
          jsonb_build_object(
            'productId', s.product_id,
            'totalEth', ROUND(s.total_eth)::text,
            'totalUsd', ROUND(s.total_usd)::text
          )
          ORDER BY s.product_id
        ) as split
      FROM daily_totals t
      INNER JOIN split_data s ON s.date = t.date
      GROUP BY t.date, t.timestamp, t.total_eth, t.total_usd
    )
    INSERT INTO protocol_daily_tvl (
      id, date, timestamp, total_eth, total_usd, avg7_eth, avg14_eth, avg30_eth, avg7_usd, avg14_usd, avg30_usd, split
    )
    SELECT
      d.date as id,
      d.date,
      d.timestamp,
      ROUND(d.total_eth),
      ROUND(d.total_usd),
      ROUND(AVG(d.total_eth) OVER (ORDER BY d.date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)) as avg7_eth,
      ROUND(AVG(d.total_eth) OVER (ORDER BY d.date ROWS BETWEEN 13 PRECEDING AND CURRENT ROW)) as avg14_eth,
      ROUND(AVG(d.total_eth) OVER (ORDER BY d.date ROWS BETWEEN 29 PRECEDING AND CURRENT ROW)) as avg30_eth,
      ROUND(AVG(d.total_usd) OVER (ORDER BY d.date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)) as avg7_usd,
      ROUND(AVG(d.total_usd) OVER (ORDER BY d.date ROWS BETWEEN 13 PRECEDING AND CURRENT ROW)) as avg14_usd,
      ROUND(AVG(d.total_usd) OVER (ORDER BY d.date ROWS BETWEEN 29 PRECEDING AND CURRENT ROW)) as avg30_usd,
      d.split
    FROM daily_data d
    ON CONFLICT (id) DO UPDATE SET
      timestamp = EXCLUDED.timestamp,
      total_eth = EXCLUDED.total_eth,
      total_usd = EXCLUDED.total_usd,
      avg7_eth = EXCLUDED.avg7_eth,
      avg14_eth = EXCLUDED.avg14_eth,
      avg30_eth = EXCLUDED.avg30_eth,
      avg7_usd = EXCLUDED.avg7_usd,
      avg14_usd = EXCLUDED.avg14_usd,
      avg30_usd = EXCLUDED.avg30_usd,
      split = EXCLUDED.split;
  `

  await runner.query(sql)
}

const upsertProtocolDailyTokenSupply = async (ctx: Context, fromDate: string) => {
  const runner = (ctx.store as any).em().queryRunner as {
    query: (sql: string) => Promise<any>
  }

  const productIdSql = productIdCaseSql('d.product')
  const productList = otokenProducts.map((product) => `'${product.product}'`).join(', ')
  const productIdsValuesSql = otokenProducts.map((product) => `('${product.productId}')`).join(',\n        ')
  const sql = `
    WITH ${ethUsdByDayCteSql(fromDate)},
    product_data AS (
      SELECT
        d.date,
        ${productIdSql} as product_id,
        d.product,
        d.supply as total_eth,
        (d.supply * e.rate_usd / 1e18) as total_usd
      FROM protocol_daily_stat_detail d
      INNER JOIN eth_usd_by_day e ON e.date = d.date
      WHERE d.date >= '${fromDate}'
        AND d.product IN (${productList})
    ),
    product_catalog AS (
      SELECT product_id
      FROM (VALUES
        ${productIdsValuesSql}
      ) AS products(product_id)
    ),
    dates AS (
      SELECT DISTINCT date
      FROM product_data
    ),
    daily_totals AS (
      SELECT
        p.date,
        (p.date::date + interval '1 day' - interval '1 second')::timestamp as timestamp,
        SUM(p.total_eth) as total_eth,
        SUM(p.total_usd) as total_usd
      FROM product_data p
      GROUP BY p.date
    ),
    split_data AS (
      SELECT
        d.date,
        c.product_id,
        COALESCE(p.total_eth, 0) as total_eth,
        COALESCE(p.total_usd, 0) as total_usd
      FROM dates d
      CROSS JOIN product_catalog c
      LEFT JOIN product_data p ON p.date = d.date AND p.product_id = c.product_id
    ),
    daily_data AS (
      SELECT
        t.date,
        t.timestamp,
        t.total_eth,
        t.total_usd,
        jsonb_agg(
          jsonb_build_object(
            'productId', s.product_id,
            'totalEth', ROUND(s.total_eth)::text,
            'totalUsd', ROUND(s.total_usd)::text
          )
          ORDER BY s.product_id
        ) as split
      FROM daily_totals t
      INNER JOIN split_data s ON s.date = t.date
      GROUP BY t.date, t.timestamp, t.total_eth, t.total_usd
    )
    INSERT INTO protocol_daily_token_supply (
      id, date, timestamp, total_eth, total_usd, avg7_eth, avg14_eth, avg30_eth, avg7_usd, avg14_usd, avg30_usd, split
    )
    SELECT
      d.date as id,
      d.date,
      d.timestamp,
      ROUND(d.total_eth),
      ROUND(d.total_usd),
      ROUND(AVG(d.total_eth) OVER (ORDER BY d.date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)) as avg7_eth,
      ROUND(AVG(d.total_eth) OVER (ORDER BY d.date ROWS BETWEEN 13 PRECEDING AND CURRENT ROW)) as avg14_eth,
      ROUND(AVG(d.total_eth) OVER (ORDER BY d.date ROWS BETWEEN 29 PRECEDING AND CURRENT ROW)) as avg30_eth,
      ROUND(AVG(d.total_usd) OVER (ORDER BY d.date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)) as avg7_usd,
      ROUND(AVG(d.total_usd) OVER (ORDER BY d.date ROWS BETWEEN 13 PRECEDING AND CURRENT ROW)) as avg14_usd,
      ROUND(AVG(d.total_usd) OVER (ORDER BY d.date ROWS BETWEEN 29 PRECEDING AND CURRENT ROW)) as avg30_usd,
      d.split
    FROM daily_data d
    ON CONFLICT (id) DO UPDATE SET
      timestamp = EXCLUDED.timestamp,
      total_eth = EXCLUDED.total_eth,
      total_usd = EXCLUDED.total_usd,
      avg7_eth = EXCLUDED.avg7_eth,
      avg14_eth = EXCLUDED.avg14_eth,
      avg30_eth = EXCLUDED.avg30_eth,
      avg7_usd = EXCLUDED.avg7_usd,
      avg14_usd = EXCLUDED.avg14_usd,
      avg30_usd = EXCLUDED.avg30_usd,
      split = EXCLUDED.split;
  `

  await runner.query(sql)
}

