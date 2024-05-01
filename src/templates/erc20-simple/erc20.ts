import * as abi from '@abi/erc20'
import {
  ERC20,
  ERC20Balance,
  ERC20Holder,
  ERC20State,
  ERC20Transfer,
} from '@model'
import { Block, Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { ADDRESS_ZERO, TokenAddress } from '@utils/addresses'
import { logFilter } from '@utils/logFilter'

export const createERC20SimpleTracker = ({
  from,
  address,
}: {
  from: number
  address: TokenAddress
}) => {
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
      ctx.log.error(
        { height: block.header.height, err },
        'Failed to get contract name',
      )
    }
    if (!lastState) {
      lastState = await ctx.store
        .find(ERC20State, {
          order: { id: 'desc' },
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
      const createBalance = async (
        ctx: Context,
        block: Block,
        account: string,
        balance: bigint,
      ) => {
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
      const getHolder = async (ctx: Context, account: string) => {
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
          balance: 0n,
        })
        result.holders.set(id, holder)
        return holder
      }

      for (const block of ctx.blocks) {
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
              to,
              value: data.value,
            })
            result.transfers.set(transfer.id, transfer)

            // Skip remaining if `from` and `to` are both address zero.
            if (from === to && from === ADDRESS_ZERO)
              throw new Error('what the fuck bro')

            const [state, fromHolder, toHolder] = await Promise.all([
              await getState(ctx, block),
              await getHolder(ctx, from),
              await getHolder(ctx, to),
            ])
            // Handle Total Supply Changes
            if (from === ADDRESS_ZERO) {
              state.totalSupply += data.value
            }
            if (to === ADDRESS_ZERO) {
              state.totalSupply -= data.value
            }

            // ctx.log.info(`${from} ${to} ${formatEther(data.value)}`)

            // Handle From Address Changes
            if (fromHolder) {
              fromHolder.balance -= data.value
              await createBalance(ctx, block, from, fromHolder.balance)
            }
            if (fromHolder?.balance === 0n) {
              state.holderCount += 1
            }
            // Handle To Address Changes
            if (toHolder?.balance === 0n && data.value > 0n) {
              state.holderCount += 1
              if (state.holderCount % 100 === 0) {
                ctx.log.info({
                  height: block.header.height,
                  holderCount: state.holderCount,
                })
              }
            }
            if (toHolder) {
              toHolder.balance += data.value
              await createBalance(ctx, block, to, toHolder.balance)
            }
          }
        }
      }
      await Promise.all([
        ctx.store.upsert([...result.holders.values()]),
        ctx.store.insert([...result.states.values()]),
        ctx.store.insert([...result.balances.values()]),
        ctx.store.insert([...result.transfers.values()]),
      ])
    },
  }
}
