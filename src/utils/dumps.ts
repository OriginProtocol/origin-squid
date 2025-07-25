import { SquidProcessor, run } from '@originprotocol/squid-utils'

import { DBDumpManager } from './db-dump-manager'

export async function checkAndRestoreDump(processorName: string) {
  const dumpManager = new DBDumpManager()

  try {
    // Check if we've already restored a dump
    const hasRestored = await dumpManager.hasRestoredDump(processorName)
    if (hasRestored) {
      const blockHeight = await dumpManager.getRestoredBlockHeight(processorName)
      console.log(`Database dump already restored at block height ${blockHeight}, skipping...`)
      return blockHeight
    }

    // List available dumps
    const dumps = await dumpManager.listAvailableDumps()
    const processorDumps = dumps.filter((d) => d.processorName === processorName)

    if (processorDumps.length === 0) {
      await dumpManager.markDumpAsRestored({ processorName, blockHeight: 0 })
      console.log(`No database dumps found for ${processorName}`)
      return null
    }

    // Get the latest dump
    const latestDump = processorDumps.reduce((latest, current) =>
      current.blockHeight > latest.blockHeight ? current : latest,
    )

    console.log(`Found database dump at block height ${latestDump.blockHeight}`)
    await dumpManager.restoreDump(latestDump)
    console.log('Database dump restored successfully')
    return latestDump.blockHeight
  } finally {
    await dumpManager.close()
  }
}

export async function initProcessorFromDump(processor: SquidProcessor) {
  if (!process.env.BLOCK_FROM && !process.env.BLOCK_FROM) {
    const blockHeight = await checkAndRestoreDump(processor.stateSchema)
    if (blockHeight) {
      console.log(`Starting processor from block height ${blockHeight}`)
      // Update processor configuration to start from the restored block height
      processor.processors.forEach((p) => {
        if ('from' in p) {
          p.from = blockHeight + 1
        }
      })
    }
  }
  return run(processor)
}
