export interface CoingeckoDataInput {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

export interface CoingeckoDataOutput {
  [date: string]: {
    prices: number | null
    market_caps: number | null
    total_volumes: number | null
  }
}

export function processCoingeckoData(data: CoingeckoDataInput): CoingeckoDataOutput {
  const result: CoingeckoDataOutput = {}

  // Helper function to convert timestamp to date string
  const timestampToDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toISOString().split('T')[0]
  }

  const dataKeys = Object.keys(data) as (keyof CoingeckoDataInput)[]

  // Process each data category
  dataKeys.forEach((category) => {
    data[category].forEach(([timestamp, value]) => {
      const dateStr = timestampToDate(timestamp)

      // Initialize the object for the date if it doesn't exist
      if (!result[dateStr]) {
        result[dateStr] = {
          prices: null,
          market_caps: null,
          total_volumes: null,
        }
      }

      // Update the relevant category
      result[dateStr][category] = value
    })
  })

  return result
}
