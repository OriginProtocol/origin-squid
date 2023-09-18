import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { v4 as uuidv4 } from 'uuid'

import * as oeth from '../../abi/oeth'
import { APY, Address, History, Rebase, RebaseOption } from '../../model'
import { Context } from '../../processor'
import { ADDRESS_ZERO, OETH_ADDRESS } from '../../utils/addresses'
import { createAddress, createRebaseAPY } from './utils'

export const from = 16933090 // https://etherscan.io/tx/0x3b4ece4f5fef04bf7ceaec4f6c6edf700540d7597589f8da0e3a8c94264a3b50

export const setup = (processor: EvmBatchProcessor) => {
  processor.addTrace({
    type: ['call', 'delegatecall'],
    callSighash: [
      oeth.functions.rebaseOptOut.sighash,
      oeth.functions.rebaseOptIn.sighash,
    ],
    transaction: true,
  })
  processor.addLog({
    address: [OETH_ADDRESS],
    topic0: [
      oeth.events.Transfer.topic,
      oeth.events.TotalSupplyUpdatedHighres.topic,
    ],
    transaction: true,
  })
}

interface ProcessResult {
  initialized: boolean
  initialize: () => Promise<void>
  history: History[]
  rebases: Rebase[]
  rebaseOptions: RebaseOption[]
  apies: APY[]
  owners: Map<string, Address>
}

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    initialized: false,
    // Saves ~5ms init time if we have no filter matches.
    initialize: async () => {
      if (result.initialized) return
      result.initialized = true
      result.owners = await ctx.store
        .find(Address)
        .then((q) => new Map(q.map((i) => [i.id, i])))
    },
    history: [],
    rebases: [],
    rebaseOptions: [],
    apies: [],
    // get all addresses from the database.
    // we need this because we increase their balance based on rebase events
    owners: undefined as unknown as Map<string, Address>, // We want to error if someone forgets to initialize.
  }

  for (const block of ctx.blocks) {
    for (const trace of block.traces) {
      await processRebaseOpt(ctx, result, block, trace)
    }
    for (const log of block.logs) {
      await processTransfer(ctx, result, block, log)
      await processTotalSupplyUpdatedHighres(ctx, result, block, log)
    }
  }

  if (result.owners) {
    await ctx.store.upsert([...result.owners.values()])
  }
  await ctx.store.upsert(result.apies)
  await ctx.store.insert(result.history)
  await ctx.store.insert(result.rebases)
  await ctx.store.insert(result.rebaseOptions)
}

const processTransfer = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
  log: Context['blocks']['0']['logs']['0'],
) => {
  if (log.address !== OETH_ADDRESS) return
  if (log.topics[0] === oeth.events.Transfer.topic) {
    await result.initialize()
    const data = oeth.events.Transfer.decode(log)
    // Bind the token contract to the block number
    const token = new oeth.Contract(ctx, block.header, OETH_ADDRESS)
    // Transfer events
    let addressSub = result.owners.get(data.from)
    let addressAdd = result.owners.get(data.to)

    if (addressSub == null) {
      addressSub = await createAddress(ctx, data.from)
      result.owners.set(addressSub.id, addressSub)
    }
    if (addressAdd == null) {
      addressAdd = await createAddress(ctx, data.to)
      result.owners.set(addressAdd.id, addressAdd)
    }

    addressSub.lastUpdated = new Date(block.header.timestamp)
    addressAdd.lastUpdated = new Date(block.header.timestamp)

    const isSwap = [data.from, data.to].includes(ADDRESS_ZERO)

    // update the address balance
    await Promise.all(
      [addressSub, addressAdd].map(async (address) => {
        const credits = await token.creditsBalanceOfHighres(address.id)
        const newBalance = Number(credits[0]) / Number(credits[1])
        result.history.push(
          new History({
            // we can't use {t.id} because it's not unique
            id: uuidv4(),
            address: address,
            value: newBalance - address.balance,
            balance: newBalance,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            txHash: log.transactionHash,
            type: isSwap
              ? 'Swap'
              : addressSub === address
              ? 'Sent'
              : 'Received',
          }),
        )
        address.credits = BigInt(credits[0]) // token credits
        address.balance = Number(credits[0]) / Number(credits[1]) // token balance
      }),
    )
  }
}

const processTotalSupplyUpdatedHighres = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
  log: Context['blocks']['0']['logs']['0'],
) => {
  if (log.address !== OETH_ADDRESS) return
  if (log.topics[0] === oeth.events.TotalSupplyUpdatedHighres.topic) {
    await result.initialize()
    const data = oeth.events.TotalSupplyUpdatedHighres.decode(log)
    // Rebase events
    let rebase = createRebaseAPY(ctx, result.apies, block, log, data)
    for (const address of result.owners.values()) {
      if (address.rebasingOption === 'OptOut') {
        continue
      }
      const newBalance =
        Number(address.credits) / Number(data.rebasingCreditsPerToken)
      const earned = newBalance - address.balance

      result.history.push(
        new History({
          id: uuidv4(),
          // we can't use {t.id} because it's not unique
          address: address,
          value: earned,
          balance: newBalance,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          txHash: log.transactionHash,
          type: 'Yield',
        }),
      )

      address.balance = newBalance
      address.earned += earned
    }
    const entity = await rebase
    result.rebases.push(entity)
  }
}

const processRebaseOpt = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
  trace: Context['blocks']['0']['traces']['0'],
) => {
  if (
    trace.type === 'call' &&
    OETH_ADDRESS === trace.action.to &&
    (trace.action.sighash === oeth.functions.rebaseOptIn.sighash ||
      trace.action.sighash === oeth.functions.rebaseOptOut.sighash)
  ) {
    await result.initialize()
    const timestamp = new Date(block.header.timestamp)
    const blockNumber = block.header.height
    const address = trace.transaction!.from
    let owner = result.owners.get(address)
    if (!owner) {
      owner = await createAddress(ctx, address, timestamp)
      result.owners.set(address, owner)
    }

    let rebaseOption = new RebaseOption({
      id: uuidv4(),
      timestamp,
      blockNumber,
      txHash: trace.transaction?.hash,
      address: owner,
      status: owner.rebasingOption,
    })
    result.rebaseOptions.push(rebaseOption)
    if (trace.action.sighash === oeth.functions.rebaseOptIn.sighash) {
      owner.rebasingOption = 'OptIn'
      rebaseOption.status = 'OptIn'
    }
    if (trace.action.sighash === oeth.functions.rebaseOptOut.sighash) {
      owner.rebasingOption = 'OptOut'
      rebaseOption.status = 'OptOut'
    }
  }
}
