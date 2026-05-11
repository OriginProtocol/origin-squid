import { CoinGeckoCoinData } from '@model'
import { Context } from '@originprotocol/squid-utils'

import { CoingeckoDataOutput, processCoingeckoData } from './coingecko'
import { queryClient } from './queryClient'

type CoinId = 'origin-dollar' | 'origin-ether' | 'super-oeth' | 'origin-dollar-governance' | 'origin-protocol'

// Maps the CoinGecko coinId to the `product` value coingeckoProcessor writes
// into CoinGeckoCoinData. Used for the DB fallback below.
const COIN_TO_PRODUCT: Record<CoinId, string> = {
  'origin-protocol': 'OGN',
  'origin-dollar': 'OUSD',
  'origin-ether': 'OETH',
  'super-oeth': 'superOETHb',
  'origin-dollar-governance': 'OGV',
}

async function readCachedData(
  ctx: Context,
  coinId: CoinId,
  vsCurrency: 'usd' | 'eth',
): Promise<CoingeckoDataOutput | null> {
  const product = COIN_TO_PRODUCT[coinId]
  const rows = await ctx.store.find(CoinGeckoCoinData, {
    where: { product, vsCurrency: vsCurrency.toUpperCase() as 'USD' | 'ETH' },
  })
  if (rows.length === 0) return null
  const result: CoingeckoDataOutput = {}
  for (const row of rows) {
    result[row.date] = {
      prices: row.price,
      market_caps: row.marketCap,
      total_volumes: row.tradingVolume,
    }
  }
  return result
}

// Persistent throttle: if today's row exists in the DB we already have
// today's data, so skip the API entirely. Survives process restarts (unlike
// the in-memory throttle in coingeckoProcessor) and amortizes nicely across
// the 4-coin burst that runs every batch during catch-up.
async function todayCached(ctx: Context, coinId: CoinId, vsCurrency: 'usd' | 'eth'): Promise<boolean> {
  const product = COIN_TO_PRODUCT[coinId]
  const today = new Date().toISOString().slice(0, 10)
  const row = await ctx.store.get(CoinGeckoCoinData, `${today}-${product}`)
  return row != null
}

export async function getCoingeckoData(
  ctx: Context,
  props: {
    coinId: CoinId
    vsCurrency?: 'eth' | 'usd'
    startTimestamp?: number
  },
) {
  const vsCurrency = props.vsCurrency || 'usd'

  // If today's data is already cached, return the DB rows without touching
  // the API. Saves one fresh API call per coin per restart during catch-up.
  if (await todayCached(ctx, props.coinId, vsCurrency)) {
    const cached = await readCachedData(ctx, props.coinId, vsCurrency)
    if (cached) return cached
  }

  const coingeckoURL = `https://api.coingecko.com/api/v3/coins/${props.coinId}/market_chart?vs_currency=${vsCurrency}&days=365&interval=daily&precision=18`
  try {
    const coingeckoJson = await queryClient.fetchQuery({
      queryKey: [coingeckoURL, new Date().toISOString().slice(0, 10)],
      queryFn: async () => {
        console.log('Fetching Coingecko market data')
        const response = await fetch(coingeckoURL)
        if (response.status === 429) {
          throw new Error('Coingecko rate limited')
        }
        const result = await response.json()
        console.log(`Found ${result.prices.length} prices`)
        return result
      },
      staleTime: 600_000, // 10 minutes
      // Don't burn rate-limit budget on retries — if we're 429'd, retries 429 too.
      retry: 0,
    })

    return processCoingeckoData(coingeckoJson)
  } catch (err) {
    // API failed (rate limit, network, etc.). Fall back to whatever the
    // coingeckoProcessor last persisted — better than crashing the processor.
    const cached = await readCachedData(ctx, props.coinId, vsCurrency)
    if (cached) {
      console.log(
        `Coingecko fetch failed for ${props.coinId} (${(err as Error).message}); ` +
          `using ${Object.keys(cached).length} cached rows from DB`,
      )
      return cached
    }
    throw err
  }
}
