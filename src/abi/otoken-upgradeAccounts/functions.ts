import { address, array } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** upgradeAccounts(address[]) */
export const upgradeAccounts = func('0xeec037f6', {
    accounts: array(address),
})
export type UpgradeAccountsParams = FunctionArguments<typeof upgradeAccounts>
export type UpgradeAccountsReturn = FunctionReturn<typeof upgradeAccounts>
