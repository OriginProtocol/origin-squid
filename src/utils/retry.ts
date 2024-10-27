export const retry = async <T>(fn: () => Promise<T>, retries: number) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (e) {
      console.error(e)
      if (i === retries - 1) {
        throw e
      } else {
        console.log(`Retrying... ${i + 1} of ${retries}`)
      }
    }
  }
}
