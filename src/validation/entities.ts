import { sortBy } from 'lodash'

import entitiesData from './entities.json'
import manualEntitiesData from './manual-entities.json'

const e = (arr: any[]) => {
  return sortBy(arr, (v) => v.blockNumber)
}

export const entities: Record<keyof typeof entitiesData, any[]> = entitiesData
for (const key of Object.keys(entities)) {
  entities[key as keyof typeof entities] = e(entities[key as keyof typeof entities])
}

export const manualEntities: Record<keyof typeof manualEntitiesData, any[]> = manualEntitiesData
for (const key of Object.keys(manualEntities)) {
  manualEntities[key as keyof typeof manualEntities] = e(manualEntities[key as keyof typeof manualEntities])
}
