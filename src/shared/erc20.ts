import { ERC20Balance, ERC20Holder, ERC20State, ERC20Transfer } from '@model'
import { Context } from '@processor'
import { publishProcessorState, waitForProcessorState } from '@utils/state'

interface State {
  states: Map<string, ERC20State>
  balances: Map<string, ERC20Balance>
  transfers: Map<string, ERC20Transfer>
  holders: Map<string, ERC20Holder>
}

export const waitForERC20State = (ctx: Context, address: string) => {
  return waitForProcessorState<State>(ctx, `erc20-${address}`)
}

export const publishERC20State = (ctx: Context, address: string, state: State) => {
  publishProcessorState(ctx, `erc20-${address}`, state)
}
