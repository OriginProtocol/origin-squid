import dayjs from 'dayjs'
import { Between, LessThanOrEqual } from 'typeorm'

import { OGNDailyStat, OGVDailyStat } from '@model'
import { Context } from '@originprotocol/squid-utils'
import { queryClient } from '@utils/queryClient'
import { EntityClassT } from '@utils/type'

type DailyStat = EntityClassT<OGVDailyStat> | EntityClassT<OGNDailyStat>

export interface CoingeckoDataInput {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

export interface CoingeckoDataOutput {
  [date: string]: {
    prices: number | null
    market_caps: number | null
    total_volumes: number | null
  }
}

export function processCoingeckoData(data: CoingeckoDataInput): CoingeckoDataOutput {
  try {
    const result: CoingeckoDataOutput = {}

    // Helper function to convert timestamp to date string
    const timestampToDate = (timestamp: number): string => {
      const date = new Date(timestamp)
      return date.toISOString().split('T')[0]
    }

    const dataKeys = Object.keys(data) as (keyof CoingeckoDataInput)[]

    // Process each data category
    dataKeys.forEach((category) => {
      data[category].forEach(([timestamp, value]) => {
        const dateStr = timestampToDate(timestamp)

        // Initialize the object for the date if it doesn't exist
        if (!result[dateStr]) {
          result[dateStr] = {
            prices: null,
            market_caps: null,
            total_volumes: null,
          }
        }

        // Update the relevant category
        result[dateStr][category] = value
      })
    })

    return result
  } catch (err) {
    console.log(JSON.stringify(data))
    throw err
  }
}

export function getStartOfDayTimestamp(): Date {
  const utcDate = new Date()
  utcDate.setUTCHours(0, 0, 0, 0)
  return utcDate
}

export async function applyCoingeckoData(
  ctx: Context,
  props: {
    Entity: DailyStat
    coinId: 'origin-dollar' | 'origin-ether' | 'origin-dollar-governance' | 'origin-protocol'
    vsCurrency?: 'eth' | 'usd'
    startTimestamp?: number
  },
) {
  const { Entity } = props

  const updatedStats = []
  let whereClause = {
    timestamp: LessThanOrEqual(getStartOfDayTimestamp()),
  } as any
  if (Entity === OGVDailyStat || Entity === OGNDailyStat) {
    whereClause.priceUSD = 0
  } else {
    whereClause.pegPrice = 0n
  }
  whereClause.timestamp = Between(dayjs().subtract(365, 'day').toDate(), getStartOfDayTimestamp())
  const statsWithNoPrice = await ctx.store.findBy(Entity as any, whereClause)

  if (statsWithNoPrice.length > 0) {
    const vsCurrency = props.vsCurrency || 'usd'
    console.log(`Found ${statsWithNoPrice.length} stats with no price`)
    // console.log(JSON.stringify(statsWithNoPrice.map((s) => s.id)))
    let conversionRate = props.coinId === 'origin-dollar-governance' ? 0.09173 : 1
    let urlCoinId = props.coinId
    if (props.coinId === 'origin-dollar-governance') {
      urlCoinId = 'origin-protocol'
    }
    const coingeckoURL = `https://api.coingecko.com/api/v3/coins/${urlCoinId}/market_chart?vs_currency=${vsCurrency}&days=365&interval=daily&precision=18`
    const coingeckoJson = await queryClient.fetchQuery({
      queryKey: [coingeckoURL],
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
    })

    if (!coingeckoJson) {
      console.log('No coingeckoJson :(')
    } else {
      console.log('Processing coingecko data')
      const coingeckData = processCoingeckoData(coingeckoJson)
      for (const dayId in coingeckData) {
        const stat = statsWithNoPrice.find((s) => s.id === dayId) as OGVDailyStat | OGNDailyStat
        const day = coingeckData[dayId]

        if (stat && day.prices) {
          if (props.coinId === 'origin-dollar-governance') {
            stat.tradingVolumeUSD = 0
            stat.marketCapUSD = 0
          } else {
            stat.tradingVolumeUSD = day.total_volumes || 0
            stat.marketCapUSD = day.market_caps || 0
          }
          console.log('stat', stat)
          console.log('price data', day)
          stat.priceUSD = day.prices * conversionRate
          updatedStats.push(stat)
        }
      }
    }
  }
  return updatedStats
}
