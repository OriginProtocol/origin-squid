import * as abi from '@abi/erc20'
import { ERC20 } from '@model'
import { Context, Processor } from '@originprotocol/squid-utils'
import { Currency, currencyToAddress } from '@shared/post-processors/exchange-rates/mainnetCurrencies'

/**
 * Create ERC20 entry only (no event tracking).
 */
export const createERC20Entry = ({ from, addressOrSymbol }: { from: number; addressOrSymbol: Currency }): Processor => {
  let erc20: ERC20 | undefined
  const initialize = async (ctx: Context) => {
    if (erc20) return
    const block = ctx.blocks.find((b) => b.header.height >= from)
    if (!block) return
    const address = currencyToAddress(ctx.chain.id, addressOrSymbol)
    erc20 = await ctx.store.findOne(ERC20, { where: { chainId: ctx.chain.id, address } })
    try {
      if (!erc20) {
        const contract = new abi.Contract(ctx, block.header, address)
        const [name, symbol, decimals] = await Promise.all([contract.name(), contract.symbol(), contract.decimals()])
        erc20 = new ERC20({
          id: `${ctx.chain.id}-${address}`,
          chainId: ctx.chain.id,
          address,
          name,
          symbol,
          decimals,
        })
        await ctx.store.insert(erc20)
      }
    } catch (err: any) {
      ctx.log.info({ height: block.header.height, err: err.message }, `Failed to get contract name for ${address}`)
    }
  }
  return {
    from,
    async process(ctx: Context) {
      await initialize(ctx)
    },
  }
}
