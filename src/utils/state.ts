import { Context } from '../processor'

export const useProcessorState = <T>(
  ctx: Context,
  key: string,
  defaultValue: T,
) => {
  const { state } = ctx
  let value = state.get(key) as T | undefined
  if (!value) {
    value = defaultValue
    state.set(key, value)
  }
  return [
    value,
    (value: T) => {
      state.set(key, value)
    },
  ] as const
}
