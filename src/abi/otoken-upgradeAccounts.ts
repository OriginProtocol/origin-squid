import { fun } from '@subsquid/evm-abi'
import * as p from '@subsquid/evm-codec'

export const functions = {
    upgradeAccounts: fun("0xeec037f6", "upgradeAccounts(address[])", {"accounts": p.array(p.address)}, ),
}
