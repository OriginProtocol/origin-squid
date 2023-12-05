import * as otoken from '../../abi/otoken'
import { OETH_ADDRESS } from '../../utils/addresses'
import { logFilter } from '../../utils/logFilter'
import { createERC20Tracker } from '../processor-templates/erc20'

export const erc20s = [
  createERC20Tracker({
    from: 16935276,
    address: OETH_ADDRESS,
    rebaseFilters: [
      logFilter({
        address: [OETH_ADDRESS],
        topic0: [otoken.events.TotalSupplyUpdatedHighres.topic],
        transaction: true,
        range: { from: 16935276 },
      }),
    ],
  }),
]
