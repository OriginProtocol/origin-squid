import { CoinGeckoCoinData } from '@model'
import { defineProcessor } from '@originprotocol/squid-utils'
import { CoingeckoDataOutput } from '@utils/coingecko'
import { getCoingeckoData } from '@utils/coingecko2'

let throttleTimestamp = 0
let lastProcessTimestamp = 0
const from = 20933088
export const coingeckoProcessor = defineProcessor({
  from, // This is irrelevant
  name: 'coingecko',
  setup: async (processor) => {
    processor.includeAllBlocks({ from })
  },
  process: async (ctx) => {
    const isThrottled = Date.now() - throttleTimestamp < 300000
    if (isThrottled) return
    const lastProcessWithinHour = lastProcessTimestamp > Date.now() - 3600000
    if (lastProcessWithinHour) return

    try {
      const entities: CoinGeckoCoinData[] = []

      const addEntities = (product: string, vsCurrency: 'USD' | 'ETH', data: CoingeckoDataOutput) => {
        entities.push(
          ...Object.entries(data).map(
            ([date, d]) =>
              new CoinGeckoCoinData({
                id: `${date}-${product}`,
                product,
                date: date,
                vsCurrency,
                price: d.prices ?? 0,
                marketCap: d.market_caps ?? 0,
                tradingVolume: d.total_volumes ?? 0,
              }),
          ),
        )
      }

      const ognData = await getCoingeckoData(ctx, {
        coinId: 'origin-protocol',
        vsCurrency: 'usd',
      })
      addEntities('OGN', 'USD', ognData)

      const ousdData = await getCoingeckoData(ctx, {
        coinId: 'origin-dollar',
        vsCurrency: 'usd',
      })
      addEntities('OUSD', 'USD', ousdData)

      const oethData = await getCoingeckoData(ctx, {
        coinId: 'origin-ether',
        vsCurrency: 'eth',
      })
      addEntities('OETH', 'ETH', oethData)

      const superoethData = await getCoingeckoData(ctx, {
        coinId: 'super-oeth',
        vsCurrency: 'eth',
      })
      addEntities('superOETHb', 'ETH', superoethData)

      await ctx.store.upsert(entities)

      // Great success!
      lastProcessTimestamp = Date.now()
    } catch (err) {
      throttleTimestamp = Date.now()
      console.error(err)
    }
  },
})
