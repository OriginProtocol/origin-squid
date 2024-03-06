import { run } from './processor'
import * as staking from './staking/processors/staking'

/*
  interface Processor {
    name?: string
    from?: number
    initialize?: (ctx: Context) => Promise<void> // To only be run once per `sqd process`.
    setup?: (p: ReturnType<typeof createSquidProcessor>) => void
    process: (ctx: Context) => Promise<void>
  }
 */

export const processor = {
  stateSchema: 'staking-processor',
  processors: [staking],
  postProcessors: [],
  validators: [],
}
export default processor

if (require.main === module) {
  run(processor)
}
