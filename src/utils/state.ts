import { Context } from '@processor'

export const cached = <I extends [Context, ...any[]], R>(
  keyFn: (...params: I) => string,
  fn: (...params: I) => Promise<R>,
) => {
  return async (...params: I) => {
    const [state, setState] = useProcessorState<R | undefined>(params[0], keyFn(...params), undefined)
    if (state) return state
    const result = await fn(...params)
    setState(result)
    return result
  }
}

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

/**
 * Not for continuously updating state within a single context.
 * Use this to distribute state throughout processors one time.
 * *Not for gradual/continuous update within the context.*
 */
export const publishProcessorState = <T>(ctx: Context, key: string, state: T) => {
  const [, setState] = useProcessorState<T>(ctx, `waitForProcessorState:${key}`)
  const [listeners] = useProcessorState<((state: T) => void)[]>(ctx, `waitForProcessorState-listeners:${key}`, [])
  setState(state)
  listeners.forEach((listener) => listener(state))
}

/**
 * Wait for processor state to be set and retrieve it.
 */
export const waitForProcessorState = <T>(ctx: Context, key: string) => {
  return new Promise<T>((resolve) => {
    const [state] = useProcessorState<T>(ctx, `waitForProcessorState:${key}`)
    if (state) resolve(state)
    const [listeners] = useProcessorState<((state: T) => void)[]>(ctx, `waitForProcessorState-listeners:${key}`, [])
    listeners.push(resolve)
  })
}
