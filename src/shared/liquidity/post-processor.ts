import { Context } from '../../processor'
import * as balances from './balances'

export const process = async (ctx: Context) => {
  await balances.postProcess(ctx)
}
