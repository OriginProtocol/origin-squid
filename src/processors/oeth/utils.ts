import { Context } from '../../processor'
import { Address, APY, Rebase } from '../../model'
import { LessThan, MoreThanOrEqual } from 'typeorm'
import * as oeth from '../../abi/oeth'

/**
 * Create a new Address entity
 */
export async function createAddress(
  ctx: Context,
  addr: string,
  lastUpdated?: Date,
): Promise<Address> {
  let isContract: boolean = false
  if (addr !== '0x0000000000000000000000000000000000000000') {
    isContract =
      (await ctx._chain.client.call('eth_getCode', [addr, 'latest'])) !== '0x'
  }

  // ctx.log.info(`New address ${rawAddress}`);
  return new Address({
    id: addr,
    balance: 0,
    earned: 0,
    credits: 0n,
    isContract,
    rebasingOption: isContract ? 'OptOut' : 'OptIn',
    lastUpdated,
  })
}

/**
 * Create Rebase entity and set APY
 */
export async function createRebaseAPY(
  ctx: Context,
  apies: APY[],
  block: Context['blocks']['0'],
  log: Context['blocks']['0']['logs']['0'],
  rebaseEvent: ReturnType<typeof oeth.events.TotalSupplyUpdatedHighres.decode>,
): Promise<Rebase> {
  const rebase = new Rebase({
    id: log.id,
    blockNumber: block.header.height,
    timestamp: new Date(block.header.timestamp),
    txHash: log.transactionHash,
    rebasingCredits: rebaseEvent.rebasingCredits,
    rebasingCreditsPerToken: rebaseEvent.rebasingCreditsPerToken,
    totalSupply: rebaseEvent.totalSupply,
  })

  // use date as id for APY
  const date = new Date(block.header.timestamp)
  const dateId = date.toISOString().substring(0, 10)
  date.setDate(date.getDate() - 1)
  const lastDateId = date.toISOString().substring(0, 10)

  // use date as id for APY
  date.setDate(date.getDate() - 6)
  const last7daysDateId = {
    key: 'apy7DayAvg' as const,
    value: date.toISOString().substring(0, 10),
  }
  date.setDate(date.getDate() - 14)
  const last14daysDateId = {
    key: 'apy14DayAvg' as const,
    value: date.toISOString().substring(0, 10),
  }
  date.setDate(date.getDate() - 16)
  const last30daysDateId = {
    key: 'apy30DayAvg' as const,
    value: date.toISOString().substring(0, 10),
  }

  // get last APY to compare with current one
  let lastApy =
    apies.slice(apies.length - 2).find((apy) => apy.id < dateId) ??
    (await ctx.store.findOne(APY, {
      where: { id: LessThan(dateId) },
      order: { id: 'DESC' },
    }))

  // check if there is already an APY for the current date
  let apy =
    apies.slice(apies.length - 1).find((apy) => apy.id === dateId) ??
    (await ctx.store.findOne(APY, { where: { id: dateId } }))
  // ctx.log.info(`APY: ${dateId} ${apy}, ${lastDateId} ${lastApy}`);
  // create a new APY if it doesn't exist
  if (!apy) {
    apy = new APY({
      id: dateId,
      blockNumber: block.header.height,
      timestamp: new Date(block.header.timestamp),
      txHash: log.transactionHash,
      rebasingCreditsPerToken: rebaseEvent.rebasingCreditsPerToken,
    })
    apies.push(apy)
  }

  rebase.apy = apy

  // should only happen for the first rebase event
  if (!lastApy) {
    apy.apr = 0
    apy.apy = 0
    apy.apy7DayAvg = 0
    apy.apy14DayAvg = 0
    apy.apy30DayAvg = 0

    return rebase
  }

  // update APY with the new rebase event
  apy.blockNumber = block.header.height
  apy.timestamp = new Date(block.header.timestamp)
  apy.txHash = log.transactionHash
  apy.rebasingCreditsPerToken = rebaseEvent.rebasingCreditsPerToken

  // this should normally be 1 day but more secure to calculate it
  const diffTime = Math.abs(
    new Date(apy.id).getTime() - new Date(lastApy.id).getTime(),
  )
  const dayDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  apy.apr =
    ((Number(lastApy.rebasingCreditsPerToken) /
      Number(apy.rebasingCreditsPerToken) -
      1) *
      100 *
      365.25) /
    dayDiff
  const periods_per_year = 365.25 / dayDiff
  apy.apy =
    ((1 + apy.apr / periods_per_year / 100) ** periods_per_year - 1) * 100

  // calculate average APY for the last 7, 14 and 30 days
  await Promise.all(
    [last7daysDateId, last14daysDateId, last30daysDateId].map(async (i) => {
      const pastAPYs = await ctx.store.findBy(APY, {
        id: MoreThanOrEqual(i.value),
      })
      apy![i.key] =
        pastAPYs.reduce((acc: number, cur: APY) => acc + cur.apy, apy!.apy) /
        (pastAPYs.length + 1)
    }),
  )

  return rebase
}
