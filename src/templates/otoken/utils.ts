import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { LessThan, MoreThanOrEqual } from 'typeorm'

import * as otoken from '@abi/otoken'
import {
  ExchangeRate,
  OTokenAPY,
  OTokenAddress,
  OTokenRebase,
  RebasingOption,
} from '@model'
import { Context } from '@processor'
import { OUSD_STABLE_OTOKENS } from '@utils/addresses'
import { calculateAPY } from '@utils/calculateAPY'

dayjs.extend(utc)

/**
 * Create a new Address entity
 */
export async function createAddress(
  ctx: Context,
  otoken: string,
  addr: string,
  lastUpdated?: Date,
) {
  let isContract: boolean = false
  if (addr !== '0x0000000000000000000000000000000000000000') {
    isContract =
      (await ctx._chain.client.call('eth_getCode', [addr, 'latest'])) !== '0x'
  }

  // ctx.log.info(`New address ${rawAddress}`);
  return new OTokenAddress({
    id: `${ctx.chain.id}-${otoken}-${addr}`, // TODO: this change likely affects other behavior
    chainId: ctx.chain.id,
    otoken,
    address: addr,
    balance: 0n,
    earned: 0n,
    credits: 0n,
    isContract,
    rebasingOption: isContract ? RebasingOption.OptOut : RebasingOption.OptIn,
    lastUpdated,
  })
}

/**
 * Create Rebase entity and set APY
 */
export async function createRebaseAPY(
  ctx: Context,
  otokenAddress: string,
  apies: OTokenAPY[],
  block: Context['blocks']['0'],
  log: Context['blocks']['0']['logs']['0'],
  rebaseEvent: ReturnType<
    typeof otoken.events.TotalSupplyUpdatedHighres.decode
  >,
  lastYieldDistributionEvent: {
    fee: bigint
    yield: bigint
  },
  exchangeRate: ExchangeRate,
) {
  let feeETH = 0n
  let yieldETH = 0n
  let feeUSD = 0n
  let yieldUSD = 0n
  const rate = exchangeRate.rate
  const generateId = (date: dayjs.Dayjs | string | Date | number) =>
    dayjs.utc(date).toISOString().substring(0, 10)

  if (OUSD_STABLE_OTOKENS.includes(otokenAddress)) {
    feeUSD = lastYieldDistributionEvent.fee
    yieldUSD = lastYieldDistributionEvent.yield
    feeETH = (feeUSD * 1000000000000000000n) / rate / 10000000000n
    yieldETH = (yieldUSD * 1000000000000000000n) / rate / 10000000000n
  } else {
    feeETH = lastYieldDistributionEvent.fee
    yieldETH = lastYieldDistributionEvent.yield
    feeUSD = (feeETH * exchangeRate.rate) / 100000000n
    yieldUSD = (yieldETH * exchangeRate.rate) / 100000000n
  }

  const rebase = new OTokenRebase({
    id: `${ctx.chain.id}-${otokenAddress}-${log.id}`,
    chainId: ctx.chain.id,
    otoken: otokenAddress,
    blockNumber: block.header.height,
    timestamp: new Date(block.header.timestamp),
    txHash: log.transactionHash,
    rebasingCredits: rebaseEvent.rebasingCredits,
    rebasingCreditsPerToken: rebaseEvent.rebasingCreditsPerToken,
    totalSupply: rebaseEvent.totalSupply,
    feeUSD,
    yieldUSD,
    feeETH,
    yieldETH,
  })

  // use date as id for APY
  const date = new Date(block.header.timestamp)
  const dateId = generateId(date)

  // get last APY to compare with current one
  let lastApy =
    apies.find((apy) => apy.date < dateId) ??
    (await ctx.store.findOne(OTokenAPY, {
      where: {
        chainId: ctx.chain.id,
        otoken: otokenAddress,
        date: LessThan(dateId),
      },
      order: { id: 'DESC' },
    }))

  // check if there is already an APY for the current date
  let apy: OTokenAPY | undefined = apies.find((apy) => apy.date === dateId)
  if (!apy) {
    apy = await ctx.store.findOne(OTokenAPY, {
      where: {
        chainId: ctx.chain.id,
        otoken: otokenAddress,
        date: dateId,
      },
    })
    if (apy) {
      apies.push(apy)
    }
  }
  // ctx.log.info(`APY: ${dateId} ${apy}, ${lastDateId} ${lastApy}`);
  // create a new APY if it doesn't exist
  if (!apy) {
    apy = new OTokenAPY({
      id: `${ctx.chain.id}-${otokenAddress}-${dateId}`,
      chainId: ctx.chain.id,
      otoken: otokenAddress,
      blockNumber: block.header.height,
      timestamp: new Date(block.header.timestamp),
      date: dateId,
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

  const apyCalc = calculateAPY(
    dayjs.utc(lastApy.timestamp).endOf('day').toDate(),
    dayjs.utc(apy.timestamp).endOf('day').toDate(),
    apy.rebasingCreditsPerToken,
    lastApy.rebasingCreditsPerToken,
  )
  apy.apr = apyCalc.apr
  apy.apy = apyCalc.apy

  const last7daysDateId = {
    key: 'apy7DayAvg' as const,
    value: generateId(dayjs.utc(date).subtract(6, 'days')),
    days: 7,
  }
  const last14daysDateId = {
    key: 'apy14DayAvg' as const,
    value: generateId(dayjs.utc(date).subtract(13, 'days')),
    days: 14,
  }
  const last30daysDateId = {
    key: 'apy30DayAvg' as const,
    value: generateId(dayjs.utc(date).subtract(29, 'days')),
    days: 30,
  }

  const last30daysAPYs = await ctx.store.find(OTokenAPY, {
    where: {
      chainId: ctx.chain.id,
      otoken: otokenAddress,
      date: MoreThanOrEqual(last30daysDateId.value),
    },
    order: { id: 'asc' },
  })

  const blockDateId = generateId(block.header.timestamp)
  for (const i of [last7daysDateId, last14daysDateId, last30daysDateId]) {
    const pastAPYs = last30daysAPYs.filter((a) => {
      const dateId = generateId(a.timestamp)
      return dateId >= i.value && dateId < blockDateId
    })
    // console.log(i.days, pastAPYs.length)
    apy![i.key] =
      pastAPYs.reduce((acc, cur) => acc + cur.apy, apy!.apy) /
      (pastAPYs.length + 1)
  }

  return rebase
}
