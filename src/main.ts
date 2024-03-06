import { uniq } from 'lodash'

import oeth from './main-oeth'
import ogv from './main-ogv'
import other from './main-other'
import ousd from './main-ousd'
import staking from './main-staking'
import { run } from './processor'

run({
  processors: uniq([
    ...oeth.processors,
    ...ousd.processors,
    ...ogv.processors,
    ...other.processors,
    ...staking.processors,
  ]),
  postProcessors: uniq([
    ...oeth.postProcessors,
    ...ousd.postProcessors,
    ...ogv.postProcessors,
    ...other.postProcessors,
    ...staking.postProcessors,
  ]),
  validators: uniq([
    ...oeth.validators,
    ...ousd.validators,
    ...ogv.validators,
    ...other.validators,
    ...staking.validators,
  ]),
})
