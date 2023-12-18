import { EvmBatchProcessor } from '@subsquid/evm-processor'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {
  EntityManager,
  FindOptionsOrderValue,
  LessThanOrEqual,
  MoreThan,
} from 'typeorm'
import { parseEther } from 'viem'

import { OGV, OGVAddress, OGVDailyStat } from '../../model'
import { Context } from '../../processor'
import { processCoingeckoData } from '../../utils/coingecko'

dayjs.extend(utc)

export const from = 15491391

export const setup = async (processor: EvmBatchProcessor) => {
  processor.includeAllBlocks({ from })
}

export const process = async (ctx: Context) => {
  const firstBlockTimestamp = ctx.blocks.find((b) => b.header.height >= from)
    ?.header.timestamp
  if (!firstBlockTimestamp) return

  const firstBlock = ctx.blocks[0]
  const lastBlock = ctx.blocks[ctx.blocks.length - 1]
  const startDate = dayjs.utc(firstBlock.header.timestamp).endOf('day')
  const endDate = dayjs.utc(lastBlock.header.timestamp).endOf('day')

  let dates: Date[] = []
  for (
    let date = startDate;
    !date.isAfter(endDate);
    date = date.add(1, 'day').endOf('day')
  ) {
    dates.push(date.toDate())
  }

  const dailyStats = [] as OGVDailyStat[]

  for (const date of dates) {
    const dailyStatInserts = await updateDailyStats(ctx, date)
    if (dailyStatInserts) {
      dailyStats.push(dailyStatInserts.dailyStat)
    }
  }

  if (ctx.isHead) {
    const statsWithNoPrice = await ctx.store.findBy(OGVDailyStat, {
      priceUSD: 0,
      timestamp: LessThanOrEqual(getStartOfDayTimestamp()),
    })
    if (statsWithNoPrice.length > 0) {
      console.log(`Found ${statsWithNoPrice.length} stats with no price`)
      const coingeckoURL = `https://api.coingecko.com/api/v3/coins/origin-dollar-governance/market_chart?vs_currency=usd&days=max&interval=daily&precision=18`
      const coingeckoResponse = await fetch(coingeckoURL)
      const coingeckoJson = await coingeckoResponse.json()

      if (!coingeckoJson) {
        console.log('Could not fetch coingecko data')
      } else {
        const coingeckData = processCoingeckoData(coingeckoJson)
        for (const dayId in coingeckData) {
          const stat = statsWithNoPrice.find((s) => s.id === dayId)
          const day = coingeckData[dayId]

          if (stat && day.prices) {
            stat.tradingVolumeUSD = day.total_volumes || 0
            stat.marketCapUSD = day.market_caps || 0
            stat.priceUSD = day.prices
            dailyStats.push(stat)
          }
        }
      }
    }
  }

  await ctx.store.upsert(dailyStats)
}

async function updateDailyStats(ctx: Context, date: Date) {
  const queryParams = {
    where: { timestamp: LessThanOrEqual(date) },
    order: { timestamp: 'desc' as FindOptionsOrderValue },
  }

  const [lastOgv] = await Promise.all([ctx.store.findOne(OGV, queryParams)])

  // Do we have any useful data yet?
  const allEntities = [lastOgv].filter(Boolean)
  if (!lastOgv) {
    return null
  }

  const entityManager = (
    ctx.store as unknown as {
      em: () => EntityManager
    }
  ).em()

  const holderStats = await entityManager.query<
    {
      holders_over_threshold: number
    }[]
  >(holderStatsQuery)

  const mostRecentEntity = allEntities.reduce((highest, current) => {
    if (!highest || !current) return current
    return current.blockNumber > highest.blockNumber ? current : highest
  })

  const id = date.toISOString().substring(0, 10)

  const dailyStat = new OGVDailyStat({
    id,
    blockNumber: mostRecentEntity?.blockNumber,
    timestamp: mostRecentEntity?.timestamp,

    totalSupply: lastOgv?.total || 0n,
    totalStaked: lastOgv?.staked,
    totalSupplyUSD: 0,
    tradingVolumeUSD: 0,
    marketCapUSD: 0,
    priceUSD: 0,
    holdersOverThreshold: holderStats[0]?.holders_over_threshold || 0,
  })

  return { dailyStat }
}

const holderStatsQuery = `
SELECT COUNT(*) as holders_over_threshold
FROM ogv_address
WHERE balance > 100000000000000000000
`

function getStartOfDayTimestamp(): Date {
  const utcDate = new Date()
  utcDate.setUTCHours(0, 0, 0, 0)
  return utcDate
}
