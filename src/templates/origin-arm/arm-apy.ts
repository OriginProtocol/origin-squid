import dayjs from 'dayjs'

import { ArmDailyStat, ArmState } from '@model'
import { Block, calculateAPY } from '@originprotocol/squid-utils'

export const calculateArmDailyApy = ({
  block,
  state,
  previousDailyStat,
}: {
  block: Block
  state: ArmState
  previousDailyStat?: ArmDailyStat
}) => {
  const date = new Date(block.header.timestamp)
  const startOfDay = dayjs(date).startOf('day').toDate()
  const endOfDay = dayjs(date).endOf('day').toDate()

  return calculateAPY(startOfDay, endOfDay, previousDailyStat?.assetsPerShare ?? 10n ** 18n, state.assetsPerShare)
}

export const convertSharesToAssets = (shares: bigint, assetsPerShare: bigint) => (shares * assetsPerShare) / 10n ** 18n

export const calculateArmAddressRoi = ({
  deposited,
  withdrawn,
  balance,
  assetsPerShare,
}: {
  deposited: bigint
  withdrawn: bigint
  balance: bigint
  assetsPerShare: bigint
}) => {
  const currentValue = convertSharesToAssets(balance, assetsPerShare)
  const earned = currentValue + withdrawn - deposited
  const roi = deposited === 0n ? 0 : Number(earned) / Number(deposited)

  return { currentValue, earned, roi }
}
