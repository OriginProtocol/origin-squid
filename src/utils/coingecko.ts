import { Between, LessThanOrEqual } from 'typeorm'
import { parseEther } from 'viem'

import { OETHDailyStat, OGVDailyStat, OUSDDailyStat } from '../model'
import { Context } from '../processor'
import { EntityClassT } from '../utils/type'

type DailyStat =
  | EntityClassT<OETHDailyStat>
  | EntityClassT<OGVDailyStat>
  | EntityClassT<OUSDDailyStat>

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

export function processCoingeckoData(
  data: CoingeckoDataInput,
): CoingeckoDataOutput {
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
    coinId: string
    startTimestamp?: number
  },
) {
  // Avoid rate limit issues in Coingecko by only running once every 20 blocks.
  if (
    ctx.blocks.length < 20 &&
    !ctx.blocks.find((b) => b.header.height % 20 === 0)
  ) {
    return []
  }
  const { Entity } = props

  const updatedStats = []
  let whereClause = {
    timestamp: LessThanOrEqual(getStartOfDayTimestamp()),
  } as any
  if (Entity === OGVDailyStat) {
    whereClause.priceUSD = 0
  } else {
    whereClause.pegPrice = 0n
  }
  if (props.startTimestamp) {
    whereClause.timestamp = Between(
      new Date(props.startTimestamp),
      getStartOfDayTimestamp(),
    )
  }
  const statsWithNoPrice = await ctx.store.findBy(Entity as any, whereClause)

  if (statsWithNoPrice.length > 0) {
    console.log(`Found ${statsWithNoPrice.length} stats with no price`)
    // console.log(JSON.stringify(statsWithNoPrice.map((s) => s.id)))
    const coingeckoURL = `https://api.coingecko.com/api/v3/coins/${props.coinId}/market_chart?vs_currency=usd&days=365&interval=daily&precision=18`
    const coingeckoResponse = await fetch(coingeckoURL)
    if (coingeckoResponse.status === 429) {
      console.log('Coingecko rate limited')
    } else {
      const coingeckoJson = await coingeckoResponse.json()
      if (!coingeckoJson) {
        console.log('Could not fetch coingecko data')
      } else {
        console.log('Coingecko rates received OK')
        const coingeckData = processCoingeckoData(coingeckoJson)
        for (const dayId in coingeckData) {
          const stat = statsWithNoPrice.find((s) => s.id === dayId) as
            | OETHDailyStat
            | OUSDDailyStat
            | OGVDailyStat
          const day = coingeckData[dayId]

          if (stat && day.prices) {
            stat.tradingVolumeUSD = day.total_volumes || 0
            stat.marketCapUSD = day.market_caps || 0
            if (stat instanceof OGVDailyStat) {
              stat.priceUSD = day.prices
            } else {
              stat.pegPrice = parseEther(String(day.prices))
            }
            updatedStats.push(stat)
          }
        }
      }
    }
  }
  return updatedStats
}
