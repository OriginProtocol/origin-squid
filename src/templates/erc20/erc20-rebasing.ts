import * as abi from '@abi/erc20'
import { ERC20, ERC20Balance, ERC20Holder, ERC20State, ERC20Transfer } from '@model'
import { Block, Context } from '@processor'
import { publishERC20State } from '@shared/erc20'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { ADDRESS_ZERO } from '@utils/addresses'
import { LogFilter, logFilter } from '@utils/logFilter'
import { TokenAddress } from '@utils/symbols'

const duplicateTracker = new Set<string>()

export const createRebasingERC20Tracker = ({
  from,
  address,
  rebasing,
}: {
  from: number
  address: TokenAddress
  rebasing: {
    rebaseEventFilter: LogFilter
    getCredits: (ctx: Context, block: Block, account: string) => Promise<bigint>
    getCreditsPerToken: (ctx: Context, block: Block) => Promise<bigint>
  }
}) => {
  if (duplicateTracker.has(address)) {
    throw new Error('An ERC20 tracker was already created for: ' + address)
  }
  duplicateTracker.add(address)

  let erc20: ERC20 | undefined
  // Keep an in-memory record of what our current holders are.
  // TODO: Consider doing this differently?
  //       Eventually memory may become a constraint.
  let mostRecentState: ERC20State | undefined
  let holders: Map<string, bigint>
  const transferLogFilter = logFilter({
    address: [address.toLowerCase()],
    topic0: [abi.events.Transfer.topic],
    range: { from },
  })
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
      processor.addLog(transferLogFilter.value)
      processor.addLog(rebasing.rebaseEventFilter.value)
    },
    async process(ctx: Context) {
      const debugLogging = global.process.env.DEBUG_PERF === 'true'
      let start = Date.now()
      const time = (name: string) => {
        if (!debugLogging) return
        const message = `${address} ${name} ${Date.now() - start}ms`
        start = Date.now()
        ctx.log.info(message)
      }

      await initialize(ctx)
      time('initialize')
      if (!mostRecentState) {
        mostRecentState = await ctx.store.findOne(ERC20State, {
          where: { chainId: ctx.chain.id, address },
          order: { blockNumber: 'DESC' },
        })
      }
      if (!holders) {
        const holdersArray = await ctx.store.findBy(ERC20Holder, { chainId: ctx.chain.id, address })
        holders = new Map<string, bigint>()
        for (const holder of holdersArray) {
          holders.set(holder.account, holder.rebasingCredits ?? 0n)
        }
        time('initialize holders')
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
          const [totalSupply, rebasingCreditsPerToken] = await Promise.all([
            contract.totalSupply(),
            rebasing.getCreditsPerToken(ctx, block),
          ])
          const state = new ERC20State({
            id,
            chainId: ctx.chain.id,
            address,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            totalSupply,
            holderCount: holders.size,
            rebasingCreditsPerToken,
          })
          mostRecentState = state
          result.states.set(id, state)
          time('update state')
        }
        const updateBalances = async (accounts: string[]) => {
          let doStateUpdate = false
          if (accounts.length > 0) {
            const credits = await Promise.all(accounts.map((account) => rebasing.getCredits(ctx, block, account)))
            for (let i = 0; i < accounts.length; i++) {
              const account = accounts[i].toLowerCase()
              if (account === ADDRESS_ZERO) continue
              const id = `${ctx.chain.id}-${block.header.height}-${address}-${account}`
              const balance = new ERC20Balance({
                id,
                chainId: ctx.chain.id,
                timestamp: new Date(block.header.timestamp),
                blockNumber: block.header.height,
                address,
                account,
                balance: mostRecentState?.rebasingCreditsPerToken
                  ? (credits[i] * 10n ** 18n) / mostRecentState.rebasingCreditsPerToken
                  : 0n,
                rebasingCredits: credits[i],
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
                  rebasingCredits: balance.rebasingCredits,
                })
                if (!holders.has(account)) {
                  doStateUpdate = true
                  holders.set(account, credits[i])
                }
                result.holders.set(holder.account, holder)
                result.removedHolders.delete(holder.account)
              }
            }
            time('update balances')
          }
          if (doStateUpdate) {
            await updateState()
          }
        }
        const updateAllBalances = async () => {
          for (const [account, rebasingCredits] of holders.entries()) {
            const balance = mostRecentState?.rebasingCreditsPerToken
              ? rebasingCredits / mostRecentState.rebasingCreditsPerToken
              : 0n
            result.holders.set(
              account,
              new ERC20Holder({
                id: `${ctx.chain.id}-${address}-${account}`,
                chainId: ctx.chain.id,
                address,
                account,
                balance,
                rebasingCredits,
              }),
            )
            const id = `${ctx.chain.id}-${block.header.height}-${address}-${account}`
            result.balances.set(
              id,
              new ERC20Balance({
                id,
                chainId: ctx.chain.id,
                timestamp: new Date(block.header.timestamp),
                blockNumber: block.header.height,
                address,
                account,
                balance,
                rebasingCredits,
              }),
            )
          }
          time('update all balances')
        }

        for (const log of block.logs) {
          const isTransferLog = transferLogFilter.matches(log)
          if (isTransferLog) {
            const data = abi.events.Transfer.decode(log)
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
            time('transfer log')
          }
          const isRebaseLog = rebasing?.rebaseEventFilter.matches(log)
          if (isRebaseLog) {
            await updateState()
            await updateAllBalances()
            time('rebase log')
          }
        }
      }
      await Promise.all([
        ctx.store.upsert([...result.holders.values()]),
        ctx.store.insert([...result.states.values()]),
        ctx.store.insert([...result.balances.values()]),
        ctx.store.insert([...result.transfers.values()]),
        ctx.store.remove([...result.removedHolders.values()].map((id) => new ERC20Holder({ id }))),
      ])
      time('save')
      publishERC20State(ctx, address, result)
      time('publish')
    },
  }
}
