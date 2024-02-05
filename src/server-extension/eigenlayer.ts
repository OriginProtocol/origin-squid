import axios from 'axios'
import { Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { parseEther } from 'viem'

@Resolver()
export class EigenLayerResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => BigInt)
  async totalEigenLayerPoints(): Promise<bigint> {
    return await fetchEigenLayerPoints()
      .then((r) => parseEther(r.g.toString()))
      .catch((err) => {
        console.log(err)
        return 0n
      })
  }
}

export const fetchEigenLayerPoints = async () => {
  const URL = 'https://app.eigenlayer.xyz/api/trpc/'
  const PARAMS =
    'tokenStaking.getStrategyStatsForStaker,price.getPrices,nativeStaking.getNativeStakingSummaryByEigenpod?batch=1&input='
  const INPUT =
    '%7B%220%22%3A%7B%20%22json%22%3A%7B%22staker%22%3A%22{}%22%7D%7D%2C%221%22%3A%7B%20%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%2C%222%22%3A%7B%22json%22%3A%7B%22podOwnerAddress%22%3A%220x0000000000000000000000000000000000000000%22%7D%7D%7D'
  const ADDRESS = '0x0000000000000000000000000000000000000000'

  const API = URL + PARAMS + INPUT.replace('{}', ADDRESS)

  const response = await axios.get<
    [
      {
        result: {
          data: {
            meta: {
              values: {
                '3.totalIntegratedShares': string[]
                '8.lastUpdateBlockTime': string[]
                '7.lastUpdateBlockNumber': string[]
                '0.integratedShares': string[]
                '3.lastUpdateBlockTime': string[]
                '2.lastUpdateBlockTime': string[]
                '0.lastUpdateBlockNumber': string[]
                '2.totalIntegratedShares': string[]
                '4.totalIntegratedShares': string[]
                '5.totalShares': string[]
                '4.totalShares': string[]
                '1.lastUpdateBlockNumber': string[]
                '4.lastUpdateBlockTime': string[]
                '1.totalIntegratedShares': string[]
                '2.integratedShares': string[]
                '1.lastUpdateBlockTime': string[]
                '6.totalShares': string[]
                '7.totalShares': string[]
                '4.shares': string[]
                '6.shares': string[]
                '8.shares': string[]
                '8.integratedShares': string[]
                '8.totalShares': string[]
                '0.totalIntegratedShares': string[]
                '2.lastUpdateBlockNumber': string[]
                '5.integratedShares': string[]
                '5.lastUpdateBlockTime': string[]
                '3.lastUpdateBlockNumber': string[]
                '0.lastUpdateBlockTime': string[]
                '7.totalIntegratedShares': string[]
                '0.shares': string[]
                '4.integratedShares': string[]
                '1.shares': string[]
                '2.shares': string[]
                '3.shares': string[]
                '6.integratedShares': string[]
                '4.lastUpdateBlockNumber': string[]
                '6.lastUpdateBlockTime': string[]
                '3.integratedShares': string[]
                '8.totalIntegratedShares': string[]
                '7.integratedShares': string[]
                '5.lastUpdateBlockNumber': string[]
                '3.totalShares': string[]
                '5.totalIntegratedShares': string[]
                '2.totalShares': string[]
                '7.shares': string[]
                '7.lastUpdateBlockTime': string[]
                '1.totalShares': string[]
                '5.shares': string[]
                '6.lastUpdateBlockNumber': string[]
                '0.totalShares': string[]
                '1.integratedShares': string[]
                '8.lastUpdateBlockNumber': string[]
                '6.totalIntegratedShares': string[]
              }
              referentialEqualities: {
                '0.lastUpdateBlockNumber': string[]
                '0.lastUpdateBlockTime': string[]
                '2.shares': string[]
              }
            }
            json: {
              shares: string
              lastUpdateBlockNumber: string
              integratedShares: string
              lastUpdateBlockTime: string
              strategyAddress: string
              totalIntegratedShares: string
              totalShares: string
            }[]
          }
        }
      },
      {
        result: {
          data: {
            json: {
              tokenPrices: {
                'origin-ether': { usd: number }
                'wrapped-beacon-eth': { usd: number }
                'coinbase-wrapped-staked-eth': { usd: number }
                'mantle-staked-ether': { usd: number }
                'staked-frax-ether': { usd: number }
                ankreth: { usd: number }
                ethereum: { usd: number }
                'liquid-staked-ethereum': { usd: number }
                'staked-ether': { usd: number }
                'stader-ethx': { usd: number }
                'stakewise-v3-oseth': { usd: number }
                sweth: { usd: number }
                'rocket-pool-eth': { usd: number }
              }
            }
          }
        }
      },
      {
        result: {
          data: {
            json: {
              globalStats: {
                balance: number
                validators: number
                points: number
              }
              podInfo: { address: null; slashingPresent: null }
              podStats: { balance: number; validators: number; points: number }
            }
          }
        }
      },
    ]
  >(API, { withCredentials: false })

  const sData = response.data?.[0]['result']['data']['json']
  const pData = response.data?.[1]['result']['data']['json']['tokenPrices']
  const gData = response.data?.[2]['result']['data']['json']['globalStats']

  let uPoints = 0
  let gPoints = 0
  const nPoints = gData['points']
  let block = '0'
  let lastTimestamp = '0'

  // Process staking data
  for (const stake of sData) {
    const uIshares = parseFloat(stake['integratedShares'])
    const gIshares = parseFloat(stake['totalIntegratedShares'])
    uPoints += uIshares / 1e18 / 3600
    gPoints += gIshares / 1e18 / 3600
    block = stake['lastUpdateBlockNumber']
    lastTimestamp = stake['lastUpdateBlockTime']
  }

  return {
    a: parseInt(block),
    b: parseInt(lastTimestamp),
    c: ADDRESS,
    d: parseFloat(uPoints.toFixed(2)),
    e: parseFloat(gPoints.toFixed(2)),
    f: parseFloat(nPoints.toFixed(2)),
    g: parseFloat((uPoints + gPoints + nPoints).toFixed(2)),
    h: JSON.stringify(sData),
    i: JSON.stringify(pData),
    j: JSON.stringify(gData),
    k: lastTimestamp,
  }
}
