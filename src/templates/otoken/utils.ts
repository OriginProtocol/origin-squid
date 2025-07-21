import { OToken_2025_03_04 } from './otoken-2025-03-04'
import { OToken_2025_07_01 } from './otoken-2025-07-01'
import { OTokenClass } from './types'

export const isYieldDelegationContract = (otoken: OTokenClass) => {
  return otoken instanceof OToken_2025_03_04 || otoken instanceof OToken_2025_07_01
}
