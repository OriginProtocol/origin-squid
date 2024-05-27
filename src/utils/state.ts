import { Context } from '@processor'

export const useProcessorState = <T>(ctx: Context, key: string, defaultValue?: T) => {
  const { __state } = ctx
  let value = __state.get(key) as T | undefined
  if (!value) {
    value = defaultValue
    __state.set(key, value)
  }
  return [
    value as T,
    (value: T) => {
      __state.set(key, value)
    },
  ] as const
}

export const publishProcessorState = <T>(ctx: Context, key: string, state: T) => {
  const [, setState] = useProcessorState<T>(ctx, `waitForProcessorState:${key}`)
  const [listeners] = useProcessorState<((state: T) => void)[]>(ctx, `waitForProcessorState-listeners:${key}`, [])
  setState(state)
  listeners.forEach((listener) => listener(state))
}

export const waitForProcessorState = <T>(ctx: Context, key: string) => {
  return new Promise<T>((resolve) => {
    const [state] = useProcessorState<T>(ctx, `waitForProcessorState:${key}`)
    if (state) resolve(state)
    const [listeners] = useProcessorState<((state: T) => void)[]>(ctx, `waitForProcessorState-listeners:${key}`, [])
    listeners.push(resolve)
  })
}
