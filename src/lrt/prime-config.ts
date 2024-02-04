import { TokenAddress, tokens } from '../utils/addresses'

export const startBlock = 19143860 // Contract Deploy: 0xA479582c8b64533102F6F528774C536e354B8d32
export const from = 19143860

const hourMs = 3600000
export const pointInterval = hourMs

const eth = (val: bigint) => val * 1_000000000_000000000n

interface PointCondition {
  name: string
  multiplier: bigint
  asset?: TokenAddress
  startDate: Date
  endDate?: Date
  duration?: number // Days
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

interface BalanceBonus {
  name: string
  gte: bigint
  multiplier: bigint
}

// Maintain Order
export const balanceBonuses: BalanceBonus[] = [
  { name: 'gte2000', gte: eth(2000n), multiplier: 20n },
  { name: 'gte1000', gte: eth(1000n), multiplier: 15n },
  { name: 'gte100', gte: eth(100n), multiplier: 10n },
  { name: 'gte10', gte: eth(10n), multiplier: 5n },
]

export const lsts = {
  OETH: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
  stETH: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
  mETH: '0xd5f7838f5c461feff7fe49ea5ebaf7728bb0adfa',
  sfrxETH: '0xac3e018457b222d93114458476f3e3416abbe38f',
  swETH: '0xf951e335afb289353dc249e82926178eac7ded78',
  rETH: '0xae78736cd615f374d3085123a210448e74fc6393',
  ETHx: '0xa35b1b31ce002fbf2058d22f30f95d405200a15b',
}

// LRT Addresses: https://github.com/oplabs/primestaked-eth/blob/main/README.md
export const addresses = {
  lrtToken: '0x6ef3D766Dfe02Dc4bF04aAe9122EB9A0Ded25615',
  lrtDepositPool: '0xA479582c8b64533102F6F528774C536e354B8d32',
  lrtOracle: '0xA755c18CD2376ee238daA5Ce88AcF17Ea74C1c32',
  nodeDelegators: [
    {
      address: '0x8bBBCB5F4D31a6db3201D40F478f30Dc4F704aE2',
      blockNumber: 19143860,
    },
  ],
}
