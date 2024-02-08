import { EntityManager, In } from 'typeorm'
import { parseEther } from 'viem'

import { LRTBalanceData, LRTPointRecipient } from '../model'
import { Context } from '../processor'
import { balanceBonuses, pointConditions, pointInterval } from './config'
import { encodeAddress } from './encoding'
import {
  defaultReferrerData,
  getReferralDataForRecipient,
  isReferralSelfReferencing,
  isValidReferralId,
} from './referals'
import { find, useLrtState } from './state'

const sum = (vs: bigint[]) => vs.reduce((sum, v) => sum + v, 0n)

interface ReferralPointData {
  referralId: string
  referralPointsBase: bigint
}

export const calculateRecipientsPoints = async (
  ctxOrEm: Context | EntityManager,
  timestamp: number,
  recipients: LRTPointRecipient[],
  memo = new Map<
    string,
    {
      referralPoints: ReferralPointData[]
      totalIncomingReferralPoints: bigint
    }
  >(), // Who have we already calculated in this self-referencing function?
) => {
  const state = useLrtState()
  let totalPoints = 0n
  const totalReferralPoints: ReferralPointData[] = []
  for (const recipient of recipients) {
    if (memo.has(recipient.id)) {
      const lastResult = memo.get(recipient.id)!
      totalReferralPoints.push(...lastResult.referralPoints)
      totalPoints += lastResult.totalIncomingReferralPoints
      continue
    }
    state?.recipients.set(recipient.id, recipient)
    const { points, referralPoints } = calculatePoints(
      timestamp,
      recipient,
      recipient.balanceData,
    )
    totalReferralPoints.push(...referralPoints)
    const referralPointsBase = sum(
      referralPoints.map((r) => r.referralPointsBase),
    )
    recipient.referralCount = referralPoints.length
    recipient.points = points
    recipient.referralPoints = referralPointsBase / 10n // 10% of point base generated from referrals
    recipient.pointsDate = new Date(timestamp)
    totalPoints += points

    // =========================
    // Determine incoming points
    const recipientReferralData = getReferralDataForRecipient(recipient.id)
    const recipientReferralCodes = [
      ...recipientReferralData.map((d) => d.referralId),
      recipient.id,
      encodeAddress(recipient.id),
    ]
    const referringRecipients = await find(ctxOrEm, LRTPointRecipient, {
      where: {
        balanceData: {
          referralId: In(recipientReferralCodes),
        },
      },
      relations: {
        balanceData: { recipient: true },
      },
    })

    const { totalReferralPoints: referrersTotalReferrerPoints } =
      await calculateRecipientsPoints(
        ctxOrEm,
        timestamp,
        referringRecipients,
        memo,
      )

    let referrerCount = 0
    const incomingReferralPoints = referrersTotalReferrerPoints.filter((rp) =>
      recipientReferralCodes.includes(rp.referralId),
    )

    let totalIncomingReferralPoints = 0n
    for (const incoming of incomingReferralPoints) {
      const rpData =
        recipientReferralData.find(
          (r) => r.referralId === incoming.referralId,
        ) ?? defaultReferrerData(incoming.referralId, recipient.id)
      if (rpData) {
        referrerCount += 1
        const incomingReferralPoints =
          (incoming.referralPointsBase * rpData.referrerMultiplier) / 100n
        totalIncomingReferralPoints += incomingReferralPoints
      }
    }

    // torrential thoughts
    // bob refers carol
    // carol refers tom
    // tom refers bob
    // tom wants to know what his points are
    // toms points = 100, + 10 boost for referee, + 10 boost to carol for referral
    // tom referred bob so we check bob's points so we know how much to give tom
    // bobs points = 50, + 5 boost for referee, + 5 boost to tom for referral
    // do we need to dive deeper into bob's reference to carol?
    //  maybe yes because we just calculated some of bob's points and updated our calculation date of those points
    //  we're not going to do that again so any of the points earned there need to be distributed to eligible receivers
    //  we need to go both ways with that for bob, referrers and referees
    //  this creates a web, which could potentially be quite sprawling, and even circular.
    //  so now we calculate carols' points and how they affect bob, and then it circles back to tom
    //  ...and now it seems we need to memoize who we've calculated - so we know when to stop

    recipient.referrerCount = referrerCount
    recipient.points += totalIncomingReferralPoints
    recipient.referralPoints += totalIncomingReferralPoints
    totalPoints += totalIncomingReferralPoints
    memo.set(recipient.id, { referralPoints, totalIncomingReferralPoints })
  }
  return { totalPoints, totalReferralPoints, count: memo.size }
}

/**
 * This will update entity data, which you will have to save later if you want to keep.
 */
const calculatePoints = (
  timestamp: number,
  recipient: LRTPointRecipient,
  balanceData: LRTBalanceData[],
) => {
  const state = useLrtState()
  let points = 0n
  const referralPoints: ReferralPointData[] = []
  for (const data of balanceData) {
    state?.balanceData.set(data.id, data)
    const balanceMult = balanceMultiplier(recipient.balance)
    let timespanEarnedForReferrals = 0n
    const conditionPoints = pointConditions.map((c) => {
      const startTime = Math.max(
        data.staticPointsDate.getTime(),
        c.startDate.getTime(),
        data.balanceDate.getTime(),
      )
      if (timestamp < startTime) return 0n

      const endTime = Math.min(timestamp, c.endDate?.getTime() ?? timestamp)
      if (startTime > endTime) return 0n

      const timespanEarned = calculateTimespanEarned(
        startTime,
        endTime,
        data.balance,
        c.multiplier + balanceMult,
      )
      if (c.name === 'standard') {
        timespanEarnedForReferrals = timespanEarned
      }
      return timespanEarned
    })
    data.staticPoints += sum(conditionPoints)
    data.staticReferralPointsBase += timespanEarnedForReferrals
    data.staticPointsDate = new Date(timestamp)
    points += data.staticPoints
    if (
      data.referralId &&
      isValidReferralId(data.referralId) &&
      !isReferralSelfReferencing(data.referralId, recipient.id)
    ) {
      referralPoints.push({
        referralId: data.referralId,
        referralPointsBase: data.staticReferralPointsBase,
      })
    }
  }
  return { points, referralPoints }
}

/**
 * How many points have been earned since the depositor has had `amount` at `timestamp`.
 */
const calculateTimespanEarned = (
  startTimestamp: number,
  endTimestamp: number,
  amount: bigint,
  multiplier: bigint,
): bigint => {
  const intervals = (endTimestamp - startTimestamp) / pointInterval
  const multipliedAmount = (amount * multiplier) / 100n
  return (
    (parseEther(intervals.toString()) * multipliedAmount * 10_000n) /
    1_000000000_000000000n
  )
}

const balanceMultiplier = (balance: bigint) => {
  return balanceBonuses.find((b) => balance >= b.gte)?.multiplier ?? 0n
}
