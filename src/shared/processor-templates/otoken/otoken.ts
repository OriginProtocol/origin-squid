import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { groupBy } from 'lodash'
import { GetTransactionReceiptReturnType } from 'viem'

import * as otoken from '../../../abi/otoken'
import * as otokenVault from '../../../abi/otoken-vault'
import {
  HistoryType,
  OETH,
  OETHAPY,
  OETHActivity,
  OETHAddress,
  OETHAsset,
  OETHHistory,
  OETHRebase,
  OETHRebaseOption,
  OUSD,
  OUSDAPY,
  OUSDActivity,
  OUSDAddress,
  OUSDAsset,
  OUSDHistory,
  OUSDRebase,
  OUSDRebaseOption,
  RebasingOption,
} from '../../../model'
import { Context } from '../../../processor'
import { type Transaction, activityFromTx } from '../../../utils/activityFromTx'
import { ADDRESS_ZERO } from '../../../utils/addresses'
import { DECIMALS_18 } from '../../../utils/constants'
import { multicall } from '../../../utils/multicall'
import { EntityClassT, InstanceTypeOfConstructor } from '../../../utils/type'
import { getLatestEntity } from '../../../utils/utils'
import { ensureExchangeRate } from '../../post-processors/exchange-rates'
import {
  CurrencyAddress,
  CurrencySymbol,
} from '../../post-processors/exchange-rates/currencies'
import { createAddress, createRebaseAPY } from './utils'

type OToken = EntityClassT<OETH> | EntityClassT<OUSD>
type OTokenAsset = EntityClassT<OETHAsset> | EntityClassT<OUSDAsset>
type OTokenAPY = EntityClassT<OETHAPY> | EntityClassT<OUSDAPY>
type OTokenActivity = EntityClassT<OETHActivity> | EntityClassT<OUSDActivity>
type OTokenAddress = EntityClassT<OETHAddress> | EntityClassT<OUSDAddress>
type OTokenHistory = EntityClassT<OETHHistory> | EntityClassT<OUSDHistory>
type OTokenRebase = EntityClassT<OETHRebase> | EntityClassT<OUSDRebase>
type OTokenRebaseOption =
  | EntityClassT<OETHRebaseOption>
  | EntityClassT<OUSDRebaseOption>

export const createOTokenSetup =
  ({
    address,
    vaultAddress,
    from,
  }: {
    address: string
    vaultAddress: string
    from: number
  }) =>
  (processor: EvmBatchProcessor) => {
    processor.addTrace({
      type: ['call'],
      callTo: [address],
      callSighash: [
        otoken.functions.rebaseOptOut.sighash,
        otoken.functions.rebaseOptIn.sighash,
        otoken.functions.governanceRebaseOptIn.sighash,
      ],
      transaction: true,
      range: { from },
    })
    processor.addLog({
      address: [address],
      topic0: [
        otoken.events.Transfer.topic,
        otoken.events.TotalSupplyUpdatedHighres.topic,
      ],
      transaction: true,
      range: { from },
    })
    processor.addLog({
      address: [vaultAddress],
      topic0: [otokenVault.events.YieldDistribution.topic],
      range: { from },
    })
  }

