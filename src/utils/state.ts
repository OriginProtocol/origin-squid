import { Context } from '../processor'

export const useProcessorState = <T>(
  ctx: Context,
  key: string,
  defaultValue: T,
) => {
  const { __state } = ctx
  let value = __state.get(key) as T | undefined
  if (!value) {
    value = defaultValue
    __state.set(key, value)
  }
  return [
    value,
    (value: T) => {
      __state.set(key, value)
    },
  ] as const
}
