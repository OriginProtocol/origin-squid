import { findLast, sortBy, uniq } from 'lodash'
import { LessThanOrEqual } from 'typeorm'

import * as erc20 from '@abi/erc20'
import * as otoken from '@abi/otoken'
import * as otokenHarvester from '@abi/otoken-base-harvester'
import * as otokenDripper from '@abi/otoken-dripper'
import * as otokenVault from '@abi/otoken-vault'
import * as wotokenAbi from '@abi/woeth'
import {
  ERC20,
  ERC20Holder,
  HistoryType,
  OToken,
  OTokenAPY,
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
  WOToken,
} from '@model'
import {
  Block,
  Context,
  EvmBatchProcessor,
  Log,
  blockFrequencyUpdater,
  logFilter,
  multicall,
} from '@originprotocol/squid-utils'
import { ensureExchangeRate } from '@shared/post-processors/exchange-rates'
import { CurrencyAddress, CurrencySymbol } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { ADDRESS_ZERO, OETH_ADDRESS, OUSD_ADDRESS, OUSD_STABLE_OTOKENS } from '@utils/addresses'
import { baseAddresses } from '@utils/addresses-base'
import { plumeAddresses } from '@utils/addresses-plume'
import { sonicAddresses } from '@utils/addresses-sonic'
import { DECIMALS_18 } from '@utils/constants'

import { getOTokenDailyStat, processOTokenDailyStats } from './otoken-daily-stats'
import { processOTokenERC20 } from './otoken-erc20'
import { createAddress, createRebaseAPY } from './utils'

export type OTokenContractAddress =
  | typeof OUSD_ADDRESS
  | typeof OETH_ADDRESS
  | typeof baseAddresses.superOETHb.address
  | typeof sonicAddresses.tokens.OS
  | typeof plumeAddresses.tokens.superOETHp

