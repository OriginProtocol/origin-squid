import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as abi from '../../../abi/erc20'
import { ERC20, ERC20Balance, ERC20Holder, ERC20State } from '../../../model'
import { Context } from '../../../processor'
import { ADDRESS_ZERO } from '../../../utils/addresses'
import { blockFrequencyTracker } from '../../../utils/blockFrequencyUpdater'
import { LogFilter, logFilter } from '../../../utils/logFilter'
import { multicall } from '../../../utils/multicall'

const duplicateTracker = new Set<string>()

export const createERC20Tracker = ({
  from,
  address,
  accountFilter = undefined,
  rebaseFilters = [],
  intervalTracking = false,
}: {
  from: number
  address: string
  accountFilter?: string[]
  rebaseFilters?: LogFilter[]
  intervalTracking?: boolean // To be used *with* `accountFilter`.
}) => {
  address = address.toLowerCase()
  accountFilter = accountFilter?.map((a) => a.toLowerCase())
  if (duplicateTracker.has(address)) {
    throw new Error('An ERC20 tracker was already created for: ' + address)
  }
  duplicateTracker.add(address)
  const accountFilterSet = accountFilter
    ? new Set(accountFilter.map((account) => account.toLowerCase()))
    : undefined

  const intervalTracker = intervalTracking
    ? blockFrequencyTracker({ from })
    : undefined

  let erc20: ERC20 | undefined
  // Keep an in-memory record of what our current holders are.
  // TODO: Consider doing this differently?
  //       Eventually memory may become a constraint.
  let holders: Set<string>
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
    try {
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
    } catch (err) {
      ctx.log.error({ height: block.header.height, err })
    }
  }
  return {
    from,
    setup(processor: EvmBatchProcessor) {
      if (intervalTracker) {
        processor.includeAllBlocks({ from })
      } else {
        transferLogFilters.forEach((filter) => processor.addLog(filter.value))
      }
      rebaseFilters.forEach((filter) => processor.addLog(filter.value))
    },
    async process(ctx: Context) {
      await initialize(ctx)
      if (!holders) {
        const holdersArray = await ctx.store.findBy(ERC20Holder, { address })
        holders = new Set<string>()
        for (const holder of holdersArray) {
          holders.add(holder.account)
        }
      }
      const result = {
        states: new Map<string, ERC20State>(),
        balances: new Map<string, ERC20Balance>(),
        newHolders: new Map<string, ERC20Holder>(),
        removedHolders: new Set<string>(),
      }
      for (const block of ctx.blocks) {
        if (block.header.height < from) continue
        const contract = new abi.Contract(ctx, block.header, address)
        const updateState = async () => {
          const id = `${block.header.height}:${address}`
          const totalSupply = await contract.totalSupply()
          const state = new ERC20State({
            id,
            address,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            totalSupply,
            holderCount: holders.size,
          })
          result.states.set(id, state)
        }
        const updateBalances = async (
          accounts: string[],
          doStateUpdate = false,
        ) => {
          if (accountFilterSet) {
            accounts = accounts.filter((a) => accountFilterSet.has(a))
          }
          if (accounts.length > 0) {
            const balances = await multicall(
              ctx,
              block.header,
              abi.functions.balanceOf,
              address,
              accounts.map((account) => [account]),
            )
            accounts.forEach((account, i) => {
              if (account === ADDRESS_ZERO) return
              const id = `${block.header.height}:${address}:${account}`
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
                doStateUpdate = true
                holders.delete(account)
                result.newHolders.delete(`${address}:${account}`)
                result.removedHolders.add(`${address}:${account}`)
              } else if (!holders.has(account)) {
                const newHolder = new ERC20Holder({
                  id: `${address}:${account}`,
                  address,
                  account,
                })
                if (!holders.has(account)) {
                  doStateUpdate = true
                  holders.add(account)
                }
                result.newHolders.set(`${address}:${account}`, newHolder)
                result.removedHolders.delete(`${address}:${account}`)
              }
            })
          }
          if (doStateUpdate) {
            await updateState()
          }
        }
        const accounts = new Set<string>()
        let haveRebase = false
        if (intervalTracker && intervalTracker(ctx, block) && accountFilter) {
          await updateBalances(accountFilter)
        }

        for (const log of block.logs) {
          const isTransferLog = transferLogFilters.find((l) => l.matches(log))
          if (isTransferLog) {
            const transfer = abi.events.Transfer.decode(log)
            accounts.add(transfer.from)
            accounts.add(transfer.to)
          }
          const isRebaseLog = rebaseFilters.find((l) => l.matches(log))
          if (isRebaseLog) {
            haveRebase = true
            const holders = await ctx.store.find(ERC20Holder, {
              where: { address },
            })
            for (const holder of holders) {
              accounts.add(holder.account)
            }
          }
        }
        await updateBalances([...accounts], haveRebase)
      }
      await Promise.all([
        ctx.store.upsert([...result.newHolders.values()]),
        ctx.store.insert([...result.states.values()]),
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
