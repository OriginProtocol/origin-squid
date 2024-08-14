export const batchPromises = async <T>(fns: (() => Promise<T>)[], concurrency = 10) => {
  const results: T[] = []
  while (fns.length) {
    results.push(...(await Promise.all(fns.splice(0, concurrency).map((f) => f()))))
  }
  return results
}
