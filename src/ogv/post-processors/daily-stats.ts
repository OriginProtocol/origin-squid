import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {
  FindOptionsOrderValue,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm'

import { OGV, OGVAddress, OGVDailyStat } from '@model'
import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { applyCoingeckoData } from '@utils/coingecko'

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
    const updatedStats = (await applyCoingeckoData(ctx, {
      Entity: OGVDailyStat,
      coinId: 'origin-dollar-governance',
      // startTimestamp: Date.UTC(2023, 4, 17),
    })) as OGVDailyStat[]

    const existingIds = dailyStats.map((stat) => stat.id)
    dailyStats.push(
      ...updatedStats.filter((stat) => existingIds.indexOf(stat.id) < 0),
    )
  }

  await ctx.store.upsert(dailyStats)
}

async function updateDailyStats(ctx: Context, date: Date) {
  const queryParams = {
    where: { timestamp: LessThanOrEqual(date) },
    order: { timestamp: 'desc' as FindOptionsOrderValue },
  }

  const [lastOgv, holdersOverThreshold] = await Promise.all([
    ctx.store.findOne(OGV, queryParams),
    ctx.store.countBy(OGVAddress, { balance: MoreThanOrEqual(10n ** 20n) }), // 100 OGV
  ])

  const allEntities = [lastOgv].filter(Boolean)
  if (!lastOgv) {
    return null
  }

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
    holdersOverThreshold,
  })

  return { dailyStat }
}
