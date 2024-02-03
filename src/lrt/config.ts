import { TokenAddress, tokens } from '../utils/addresses'

const eth = (val: bigint) => val * 1_000000000_000000000n

interface PointCondition {
  name: string
  multiplier: bigint
  asset?: TokenAddress
  startDate: Date
  endDate?: Date
}

const launchDate = new Date('2024-01-05')
export const pointConditions: PointCondition[] = [
  {
    name: 'oeth-2x',
    startDate: launchDate,
    asset: tokens.OETH,
    multiplier: 100n,
  },
  {
    name: 'week1-5x',
    startDate: launchDate,
    endDate: new Date('2024-02-06'),
    multiplier: 100n,
  },
  {
    name: 'week1-4x',
    startDate: launchDate,
    endDate: new Date('2024-02-07'),
    multiplier: 100n,
  },
  {
    name: 'week1-3x',
    startDate: launchDate,
    endDate: new Date('2024-02-08'),
    multiplier: 100n,
  },
  {
    name: 'week1-2x',
    startDate: launchDate,
    endDate: new Date('2024-02-09'),
    multiplier: 100n,
  },
  { name: 'standard', startDate: launchDate, multiplier: 100n },
]

// Maintain Order
export const balanceBonuses = [
  { name: 'gte2000', gte: eth(2000n), multiplier: 20n },
  { name: 'gte1000', gte: eth(1000n), multiplier: 15n },
  { name: 'gte100', gte: eth(100n), multiplier: 10n },
  { name: 'gte10', gte: eth(10n), multiplier: 5n },
]
