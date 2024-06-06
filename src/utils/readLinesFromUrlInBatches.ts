import fetch from 'node-fetch'
import * as readline from 'readline'
import { Readable } from 'stream'

export async function readLinesFromUrlInBatches(
  url: string,
  batchSize: number,
  fn: (lines: string[]) => Promise<void>,
): Promise<void> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch the file: ${response.statusText}`)
  }

  const stream = response.body as Readable
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity, // Handle different newline characters correctly
  })

  let batch: string[] = []
  for await (const line of rl) {
    batch.push(line)
    if (batch.length === batchSize) {
      await fn(batch)
      batch = []
    }
  }
  if (batch.length > 0) {
    await fn(batch)
  }
}
