import { Context } from '../../processor'
import * as sources from './sources'

export const from = Number.MAX_SAFE_INTEGER // does not apply here
export const initialize = async (ctx: Context) => {
  await sources.initialize(ctx)
}
export const process = () => Promise.resolve()
