import 'tsconfig-paths/register'

import { initProcessorFromDump } from '@utils/dumps'

import arbitrum from './main-arbitrum'
import base from './main-base'
import mainnet from './main-mainnet'
import oeth from './main-oeth'
import oethb from './main-oethb'
import ogv from './main-ogv'
import ousd from './main-ousd'
import plume from './main-plume'
import sonic from './main-sonic'

Promise.all([
  // line by line
  initProcessorFromDump(mainnet),
  initProcessorFromDump(base),
  initProcessorFromDump(arbitrum),
  initProcessorFromDump(oeth),
  initProcessorFromDump(oethb),
  initProcessorFromDump(ogv),
  initProcessorFromDump(ousd),
  initProcessorFromDump(sonic),
  initProcessorFromDump(plume),
]).catch((err) => {
  throw err
})
