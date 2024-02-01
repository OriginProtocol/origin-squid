import * as lrt from './lrt'
import { run } from './processor'

export const processor = {
  stateSchema: 'lrt-processor',
  processors: [lrt],
}
export default processor

if (require.main === module) {
  run(processor)
}
