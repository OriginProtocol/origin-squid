import 'tsconfig-paths/register'

import { run } from '@originprotocol/squid-utils'

import arbitrum from './main-arbitrum'
import base from './main-base'
import mainnet from './main-mainnet'
import oeth from './main-oeth'
import ogv from './main-ogv'
import ousd from './main-ousd'

run(mainnet)
run(base)
run(arbitrum)
run(oeth)
run(ogv)
run(ousd)
