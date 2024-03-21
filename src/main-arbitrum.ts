import { KnownArchives } from '@subsquid/archive-registry/lib/chains'

import { ccip } from './oeth/processors/ccip'
import { run } from './processor'

export const processor = {
  archive: 'arbitrum' as KnownArchives,
  rpcEnv: process.env.RPC_ARBITRUM_ENV,
  stateSchema: 'arbitrum-processor',
  processors: [ccip({ chainId: 42161 })],
  postProcessors: [],
  validators: [],
}
export default processor

if (require.main === module) {
  run(processor)
}
