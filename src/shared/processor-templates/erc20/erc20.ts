import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { chunk } from 'lodash'

import * as abi from '../../../abi/erc20'
import { ERC20, ERC20Balance, ERC20Holder, ERC20Supply } from '../../../model'
import { Context } from '../../../processor'
import { ADDRESS_ZERO } from '../../../utils/addresses'
import { LogFilter, logFilter } from '../../../utils/logFilter'

export const createERC20Tracker = ({
  from,
  address,
  accountFilter = undefined,
  rebaseFilters = [],
}: {
  from: number
  address: string
  accountFilter?: string[]
  rebaseFilters?: LogFilter[]
}) => {
  let erc20: ERC20 | undefined
  const transferLogFilters = [
    logFilter({
      address: [address.toLowerCase()],
      topic0: [abi.events.Transfer.topic],
      topic1: accountFilter,
      range: { from },
    }),
    logFilter({
      address: [address.toLowerCase()],
      topic0: [abi.events.Transfer.topic],
      topic2: accountFilter,
      range: { from },
    }),
  ]
  const initialize = async (ctx: Context) => {
    if (erc20) return
    const block = ctx.blocks.find((b) => b.header.height >= from)
    if (!block) return
    erc20 = await ctx.store.findOne(ERC20, { where: { address } })
    if (!erc20) {
      const contract = new abi.Contract(ctx, block.header, address)
      const [name, symbol, decimals] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
      ])
      erc20 = new ERC20({
        id: address,
        address,
        name,
        symbol,
        decimals,
      })
      await ctx.store.insert(erc20)
    }
  }
  return {
    from,
    setup(processor: EvmBatchProcessor) {
      transferLogFilters.forEach((filter) => processor.addLog(filter.value))
      rebaseFilters.forEach((filter) => processor.addLog(filter.value))
    },
    async process(ctx: Context) {
      await initialize(ctx)
      const result = {
        supplies: new Map<string, ERC20Supply>(),
        balances: new Map<string, ERC20Balance>(),
        holders: new Map<string, ERC20Holder>(),
        removedHolders: new Set<string>(),
      }
      for (const block of ctx.blocks) {
        if (block.header.height < from) continue
        const contract = new abi.Contract(ctx, block.header, address)
        const updateBalances = async (...accounts: string[]) => {
          accounts = accounts.filter((account) => account !== ADDRESS_ZERO)
          const balances = await Promise.all(
            accounts.map((account) => contract.balanceOf(account)),
          )
          accounts.forEach((account, i) => {
            const id = `${address}:${account}:${block.header.height}`
            const balance = new ERC20Balance({
              id,
              timestamp: new Date(block.header.timestamp),
              blockNumber: block.header.height,
              address,
              account: account.toLowerCase(),
              balance: balances[i],
            })
            result.balances.set(id, balance)
            if (balance.balance === 0n) {
              result.holders.delete(`${address}:${account}`)
              result.removedHolders.add(`${address}:${account}`)
            } else {
              result.holders.set(
                `${address}:${account}`,
                new ERC20Holder({
                  id: `${address}:${account}`,
                  address,
                  account,
                }),
              )
              result.removedHolders.delete(`${address}:${account}`)
            }
          })
          if (accounts.includes(ADDRESS_ZERO)) {
            const id = `${address}:${block.header.height}`
            const supply = new ERC20Supply({
              id,
              address,
              timestamp: new Date(block.header.timestamp),
              blockNumber: block.header.height,
              totalSupply: await contract.totalSupply(),
            })
            result.supplies.set(id, supply)
          }
        }
        for (const log of block.logs) {
          const isTransferLog = transferLogFilters.find((l) => l.matches(log))
          if (isTransferLog) {
            const transfer = abi.events.Transfer.decode(log)
            await updateBalances(transfer.from, transfer.to)
          }
          const isRebaseLog = rebaseFilters.find((l) => l.matches(log))
          if (isRebaseLog) {
            const holders = await ctx.store.find(ERC20Holder, {
              where: { address },
            })
            for (const chunks of chunk(holders, 10)) {
              await updateBalances(...chunks.map((h) => h.account))
            }
          }
        }
      }
      await Promise.all([
        ctx.store.upsert([...result.holders.values()]),
        ctx.store.insert([...result.supplies.values()]),
        ctx.store.insert([...result.balances.values()]),
        ctx.store.remove(
          [...result.removedHolders.values()].map(
            (id) => new ERC20Holder({ id }),
          ),
        ),
      ])
    },
  }
}
