import { invert } from 'lodash'

type InvertedMap<T extends Record<string, any>> = {
  [K in keyof T as T[K]]: K
}
export const invertMap = <Map extends Record<K, V>, K extends string | number, V extends any>(map: Map) => {
  return invert(map) as InvertedMap<Map>
}
