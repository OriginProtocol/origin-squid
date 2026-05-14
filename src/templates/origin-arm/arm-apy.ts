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

  const result = calculateAPY(
    startOfDay,
    endOfDay,
    previousDailyStat?.assetsPerShare ?? 10n ** 18n,
    state.assetsPerShare,
  )
  // Guard against bad on-chain data producing absurd APYs. Anything above
  // 1000% is treated as noise and zeroed out.
  if (result.apy > 10) return { apr: 0, apy: 0 }
  return result
}
