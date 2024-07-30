import { createERC20SimpleTracker } from '@templates/erc20-simple'
import { OGN_BASE_ADDRESS } from '@utils/addresses'

export const baseERC20s = createERC20SimpleTracker({
  from: 15676145,
  address: OGN_BASE_ADDRESS,
})
