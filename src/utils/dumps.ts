import { sonic } from 'viem/chains'

import { SquidProcessor, chainConfigs, createPortalClient, run, runPortal } from '@originprotocol/squid-utils'

import { withPortalCache } from '../polyfills/portal-cache'
import { setupRpcCache } from '../polyfills/rpc-cache'
import { setupRpcRetryEmpty } from '../polyfills/rpc-retry-empty'
import { DBDumpManager } from './db-dump-manager'

/**
 * Chain ids that stay on the gateway-era SDK (`run()`); everything else runs on
 * the Portal SDK (`runPortal()`), consuming the portal's real-time `/stream`
 * instead of polling RPC for the chain head.
 *
 * Sonic is here because it has no real-time Portal dataset — gateway, `/stream`
 * and `/finalized` all sit at the same stalled height. `GATEWAY_CHAIN_IDS` is
 * env-driven so a single container can be rolled back onto the old path without
 * a code change: `GATEWAY_CHAIN_IDS=1,146` to add mainnet, `GATEWAY_CHAIN_IDS=`
 * to put every chain on the portal.
 */
const gatewayChainIds = new Set(
  (process.env.GATEWAY_CHAIN_IDS ?? String(sonic.id))
    .split(',')
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isFinite(id)),
)

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
  // Must precede setupRpcCache so the cache only ever sees settled results —
  // a transient empty `0x` recorded to disk replays forever.
  setupRpcRetryEmpty()
  setupRpcCache(processor.stateSchema)
  if (process.env.NODE_ENV !== 'development' && !process.env.BLOCK_FROM && !process.env.BLOCK_TO) {
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

  const chainId = processor.chainId ?? 1
  if (gatewayChainIds.has(chainId)) {
    console.log(`Gateway SDK path (chain ${chainId})`)
    return run(processor)
  }
  console.log(`Portal SDK path (chain ${chainId})`)
  // The cache wraps a client *instance* rather than `PortalClient.prototype`;
  // the install tree resolves more than one physical copy of the class.
  processor.portalClient = withPortalCache(createPortalClient(chainConfigs[chainId]), processor.stateSchema)
  return runPortal(processor)
}
