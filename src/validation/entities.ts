import { sortBy } from 'lodash'

import entitiesData from './entities.json'

const e = (arr: any[]) => {
  return sortBy(arr, (v) => v.blockNumber)
}

export const entities: Record<keyof typeof entitiesData, any[]> = entitiesData
for (const key of Object.keys(entities)) {
  entities[key as keyof typeof entities] = e(entities[key as keyof typeof entities])
}
