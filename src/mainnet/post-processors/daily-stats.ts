import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { FindOptionsOrderValue, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'

import { ERC20Balance, ERC20Holder, ERC20State, OGNDailyStat } from '@model'
import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { applyCoingeckoData } from '@utils/coingecko'

dayjs.extend(utc)

export const from = 15491391

export const setup = async (processor: EvmBatchProcessor) => {
  processor.includeAllBlocks({ from })
}

export const process = async (ctx: Context) => {
  const firstBlockTimestamp = ctx.blocks.find((b) => b.header.height >= from)?.header.timestamp
  if (!firstBlockTimestamp) return

  const firstBlock = ctx.blocks[0]
  const lastBlock = ctx.blocks[ctx.blocks.length - 1]
  const startDate = dayjs.utc(firstBlock.header.timestamp).endOf('day')
  const endDate = dayjs.utc(lastBlock.header.timestamp).endOf('day')

  let dates: Date[] = []
  for (let date = startDate; !date.isAfter(endDate); date = date.add(1, 'day').endOf('day')) {
    dates.push(date.toDate())
  }

  const ognDailyStats = [] as OGNDailyStat[]

  for (const date of dates) {
    const dailyOGNStatInserts = await updateOGNDailyStats(ctx, date)
    if (dailyOGNStatInserts) {
      ognDailyStats.push(dailyOGNStatInserts.dailyStat)
    }
  }

  if (ctx.isHead) {
    const updatedOGNStats = (await applyCoingeckoData(ctx, {
      Entity: OGNDailyStat,
      coinId: 'origin-protocol',
      // startTimestamp: Date.UTC(2023, 4, 17),
    })) as OGNDailyStat[]

    const existingOGNIds = ognDailyStats.map((stat) => stat.id)
    ognDailyStats.push(...updatedOGNStats.filter((stat) => existingOGNIds.indexOf(stat.id) < 0))
  }

  await ctx.store.upsert(ognDailyStats)
}

async function updateOGNDailyStats(ctx: Context, date: Date) {
  const queryParams = {
    where: { timestamp: LessThanOrEqual(date) },
    order: { timestamp: 'desc' as FindOptionsOrderValue },
  }

  const [stakedBalance, holdersOverThreshold, totalSupply] = await Promise.all([
    ctx.store.findOne(ERC20Balance, {
      where: {
        timestamp: LessThanOrEqual(date),
        address: '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26',
        account: '0x63898b3b6ef3d39332082178656e9862bee45c57',
      },
      order: { timestamp: 'desc' as FindOptionsOrderValue },
    }),
    ctx.store.countBy(ERC20Holder, {
      balance: MoreThanOrEqual(10n ** 20n),
      address: '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26',
    }), // 100 OGN
    ctx.store.findOne(ERC20State, {
      where: {
        timestamp: LessThanOrEqual(date),
        address: '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26',
      },
      order: { timestamp: 'desc' as FindOptionsOrderValue },
    }),
  ])

  const allEntities = [totalSupply].filter(Boolean)
  if (!totalSupply) {
    return null
  }

  const mostRecentEntity = allEntities.reduce((highest, current) => {
    if (!highest || !current) return current
    return current.blockNumber > highest.blockNumber ? current : highest
  })

  const id = date.toISOString().substring(0, 10)

  const dailyStat = new OGNDailyStat({
    id,
    blockNumber: mostRecentEntity?.blockNumber,
    timestamp: mostRecentEntity?.timestamp,

    totalSupply: totalSupply?.totalSupply || 0n,
    totalStaked: stakedBalance?.balance || 0n,
    totalSupplyUSD: 0,
    tradingVolumeUSD: 0,
    marketCapUSD: 0,
    priceUSD: 0,
    holdersOverThreshold,
  })

  return { dailyStat }
}
