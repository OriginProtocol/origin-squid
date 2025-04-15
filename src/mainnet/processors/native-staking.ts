import * as beaconAbi from '@abi/beacon-deposit-contract'
import { BeaconDepositEvent, BeaconDepositPubkey } from '@model'
import { Block, Context, EvmBatchProcessor, logFilter, readLinesFromUrlInBatches } from '@originprotocol/squid-utils'
import { OETH_NATIVE_STRATEGIES } from '@utils/addresses'

export const from = 20029793 // Dump contains pubkeys up until 20029793.

const beaconDepositContractAddress = '0x00000000219ab540356cbb839cbe05303d7705fa'
const withdrawCredentials = OETH_NATIVE_STRATEGIES.map(
  (strategy) => `0x010000000000000000000000${strategy.address.slice(2)}`,
)

const beaconDepositFilter = logFilter({
  address: [beaconDepositContractAddress],
  topic0: [beaconAbi.events.DepositEvent.topic],
  transaction: true,
})

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog(beaconDepositFilter.value)
}

export const initialize = async (ctx: Context) => {
  if (global.process.env.BLOCK_FROM) return
  // Only add these if there are no pubkeys yet.
  const existing = await ctx.store.find(BeaconDepositPubkey, { take: 1 })
  if (existing.length > 0) return

  ctx.log.info('Inserting beacon deposit pubkeys from dump.')
  let count = 0
  await readLinesFromUrlInBatches(
    'https://origin-squid.s3.amazonaws.com/BeaconDepositPubkey.jsonl',
    25000,
    async (pubkeys) => {
      const result: BeaconDepositPubkey[] = []
      for (const json of pubkeys) {
        const entity = new BeaconDepositPubkey(JSON.parse(json))
        if (!entity.id.startsWith('0x')) throw new Error(`Bad pubkey: ${entity.id}`)
        result.push(entity)
      }
      count += pubkeys.length
      ctx.log.info(`Pubkeys processed: ${count}`)
      await ctx.store.insert(result)
    },
  )
}

interface Result {
  pubkeys: Map<string, BeaconDepositPubkey>
  deposits: Map<string, BeaconDepositEvent>
}

export const process = async (ctx: Context) => {
  if (!ctx.blocksWithContent.length || ctx.blocksWithContent[ctx.blocksWithContent.length - 1].header.height < from) {
    return
  }
  const result: Result = {
    pubkeys: new Map<string, BeaconDepositPubkey>(),
    deposits: new Map<string, BeaconDepositEvent>(),
  }
  for (const block of ctx.blocksWithContent) {
    if (block.header.height < from) continue
    for (const log of block.logs) {
      if (beaconDepositFilter.matches(log)) {
        const data = beaconAbi.events.DepositEvent.decode(log)
        const pubkey = await getBeaconDepositPubkey(ctx, block, result, data.pubkey)
        pubkey.count += 1
        pubkey.lastUpdated = new Date(block.header.timestamp)

        if (withdrawCredentials.includes(data.withdrawal_credentials)) {
          if (pubkey.count > 1) {
            ctx.log.error(`Origin pubkey used ${pubkey.count} times: ${pubkey.id}`)
          }
          const deposit = new BeaconDepositEvent({
            id: `${ctx.chain.id}:${log.id}`,
            chainId: ctx.chain.id,
            address: log.address,
            blockNumber: block.header.height,
            timestamp: new Date(block.header.timestamp),
            txHash: log.transactionHash,
            caller: log.transaction?.from,
            amount: data.amount,
            index: data.index,
            signature: data.signature,
            withdrawalCredentials: data.withdrawal_credentials,
            pubkey,
          })
          result.deposits.set(deposit.id, deposit)
        }
      }
    }
  }

  await ctx.store.upsert([...result.pubkeys.values()])
  await ctx.store.insert([...result.deposits.values()])
}

const getBeaconDepositPubkey = async (ctx: Context, block: Block, result: Result, pubkey: string) => {
  const existing = result.pubkeys.get(pubkey) ?? (await ctx.store.get(BeaconDepositPubkey, pubkey))
  const entity =
    existing ??
    new BeaconDepositPubkey({
      id: pubkey,
      deposits: [],
      count: 0,
      createDate: new Date(block.header.timestamp),
      lastUpdated: new Date(block.header.timestamp),
    })
  result.pubkeys.set(pubkey, entity)
  return entity
}
