import dayjs from 'dayjs'
import { findLast, sortBy } from 'lodash'
import { Between, LessThanOrEqual } from 'typeorm'
import { formatUnits } from 'viem'

import * as erc20 from '@abi/erc20'
import * as otoken from '@abi/otoken'
import * as otokenHarvester from '@abi/otoken-base-harvester'
import * as otokenDripper from '@abi/otoken-dripper'
import * as otokenVault from '@abi/otoken-vault'
import {
  HistoryType,
  OToken,
  OTokenAPY,
  OTokenActivity,
  OTokenAddress,
  OTokenAsset,
  OTokenDailyStat,
  OTokenDripperState,
  OTokenHarvesterYieldSent,
  OTokenHistory,
  OTokenRebase,
  OTokenRebaseOption,
  OTokenVault,
  RebasingOption,
} from '@model'
import { Block, Context, Log } from '@processor'
import { ensureExchangeRate } from '@shared/post-processors/exchange-rates'
import { CurrencyAddress, CurrencySymbol } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { ADDRESS_ZERO, OETH_ADDRESS, OUSD_ADDRESS } from '@utils/addresses'
import { baseAddresses } from '@utils/addresses-base'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'
import { DECIMALS_18 } from '@utils/constants'
import { logFilter } from '@utils/logFilter'
import { multicall } from '@utils/multicall'
import { tokensByChain } from '@utils/tokensByChain'
import { getLatestEntity } from '@utils/utils'

import { createAddress, createRebaseAPY } from './utils'

export type OTokenContractAddress = typeof OUSD_ADDRESS | typeof OETH_ADDRESS | typeof baseAddresses.superOETHb.address

