import {
  ArmDailyStat,
  ArmState,
  ArmWithdrawalRequest,
  BeaconDepositEvent,
  ERC20Balance,
  OGNDailyStat,
  TransactionDetails,
} from '@model'
import { Context } from '@processor'
import { env } from '@utils/env'
import { entities } from '@validation/entities'
import { validateExpectations } from '@validation/validate'

export const name = 'validate-mainnet'

let firstBlock = true

export const process = async (ctx: Context) => {
  if (env.BLOCK_FROM || env.PROCESSOR) return
  for (const block of ctx.blocks) {
    await validateExpectations(ctx, block, ERC20Balance, firstBlock, entities.ogn_erc20Balances)
    await validateExpectations(ctx, block, ERC20Balance, firstBlock, entities.oeth_erc20Balances)
    await validateExpectations(ctx, block, ArmDailyStat, firstBlock, entities.lidoarm_armDailyStats)
    await validateExpectations(ctx, block, ArmState, firstBlock, entities.lidoarm_armStates)
    await validateExpectations(ctx, block, ArmWithdrawalRequest, firstBlock, entities.lidoarm_armWithdrawalRequests)
    await validateExpectations(ctx, block, TransactionDetails, firstBlock, entities.lidoarm_transactionDetails)
    await validateExpectations(ctx, block, OGNDailyStat, firstBlock, entities.ognDailyStats)
    await validateExpectations(ctx, block, BeaconDepositEvent, firstBlock, entities.beaconDepositEvents)
    firstBlock = false
  }
}
