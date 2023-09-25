import { TypeormDatabase } from '@subsquid/typeorm-store';
import { processor } from './processor';

import oethHandler from './handlers/oeth.handler'
import governanceHandler from './handlers/governance.handler'
import veogvHandler from './handlers/veogv.handler';

/**
 * Process on-chain data
 *
 */
processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  await oethHandler(ctx)
  await governanceHandler(ctx)
  await veogvHandler(ctx)
});
