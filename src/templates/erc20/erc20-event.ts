import dayjs from 'dayjs'
import { findLast } from 'lodash'

import * as abi from '@abi/erc20'
import { ERC20, ERC20Balance, ERC20Holder, ERC20State, ERC20StateByDay, ERC20Transfer } from '@model'
import { Block, Context, logFilter } from '@originprotocol/squid-utils'
import { publishERC20State } from '@shared/erc20'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { ADDRESS_ZERO } from '@utils/addresses'
import { TokenAddress } from '@utils/symbols'

/**
 * Track ERC20 state using events.
 */
export const createERC20EventTracker = ({ from, address }: { from: number; address: TokenAddress | string }) => {
  let erc20: ERC20 | undefined
  let lastState: ERC20State | undefined
  const transferLogFilters = [
    logFilter({
      address: [address.toLowerCase()],
      topic0: [abi.events.Transfer.topic],
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
      ctx.log.info({ height: block.header.height }, `Failed to get contract name for ${address}`)
    }
    if (!lastState) {
      lastState = await ctx.store
        .find(ERC20State, {
          order: { blockNumber: 'desc' },
          where: { chainId: ctx.chain.id, address },
          take: 1,
        })
        .then((r) => r[0])
    }
  }
  return {
    from,
    setup(processor: EvmBatchProcessor) {
      transferLogFilters.forEach((filter) => processor.addLog(filter.value))
    },
    async process(ctx: Context) {
      await initialize(ctx)
      const result = {
        states: new Map<string, ERC20State>(),
        statesByDay: new Map<string, ERC20StateByDay>(),
        balances: new Map<string, ERC20Balance>(),
        transfers: new Map<string, ERC20Transfer>(),
        holders: new Map<string, ERC20Holder>(),
      }

      const getState = async (ctx: Context, block: Block) => {
        const id = `${ctx.chain.id}-${block.header.height}-${address}`
        if (result.states.has(id)) return result.states.get(id)!
        const prevState =
          lastState ??
          (await ctx.store.findOne(ERC20State, {
            order: { id: 'desc' },
            where: { chainId: ctx.chain.id, address },
          }))
        const state = new ERC20State({
          id,
          chainId: ctx.chain.id,
          address,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          totalSupply: prevState?.totalSupply ?? 0n,
          holderCount: prevState?.holderCount ?? 0,
        })
        result.states.set(id, state)
        lastState = state
        return state
      }
      const createBalance = async (ctx: Context, block: Block, account: string, balance: bigint) => {
        if (account === ADDRESS_ZERO) return undefined
        const id = `${ctx.chain.id}-${block.header.height}-${address}-${account}`
        if (result.balances.has(id)) return result.balances.get(id)!
        result.balances.set(
          id,
          new ERC20Balance({
            id,
            chainId: ctx.chain.id,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            address,
            account: account,
            balance,
          }),
        )
      }
      const getHolder = async (ctx: Context, account: string, block: Block) => {
        if (account === ADDRESS_ZERO) return undefined
        const id = `${ctx.chain.id}-${address}-${account}`
        if (result.holders.has(id)) {
          return result.holders.get(id)!
        }
        const existingHolder = await ctx.store.findOne(ERC20Holder, {
          where: { id },
        })
        if (existingHolder) {
          result.holders.set(id, existingHolder)
          return existingHolder
        }
        const holder = new ERC20Holder({
          id,
          chainId: ctx.chain.id,
          address,
          account,
          since: new Date(block.header.timestamp),
          balance: 0n,
        })
        result.holders.set(id, holder)
        return holder
      }

      for (const block of ctx.blocksWithContent) {
        if (block.header.height < from) continue

        for (const log of block.logs) {
          const isTransfer = transferLogFilters.find((l) => l.matches(log))
          if (isTransfer) {
            const data = abi.events.Transfer.decode(log)
            const from = data.from.toLowerCase()
            const to = data.to.toLowerCase()
            const transfer = new ERC20Transfer({
              id: `${ctx.chain.id}-${log.id}`,
              chainId: ctx.chain.id,
              txHash: log.transactionHash,
              blockNumber: block.header.height,
              timestamp: new Date(block.header.timestamp),
              address: log.address,
              from,
              fromBalance: 0n,
              to,
              toBalance: 0n,
              value: data.value,
            })
            result.transfers.set(transfer.id, transfer)

            // Skip remaining if `from` and `to` are both address zero.
            if (from === to && from === ADDRESS_ZERO) throw new Error('what the fuck bro')

            const [state, fromHolder, toHolder] = await Promise.all([
              await getState(ctx, block),
              await getHolder(ctx, from, block),
              await getHolder(ctx, to, block),
            ])
            // Handle Total Supply Changes
            if (from === ADDRESS_ZERO) {
              state.totalSupply += data.value
            }
            if (to === ADDRESS_ZERO) {
              state.totalSupply -= data.value
            }

            // Handle From Address Changes
            if (fromHolder) {
              fromHolder.balance -= data.value
              transfer.fromBalance = fromHolder.balance
              await createBalance(ctx, block, from, fromHolder.balance)
              if (fromHolder.balance === 0n && data.value > 0n) {
                state.holderCount -= 1
              }
            }
            // Handle To Address Changes
            if (toHolder?.balance === 0n && data.value > 0n) {
              state.holderCount += 1
            }
            if (toHolder) {
              toHolder.balance += data.value
              transfer.toBalance = toHolder.balance
              await createBalance(ctx, block, to, toHolder.balance)
            }
          }
        }
      }

      // Generate ERC20StateByDay entities.
      let lastStateByDay = await ctx.store.findOne(ERC20StateByDay, {
        where: { chainId: ctx.chain.id, address },
        order: { timestamp: 'DESC' },
      })

      const states = [...result.states.values()]
      const startDate = lastStateByDay
        ? dayjs.utc(lastStateByDay.timestamp).endOf('day')
        : states[0]
        ? dayjs.utc(states[0].timestamp).endOf('day')
        : null
      if (startDate) {
        const endDate = dayjs.utc(ctx.blocks[ctx.blocks.length - 1].header.timestamp).endOf('day')

        // Ensure we create an entry for every day
        for (let day = startDate; day.isBefore(endDate) || day.isSame(endDate, 'day'); day = day.add(1, 'day')) {
          const date = day.format('YYYY-MM-DD')
          const dayEnd = day.endOf('day')
          const mostRecentState = findLast(
            states,
            (s) => dayjs.utc(s.timestamp).isBefore(dayEnd) || dayjs.utc(s.timestamp).isSame(dayEnd),
          )
          const stateByDay = new ERC20StateByDay({
            ...(mostRecentState ?? lastStateByDay ?? states[0]), // Fallback to first state if no previous state exists
            id: `${ctx.chain.id}-${date}-${address}`,
            date,
          })
          result.statesByDay.set(stateByDay.id, stateByDay)
          lastStateByDay = stateByDay
        }
      }

      await Promise.all([
        ctx.store.upsert([...result.holders.values()]),
        ctx.store.insert([...result.states.values()]),
        ctx.store.upsert([...result.statesByDay.values()]),
        ctx.store.insert([...result.balances.values()]),
        ctx.store.insert([...result.transfers.values()]),
      ])
      publishERC20State(ctx, address, result)
    },
  }
}
