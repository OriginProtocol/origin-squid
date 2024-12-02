import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { findLast, last } from 'lodash'
import { In, LessThan, MoreThanOrEqual, Not } from 'typeorm'

import * as otoken from '@abi/otoken'
import { OTokenAPY, OTokenAddress, OTokenRebase, RebasingOption } from '@model'
import { Context } from '@processor'
import { ensureExchangeRate } from '@shared/post-processors/exchange-rates'
import { CurrencyAddress } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { OUSD_STABLE_OTOKENS } from '@utils/addresses'
import { calculateAPY } from '@utils/calculateAPY'

dayjs.extend(utc)

/**
 * Create a new Address entity
 */
export async function createAddress(ctx: Context, otoken: string, addr: string, lastUpdated?: Date) {
  let isContract: boolean = false
  if (addr !== '0x0000000000000000000000000000000000000000') {
    isContract = (await ctx._chain.client.call('eth_getCode', [addr, 'latest'])) !== '0x'
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
    delegatedTo: null,
    lastUpdated,
  })
}

/**
 * Create Rebase entity and set APY
 */
export async function createRebaseAPY(
  ctx: Context,
  otokenAddress: CurrencyAddress,
  apies: OTokenAPY[],
  rebases: OTokenRebase[],
  block: Context['blocks']['0'],
  log: Context['blocks']['0']['logs']['0'],
  rebaseEvent: ReturnType<typeof otoken.events.TotalSupplyUpdatedHighres.decode>,
  lastYieldDistributionEvent:
    | {
        fee: bigint
        yield: bigint
      }
    | undefined,
) {
  let feeETH = 0n
  let yieldETH = 0n
  let feeUSD = 0n
  let yieldUSD = 0n
  const generateId = (date: dayjs.Dayjs | string | Date | number) => dayjs.utc(date).toISOString().substring(0, 10)

  let _fee = lastYieldDistributionEvent?.fee ?? 0n
  let _yield = lastYieldDistributionEvent?.yield ?? 0n
  if (!lastYieldDistributionEvent) {
    let lastRebase =
      last(rebases) ??
      (await ctx.store.findOne(OTokenRebase, {
        where: {
          chainId: ctx.chain.id,
          otoken: otokenAddress,
        },
        order: { timestamp: 'DESC' },
      }))
    if (lastRebase) {
      // Hack solution if `lastYieldDistributionEvent` is missing.
      // The split should be 80:20 and this is currently only seen on superOETHb.
      // For any amount of yield seen we can assume we've also generated 25% of that amount as fees.
      //  (current rebasing credits / current rcpt) - (current rebasing credits / past rcpt)
      _yield =
        (rebaseEvent.rebasingCredits * 10n ** 18n) / rebaseEvent.rebasingCreditsPerToken -
        (rebaseEvent.rebasingCredits * 10n ** 18n) / lastRebase.rebasingCreditsPerToken
      _fee = (_yield * 25n) / 100n
      _yield += _fee // YieldDistributionEvent yield includes the fee so let's add that here.
    }
  }

  if (OUSD_STABLE_OTOKENS.includes(otokenAddress)) {
    const rate = await ensureExchangeRate(ctx, block, otokenAddress, 'ETH').then((er) => er?.rate ?? 0n)
    feeUSD = _fee
    yieldUSD = _yield
    feeETH = (feeUSD * rate) / 1000000000000000000n
    yieldETH = (yieldUSD * rate) / 1000000000000000000n
  } else {
    const rate = await ensureExchangeRate(ctx, block, otokenAddress, 'USD').then((er) => er?.rate ?? 0n)
    feeETH = _fee
    yieldETH = _yield
    feeUSD = (feeETH * rate) / 1000000000000000000n
    yieldUSD = (yieldETH * rate) / 1000000000000000000n
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
    fee: _fee,
    yield: _yield,
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
    findLast(apies, (apy) => apy.date < dateId) ??
    (await ctx.store.findOne(OTokenAPY, {
      where: {
        chainId: ctx.chain.id,
        otoken: otokenAddress,
        date: LessThan(dateId),
      },
      order: { timestamp: 'DESC' },
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

  let last30daysAPYs: OTokenAPY[] = apies.filter((apy) => apy.date >= last30daysDateId.value)
  last30daysAPYs = last30daysAPYs.concat(
    await ctx.store.find(OTokenAPY, {
      where: {
        chainId: ctx.chain.id,
        otoken: otokenAddress,
        date: MoreThanOrEqual(last30daysDateId.value),
        id: Not(In(last30daysAPYs.map((apy) => apy.id))),
      },
      order: { id: 'asc' },
    }),
  )

  const blockDateId = generateId(block.header.timestamp)
  for (const i of [last7daysDateId, last14daysDateId, last30daysDateId]) {
    const pastAPYs = last30daysAPYs.filter((a) => {
      const dateId = generateId(a.timestamp)
      return dateId >= i.value && dateId < blockDateId
    })
    // console.log(i.days, pastAPYs.length)
    apy![i.key] = pastAPYs.reduce((acc, cur) => acc + cur.apy, apy!.apy) / i.days
  }

  return rebase
}
