import { createERC20Tracker } from '@templates/erc20'
import { WOETH_ARBITRUM_ADDRESS } from '@utils/addresses'

const woethTransferProcessor = createERC20Tracker({
  from: 178662968,
  address: WOETH_ARBITRUM_ADDRESS,
})

export const from = woethTransferProcessor.from
export const setup = woethTransferProcessor.setup
export const process = woethTransferProcessor.process
