import { Context } from '@processor'

import { processCoingeckoData } from './coingecko'
import { queryClient } from './queryClient'

export async function getCoingeckoData(
  ctx: Context,
  props: {
    coinId: 'origin-dollar' | 'origin-ether' | 'super-oeth' | 'origin-dollar-governance' | 'origin-protocol'
    vsCurrency?: 'eth' | 'usd'
    startTimestamp?: number
  },
) {
  const vsCurrency = props.vsCurrency || 'usd'
  const coingeckoURL = `https://api.coingecko.com/api/v3/coins/${props.coinId}/market_chart?vs_currency=${vsCurrency}&days=365&interval=daily&precision=18`
  const coingeckoJson = await queryClient.fetchQuery({
    queryKey: [coingeckoURL],
    queryFn: async () => {
      console.log('Fetching Coingecko market data')
      const response = await fetch(coingeckoURL)
      if (response.status === 429) {
        throw new Error('Coingecko rate limited')
      }
      const result = await response.json()
      console.log(`Found ${result.prices.length} prices`)
      return result
    },

    staleTime: 600_000, // 10 minutes
  })

  const result = processCoingeckoData(coingeckoJson)
  return result
}
