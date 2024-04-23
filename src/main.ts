import 'tsconfig-paths/register'

import { run } from '@processor'

import arbitrum from './main-arbitrum'
import mainnet from './main-mainnet'
import oeth from './main-oeth'
import ogv from './main-ogv'
import ousd from './main-ousd'

// run(mainnet)
// run(arbitrum)
run(oeth)
// run(ogv)
run(ousd)
