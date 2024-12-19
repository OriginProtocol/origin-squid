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
import { entities } from '@validation/entities'
import { validateBlocks } from '@validation/validate'

export const name = 'validate-mainnet'

const expectationSets = [
  { entity: ERC20Balance, expectations: entities.ogn_erc20Balances },
  { entity: ERC20Balance, expectations: entities.oeth_erc20Balances },
  { entity: ArmDailyStat, expectations: entities.lidoarm_armDailyStats },
  { entity: ArmState, expectations: entities.lidoarm_armStates },
  { entity: ArmWithdrawalRequest, expectations: entities.lidoarm_armWithdrawalRequests },
  { entity: TransactionDetails, expectations: entities.lidoarm_transactionDetails },
  { entity: OGNDailyStat, expectations: entities.ognDailyStats },
  { entity: BeaconDepositEvent, expectations: entities.beaconDepositEvents },
]

export const process = async (ctx: Context) => {
  await validateBlocks(ctx, expectationSets)
}
