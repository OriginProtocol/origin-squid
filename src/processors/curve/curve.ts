import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { pad } from 'viem'

import * as baseRewardPool from '../../abi/base-reward-pool'
import * as curveLpToken from '../../abi/curve-lp-token'
import * as erc20 from '../../abi/erc20'
import { CurvePoolBalance } from '../../model'
import { Context } from '../../processor'
import { createCurveSetup } from '../../processor-templates/curve'
import {
  OETH_ADDRESS,
  OETH_CONVEX_ADDRESS,
  OETH_CURVE_LP_ADDRESS,
  OETH_CURVE_REWARD_LP_ADDRESS,
} from '../../utils/addresses'
import { getEthBalance } from '../../utils/getEthBalance'
import { getLatestEntity, trackAddressBalances } from '../utils'

interface ProcessResult {
  curvePoolBalances: CurvePoolBalance[]
}

export const from = Math.min(99999999)

export const setup = createCurveSetup({})

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    curvePoolBalances: [],
  }

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
    }
  }

  await ctx.store.insert(result.curvePoolBalances)
}
