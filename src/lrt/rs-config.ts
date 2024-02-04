import { TokenAddress, tokens } from '../utils/addresses'

export const startBlock = 18758282 // Contract Deploy: 0x036676389e48133b63a802f8635ad39e752d375d
export const from = 18758282

const hourMs = 3600000
const dayMs = hourMs * 24
export const pointInterval = dayMs

// const eth = (val: bigint) => val * 1_000000000_000000000n

interface PointCondition {
  name: string
  multiplier: bigint
  asset?: TokenAddress
  startDate: Date
  endDate?: Date
  duration?: number // Days
}

const launchDate = new Date('2023-12-12')
export const pointConditions: PointCondition[] = [
  { name: 'standard', startDate: launchDate, multiplier: 100n },
  // Points calculation doesn't handle `duration`
  // {
  //   name: 'early',
  //   startDate: new Date('2023-12-12'),
  //   endDate: new Date('2024-01-01'),
  //   duration: 90,
  //   multiplier: 25n,
  // },
]

interface BalanceBonus {
  name: string
  gte: bigint
  multiplier: bigint
}

// Maintain Order
export const balanceBonuses: BalanceBonus[] = []

export const addresses = {
  lrtToken: '0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7',
  lrtDepositPool: '0x036676389e48133B63a802f8635AD39E752D375D',
  lrtOracle: '0x349A73444b1a310BAe67ef67973022020d70020d',
  nodeDelegators: [
    '0x07b96Cf1183C9BFf2E43Acf0E547a8c4E4429473',
    '0x429554411C8f0ACEEC899100D3aacCF2707748b3',
    '0x92B4f5b9ffa1b5DB3b976E89A75E87B332E6e388',
    '0x9d2Fc9287e1c3A1A814382B40AAB13873031C4ad',
    '0xe8038228ff1aEfD007D7A22C9f08DDaadF8374E4',
  ],
}
