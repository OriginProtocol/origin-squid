let state = new Map<string, unknown>()
export const resetProcessorState = () => {
  state = new Map<string, unknown>()
}
export const useProcessorState = <T>(key: string, defaultValue: T) => {
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
