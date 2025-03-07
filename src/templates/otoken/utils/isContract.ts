import { Block, Context } from '@originprotocol/squid-utils'

/**
 * I've found we cannot cache this because it may change.
 */
export const isContract = async (ctx: Context, block: Block, account: string): Promise<boolean> => {
  if (account !== '0x0000000000000000000000000000000000000000') {
    const code = await ctx._chain.client.call('eth_getCode', [account, `0x${block.header.height.toString(16)}`])
    return code !== '0x'
  }
  return false
}
