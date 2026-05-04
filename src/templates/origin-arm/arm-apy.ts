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
