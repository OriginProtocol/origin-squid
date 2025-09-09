import { Context, defineProcessor } from '@originprotocol/squid-utils'
import { armProducts, otokenProducts } from '@utils/products'

const startDate = '2022-01-01'

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
        id, date, product, timestamp, rate_usd, earning_tvl, tvl, supply, yield, revenue, apy,
        inherited_tvl, inherited_yield, inherited_revenue, bridged_tvl
      )
      SELECT 
        o.date || '-${product.product}' as id,
        o.date,
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
        id, date, product, timestamp, rate_usd, earning_tvl, tvl, supply, yield, revenue, apy,
        inherited_tvl, inherited_yield, inherited_revenue, bridged_tvl
      )
      SELECT 
        a.date || '-${product.product}' as id,
        a.date,
        '${product.product}' as product,
        (a.date::date + interval '1 day' - interval '1 second')::timestamp as timestamp,
        COALESCE(a.rate_usd, 0) as rate_usd,
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
  await runner.query(`
    UPDATE protocol_daily_stat_detail 
    SET bridged_tvl = COALESCE((
      SELECT sb.balance_eth 
      FROM strategy_balance sb 
      WHERE sb.strategy = '0x80c864704dd06c3693ed5179190786ee38acf835'
      AND sb.timestamp <= (date::date + interval '1 day')::timestamp
      AND sb.timestamp = (
        SELECT MAX(sb2.timestamp) 
        FROM strategy_balance sb2 
        WHERE sb2.strategy = sb.strategy 
        AND sb2.timestamp <= (date::date + interval '1 day')::timestamp
      )
    ), 0)
    WHERE product = 'superOETHb' AND date >= '${fromDate}';
  `)

  await runner.query(`
    UPDATE protocol_daily_stat_detail 
    SET bridged_tvl = COALESCE((
      SELECT sb.balance_eth 
      FROM strategy_balance sb 
      WHERE sb.strategy = '0x1e3edd5e019207d6355ea77f724b1f1bf639b569'
      AND sb.timestamp <= (date::date + interval '1 day')::timestamp
      AND sb.timestamp = (
        SELECT MAX(sb2.timestamp) 
        FROM strategy_balance sb2 
        WHERE sb2.strategy = sb.strategy 
        AND sb2.timestamp <= (date::date + interval '1 day')::timestamp
      )
    ), 0)
    WHERE product = 'superOETHp' AND date >= '${fromDate}';
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
      SUM(earning_tvl) as earning_tvl,
      SUM(tvl) as tvl,
      SUM(yield) as yield,
      SUM(revenue) as revenue,
      
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
