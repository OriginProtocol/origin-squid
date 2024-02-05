import { parseEther } from 'viem'

import { LRTBalanceData, LRTPointRecipient } from '../model'
import { Context } from '../processor'
import { balanceBonuses, pointConditions, pointInterval } from './config'
import { useLrtState } from './state'

const sum = (vs: bigint[]) => vs.reduce((sum, v) => sum + v, 0n)

/**
 * This will update entity data, which you will have to save later if you want to keep.
 */
export const calculateRecipientsPoints = (
  timestamp: number,
  recipients: LRTPointRecipient[],
  ctx?: Context,
) => {
  const state = ctx && useLrtState()
  let totalPoints = 0n
  for (const recipient of recipients) {
    state?.recipients.set(recipient.id, recipient)
    recipient.points = calculatePoints(
      timestamp,
      recipient,
      recipient.balanceData,
      ctx,
    )
    recipient.pointsDate = new Date(timestamp)
    totalPoints += recipient.points
  }
  return totalPoints
}

/**
 * This will update entity data, which you will have to save later if you want to keep.
 */
const calculatePoints = (
  timestamp: number,
  recipient: LRTPointRecipient,
  balanceData: LRTBalanceData[],
  ctx?: Context,
) => {
  const state = ctx && useLrtState()
  let totalPoints = 0n
  for (const data of balanceData) {
    state?.balanceData.set(data.id, data)
    const balanceMult = balanceMultiplier(recipient.balance)
    const conditionPoints = pointConditions.map((c) => {
      const startTime = Math.max(
        data.staticPointsDate.getTime(),
        c.startDate.getTime(),
        data.balanceDate.getTime(),
      )
      if (timestamp < startTime) return 0n

      const endTime = Math.min(timestamp, c.endDate?.getTime() ?? timestamp)
      if (startTime > endTime) return 0n

      return calculateTimespanEarned(
        startTime,
        endTime,
        data.balance,
        c.multiplier + balanceMult,
      )
    })
    data.staticPoints = data.staticPoints + sum(conditionPoints)
    data.staticPointsDate = new Date(timestamp)
    totalPoints += data.staticPoints
  }
  return totalPoints
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