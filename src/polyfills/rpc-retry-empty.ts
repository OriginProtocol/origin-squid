/**
 * Retries `eth_call` responses that come back as empty `0x`.
 *
 * Providers — drpc's load balancer among them — intermittently answer
 * `eth_call` with `{"result":"0x"}` under sustained load: HTTP 200, no
 * JSON-RPC error, just no data. Measured at ~2% of calls at 64-way
 * concurrency against a contract that returns a value at every block.
 *
 * Nothing below us treats that as a failure. `@subsquid/rpc-client` only
 * retries transport and JSON-RPC *errors*, so the empty result is handed
 * straight to `decodeResult`, which throws `FunctionResultDecodeError`
 * ("Cannot convert 0x to a BigInt" / "Invalid array length") from whichever
 * contract call happened to draw the short straw. The symptom is
 * indistinguishable from a genuine contract bug and moves between unrelated
 * contracts run to run.
 *
 * A deployed contract cannot legitimately return empty for a function with a
 * declared return type — an unknown selector reverts, and a revert arrives as
 * an RPC error rather than as `0x`. So an empty result is either a provider
 * fault (retryable) or a call against an address with no code (not, but also
 * harmless to retry a bounded number of times).
 *
 * Install BEFORE `setupRpcCache` so the cache wraps this and only ever sees
 * settled results — otherwise a transient empty gets persisted and replays
 * forever, immune to switching providers.
 *
 * Env knobs:
 *   RPC_RETRY_EMPTY            set falsy to disable (default on)
 *   RPC_RETRY_EMPTY_ATTEMPTS   total attempts per call (default 3)
 *   RPC_RETRY_EMPTY_DELAY_MS   base backoff, doubled per attempt (default 50)
 */
import { CallOptions, RpcClient } from '@subsquid/rpc-client'
import { RpcCall } from '@subsquid/rpc-client/src/interfaces'

const isEmpty = (value: unknown): boolean => value === '0x'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function setupRpcRetryEmpty(): void {
  if (process.env.RPC_RETRY_EMPTY && !/^(1|true|yes)$/i.test(process.env.RPC_RETRY_EMPTY)) return

  const attempts = Math.max(1, Number(process.env.RPC_RETRY_EMPTY_ATTEMPTS ?? 3))
  const baseDelay = Math.max(0, Number(process.env.RPC_RETRY_EMPTY_DELAY_MS ?? 50))
  if (attempts === 1) return

  const inner = RpcClient.prototype.call
  const innerBatch = RpcClient.prototype.batchCall

  let recovered = 0
  let exhausted = 0
  const report = (address: unknown, block: unknown, ok: boolean) => {
    if (ok) {
      recovered++
      if (recovered === 1 || recovered % 50 === 0) {
        console.warn(`[rpc-retry-empty] recovered ${recovered} empty eth_call result(s) so far (latest ${address} @ ${block})`)
      }
    } else {
      exhausted++
      console.warn(
        `[rpc-retry-empty] eth_call still empty after ${attempts} attempts: to=${address} block=${block}. ` +
          `Treating as a genuine empty result; a decode error downstream means the provider is dropping calls.`,
      )
    }
  }

  const describe = (params: unknown): [unknown, unknown] => {
    const p = params as [{ to?: unknown }, unknown] | undefined
    return [p?.[0]?.to ?? 'unknown', p?.[1] ?? 'unknown']
  }

  RpcClient.prototype.call = async function <T = any>(method: string, params?: any[], options?: CallOptions<T>): Promise<T> {
    let result = (await inner.call(this, method, params, options)) as T
    if (method !== 'eth_call' || !isEmpty(result)) return result

    const [address, block] = describe(params)
    for (let attempt = 2; attempt <= attempts; attempt++) {
      await sleep(baseDelay * (attempt - 1))
      result = (await inner.call(this, method, params, options)) as T
      if (!isEmpty(result)) {
        report(address, block, true)
        return result
      }
    }
    report(address, block, false)
    return result
  }

  RpcClient.prototype.batchCall = async function <T = any>(batch: RpcCall[], options?: CallOptions<T>): Promise<T[]> {
    const out = (await innerBatch.call(this, batch, options)) as T[]

    let pending = batch.map((c, i) => i).filter((i) => batch[i].method === 'eth_call' && isEmpty(out[i]))
    if (pending.length === 0) return out

    for (let attempt = 2; attempt <= attempts && pending.length > 0; attempt++) {
      await sleep(baseDelay * (attempt - 1))
      const retryBatch = pending.map((i) => batch[i])
      const fetched = (await innerBatch.call(this, retryBatch, options)) as T[]
      const stillEmpty: number[] = []
      for (let j = 0; j < pending.length; j++) {
        const i = pending[j]
        const value = fetched[j]
        if (isEmpty(value)) {
          stillEmpty.push(i)
        } else {
          out[i] = value
          const [address, block] = describe(batch[i].params)
          report(address, block, true)
        }
      }
      pending = stillEmpty
    }

    for (const i of pending) {
      const [address, block] = describe(batch[i].params)
      report(address, block, false)
    }
    return out
  }
}