export const createOTokenProcessor = (params: {
  Upgrade_CreditsBalanceOfHighRes?: number
  OTOKEN_ADDRESS: string
  OTOKEN_VAULT_ADDRESS: string
  oTokenAssets: { asset: CurrencyAddress; symbol: CurrencySymbol }[]
  OToken: OToken
  OTokenAsset: OTokenAsset
  OTokenAPY: OTokenAPY
  OTokenAddress: OTokenAddress
  OTokenHistory: OTokenHistory
  OTokenActivity: OTokenActivity
  OTokenRebase: OTokenRebase
  OTokenRebaseOption: OTokenRebaseOption
}) => {
  interface ProcessResult {
    initialized: boolean
    initialize: () => Promise<void>
    otokens: InstanceTypeOfConstructor<OToken>[]
    assets: InstanceTypeOfConstructor<OTokenAsset>[]
    history: InstanceTypeOfConstructor<OTokenHistory>[]
    rebases: InstanceTypeOfConstructor<OTokenRebase>[]
    rebaseOptions: InstanceTypeOfConstructor<OTokenRebaseOption>[]
    apies: InstanceTypeOfConstructor<OTokenAPY>[]
    activity: InstanceTypeOfConstructor<OTokenActivity>[]
    lastYieldDistributionEvent?: {
      fee: bigint
      yield: bigint
    }
  }

  let owners:
    | Map<string, InstanceTypeOfConstructor<OTokenAddress>>
    | undefined = undefined

  let idMap: Map<string, number>
  const getUniqueId = (partialId: string) => {
    const nextId = (idMap.get(partialId) ?? 0) + 1
    idMap.set(partialId, nextId)
    return `${partialId}-${nextId}`
  }

  const process = async (ctx: Context) => {
    idMap = new Map<string, number>()
    const result: ProcessResult = {
      initialized: false,
      // Saves ~5ms init time if we have no filter matches.
      initialize: async () => {
        if (result.initialized) return
        result.initialized = true

        // get all addresses from the database.
        // we need this because we increase their balance based on rebase events
        owners = await ctx.store
          .find<InstanceTypeOfConstructor<OTokenAddress>>(
            params.OTokenAddress as any,
          )
          .then((q) => new Map(q.map((i) => [i.id, i])))

        const assetsCount = await ctx.store.count<
          InstanceTypeOfConstructor<OTokenAsset>
        >(params.OTokenAsset as any)
        if (assetsCount === 0) {
          result.assets.push(
            ...params.oTokenAssets.map(
              ({ asset, symbol }) =>
                new params.OTokenAsset({
                  id: asset,
                  address: asset,
                  symbol: symbol,
                }),
            ),
          )
        }
      },
      otokens: [],
      assets: [],
      history: [],
      rebases: [],
      rebaseOptions: [],
      apies: [],
      activity: [],
    }

    for (const block of ctx.blocks) {
      for (const trace of block.traces) {
        await processRebaseOpt(ctx, result, block, trace)
      }
      for (const log of block.logs) {
        await processTransfer(ctx, result, block, log)
        await processYieldDistribution(ctx, result, block, log)
        await processTotalSupplyUpdatedHighres(ctx, result, block, log)
      }
      await processActivity(ctx, result, block)
    }

    if (owners) {
      await ctx.store.upsert([...owners.values()])
    }
    await Promise.all([
      ctx.store.upsert(result.apies),
      ctx.store.insert(result.otokens),
      ctx.store.insert(result.assets),
      ctx.store.insert(result.history),
      ctx.store.insert(result.rebases),
      ctx.store.insert(result.rebaseOptions),
      ctx.store.insert(result.activity),
    ])
  }

  const processTransfer = async (
    ctx: Context,
    result: ProcessResult,
    block: Context['blocks']['0'],
    log: Context['blocks']['0']['logs']['0'],
  ) => {
    if (log.address !== params.OTOKEN_ADDRESS) return
    if (log.topics[0] === otoken.events.Transfer.topic) {
      await result.initialize()
      const dataRaw = otoken.events.Transfer.decode(log)
      const data = {
        from: dataRaw.from.toLowerCase(),
        to: dataRaw.to.toLowerCase(),
        value: dataRaw.value,
      }
      if (data.value === 0n) return

      const otokenObject = await getLatestOTokenObject(ctx, result, block)
      if (data.from === ADDRESS_ZERO) {
        otokenObject.totalSupply += data.value
      } else if (data.to === ADDRESS_ZERO) {
        otokenObject.totalSupply -= data.value
      }

      const ensureAddress = async (address: string) => {
        let entity = owners!.get(address)
        if (!entity) {
          entity = await createAddress(params.OTokenAddress, ctx, address)
          owners!.set(entity.id, entity)
        }
        entity.lastUpdated = new Date(block.header.timestamp)
        return entity
      }

      const afterHighResUpgrade =
        block.header.height >= (params.Upgrade_CreditsBalanceOfHighRes ?? 0)
      const [
        addressSub,
        addressAdd,
        [fromCreditsBalanceOf, toCreditsBalanceOf],
      ] = await Promise.all([
        ensureAddress(data.from),
        ensureAddress(data.to),
        multicall(
          ctx,
          block.header,
          afterHighResUpgrade
            ? otoken.functions.creditsBalanceOfHighres
            : (otoken.functions
                .creditsBalanceOf as unknown as typeof otoken.functions.creditsBalanceOfHighres),
          params.OTOKEN_ADDRESS,
          [[data.from], [data.to]],
        ).then((results) => {
          if (afterHighResUpgrade) {
            return results.map((r) => [r[0], r[1]])
          } else {
            return results.map((r) => [r[0] * 1000000000n, r[1] * 1000000000n])
          }
        }) as Promise<[bigint, bigint][]>,
      ])

      /**
       * "0017708038-000327-29fec:0xd2cdf18b60a5cdb634180d5615df7a58a597247c:Sent","0","49130257489166670","2023-07-16T19:50:11.000Z",17708038,"0x0e3ac28945d45993e3d8e1f716b6e9ec17bfc000418a1091a845b7a00c7e3280","Sent","0xd2cdf18b60a5cdb634180d5615df7a58a597247c",
       * "0017708038-000327-29fec:0xd2cdf18b60a5cdb634180d5615df7a58a597247c:Sent","0","49130257489166670","2023-07-16T19:50:11.000Z",17708038,"0x0e3ac28945d45993e3d8e1f716b6e9ec17bfc000418a1091a845b7a00c7e3280","Sent","0xd2cdf18b60a5cdb634180d5615df7a58a597247c",
       */

      const updateAddressBalance = ({
        address,
        credits,
      }: {
        address: InstanceTypeOfConstructor<OTokenAddress>
        credits: [bigint, bigint]
      }) => {
        const newBalance = (credits[0] * DECIMALS_18) / credits[1]
        const change = newBalance - address.balance
        if (change === 0n) return
        const type =
          addressSub === address ? HistoryType.Sent : HistoryType.Received
        result.history.push(
          new params.OTokenHistory({
            // we can't use {t.id} because it's not unique
            id: getUniqueId(`${log.id}-${address.id}`),
            address: address,
            value: change,
            balance: newBalance,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            txHash: log.transactionHash,
            type,
          }),
        )
        address.credits = BigInt(credits[0]) // token credits
        address.balance = newBalance // token balance
      }

      updateAddressBalance({
        address: addressSub,
        credits: fromCreditsBalanceOf,
      })
      updateAddressBalance({
        address: addressAdd,
        credits: toCreditsBalanceOf,
      })

      if (
        addressAdd.rebasingOption === RebasingOption.OptOut &&
        data.from === ADDRESS_ZERO
      ) {
        // If it's a mint and minter has opted out of rebasing,
        // add to non-rebasing supply
        otokenObject.nonRebasingSupply += data.value
      } else if (
        data.to === ADDRESS_ZERO &&
        addressSub.rebasingOption === RebasingOption.OptOut
      ) {
        // If it's a redeem and redeemer has opted out of rebasing,
        // subtract non-rebasing supply
        otokenObject.nonRebasingSupply -= data.value
      } else if (
        addressAdd.rebasingOption === RebasingOption.OptOut &&
        addressSub.rebasingOption === RebasingOption.OptIn
      ) {
        // If receiver has opted out but sender hasn't,
        // Add to non-rebasing supply
        otokenObject.nonRebasingSupply += data.value
      } else if (
        addressAdd.rebasingOption === RebasingOption.OptIn &&
        addressSub.rebasingOption === RebasingOption.OptOut
      ) {
        // If sender has opted out but receiver hasn't,
        // Subtract non-rebasing supply
        otokenObject.nonRebasingSupply -= data.value
      }

      // Update rebasing supply in all cases
      otokenObject.rebasingSupply =
        otokenObject.totalSupply - otokenObject.nonRebasingSupply
    }
  }

  const processActivity = async (
    ctx: Context,
    result: ProcessResult,
    block: Context['blocks']['0'],
  ) => {
    await result.initialize()
    const logs = block.logs
    const groupedLogs = groupBy(logs, (log) => log.transactionHash)
    for (const [txHash, logs] of Object.entries(groupedLogs)) {
      const log = logs.find((l) => l.address === params.OTOKEN_ADDRESS)
      const transaction = log?.transaction as unknown as Transaction
      if (log && transaction) {
        // We need to get the whole transaction receipt for all related logs.
        // This shouldn't slow things down too much since it's only done for
        // OToken transactions.
        const txReceipt = await ctx._chain.client.call(
          'eth_getTransactionReceipt',
          [log.transactionHash],
        )

        const activity = await activityFromTx(
          transaction,
          txReceipt.logs as unknown as GetTransactionReceiptReturnType['logs'],
        )
        if (activity) {
          for (const item of activity) {
            result.activity.push(
              new params.OTokenActivity({
                id: getUniqueId(log.id),
                timestamp: new Date(block.header.timestamp),
                blockNumber: block.header.height,
                txHash: log.transactionHash,
                address: transaction.to,
                sighash: transaction.input.slice(0, 10),
                ...item,
              }),
            )
          }
        }
      }
    }
  }

  const processTotalSupplyUpdatedHighres = async (
    ctx: Context,
    result: ProcessResult,
    block: Context['blocks']['0'],
    log: Context['blocks']['0']['logs']['0'],
  ) => {
    if (log.address !== params.OTOKEN_ADDRESS) return
    if (log.topics[0] !== otoken.events.TotalSupplyUpdatedHighres.topic) return

    await result.initialize()
    const data = otoken.events.TotalSupplyUpdatedHighres.decode(log)

    // OToken Object
    const otokenObject = await getLatestOTokenObject(ctx, result, block)
    otokenObject.totalSupply = data.totalSupply
    otokenObject.rebasingSupply =
      otokenObject.totalSupply - otokenObject.nonRebasingSupply

    if (!result.lastYieldDistributionEvent) {
      throw new Error('lastYieldDistributionEvent is not set')
    }

    const exchangeRate = await ensureExchangeRate(ctx, block, 'ETH', 'USD')
    if (!exchangeRate) {
      throw new Error('Could not fetch ETH/USD exchange rate')
    }

    // Rebase events
    let rebase = createRebaseAPY(
      params.OTokenAPY,
      params.OTokenRebase,
      ctx,
      result.apies,
      block,
      log,
      data,
      result.lastYieldDistributionEvent,
      exchangeRate,
    )

    for (const address of owners!.values()) {
      if (
        !address.credits ||
        address.rebasingOption === RebasingOption.OptOut
      ) {
        continue
      }
      const newBalance =
        (address.credits * DECIMALS_18) / data.rebasingCreditsPerToken
      const earned = newBalance - address.balance

      if (earned === 0n) continue
      result.history.push(
        new params.OTokenHistory({
          id: getUniqueId(`${log.id}-${address.id}`),
          // we can't use {t.id} because it's not unique
          address: address,
          value: earned,
          balance: newBalance,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          txHash: log.transactionHash,
          type: HistoryType.Yield,
        }),
      )

      address.balance = newBalance
      address.earned += earned
    }
    const entity = await rebase
    result.rebases.push(entity)
  }

  const processYieldDistribution = async (
    ctx: Context,
    result: ProcessResult,
    block: Context['blocks']['0'],
    log: Context['blocks']['0']['logs']['0'],
  ) => {
    if (log.address !== params.OTOKEN_VAULT_ADDRESS) return
    if (log.topics[0] !== otokenVault.events.YieldDistribution.topic) return

    await result.initialize()
    const { _yield, _fee } = otokenVault.events.YieldDistribution.decode(log)
    result.lastYieldDistributionEvent = { yield: _yield, fee: _fee }
  }

  const processRebaseOpt = async (
    ctx: Context,
    result: ProcessResult,
    block: Context['blocks']['0'],
    trace: Context['blocks']['0']['traces']['0'],
  ) => {
    if (
      trace.type === 'call' &&
      params.OTOKEN_ADDRESS === trace.action.to &&
      (trace.action.sighash ===
        otoken.functions.governanceRebaseOptIn.sighash ||
        trace.action.sighash === otoken.functions.rebaseOptIn.sighash ||
        trace.action.sighash === otoken.functions.rebaseOptOut.sighash)
    ) {
      await result.initialize()
      const timestamp = new Date(block.header.timestamp)
      const blockNumber = block.header.height
      const address =
        trace.action.sighash === otoken.functions.governanceRebaseOptIn.sighash
          ? otoken.functions.governanceRebaseOptIn.decode(trace.action.input)
              ._account
          : trace.action.from.toLowerCase()
      const otokenObject = await getLatestOTokenObject(ctx, result, block)
      let owner = owners!.get(address)
      if (!owner) {
        owner = await createAddress(
          params.OTokenAddress,
          ctx,
          address,
          timestamp,
        )
        owners!.set(address, owner)
      }

      let rebaseOption = new params.OTokenRebaseOption({
        id: getUniqueId(`${trace.transaction?.hash!}-${owner.id}`),
        timestamp,
        blockNumber,
        txHash: trace.transaction?.hash,
        address: owner,
        status: owner.rebasingOption,
      })
      result.rebaseOptions.push(rebaseOption)
      if (trace.action.sighash === otoken.functions.rebaseOptIn.sighash) {
        owner.rebasingOption = RebasingOption.OptIn
        rebaseOption.status = RebasingOption.OptIn
        otokenObject.nonRebasingSupply -= owner.balance
        otokenObject.rebasingSupply =
          otokenObject.totalSupply - otokenObject.nonRebasingSupply
      }
      if (trace.action.sighash === otoken.functions.rebaseOptOut.sighash) {
        owner.rebasingOption = RebasingOption.OptOut
        rebaseOption.status = RebasingOption.OptOut
        otokenObject.nonRebasingSupply += owner.balance
        otokenObject.rebasingSupply =
          otokenObject.totalSupply - otokenObject.nonRebasingSupply
      }
    }
  }

  const getLatestOTokenObject = async (
    ctx: Context,
    result: ProcessResult,
    block: Context['blocks']['0'],
  ) => {
    const timestampId = new Date(block.header.timestamp).toISOString()
    const { latest, current } = await getLatestEntity(
      ctx,
      params.OToken as any,
      result.otokens,
      timestampId,
    )

    let otokenObject = current
    if (!otokenObject) {
      otokenObject = new params.OToken({
        id: timestampId,
        timestamp: new Date(block.header.timestamp),
        blockNumber: block.header.height,
        totalSupply: latest?.totalSupply ?? 0n,
        rebasingSupply: latest?.rebasingSupply ?? 0n,
        nonRebasingSupply: latest?.nonRebasingSupply ?? 0n,
      })
      result.otokens.push(otokenObject)
    }

    return otokenObject
  }

  return process
}
