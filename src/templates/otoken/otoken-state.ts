import * as erc20Abi from '@abi/erc20'
import * as otokenAbi from '@abi/otoken'
import * as dripperAbi from '@abi/otoken-dripper'
import * as otokenVault from '@abi/otoken-vault'
import * as wotokenAbi from '@abi/woeth'
import { OTokenDripperState, OTokenVault, WOToken } from '@model'
import { Block, Context, blockFrequencyUpdater } from '@originprotocol/squid-utils'

export const otokenStateProcessor = (params: {
  otokenAddress: string
  otokenVaultAddress: string
  vaultFrom: number
  wotoken?: {
    address: string
    from: number
  }
  dripper?: {
    vaultDripper: boolean
    address: string
    token: string
    from: number
    to?: number
  }[]
}) => {
  const frequencyUpdate = blockFrequencyUpdater({
    from: Math.min(
      params.vaultFrom,
      params.wotoken?.from ?? Number.MAX_SAFE_INTEGER,
      params.dripper?.reduce((acc, dripper) => (acc < dripper.from ? acc : dripper.from), Number.MAX_SAFE_INTEGER) ??
        Number.MAX_SAFE_INTEGER,
    ),
  })
  // Running claimable pointer; advanced whenever WithdrawalClaimable fires.
  // Monotonic per the contract, so the latest event value is always current.
  let currentClaimable = 0n
  const vaultAddrLc = params.otokenVaultAddress.toLowerCase()

  const initialize = async (ctx: Context) => {
    // Seed claimable from the most recent persisted snapshot so a restart
    // mid-history doesn't write claimable=0 until the next event fires.
    const last = await ctx.store.findOne(OTokenVault, {
      where: {
        chainId: ctx.chain.id,
        otoken: params.otokenAddress,
        address: params.otokenVaultAddress,
      },
      order: { blockNumber: 'desc' },
    })
    if (last) currentClaimable = last.claimable
  }

  const process = async (ctx: Context) => {
    // Keyed by id so an event-driven + frequency snapshot on the same block dedupe.
    const vaults = new Map<string, OTokenVault>()
    const wotokens: WOToken[] = []
    const dripperStates: OTokenDripperState[] = []

    const upsertVaultState = async (block: Block, newClaimable?: bigint) => {
      if (newClaimable !== undefined) currentClaimable = newClaimable
      if (block.header.height < params.vaultFrom) return
      const vaultContract = new otokenVault.Contract(ctx, block.header, params.otokenVaultAddress)
      const [vaultBuffer, totalValue] = await Promise.all([vaultContract.vaultBuffer(), vaultContract.totalValue()])
      const id = `${ctx.chain.id}-${params.otokenAddress}-${block.header.height}-${params.otokenVaultAddress}`
      vaults.set(
        id,
        new OTokenVault({
          id,
          chainId: ctx.chain.id,
          otoken: params.otokenAddress,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          address: params.otokenVaultAddress,
          vaultBuffer,
          totalValue,
          claimable: currentClaimable,
        }),
      )
    }

    // Event-driven: snapshot at each WithdrawalClaimable block, capturing the new pointer.
    for (const block of ctx.blocksWithContent) {
      for (const log of block.logs) {
        if (log.address === vaultAddrLc && log.topics[0] === otokenVault.events.WithdrawalClaimable.topic) {
          const data = otokenVault.events.WithdrawalClaimable.decode(log)
          await upsertVaultState(block, data._newClaimable)
        }
      }
    }

    await frequencyUpdate(ctx, async (ctx, block) => {
      await upsertVaultState(block)

      if (params.wotoken && block.header.height >= params.wotoken.from) {
        const wrappedContract = new wotokenAbi.Contract(ctx, block.header, params.wotoken.address)
        const [totalAssets, totalSupply, assetsPerShare] = await Promise.all([
          wrappedContract.totalAssets(),
          wrappedContract.totalSupply(),
          wrappedContract.previewRedeem(10n ** 18n),
        ])
        wotokens.push(
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
          if (dripper.vaultDripper) {
            const vaultContract = new otokenVault.Contract(ctx, block.header, dripper.address)
            const otokenContract = new otokenAbi.Contract(ctx, block.header, params.otokenAddress)
            const [
              dripDuration,
              lastCollect,
              perSecond,
              perSecondTarget,
              perSecondMax,
              totalValue,
              totalSupply,
              wethBalance,
            ] = await Promise.all([
              vaultContract.dripDuration(),
              vaultContract.lastRebase(),
              vaultContract.previewYield(),
              vaultContract.rebasePerSecondTarget(),
              vaultContract.rebasePerSecondMax(),
              vaultContract.totalValue(),
              otokenContract.totalSupply(),
              new erc20Abi.Contract(ctx, block.header, dripper.token).balanceOf(dripper.address),
            ])
            const availableFunds = totalValue - totalSupply
            const secondsSinceLastCollect = BigInt(block.header.timestamp / 1000) - lastCollect
            dripperStates.push(
              new OTokenDripperState({
                id: `${ctx.chain.id}-${params.otokenAddress}-${block.header.height}-${params.otokenVaultAddress}`,
                chainId: ctx.chain.id,
                blockNumber: block.header.height,
                timestamp: new Date(block.header.timestamp),
                otoken: params.otokenAddress,
                dripDuration,
                lastCollect,
                perSecond: secondsSinceLastCollect > 0 ? perSecond / secondsSinceLastCollect : 0n,
                perSecondTarget,
                perSecondMax,
                availableFunds,
                wethBalance,
              }),
            )
          } else {
            const dripperContract = new dripperAbi.Contract(ctx, block.header, dripper.address)
            const [dripDuration, { lastCollect, perSecond }, availableFunds, wethBalance] = await Promise.all([
              dripperContract.dripDuration(),
              dripperContract.drip(),
              dripperContract.availableFunds(),
              new erc20Abi.Contract(ctx, block.header, dripper.token).balanceOf(dripper.address),
            ])
            dripperStates.push(
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
      }
    })

    return {
      vaults: [...vaults.values()],
      wotokens,
      dripperStates,
    }
  }

  return { initialize, process }
}