export const createOTokenProcessor = (params: {
  from: number
  vaultFrom: number
  Upgrade_CreditsBalanceOfHighRes?: number
  otokenAddress: OTokenContractAddress
  wotoken?: {
    address: string
    from: number
  }
  dripper?: {
    address: string
    from: number
    perSecondStartingBlock?: number
  }
  harvester?: {
    address: string
    from: number
    yieldSent: boolean
  }
  otokenVaultAddress: string
  oTokenAssets: { asset: CurrencyAddress; symbol: CurrencySymbol }[]
  getAmoSupply: (ctx: Context, height: number) => Promise<bigint>
  upgrades?: {
    rebaseOptEvents: number | false
  }
  accountsOverThresholdMinimum: bigint
}) => {
  const harvesterYieldSentFilter = params.harvester?.yieldSent
    ? logFilter({
        address: [params.harvester.address],
        topic0: [otokenHarvester.events.YieldSent.topic],
        range: { from: params.harvester.from },
      })
    : undefined
  const yieldDelegatedFilter = logFilter({
    address: [params.otokenAddress],
    topic0: [otoken.events.YieldDelegated.topic],
    range: { from: params.from },
  })
  const yieldUndelegatedFilter = logFilter({
    address: [params.otokenAddress],
    topic0: [otoken.events.YieldUndelegated.topic],
    range: { from: params.from },
  })

  const setup = (processor: EvmBatchProcessor) => {
    if (params.upgrades?.rebaseOptEvents !== false) {
      processor.addTrace({
        type: ['call'],
        callTo: [params.otokenAddress],
        callSighash: [otoken.functions.rebaseOptOut.selector, otoken.functions.rebaseOptIn.selector],
        transaction: true,
        range: { from: params.from, to: params.upgrades?.rebaseOptEvents }, // First AccountRebasing appears on 18872285, on OETH
      })
    }
    processor.addLog({
      address: [params.otokenAddress],
      topic0: [
        otoken.events.Transfer.topic,
        otoken.events.TotalSupplyUpdatedHighres.topic,
        otoken.events.AccountRebasingEnabled.topic,
        otoken.events.AccountRebasingDisabled.topic,
      ],
      transaction: true,
      range: { from: params.from },
    })
    processor.addLog(yieldDelegatedFilter.value)
    processor.addLog(yieldUndelegatedFilter.value)
    if (params.wotoken) {
      processor.addLog({
        address: [params.wotoken.address],
        topic0: [erc20.events.Transfer.topic],
        range: { from: params.wotoken.from },
      })
    }
    processor.addLog({
      address: [params.otokenVaultAddress],
      topic0: [otokenVault.events.YieldDistribution.topic],
      range: { from: params.from },
    })
    if (harvesterYieldSentFilter) {
      processor.addLog(harvesterYieldSentFilter.value)
    }
  }

  interface ProcessResult {
    initialized: boolean
    initialize: () => Promise<void>
    dailyStats: Map<string, { block: Block; entity: OTokenDailyStat }>
    otokens: OToken[]
    assets: OTokenAsset[]
    history: OTokenHistory[]
    rebases: OTokenRebase[]
    rebaseOptions: OTokenRebaseOption[]
    apies: OTokenAPY[]
    activity: OTokenActivity[]
    vaults: OTokenVault[]
    dripperStates: OTokenDripperState[]
    harvesterYieldSent: OTokenHarvesterYieldSent[]
    lastYieldDistributionEvent:
      | {
          fee: bigint
          yield: bigint
        }
      | undefined
  }

  let owners: Map<string, OTokenAddress> | undefined = undefined

  let idMap: Map<string, number>
  const getUniqueId = (partialId: string) => {
    const nextId = (idMap.get(partialId) ?? 0) + 1
    idMap.set(partialId, nextId)
    return `${partialId}-${nextId}`
  }
  const frequencyUpdate = blockFrequencyUpdater({ from: params.vaultFrom })

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
          .find(OTokenAddress, {
            where: { chainId: ctx.chain.id, otoken: params.otokenAddress },
          })
          .then((q) => new Map(q.map((i) => [i.address, i])))

        const assetsCount = await ctx.store.count(OTokenAsset, {
          where: { chainId: ctx.chain.id, otoken: params.otokenAddress },
        })
        if (assetsCount === 0) {
          result.assets.push(
            ...params.oTokenAssets.map(
              ({ asset, symbol }) =>
                new OTokenAsset({
                  id: `${ctx.chain.id}-${params.otokenAddress}-${asset}`,
                  chainId: ctx.chain.id,
                  otoken: params.otokenAddress,
                  address: asset,
                  symbol: symbol,
                }),
            ),
          )
        }
      },
      dailyStats: new Map<string, { block: Block; entity: OTokenDailyStat }>(),
      otokens: [],
      assets: [],
      history: [],
      rebases: [],
      rebaseOptions: [],
      apies: [],
      activity: [],
      vaults: [],
      dripperStates: [],
      harvesterYieldSent: [],
      lastYieldDistributionEvent: undefined,
    }

    for (const block of ctx.blocks) {
      await getOTokenDailyStat(ctx, result, block)
      for (const trace of block.traces) {
        await processRebaseOptTrace(ctx, result, block, trace)
      }
      for (const log of block.logs) {
        await processTransfer(ctx, result, block, log)
        await processYieldDistribution(ctx, result, block, log)
        await processTotalSupplyUpdatedHighres(ctx, result, block, log)
        await processRebaseOptEvent(ctx, result, block, log)
        await processHarvesterYieldSent(ctx, result, block, log)
        await processYieldDelegated(ctx, result, block, log)
        await processYieldUndelegated(ctx, result, block, log)
      }
    }

    await frequencyUpdate(ctx, async (ctx, block) => {
      const vaultContract = new otokenVault.Contract(ctx, block.header, params.otokenVaultAddress)
      const [vaultBuffer, totalValue] = await Promise.all([vaultContract.vaultBuffer(), vaultContract.totalValue()])
      result.vaults.push(
        new OTokenVault({
          id: `${ctx.chain.id}-${params.otokenAddress}-${block.header.height}-${params.otokenVaultAddress}`,
          chainId: ctx.chain.id,
          otoken: params.otokenAddress,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          address: params.otokenVaultAddress,
          vaultBuffer,
          totalValue,
        }),
      )

      if (params.dripper && params.dripper.from <= block.header.height) {
        const dripperContract = new otokenDripper.Contract(ctx, block.header, params.dripper.address)
        const [dripDuration, { lastCollect, perSecond }, availableFunds, wethBalance] = await Promise.all([
          dripperContract.dripDuration(),
          dripperContract.drip(),
          dripperContract.availableFunds(),
          new erc20.Contract(ctx, block.header, tokensByChain[ctx.chain.id].WETH).balanceOf(params.dripper.address),
        ])
        result.dripperStates.push(
          new OTokenDripperState({
            id: `${ctx.chain.id}-${params.otokenAddress}-${block.header.height}-${params.otokenVaultAddress}`,
            chainId: ctx.chain.id,
            blockNumber: block.header.height,
            timestamp: new Date(block.header.timestamp),
            otoken: params.otokenAddress,
            dripDuration,
            lastCollect,
            perSecond,
            availableFunds,
            wethBalance,
          }),
        )
      }
    })

    // Daily Stats
    // Whatever days we've just crossed over, let's update their respective daily stat entry using the last block seen at that time.
    for (const { block, entity } of result.dailyStats.values()) {
      if (block.header.height < params.from) continue
      const blockDate = new Date(block.header.timestamp)
      // Get the latest otokenObject for the blockDate in question. We cannot use `getLatestOTokenObject`.
      let otokenObject = findLast(result.otokens, (o) => o.timestamp <= blockDate)
      if (!otokenObject) {
        otokenObject = await ctx.store.findOne(OToken, {
          where: {
            chainId: ctx.chain.id,
            otoken: params.otokenAddress,
            timestamp: LessThanOrEqual(blockDate),
          },
          order: { timestamp: 'desc' },
        })
      }
      if (!otokenObject) {
        continue
        // throw new Error('otokenObject not found for daily stat processing')
      }
      entity.totalSupply = otokenObject.totalSupply ?? 0n
      entity.nonRebasingSupply = otokenObject.nonRebasingSupply ?? 0n
      entity.rebasingSupply = otokenObject.rebasingSupply ?? 0n

      let apy = findLast(result.apies, (apy) => apy.timestamp <= blockDate)
      if (!apy) {
        apy = await ctx.store.findOne(OTokenAPY, {
          order: { timestamp: 'desc' },
          where: { chainId: ctx.chain.id, otoken: params.otokenAddress, timestamp: LessThanOrEqual(blockDate) },
        })
      }
      if (apy) {
        entity.apr = apy.apr
        entity.apy = apy.apy
        entity.apy7 = apy.apy7DayAvg
        entity.apy14 = apy.apy14DayAvg
        entity.apy30 = apy.apy30DayAvg
      }
      const startOfDay = dayjs.utc(blockDate).startOf('day').toDate()
      // These should remain unique since any result rebases have not been stored in the database yet.
      let rebases = result.rebases.filter((rebase) => rebase.timestamp >= startOfDay && rebase.timestamp <= blockDate)
      rebases.push(
        ...(await ctx.store.find(OTokenRebase, {
          order: { timestamp: 'desc' },
          where: {
            chainId: ctx.chain.id,
            otoken: params.otokenAddress,
            timestamp: Between(startOfDay, blockDate),
          },
        })),
      )
      entity.yield = rebases.reduce((sum, current) => sum + current.yield - current.fee, 0n)
      // let yieldSentEvents: OTokenHarvesterYieldSent[] = []
      // if (params.harvester?.yieldSent) {
      //   yieldSentEvents = result.harvesterYieldSent.filter(
      //     (event) => event.timestamp >= startOfDay && event.timestamp <= blockDate,
      //   )
      //   yieldSentEvents.push(
      //     ...(await ctx.store.find(OTokenHarvesterYieldSent, {
      //       order: { timestamp: 'desc' },
      //       where: {
      //         chainId: ctx.chain.id,
      //         otoken: params.otokenAddress,
      //         timestamp: Between(startOfDay, blockDate),
      //       },
      //     })),
      //   )
      // }
      entity.fees = rebases.reduce((sum, current) => sum + current.fee, 0n)

      const lastDayString = dayjs(block.header.timestamp).subtract(1, 'day').toISOString().substring(0, 10)
      const lastId = `${ctx.chain.id}-${params.otokenAddress}-${lastDayString}`
      const last = result.dailyStats.get(lastId)?.entity ?? (await ctx.store.get(OTokenDailyStat, lastId))
      entity.cumulativeYield = (last?.cumulativeYield ?? 0n) + entity.yield
      entity.cumulativeFees = (last?.cumulativeFees ?? 0n) + entity.fees

      const getDripperAvailableFunds = async () => {
        if (!params.dripper || params.dripper.from > block.header.height) return 0n
        const dripperContract = new otokenDripper.Contract(ctx, block.header, params.dripper.address)
        return dripperContract.availableFunds()
      }
      const [rateETH, rateUSD, dripperWETH, amoSupply] = await Promise.all([
        ensureExchangeRate(ctx, block, params.otokenAddress, 'ETH').then((e) => e?.rate ?? 0n),
        ensureExchangeRate(ctx, block, params.otokenAddress, 'USD').then((e) => e?.rate ?? 0n),
        getDripperAvailableFunds(),
        params.getAmoSupply(ctx, block.header.height),
      ])

      entity.rateETH = rateETH
      entity.rateUSD = rateUSD
      entity.amoSupply = amoSupply

      entity.dripperWETH = dripperWETH
      entity.marketCapUSD = +formatUnits(entity.totalSupply * entity.rateUSD, 18)
      entity.wrappedSupply =
        params.wotoken && block.header.height >= params.wotoken.from
          ? await new erc20.Contract(ctx, block.header, params.wotoken.address).totalSupply()
          : 0n
      entity.accountsOverThreshold = Array.from(owners?.values() ?? []).filter(
        (a) => a.balance >= params.accountsOverThresholdMinimum,
      ).length
      ctx.log.info(`Updated OTokenDailyStat: ${entity.id}`)
    }

    if (owners) {
      await ctx.store.upsert([...owners.values()])
    }
    await ctx.store.upsert(result.apies)
    await Promise.all([
      ctx.store.insert(result.otokens),
      ctx.store.insert(result.assets),
      ctx.store.insert(result.history),
      ctx.store.insert(result.rebases),
      ctx.store.insert(result.rebaseOptions),
      ctx.store.insert(result.activity),
      ctx.store.insert(result.vaults),
      ctx.store.insert(result.dripperStates),
      ctx.store.insert(result.harvesterYieldSent),
      ctx.store.upsert([...result.dailyStats.values()].map((ds) => ds.entity)),
    ])
  }

  const processTransfer = async (
    ctx: Context,
    result: ProcessResult,
    block: Context['blocks']['0'],
    log: Context['blocks']['0']['logs']['0'],
  ) => {
    if (log.address !== params.otokenAddress) return
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
          entity = await createAddress(ctx, params.otokenAddress, address)
          owners!.set(entity.address, entity)
        }
        entity.lastUpdated = new Date(block.header.timestamp)
        return entity
      }

      const afterHighResUpgrade = block.header.height >= (params.Upgrade_CreditsBalanceOfHighRes ?? 0)
      const [addressSub, addressAdd, [fromCreditsBalanceOf, toCreditsBalanceOf]] = await Promise.all([
        ensureAddress(data.from),
        ensureAddress(data.to),
        multicall(
          ctx,
          block.header,
          afterHighResUpgrade
            ? otoken.functions.creditsBalanceOfHighres
            : (otoken.functions.creditsBalanceOf as unknown as typeof otoken.functions.creditsBalanceOfHighres),
          params.otokenAddress,
          [{ _account: data.from }, { _account: data.to }],
        ).then((results) => {
          if (afterHighResUpgrade) {
            return results.map((r) => [r._0, r._1])
          } else {
            return results.map((r) => [r._0 * 1000000000n, r._1 * 1000000000n])
          }
        }) as Promise<[bigint, bigint][]>,
      ])

      /**
       * "0017708038-000327-29fec:0xd2cdf18b60a5cdb634180d5615df7a58a597247c:Sent","0","49130257489166670","2023-07-16T19:50:11.000Z",17708038,"0x0e3ac28945d45993e3d8e1f716b6e9ec17bfc000418a1091a845b7a00c7e3280","Sent","0xd2cdf18b60a5cdb634180d5615df7a58a597247c",
       * "0017708038-000327-29fec:0xd2cdf18b60a5cdb634180d5615df7a58a597247c:Sent","0","49130257489166670","2023-07-16T19:50:11.000Z",17708038,"0x0e3ac28945d45993e3d8e1f716b6e9ec17bfc000418a1091a845b7a00c7e3280","Sent","0xd2cdf18b60a5cdb634180d5615df7a58a597247c",
       */

      const updateAddressBalance = async ({
        address,
        credits,
      }: {
        address: OTokenAddress
        credits: [bigint, bigint]
      }) => {
        const otokenContract = new otoken.Contract(ctx, block.header, params.otokenAddress)
        const involvedInYieldDelegation =
          address.rebasingOption === RebasingOption.YieldDelegationSource ||
          address.rebasingOption === RebasingOption.YieldDelegationTarget
        const newBalance = involvedInYieldDelegation
          ? await otokenContract.balanceOf(address.address)! // It should exist.
          : (credits[0] * DECIMALS_18) / credits[1]
        const change = newBalance - address.balance
        if (change === 0n) return
        const type = addressSub === address ? HistoryType.Sent : HistoryType.Received
        result.history.push(
          new OTokenHistory({
            id: getUniqueId(`${ctx.chain.id}-${params.otokenAddress}-${log.id}`),
            chainId: ctx.chain.id,
            otoken: params.otokenAddress,
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

      await Promise.all([
        updateAddressBalance({
          address: addressSub,
          credits: fromCreditsBalanceOf,
        }),
        updateAddressBalance({
          address: addressAdd,
          credits: toCreditsBalanceOf,
        }),
      ])

      if (addressAdd.rebasingOption === RebasingOption.OptOut && data.from === ADDRESS_ZERO) {
        // If it's a mint and minter has opted out of rebasing,
        // add to non-rebasing supply
        otokenObject.nonRebasingSupply += data.value
      } else if (data.to === ADDRESS_ZERO && addressSub.rebasingOption === RebasingOption.OptOut) {
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
      otokenObject.rebasingSupply = otokenObject.totalSupply - otokenObject.nonRebasingSupply
    }
  }

  const processTotalSupplyUpdatedHighres = async (
    ctx: Context,
    result: ProcessResult,
    block: Context['blocks']['0'],
    log: Context['blocks']['0']['logs']['0'],
  ) => {
    if (log.address !== params.otokenAddress) return
    if (log.topics[0] !== otoken.events.TotalSupplyUpdatedHighres.topic) return

    await result.initialize()
    const data = otoken.events.TotalSupplyUpdatedHighres.decode(log)

    // OToken Object
    const otokenObject = await getLatestOTokenObject(ctx, result, block)

    otokenObject.totalSupply = data.totalSupply
    otokenObject.rebasingSupply = otokenObject.totalSupply - otokenObject.nonRebasingSupply

    // Rebase events
    const rebase = createRebaseAPY(
      ctx,
      params.otokenAddress,
      result.apies,
      result.rebases,
      block,
      log,
      data,
      result.lastYieldDistributionEvent,
    )
    const yieldDelegationBalances = await getYieldDelegationBalances(ctx, block)

    for (const address of sortBy([...owners!.values()], 'address')) {
      if (!address.credits || address.rebasingOption === RebasingOption.OptOut) {
        continue
      }
      const involvedInYieldDelegation =
        address.rebasingOption === RebasingOption.YieldDelegationSource ||
        address.rebasingOption === RebasingOption.YieldDelegationTarget
      const newBalance = involvedInYieldDelegation
        ? yieldDelegationBalances.get(address.address)! // It should exist.
        : (address.credits * DECIMALS_18) / data.rebasingCreditsPerToken
      const earned = newBalance - address.balance

      if (earned === 0n) continue
      result.history.push(
        new OTokenHistory({
          id: getUniqueId(`${ctx.chain.id}-${params.otokenAddress}-${log.id}`),
          chainId: ctx.chain.id,
          otoken: params.otokenAddress,
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
    if (log.address !== params.otokenVaultAddress) return
    if (log.topics[0] !== otokenVault.events.YieldDistribution.topic) return

    await result.initialize()
    const { _yield, _fee } = otokenVault.events.YieldDistribution.decode(log)
    result.lastYieldDistributionEvent = { yield: _yield, fee: _fee }
  }

  const processRebaseOptTrace = async (
    ctx: Context,
    result: ProcessResult,
    block: Context['blocks']['0'],
    trace: Context['blocks']['0']['traces']['0'],
  ) => {
    if (
      trace.type === 'call' &&
      params.otokenAddress === trace.action.to &&
      (trace.action.sighash === otoken.functions.governanceRebaseOptIn.selector ||
        trace.action.sighash === otoken.functions.rebaseOptIn.selector ||
        trace.action.sighash === otoken.functions.rebaseOptOut.selector)
    ) {
      await result.initialize()
      const timestamp = new Date(block.header.timestamp)
      const address =
        trace.action.sighash === otoken.functions.governanceRebaseOptIn.selector
          ? otoken.functions.governanceRebaseOptIn.decode(trace.action.input)._account
          : trace.action.from.toLowerCase()
      const option =
        trace.action.sighash === otoken.functions.rebaseOptIn.selector ? RebasingOption.OptIn : RebasingOption.OptOut
      await processRebaseOpt({
        ctx,
        result,
        block,
        address,
        hash: trace.transaction?.hash ?? timestamp.toString(),
        option,
      })
    }
  }

  const processRebaseOptEvent = async (
    ctx: Context,
    result: ProcessResult,
    block: Context['blocks']['0'],
    log: Context['blocks']['0']['logs']['0'],
  ) => {
    if (log.address !== params.otokenAddress) return
    const rebaseEventTopics = {
      [otoken.events.AccountRebasingEnabled.topic]: otoken.events.AccountRebasingEnabled,
      [otoken.events.AccountRebasingDisabled.topic]: otoken.events.AccountRebasingDisabled,
    }
    if (rebaseEventTopics[log.topics[0]]) {
      await result.initialize()
      const data = rebaseEventTopics[log.topics[0]].decode(log)

      const address = data.account.toLowerCase()
      const option =
        log.topics[0] === otoken.events.AccountRebasingEnabled.topic ? RebasingOption.OptIn : RebasingOption.OptOut
      await processRebaseOpt({ ctx, result, block, address, hash: log.transactionHash, option })
    }
  }

  const rebaseOptsHandled = new Set<string>()
  const processRebaseOpt = async ({
    ctx,
    result,
    block,
    address,
    hash,
    option,
    delegate,
  }: {
    ctx: Context
    result: ProcessResult
    block: Context['blocks']['0']
    address: string
    hash: string
    option: RebasingOption
    delegate?: string
  }) => {
    if (rebaseOptsHandled.has(`${hash}-${address}-${option}`)) return
    rebaseOptsHandled.add(`${hash}-${address}-${option}`)
    const timestamp = new Date(block.header.timestamp)
    const blockNumber = block.header.height
    const otokenObject = await getLatestOTokenObject(ctx, result, block)
    let owner = owners!.get(address)
    if (!owner) {
      owner = await createAddress(ctx, params.otokenAddress, address, timestamp)
      owners!.set(address, owner)
    }
    const rebaseOption = new OTokenRebaseOption({
      id: getUniqueId(`${ctx.chain.id}-${params.otokenAddress}-${hash}-${owner.address}`),
      chainId: ctx.chain.id,
      otoken: params.otokenAddress,
      timestamp,
      blockNumber,
      txHash: hash,
      address: owner,
      status: owner.rebasingOption,
      delegatedTo: null,
    })
    result.rebaseOptions.push(rebaseOption)

    owner.delegatedTo = null
    if (option === RebasingOption.OptIn) {
      const afterHighResUpgrade = block.header.height >= (params.Upgrade_CreditsBalanceOfHighRes ?? 0)
      const otokenContract = new otoken.Contract(ctx, block.header, params.otokenAddress)
      owner.credits = afterHighResUpgrade
        ? await otokenContract.creditsBalanceOfHighres(owner.address).then((c) => c._0)
        : await otokenContract.creditsBalanceOf(owner.address).then((c) => c._0 * 1000000000n)
      rebaseOption.status = RebasingOption.OptIn
      owner.rebasingOption = RebasingOption.OptIn
      otokenObject.nonRebasingSupply -= owner.balance
      otokenObject.rebasingSupply = otokenObject.totalSupply - otokenObject.nonRebasingSupply
    } else {
      rebaseOption.status = RebasingOption.OptOut
      owner.rebasingOption = RebasingOption.OptOut
      otokenObject.nonRebasingSupply += owner.balance
      otokenObject.rebasingSupply = otokenObject.totalSupply - otokenObject.nonRebasingSupply
    }
  }

  const processYieldDelegated = async (ctx: Context, result: ProcessResult, block: Block, log: Log) => {
    if (!yieldDelegatedFilter.matches(log)) return
    const timestamp = new Date(block.header.timestamp)
    const blockNumber = block.header.height
    const data = otoken.events.YieldDelegated.decode(log)
    const sourceAddress = data.source.toLowerCase()
    const targetAddress = data.target.toLowerCase()
    // Source
    let sourceOwner = owners!.get(sourceAddress)
    if (!sourceOwner) {
      sourceOwner = await createAddress(ctx, params.otokenAddress, sourceAddress, timestamp)
      owners!.set(sourceAddress, sourceOwner)
    }
    sourceOwner.rebasingOption = RebasingOption.YieldDelegationSource
    sourceOwner.delegatedTo = targetAddress
    result.rebaseOptions.push(
      new OTokenRebaseOption({
        id: getUniqueId(`${ctx.chain.id}-${params.otokenAddress}-${log.transactionHash}-${sourceAddress}`),
        chainId: ctx.chain.id,
        otoken: params.otokenAddress,
        timestamp,
        blockNumber,
        txHash: log.transactionHash,
        address: sourceOwner,
        status: RebasingOption.YieldDelegationSource,
        delegatedTo: targetAddress,
      }),
    )
    // Target
    let targetOwner = owners!.get(targetAddress)
    if (!targetOwner) {
      targetOwner = await createAddress(ctx, params.otokenAddress, targetAddress, timestamp)
      owners!.set(targetAddress, targetOwner)
    }
    targetOwner.rebasingOption = RebasingOption.YieldDelegationTarget
    targetOwner.delegatedTo = null
    result.rebaseOptions.push(
      new OTokenRebaseOption({
        id: getUniqueId(`${ctx.chain.id}-${params.otokenAddress}-${log.transactionHash}-${targetAddress}`),
        chainId: ctx.chain.id,
        otoken: params.otokenAddress,
        timestamp,
        blockNumber,
        txHash: log.transactionHash,
        address: targetOwner,
        status: RebasingOption.YieldDelegationTarget,
        delegatedTo: null,
      }),
    )
  }

  const processYieldUndelegated = async (ctx: Context, result: ProcessResult, block: Block, log: Log) => {
    if (!yieldUndelegatedFilter.matches(log)) return
    const timestamp = new Date(block.header.timestamp)
    const blockNumber = block.header.height
    const data = otoken.events.YieldUndelegated.decode(log)
    const sourceAddress = data.source.toLowerCase()
    const targetAddress = data.target.toLowerCase()
    // Source
    let sourceOwner = owners!.get(sourceAddress)
    if (!sourceOwner) {
      sourceOwner = await createAddress(ctx, params.otokenAddress, sourceAddress, timestamp)
      owners!.set(sourceAddress, sourceOwner)
    }
    sourceOwner.rebasingOption = RebasingOption.OptOut
    sourceOwner.delegatedTo = null
    result.rebaseOptions.push(
      new OTokenRebaseOption({
        id: getUniqueId(`${ctx.chain.id}-${params.otokenAddress}-${log.transactionHash}-${sourceAddress}`),
        chainId: ctx.chain.id,
        otoken: params.otokenAddress,
        timestamp,
        blockNumber,
        txHash: log.transactionHash,
        address: sourceOwner,
        status: RebasingOption.OptOut,
        delegatedTo: null,
      }),
    )
    // Target
    let targetOwner = owners!.get(targetAddress)
    if (!targetOwner) {
      targetOwner = await createAddress(ctx, params.otokenAddress, targetAddress, timestamp)
      owners!.set(targetAddress, targetOwner)
    }
    targetOwner.rebasingOption = RebasingOption.OptIn
    targetOwner.delegatedTo = null
    result.rebaseOptions.push(
      new OTokenRebaseOption({
        id: getUniqueId(`${ctx.chain.id}-${params.otokenAddress}-${log.transactionHash}-${targetAddress}`),
        chainId: ctx.chain.id,
        otoken: params.otokenAddress,
        timestamp,
        blockNumber,
        txHash: log.transactionHash,
        address: targetOwner,
        status: RebasingOption.OptIn,
        delegatedTo: null,
      }),
    )
  }

  const processHarvesterYieldSent = async (
    ctx: Context,
    result: ProcessResult,
    block: Context['blocks']['0'],
    log: Context['blocks']['0']['logs']['0'],
  ) => {
    if (!harvesterYieldSentFilter?.matches(log)) return
    await result.initialize()
    const data = otokenHarvester.events.YieldSent.decode(log)
    result.harvesterYieldSent.push(
      new OTokenHarvesterYieldSent({
        id: log.id,
        chainId: ctx.chain.id,
        blockNumber: block.header.height,
        timestamp: new Date(block.header.timestamp),
        otoken: params.otokenAddress,
        txHash: log.transactionHash,
        yield: data.yield,
        fee: data.fee,
      }),
    )
  }

  const getLatestOTokenObject = async (ctx: Context, result: ProcessResult, block: Block) => {
    const timestamp = new Date(block.header.timestamp).toISOString()
    const otokenId = `${ctx.chain.id}-${params.otokenAddress}-${timestamp}`
    const { latest, current } = await getLatestEntity(ctx, OToken, result.otokens, otokenId, {
      chainId: ctx.chain.id,
      otoken: params.otokenAddress,
    })

    let otokenObject = current
    if (!otokenObject) {
      otokenObject = new OToken({
        id: otokenId,
        chainId: ctx.chain.id,
        otoken: params.otokenAddress,
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

  const getOTokenDailyStat = async (ctx: Context, result: ProcessResult, block: Block) => {
    const dayString = new Date(block.header.timestamp).toISOString().substring(0, 10)
    const id = `${ctx.chain.id}-${params.otokenAddress}-${dayString}`
    let entity = result.dailyStats.get(id)?.entity ?? (await ctx.store.get(OTokenDailyStat, id))

    if (!entity) {
      entity = new OTokenDailyStat({
        id,
        chainId: ctx.chain.id,
        timestamp: new Date(block.header.timestamp),
        date: dayString,
        blockNumber: block.header.height,
        otoken: params.otokenAddress,

        apr: 0,
        apy: 0,
        apy7: 0,
        apy14: 0,
        apy30: 0,

        rateUSD: 0n,
        rateETH: 0n,

        totalSupply: 0n,
        rebasingSupply: 0n,
        nonRebasingSupply: 0n,
        wrappedSupply: 0n,

        amoSupply: 0n,
        dripperWETH: 0n,

        yield: 0n,
        fees: 0n,
        cumulativeYield: 0n,
        cumulativeFees: 0n,

        marketCapUSD: 0,
        accountsOverThreshold: 0,
      })
      result.dailyStats.set(entity.id, { block, entity })
    } else {
      result.dailyStats.set(entity.id, { block, entity })
      entity.timestamp = new Date(block.header.timestamp)
      entity.blockNumber = block.header.height
    }

    return entity
  }

  const getYieldDelegationBalances = async (ctx: Context, block: Block) => {
    const delegatedAddresses = Array.from(owners!.values())
      .filter(
        (owner) =>
          owner.rebasingOption === RebasingOption.YieldDelegationSource ||
          owner.rebasingOption === RebasingOption.YieldDelegationTarget,
      )
      .map((owner) => owner.address)
    const delegateBalances = await multicall(
      ctx,
      block.header,
      otoken.functions.balanceOf,
      params.otokenAddress,
      delegatedAddresses.map((_account) => ({ _account })),
    )
    return new Map<string, bigint>(delegatedAddresses.map((address, index) => [address, delegateBalances[index]]))
  }

  return {
    name: `otoken-${params.otokenAddress}`,
    from: params.from,
    setup,
    process,
  }
}
