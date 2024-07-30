import { createERC20Tracker } from '@templates/erc20'
import { WOETH_ARBITRUM_ADDRESS } from '@utils/addresses'

export const arbitrumERC20s = createERC20Tracker({
  from: 178662968,
  address: WOETH_ARBITRUM_ADDRESS,
})
