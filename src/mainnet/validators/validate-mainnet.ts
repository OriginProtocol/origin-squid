import { ERC20Balance } from '@model'
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
    firstBlock = false
  }
}
