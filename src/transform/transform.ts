import { RawLog, RawRebase } from '../parser'
import { Address, APY, History, Rebase, Vault } from '../model'
import { BlockData } from '@subsquid/evm-processor'
import * as oeth from '../abi/oeth'
import { Context } from '../processor'
import { v4 as uuidv4 } from 'uuid'
import { LessThan, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import {
  ADDRESS_ZERO,
  FRXETH_ADDRESS,
  OETH_ADDRESS,
  OETH_VAULT_ADDRESS,
  RETH_ADDRESS,
  STETH_ADDRESS,
  VAULT_HOLDINGS_ADDRESSES,
  WETH_ADDRESS,
} from '../utils/addresses'

const addressZero = '0x0000000000000000000000000000000000000000'

interface TransformResult {
  history: History[]
  rebases: Rebase[]
  vaults: Vault[]
  owners: Map<string, Address>
}

export const transform = async (ctx: Context, logs: RawLog[]) => {
  const result: TransformResult = {
    history: [],
    rebases: [],
    vaults: [],
    owners: new Map(),
  }

  // get all addresses from the database.
  // we need this because we increase their balance based on rebase events
  result.owners = await ctx.store
    .find(Address)
    .then((q) => new Map(q.map((i) => [i.id, i])))

  for (let log of logs) {
    // let rebase = await ctx.store.findOne(History, {
    //   where: { blockNumber: LessThanOrEqual(t.blockNumber), type: 'Rebase' },
    //   order: { blockNumber: 'DESC' },
    // });

    if (log.address === OETH_ADDRESS) {
      if (log.type === 'transfer') {
        // Bind the token contract to the block number
        const token = new oeth.Contract(ctx, log.block.header, OETH_ADDRESS)
        // Transfer events
        let addressSub = result.owners.get(log.from)
        let addressAdd = result.owners.get(log.to)

        if (addressSub == null) {
          addressSub = await createAddress(ctx, log.from)
          result.owners.set(addressSub.id, addressSub)
        }
        if (addressAdd == null) {
          addressAdd = await createAddress(ctx, log.to)
          result.owners.set(addressAdd.id, addressAdd)
        }

        addressSub.lastUpdated = log.timestamp
        addressAdd.lastUpdated = log.timestamp

        const isSwap = [log.from, log.to].includes(addressZero)

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
                timestamp: log.timestamp,
                blockNumber: log.blockNumber,
                txHash: log.txHash,
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
      } else if (log.type === 'rebase') {
        // Rebase events
        let rebase = createRebaseAPY(ctx, log)
        for (const address of result.owners.values()) {
          if (address.rebasingOption === 'OptOut') {
            continue
          }
          const newBalance =
            Number(address.credits) / Number(log.rebasingCreditsPerToken)
          const earned = newBalance - address.balance

          result.history.push(
            new History({
              id: uuidv4(),
              // we can't use {t.id} because it's not unique
              address: address,
              value: earned,
              balance: newBalance,
              timestamp: log.timestamp,
              blockNumber: log.blockNumber,
              txHash: log.txHash,
              type: 'Yield',
            }),
          )

          address.balance = newBalance
          address.earned += earned
        }
        const entity = await rebase
        result.rebases.push(entity)
      }
    } else if (VAULT_HOLDINGS_ADDRESSES.includes(log.address)) {
      if (
        log.type === 'transfer' &&
        log.value > 0n &&
        (log.from === OETH_VAULT_ADDRESS || log.to === OETH_VAULT_ADDRESS)
      ) {
        const dateId = log.timestamp.toISOString()

        // Multiple transfers in a single block will lead us to modify ourselves.
        let vault = result.vaults
          .slice(result.vaults.length - 1)
          .find((v) => v.id === dateId)

        if (!vault) {
          let last =
            result.vaults[result.vaults.length - 1] ??
            (await ctx.store.findOne(Vault, {
              where: { id: LessThanOrEqual(dateId) },
              order: { id: 'desc' },
            }))
          vault =
            last?.id === dateId
              ? last
              : new Vault({
                  id: dateId,
                  timestamp: log.timestamp,
                  blockNumber: log.blockNumber,
                  txHash: log.txHash,
                  eth: last?.eth ?? 0n,
                  weth: last?.weth ?? 0n,
                  rETH: last?.rETH ?? 0n,
                  stETH: last?.stETH ?? 0n,
                  frxETH: last?.frxETH ?? 0n,
                })
          result.vaults.push(vault)
        } else {
          ctx.log.info(`existing: ${vault}`)
        }

        const change = log.from === OETH_VAULT_ADDRESS ? -log.value : log.value
        if (log.address === ADDRESS_ZERO) {
          vault.eth += change
        } else if (log.address === WETH_ADDRESS) {
          vault.weth += change
        } else if (log.address === RETH_ADDRESS) {
          vault.rETH += change
        } else if (log.address === STETH_ADDRESS) {
          vault.stETH += change
        } else if (log.address === FRXETH_ADDRESS) {
          vault.frxETH += change
        }

        // ctx.log.info(
        //   `Transfer: ${log.address} : ${log.from} > ${log.to} : ${log.value}`,
        // )

        // if (log.address === FRXETH_ADDRESS) {
        //   ctx.log.info(
        //     `${log.address} frxETH ${change} ${vault.frxETH} ${log.txHash}`,
        //   )
        // }
      }
    }
  }

  return result
}

/**
 * Create a new Address entity
 */
async function createAddress(ctx: Context, addr: string): Promise<Address> {
  let isContract: boolean = false
  if (addr !== '0x0000000000000000000000000000000000000000') {
    isContract =
      (await ctx._chain.client.call('eth_getCode', [addr, 'latest'])) !== '0x'
  }

  // ctx.log.info(`New address ${rawAddress}`);
  return new Address({
    id: addr,
    balance: 0,
    earned: 0,
    isContract,
    rebasingOption: isContract ? 'OptOut' : 'OptIn',
  })
}

/**
 * Create Rebase entity and set APY
 */
async function createRebaseAPY(
  ctx: Context,
  rebaseEvent: RawRebase,
): Promise<Rebase> {
  const r = new Rebase({ ...rebaseEvent })

  // use date as id for APY
  const date = new Date(rebaseEvent.timestamp)
  const dateId = date.toISOString().substring(0, 10)
  date.setDate(date.getDate() - 1)
  const lastDateId = date.toISOString().substring(0, 10)

  // use date as id for APY
  date.setDate(date.getDate() - 6)
  const last7daysDateId = {
    key: 'apy7DayAvg',
    value: date.toISOString().substring(0, 10),
  }
  date.setDate(date.getDate() - 14)
  const last14daysDateId = {
    key: 'apy14DayAvg',
    value: date.toISOString().substring(0, 10),
  }
  date.setDate(date.getDate() - 16)
  const last30daysDateId = {
    key: 'apy30DayAvg',
    value: date.toISOString().substring(0, 10),
  }

  // get last APY to compare with current one
  let lastApy = await ctx.store.findOne(APY, {
    where: { id: LessThan(dateId) },
    order: { id: 'DESC' },
  })

  // check if there is already an APY for the current date
  let apy = await ctx.store.findOne(APY, { where: { id: dateId } })
  // ctx.log.info(`APY: ${dateId} ${apy}, ${lastDateId} ${lastApy}`);
  // create a new APY if it doesn't exist
  if (!apy) {
    apy = new APY({
      id: dateId,
      blockNumber: rebaseEvent.blockNumber,
      timestamp: rebaseEvent.timestamp,
      txHash: rebaseEvent.txHash,
      rebasingCreditsPerToken: rebaseEvent.rebasingCreditsPerToken,
    })
  }
  // should only happen for the first rebase event
  if (!lastApy) {
    apy.apr = 0
    apy.apy = 0
    apy.apy7DayAvg = 0
    apy.apy14DayAvg = 0
    apy.apy30DayAvg = 0

    await ctx.store.upsert(apy)
    return r
  }

  // update APY with the new rebase event
  apy.blockNumber = rebaseEvent.blockNumber
  apy.timestamp = rebaseEvent.timestamp
  apy.txHash = rebaseEvent.txHash
  apy.rebasingCreditsPerToken = rebaseEvent.rebasingCreditsPerToken

  // this should normally be 1 day but more secure to calculate it
  const diffTime = Math.abs(
    new Date(apy.id).getTime() - new Date(lastApy.id).getTime(),
  )
  const dayDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  apy.apr =
    ((Number(lastApy.rebasingCreditsPerToken) /
      Number(apy.rebasingCreditsPerToken) -
      1) *
      100 *
      365.25) /
    dayDiff
  const periods_per_year = 365.25 / dayDiff
  apy.apy =
    ((1 + apy.apr / periods_per_year / 100) ** periods_per_year - 1) * 100

  // calculate average APY for the last 7, 14 and 30 days
  for (const i of [last7daysDateId, last14daysDateId, last30daysDateId]) {
    let pastAPYs = await ctx.store.findBy(APY, {
      id: MoreThanOrEqual(i.value),
    })
    // @ts-ignore
    apy[i.key] =
      pastAPYs.reduce((acc: number, cur: APY) => acc + cur.apy, apy.apy) /
      (pastAPYs.length + 1)
  }

  await ctx.store.upsert(apy)
  return r
}
