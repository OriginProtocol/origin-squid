import * as abi from '@abi/erc20'
import { ERC20, ERC20Balance, ERC20Holder, ERC20State, ERC20Transfer } from '@model'
import { Context } from '@processor'
import { publishERC20State } from '@shared/erc20'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { ADDRESS_ZERO, TokenAddress } from '@utils/addresses'
import { blockFrequencyTracker } from '@utils/blockFrequencyUpdater'
import { LogFilter, logFilter } from '@utils/logFilter'
import { multicall } from '@utils/multicall'

const duplicateTracker = new Set<string>()

export const createERC20Tracker = ({
  from,
  address,
  accountFilter = undefined,
  rebaseFilters = [],
  intervalTracking = false,
}: {
  from: number
  address: TokenAddress
  accountFilter?: string[]
  rebaseFilters?: LogFilter[]
  intervalTracking?: boolean // To be used *with* `accountFilter`.
}) => {
  accountFilter = accountFilter?.map((a) => a.toLowerCase())
  if (duplicateTracker.has(address)) {
    throw new Error('An ERC20 tracker was already created for: ' + address)
  }
  duplicateTracker.add(address)
  const accountFilterSet = accountFilter ? new Set(accountFilter.map((account) => account.toLowerCase())) : undefined

  const intervalTracker = intervalTracking ? blockFrequencyTracker({ from }) : undefined

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
    } catch (err) {
      ctx.log.error({ height: block.header.height, err }, `Failed to get contract name for ${address}`)
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
        const holdersArray = await ctx.store.findBy(ERC20Holder, { chainId: ctx.chain.id, address })
        holders = new Set<string>()
        for (const holder of holdersArray) {
          holders.add(holder.account)
        }
      }
      const result = {
        states: new Map<string, ERC20State>(),
        balances: new Map<string, ERC20Balance>(),
        transfers: new Map<string, ERC20Transfer>(),
        holders: new Map<string, ERC20Holder>(),
        removedHolders: new Set<string>(),
      }
      for (const block of ctx.blocks) {
        if (block.header.height < from) continue
        const contract = new abi.Contract(ctx, block.header, address)
        const updateState = async () => {
          const id = `${ctx.chain.id}-${block.header.height}-${address}`
          const totalSupply = await contract.totalSupply()
          const state = new ERC20State({
            id,
            chainId: ctx.chain.id,
            address,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            totalSupply,
            holderCount: holders.size,
          })
          result.states.set(id, state)
        }
        const updateBalances = async (accounts: string[], doStateUpdate = false) => {
          if (accountFilterSet) {
            accounts = accounts.filter((a) => accountFilterSet.has(a))
          }
          if (accounts.length > 0) {
            const balances = await multicall(
              ctx,
              block.header,
              abi.functions.balanceOf,
              address,
              accounts.map((account) => ({ _owner: account })),
            )
            accounts.forEach((account, i) => {
              if (account === ADDRESS_ZERO) return
              account = account.toLowerCase()
              const id = `${ctx.chain.id}-${block.header.height}-${address}-${account}`
              const balance = new ERC20Balance({
                id,
                chainId: ctx.chain.id,
                timestamp: new Date(block.header.timestamp),
                blockNumber: block.header.height,
                address,
                account,
                balance: balances[i],
              })
              result.balances.set(id, balance)
              if (balance.balance === 0n) {
                doStateUpdate = true
                holders.delete(account)
                result.holders.delete(account)
                result.removedHolders.add(account)
              } else {
                const holder = new ERC20Holder({
                  id: `${ctx.chain.id}-${address}-${account}`,
                  chainId: ctx.chain.id,
                  address,
                  account,
                  balance: balance.balance,
                })
                if (!holders.has(account)) {
                  doStateUpdate = true
                  holders.add(account)
                }
                result.holders.set(holder.account, holder)
                result.removedHolders.delete(holder.account)
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
            const data = abi.events.Transfer.decode(log)
            accounts.add(data.from.toLowerCase())
            accounts.add(data.to.toLowerCase())
            await updateBalances([data.from.toLowerCase(), data.to.toLowerCase()])
            const fromHolder = result.holders.get(data.from.toLowerCase())
            const toHolder = result.holders.get(data.to.toLowerCase())
            const transfer = new ERC20Transfer({
              id: `${ctx.chain.id}-${log.id}`,
              chainId: ctx.chain.id,
              txHash: log.transactionHash,
              blockNumber: block.header.height,
              timestamp: new Date(block.header.timestamp),
              address: log.address,
              from: data.from.toLowerCase(),
              fromBalance: fromHolder?.balance ?? 0n,
              to: data.to.toLowerCase(),
              toBalance: toHolder?.balance ?? 0n,
              value: data.value,
            })
            result.transfers.set(transfer.id, transfer)
          }
          const isRebaseLog = rebaseFilters.find((l) => l.matches(log))
          if (isRebaseLog) {
            haveRebase = true
            const holders = await ctx.store.find(ERC20Holder, {
              where: { chainId: ctx.chain.id, address },
            })
            for (const holder of holders) {
              accounts.add(holder.account.toLowerCase())
            }
          }
        }
        await updateBalances([...accounts], haveRebase)
      }
      await Promise.all([
        ctx.store.upsert([...result.holders.values()]),
        ctx.store.insert([...result.states.values()]),
        ctx.store.insert([...result.balances.values()]),
        ctx.store.insert([...result.transfers.values()]),
        ctx.store.remove([...result.removedHolders.values()].map((id) => new ERC20Holder({ id }))),
      ])
      publishERC20State(ctx, address, result)
    },
  }
}
