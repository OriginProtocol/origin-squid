export const parallel = async <T>(fns: (() => Promise<T>)[], concurrency: number) => {
  const results: T[] = []
  let promises: Promise<T>[] = []
  for (const fn of fns) {
    promises.push(fn())
    if (promises.length >= concurrency) {
      const result = await Promise.race(promises)
      results.push(result)
      promises = promises.filter((p) => p !== result)
    }
  }
  results.push(...(await Promise.all(promises)))
  return results
}
