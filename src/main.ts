import { TypeormDatabase } from '@subsquid/typeorm-store'
import { processor } from './processor'

import * as oethProcessor from './processors/oeth'
import * as vaultProcessor from './processors/vault'
import * as fraxStakingProcessor from './processors/frax-staking'
import * as morphoAaveProcessor from './processors/morpho-aave'
import * as dripperProcessor from './processors/dripper'

oethProcessor.setup(processor)
vaultProcessor.setup(processor)
fraxStakingProcessor.setup(processor)
morphoAaveProcessor.setup(processor)
dripperProcessor.setup(processor)

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  let start = Date.now()
  const time = (name: string) => () =>
    ctx.log.info(`${name} ${Date.now() - start}ms`)
  // The idea is that these processors have zero dependencies on one another and can be processed asynchronously.
  await Promise.all([
    oethProcessor.process(ctx).then(time('oethProcessor')), // This processor is slow. Likely due to the high quantity of address balance lookups.
    vaultProcessor.process(ctx),
    fraxStakingProcessor.process(ctx),
    morphoAaveProcessor.process(ctx),
    dripperProcessor.process(ctx),
  ])
})
