import { superOETHb } from 'oethb/super-oeth-b'
import 'tsconfig-paths/register'
import { base } from 'viem/chains'

import { defineSquidProcessor, run } from '@originprotocol/squid-utils'
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates'
import { processStatus } from '@templates/processor-status'
import { DEFAULT_FIELDS } from '@utils/batch-proccesor-fields'
import { DBDumpManager } from '@utils/db-dump-manager'

import * as validate from './oethb/validate'

async function checkAndRestoreDump() {
  const dumpManager = new DBDumpManager()

  try {
    // Check if we've already restored a dump
    const hasRestored = await dumpManager.hasRestoredDump('oethb-processor')
    if (hasRestored) {
      const blockHeight = await dumpManager.getRestoredBlockHeight('oethb-processor')
      console.log(`Database dump already restored at block height ${blockHeight}, skipping...`)
      return blockHeight
    }

    // List available dumps
    const dumps = await dumpManager.listAvailableDumps()
    const processorDumps = dumps.filter((d) => d.processorName === 'oethb-processor')

    if (processorDumps.length === 0) {
      console.log('No database dumps found for oethb-processor')
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

export const processor = defineSquidProcessor({
  chainId: base.id,
  stateSchema: 'oethb-processor',
  processors: [...superOETHb],
  postProcessors: [exchangeRatesPostProcessor, processStatus('oethb')],
  validators: [validate],
  fields: DEFAULT_FIELDS,
})

export default processor

if (require.main === module) {
  // Check for and restore dump before starting the processor
  checkAndRestoreDump()
    .then((blockHeight) => {
      if (blockHeight) {
        console.log(`Starting processor from block height ${blockHeight}`)
        // Update processor configuration to start from the restored block height
        processor.processors.forEach((p) => {
          if ('from' in p) {
            p.from = blockHeight
          }
        })
      }
      return run(processor)
    })
    .catch((error) => {
      throw error
    })
}