export const createOTokenLegacyProcessor = (params: {
  name: string
  symbol: string
  from: number
  vaultFrom: number
  Upgrade_CreditsBalanceOfHighRes?: number
  otokenAddress: OTokenContractAddress
  wotoken?: {
    address: string
    from: number
  }
  dripper?: {
    vaultDripper: boolean
    address: string
    from: number
    to?: number
    token: string
  }[]
  harvester?: {
    address: string
    from: number
    yieldSent: boolean
  }
  otokenVaultAddress: string
  redemptionAsset?: { asset: CurrencyAddress; symbol: CurrencySymbol }
  oTokenAssets: { asset: CurrencyAddress; symbol: CurrencySymbol }[]
  getAmoSupply: (ctx: Context, height: number) => Promise<bigint>
  upgrades?: {
    rebaseOptEvents: number | false
  }
  accountsOverThresholdMinimum: bigint
  feeOverride?: bigint // out of 100
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
  const withdrawalRelatedFilter = logFilter({
    address: [params.otokenVaultAddress],
    topic0: [
      otokenVault.events.WithdrawalRequested.topic,
      otokenVault.events.WithdrawalClaimable.topic,
      otokenVault.events.WithdrawalClaimed.topic,
    ],
    range: { from: params.from },
  })

  const rebaseEventTopics = {
    [otoken.events.AccountRebasingEnabled.topic]: otoken.events.AccountRebasingEnabled,
    [otoken.events.AccountRebasingDisabled.topic]: otoken.events.AccountRebasingDisabled,
  }

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
    processor.addLog(withdrawalRelatedFilter.value)
  }

  const initialize = async (ctx: Context) => {
    const erc20Id = `${ctx.chain.id}-${params.otokenAddress}`
    const erc20 = await ctx.store.get(ERC20, erc20Id)
    if (!erc20) {
      await ctx.store.insert(
        new ERC20({
          id: erc20Id,
          chainId: ctx.chain.id,
          address: params.otokenAddress,
          name: params.name,
          symbol: params.symbol,
          decimals: 18,
        }),
      )
    }
  }

  interface ProcessResult {
    initialized: boolean
    initialize: () => Promise<void>
    dailyStats: Map<string, { block: Block; entity: OTokenDailyStat }>
    otokens: OToken[]
    wotokens: WOToken[]
    assets: OTokenAsset[]
    history: OTokenHistory[]
    rebases: OTokenRebase[]
    rebaseOptions: OTokenRebaseOption[]
    apies: OTokenAPY[]
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
    let start: number = Date.now()
    const time = (name: string) => {
      if (global.process.env.DEBUG_PERF !== 'true') return
      const message = `otoken:${name} ${Date.now() - start}ms`
      ctx.log.info(message)
      start = Date.now()
    }
    time('start')
    idMap = new Map<string, number>()

    const transferFilter = logFilter({
      address: [params.otokenAddress],
      topic0: [otoken.events.Transfer.topic],
      range: { from: params.from },
    })

    const result: ProcessResult = {
      initialized: false,
      // Saves ~5ms init time if we have no filter matches.
      initialize: async () => {
        if (result.initialized) return
        result.initialized = true

        if (!owners) {
          // get all addresses from the database.
          // we need this because we increase their balance based on rebase events
          owners = await ctx.store
            .find(OTokenAddress, {
              where: { chainId: ctx.chain.id, otoken: params.otokenAddress },
            })
            .then((q) => new Map(q.map((i) => [i.address, i])))
        }

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
        time('initialize')
      },
      dailyStats: new Map<string, { block: Block; entity: OTokenDailyStat }>(),
      otokens: [],
      wotokens: [],
      assets: [],
      history: [],
      rebases: [],
      rebaseOptions: [],
      apies: [],
      vaults: [],
      dripperStates: [],
      harvesterYieldSent: [],
      lastYieldDistributionEvent: undefined,
    }
    const transfers: {
      block: Block
      transactionHash: string
      from: string
      fromBalance: bigint
      to: string
      toBalance: bigint
      value: bigint
    }[] = []

    /* Owners which have been pulled or updated in the current context. */
    let ownersChanged = new Map<string, OTokenAddress>()
    let getOwner = async (ctx: Context, address: string, block: Block) => {
      let owner = owners!.get(address)
      if (!owner) {
        owner = await createAddress(ctx, params.otokenAddress, address, block)
        owners!.set(owner.address, owner)
      }
      ownersChanged.set(owner.address, owner)
      return owner
    }

    await result.initialize()

    // Prepare data for transfer processing
    const transferLogs = ctx.blocks.map((block) => {
      const logs = block.logs.filter((l) => transferFilter.matches(l)).map((log) => ({ block, log }))
      const addresses = uniq(
        logs.flatMap(({ log }) => {
          const transfer = otoken.events.Transfer.decode(log)
          return [transfer.from.toLowerCase(), transfer.to.toLowerCase()]
        }),
      )
      return {
        block,
        addresses,
      }
    })

    const transferLogsCredits = new Map<number, { address: string; credits: [bigint, bigint] }[]>(
      await Promise.all(
        transferLogs.map(({ block, addresses }) => {
          const afterHighResUpgrade = block.header.height >= (params.Upgrade_CreditsBalanceOfHighRes ?? 0)
          return multicall(
            ctx,
            block.header,
            afterHighResUpgrade
              ? otoken.functions.creditsBalanceOfHighres
              : (otoken.functions.creditsBalanceOf as unknown as typeof otoken.functions.creditsBalanceOfHighres),
            params.otokenAddress,
            addresses.map((_account) => ({ _account })),
          ).then((results) => {
            const mod = afterHighResUpgrade ? 1n : 1000000000n
            return [
              block.header.height,
              results.map((result, index) => ({
                address: addresses[index],
                credits: [result._0 * mod, result._1 * mod],
              })),
            ] as [number, { address: string; credits: [bigint, bigint] }[]]
          })
        }),
      ),
    )
    time('processTransfer preparation')

    const processTransfer = async (block: Context['blocks']['0'], log: Context['blocks']['0']['logs']['0']) => {
      const dataRaw = otoken.events.Transfer.decode(log)
      const data = {
        from: dataRaw.from.toLowerCase(),
        to: dataRaw.to.toLowerCase(),
        value: dataRaw.value,
      }
      if (data.value === 0n) return

      const fromCreditsBalanceOf = transferLogsCredits
        .get(block.header.height)!
        .find(({ address }) => address === data.from)!.credits
      const toCreditsBalanceOf = transferLogsCredits
        .get(block.header.height)!
        .find(({ address }) => address === data.to)!.credits

      const ensureAddress = async (address: string) => {
        let entity = await getOwner(ctx, address, block)
        entity.blockNumber = block.header.height
        entity.lastUpdated = new Date(block.header.timestamp)
        return entity
      }

      const [otokenObject, addressSub, addressAdd] = await Promise.all([
        getOTokenObject(block),
        ensureAddress(data.from),
        ensureAddress(data.to),
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
        if (address.balance === 0n && newBalance > 0n) {
          address.since = new Date(block.header.timestamp)
        } else if (newBalance === 0n) {
          address.since = null
        }
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

      if (data.from === ADDRESS_ZERO) {
        otokenObject.totalSupply += data.value
      } else if (data.to === ADDRESS_ZERO) {
        otokenObject.totalSupply -= data.value
      }

      const addIsRebasing =
        addressAdd.rebasingOption === RebasingOption.OptIn ||
        addressAdd.rebasingOption === RebasingOption.YieldDelegationSource ||
        addressAdd.rebasingOption === RebasingOption.YieldDelegationTarget
      const subIsRebasing =
        addressSub.rebasingOption === RebasingOption.OptIn ||
        addressSub.rebasingOption === RebasingOption.YieldDelegationSource ||
        addressSub.rebasingOption === RebasingOption.YieldDelegationTarget

      if (data.from === ADDRESS_ZERO && !addIsRebasing) {
        // If it's a mint and minter has opted out of rebasing,
        // add to non-rebasing supply
        otokenObject.nonRebasingSupply += data.value
      } else if (data.to === ADDRESS_ZERO && !subIsRebasing) {
        // If it's a redeem and redeemer has opted out of rebasing,
        // subtract non-rebasing supply
        otokenObject.nonRebasingSupply -= data.value
      } else if (!addIsRebasing && subIsRebasing) {
        // If receiver has opted out but sender hasn't,
        // Add to non-rebasing supply
        otokenObject.nonRebasingSupply += data.value
      } else if (addIsRebasing && !subIsRebasing) {
        // If sender has opted out but receiver hasn't,
        // Subtract non-rebasing supply
        otokenObject.nonRebasingSupply -= data.value
      }

      // Update rebasing supply in all cases
      otokenObject.rebasingSupply = otokenObject.totalSupply - otokenObject.nonRebasingSupply

      transfers.push({
        block,
        transactionHash: log.transactionHash,
        from: data.from,
        fromBalance: addressSub.balance,
        to: data.to,
        toBalance: addressAdd.balance,
        value: data.value,
      })
    }

    const processTotalSupplyUpdatedHighres = async (
      block: Context['blocks']['0'],
      log: Context['blocks']['0']['logs']['0'],
    ) => {
      const data = otoken.events.TotalSupplyUpdatedHighres.decode(log)

      // OToken Object
      const otokenObject = await getOTokenObject(block)

      otokenObject.totalSupply = data.totalSupply
      otokenObject.rebasingSupply = otokenObject.totalSupply - otokenObject.nonRebasingSupply
      otokenObject.creditsPerToken = data.rebasingCreditsPerToken

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
        params.feeOverride,
      )
      const yieldDelegationBalances = await getYieldDelegationBalances(ctx, block)

      for (const address of sortBy([...owners!.values()], 'address')) {
        if (!address.credits || address.rebasingOption === RebasingOption.OptOut) {
          continue
        }
        ownersChanged.set(address.address, address) // We have to mark that this has changed.

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

        if (address.balance === 0n && newBalance > 0n) {
          address.since = new Date(block.header.timestamp)
        } else if (newBalance === 0n) {
          address.since = null
        }
        address.balance = newBalance
        address.creditsPerToken = data.rebasingCreditsPerToken
        address.earned += earned
      }
      const entity = await rebase
      result.rebases.push(entity)
      time('processTotalSupplyUpdatedHighres')
    }

    const processYieldDistribution = (block: Context['blocks']['0'], log: Context['blocks']['0']['logs']['0']) => {
      const { _yield, _fee } = otokenVault.events.YieldDistribution.decode(log)
      result.lastYieldDistributionEvent = { yield: _yield, fee: _fee }
      time('processYieldDistribution')
    }

    const processRebaseOptTrace = async (
      block: Context['blocks']['0'],
      trace: Context['blocks']['0']['traces']['0'] & { type: 'call' },
    ) => {
      const timestamp = new Date(block.header.timestamp)
      const address =
        trace.action.sighash === otoken.functions.governanceRebaseOptIn.selector
          ? otoken.functions.governanceRebaseOptIn.decode(trace.action.input)._account
          : trace.action.from.toLowerCase()
      const option =
        trace.action.sighash === otoken.functions.rebaseOptIn.selector ? RebasingOption.OptIn : RebasingOption.OptOut
      await processRebaseOpt({
        block,
        address,
        hash: trace.transaction?.hash ?? timestamp.toString(),
        option,
      })
      time('processRebaseOptTrace')
    }

    const processRebaseOptEvent = async (block: Context['blocks']['0'], log: Context['blocks']['0']['logs']['0']) => {
      if (log.address === params.otokenAddress) {
        const rebaseEventTopics = {
          [otoken.events.AccountRebasingEnabled.topic]: otoken.events.AccountRebasingEnabled,
          [otoken.events.AccountRebasingDisabled.topic]: otoken.events.AccountRebasingDisabled,
        }
        if (rebaseEventTopics[log.topics[0]]) {
          const data = rebaseEventTopics[log.topics[0]].decode(log)

          const address = data.account.toLowerCase()
          const option =
            log.topics[0] === otoken.events.AccountRebasingEnabled.topic ? RebasingOption.OptIn : RebasingOption.OptOut
          await processRebaseOpt({ block, address, hash: log.transactionHash, option })
          time('processRebaseOptEvent')
        }
      }
    }

    const rebaseOptsHandled = new Set<string>()
    const processRebaseOpt = async ({
      block,
      address,
      hash,
      option,
      _delegate,
    }: {
      block: Context['blocks']['0']
      address: string
      hash: string
      option: RebasingOption
      _delegate?: string
    }) => {
      if (rebaseOptsHandled.has(`${hash}-${address}-${option}`)) return
      rebaseOptsHandled.add(`${hash}-${address}-${option}`)
      const timestamp = new Date(block.header.timestamp)
      const blockNumber = block.header.height
      const otokenObject = await getOTokenObject(block)
      let owner = await getOwner(ctx, address, block)
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

      owner.yieldFrom = null
      owner.yieldTo = null
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

    const processYieldDelegated = async (block: Block, log: Log) => {
      const otokenObject = await getOTokenObject(block)
      const timestamp = new Date(block.header.timestamp)
      const blockNumber = block.header.height
      const data = otoken.events.YieldDelegated.decode(log)
      const sourceAddress = data.source.toLowerCase()
      const targetAddress = data.target.toLowerCase()
      let sourceOwner = await getOwner(ctx, sourceAddress, block)
      let targetOwner = await getOwner(ctx, targetAddress, block)
      // Source
      sourceOwner.rebasingOption = RebasingOption.YieldDelegationSource
      sourceOwner.yieldFrom = null
      sourceOwner.yieldTo = targetAddress
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
      targetOwner.rebasingOption = RebasingOption.YieldDelegationTarget
      targetOwner.yieldFrom = sourceAddress
      targetOwner.yieldTo = null
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
      const otokenContract = new otoken.Contract(ctx, block.header, params.otokenAddress)
      otokenObject.nonRebasingSupply = await otokenContract.nonRebasingSupply()
      otokenObject.rebasingSupply = otokenObject.totalSupply - otokenObject.nonRebasingSupply
      time('processYieldDelegated')
    }

    const processYieldUndelegated = async (block: Block, log: Log) => {
      const otokenObject = await getOTokenObject(block)
      const timestamp = new Date(block.header.timestamp)
      const blockNumber = block.header.height
      const data = otoken.events.YieldUndelegated.decode(log)
      const sourceAddress = data.source.toLowerCase()
      const targetAddress = data.target.toLowerCase()
      // Source
      let sourceOwner = await getOwner(ctx, sourceAddress, block)
      sourceOwner.rebasingOption = RebasingOption.OptOut
      sourceOwner.yieldFrom = null
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
      let targetOwner = await getOwner(ctx, targetAddress, block)
      targetOwner.rebasingOption = RebasingOption.OptIn
      targetOwner.yieldTo = null
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
      const otokenContract = new otoken.Contract(ctx, block.header, params.otokenAddress)
      otokenObject.nonRebasingSupply = await otokenContract.nonRebasingSupply()
      otokenObject.rebasingSupply = otokenObject.totalSupply - otokenObject.nonRebasingSupply
      time('processYieldUndelegated')
    }

    const processHarvesterYieldSent = async (
      block: Context['blocks']['0'],
      log: Context['blocks']['0']['logs']['0'],
    ) => {
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
      time('processHarvesterYieldSent')
    }

    // Update the unallocatedSupply of OToken.
    const processWithdrawalRelated = async (block: Block, _log: Log) => {
      if (!params.redemptionAsset) return
      const vault = new otokenVault.Contract(ctx, block.header, params.otokenVaultAddress)
      const redeemingAsset = new erc20.Contract(ctx, block.header, params.redemptionAsset.asset)
      const [otokenObject, withdrawalQueueMetadata, redeemingAssetBalance] = await Promise.all([
        getOTokenObject(block),
        vault.withdrawalQueueMetadata(),
        redeemingAsset.balanceOf(params.otokenVaultAddress),
      ])
      const claimableSupply = withdrawalQueueMetadata.queued - withdrawalQueueMetadata.claimed
      otokenObject.unallocatedSupply = redeemingAssetBalance - claimableSupply
    }

    const getOTokenObject = async (block: Block) => {
      const timestamp = new Date(block.header.timestamp)
      const otokenId = `${ctx.chain.id}-${params.otokenAddress}-${timestamp.toISOString()}`
      const latest =
        findLast(result.otokens, (o) => o.id <= otokenId) ??
        (await ctx.store.findOne(OToken, {
          where: {
            chainId: ctx.chain.id,
            otoken: params.otokenAddress,
            timestamp: LessThanOrEqual(timestamp),
          },
          order: { timestamp: 'desc' },
        }))
      const current = result.otokens.find((o) => o.id === otokenId)

      let otokenObject = current
      if (!otokenObject) {
        otokenObject = new OToken({
          id: otokenId,
          chainId: ctx.chain.id,
          otoken: params.otokenAddress,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          unallocatedSupply: latest?.unallocatedSupply ?? 0n,
          creditsPerToken: latest?.creditsPerToken ?? 0n,
          totalSupply: latest?.totalSupply ?? 0n,
          rebasingSupply: latest?.rebasingSupply ?? 0n,
          nonRebasingSupply: latest?.nonRebasingSupply ?? 0n,
          holderCount: [...(owners?.values() ?? [])].reduce((acc, owner) => acc + (owner.balance > 0 ? 1 : 0), 0),
        })
        result.otokens.push(otokenObject)
      }

      return otokenObject
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

    // Trigger ensureExchangeRate asynchronously ahead of time.
    // We know we need it for TotalSupplyUpdatedHighres events.
    for (const block of ctx.blocksWithContent) {
      const log = block.logs.some(
        (l) => l.address === params.otokenAddress && l.topics[0] === otoken.events.TotalSupplyUpdatedHighres.topic,
      )
      if (log) {
        ensureExchangeRate(
          ctx,
          block,
          params.otokenAddress,
          OUSD_STABLE_OTOKENS.includes(params.otokenAddress) ? 'ETH' : 'USD',
        ).catch((err) => {
          throw err
        })
      }
    }

    for (const block of ctx.blocks) {
      await getOTokenDailyStat(ctx, block, params.otokenAddress, result.dailyStats)
      for (const trace of block.traces) {
        if (
          trace.type === 'call' &&
          params.otokenAddress === trace.action.to &&
          (trace.action.sighash === otoken.functions.governanceRebaseOptIn.selector ||
            trace.action.sighash === otoken.functions.rebaseOptIn.selector ||
            trace.action.sighash === otoken.functions.rebaseOptOut.selector)
        ) {
          await processRebaseOptTrace(block, trace)
        }
      }

      for (const log of block.logs) {
        if (log.address === params.otokenVaultAddress && log.topics[0] === otokenVault.events.YieldDistribution.topic) {
          processYieldDistribution(block, log)
        }
        if (log.address === params.otokenAddress && rebaseEventTopics[log.topics[0]]) {
          await processRebaseOptEvent(block, log)
        }
        if (log.address === params.otokenAddress && log.topics[0] === otoken.events.TotalSupplyUpdatedHighres.topic) {
          await processTotalSupplyUpdatedHighres(block, log)
        }
        if (harvesterYieldSentFilter?.matches(log)) {
          await processHarvesterYieldSent(block, log)
        }
        if (transferFilter.matches(log)) {
          await processTransfer(block, log)
        }
        if (yieldDelegatedFilter.matches(log)) {
          await processYieldDelegated(block, log)
        }
        if (yieldUndelegatedFilter.matches(log)) {
          await processYieldUndelegated(block, log)
        }
        if (withdrawalRelatedFilter.matches(log)) {
          await processWithdrawalRelated(block, log)
        }
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

      if (params.wotoken && block.header.height >= params.wotoken.from) {
        const wrappedContract = new wotokenAbi.Contract(ctx, block.header, params.wotoken.address)
        const [totalAssets, totalSupply, assetsPerShare] = await Promise.all([
          wrappedContract.totalAssets(),
          wrappedContract.totalSupply(),
          wrappedContract.previewRedeem(10n ** 18n),
        ])
        result.wotokens.push(
          new WOToken({
            id: `${ctx.chain.id}-${params.otokenAddress}-${block.header.height}`,
            chainId: ctx.chain.id,
            otoken: params.otokenAddress,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            totalAssets,
            totalSupply,
            assetsPerShare,
          }),
        )
      }

      if (params.dripper) {
        const dripper = params.dripper.find(
          (d) => d.from <= block.header.height && (!d.to || d.to >= block.header.height),
        )
        if (dripper) {
          const dripperContract = new otokenDripper.Contract(ctx, block.header, dripper.address)
          const [dripDuration, { lastCollect, perSecond }, availableFunds, wethBalance] = await Promise.all([
            dripperContract.dripDuration(),
            dripperContract.drip(),
            dripperContract.availableFunds(),
            new erc20.Contract(ctx, block.header, dripper.token).balanceOf(dripper.address),
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
      }
    })
    time('frequencyUpdate')

    await processOTokenDailyStats(ctx, {
      ...params,
      ...result,
      balances: new Map(Array.from(owners!.values()).map((owner) => [owner.address, owner.balance])),
    })
    time('dailyStats')

    const ownersToUpdate = [...(ownersChanged.values() ?? [])]
    const erc20s = await processOTokenERC20(ctx, {
      ...params,
      ...result,
      addresses: ownersToUpdate,
      transfers: transfers,
    })
    time('erc20 instances')

    // Save to database
    await ctx.store.upsert(ownersToUpdate)
    await ctx.store.upsert(result.apies)
    await Promise.all([
      ctx.store.upsert(result.otokens), // TODO: Consider changing otoken ID to block number instead of timestamp.
      ctx.store.insert(result.wotokens),
      ctx.store.insert(result.assets),
      ctx.store.insert(result.history),
      ctx.store.insert(result.rebases),
      ctx.store.insert(result.rebaseOptions),
      ctx.store.insert(result.vaults),
      ctx.store.insert(result.dripperStates),
      ctx.store.insert(result.harvesterYieldSent),
      ctx.store.upsert([...result.dailyStats.values()].map((ds) => ds.entity)),
      // ERC20
      ctx.store.insert([...erc20s.states.values()]),
      ctx.store.upsert([...erc20s.statesByDay.values()]),
      ctx.store.upsert([...erc20s.holders.values()]),
      ctx.store.insert([...erc20s.balances.values()]),
      ctx.store.insert(erc20s.transfers),
      ctx.store.remove(
        [...erc20s.removedHolders.values()].map(
          (account) => new ERC20Holder({ id: `${ctx.chain.id}-${params.otokenAddress}-${account}` }),
        ),
      ),
    ])
    time('save to database')

    if (global.process.env.DEBUG_PERF === 'true') {
      // Log entity counts
      ctx.log.info(`Saved ${ownersToUpdate.length} OTokenAddress entities`)
      ctx.log.info(`Saved entities:
      APYs: ${result.apies.length}
      OTokens: ${result.otokens.length}
      WOTokens: ${result.wotokens.length}
      Assets: ${result.assets.length}
      History: ${result.history.length}
      Rebases: ${result.rebases.length}
      RebaseOptions: ${result.rebaseOptions.length}
      Vaults: ${result.vaults.length}
      DripperStates: ${result.dripperStates.length}
      HarvesterYieldSent: ${result.harvesterYieldSent.length}
      DailyStats: ${result.dailyStats.size}
      ERC20:
        - States: ${erc20s.states.size}
        - StatesByDay: ${erc20s.statesByDay.size}
        - Holders: ${erc20s.holders.size}
        - Balances: ${erc20s.balances.size}
        - Transfers: ${erc20s.transfers.length}
        - RemovedHolders: ${erc20s.removedHolders.size}
    `)
    }
  }

  return {
    name: `otoken-${params.otokenAddress}`,
    from: params.from,
    setup,
    initialize,
    process,
  }
}
