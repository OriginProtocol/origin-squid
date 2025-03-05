import { Context } from '@originprotocol/squid-utils'

const isContractMemory = new Map<string, boolean>()

export const isContract = async (ctx: Context, account: string): Promise<boolean> => {
  if (isContractMemory.has(account)) {
    return isContractMemory.get(account)!
  }
  let isContract: boolean = false
  if (account !== '0x0000000000000000000000000000000000000000') {
    isContract = (await ctx._chain.client.call('eth_getCode', [account, 'latest'])) !== '0x'
  }
  isContractMemory.set(account, isContract)
  return isContract
}
