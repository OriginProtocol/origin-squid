import { uniq } from 'lodash'

import lrt from './main-lrt'
import { run } from './processor'

run({
  processors: uniq([...lrt.processors]),
  postProcessors: uniq([...lrt.postProcessors]),
  validators: uniq([...lrt.validators]),
})
