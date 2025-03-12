import * as erc20Abi from '@abi/erc20'
import * as dripperAbi from '@abi/otoken-dripper'
import * as otokenVault from '@abi/otoken-vault'
import * as wotokenAbi from '@abi/woeth'
import { OTokenDripperState, OTokenVault, WOToken } from '@model'
import { Context, blockFrequencyUpdater } from '@originprotocol/squid-utils'

export const otokenFrequencyProcessor = (params: {
  otokenAddress: string
  otokenVaultAddress: string
  vaultFrom: number
  wotoken?: {
    address: string
    from: number
  }
  dripper?: {
    address: string
    token: string
    from: number
  }
}) => {
  const frequencyUpdate = blockFrequencyUpdater({
    from: Math.min(params.vaultFrom, params.wotoken?.from ?? 0, params.dripper?.from ?? 0),
  })
  return async (ctx: Context) => {
    const vaults: OTokenVault[] = []
    const wotokens: WOToken[] = []
    const dripperStates: OTokenDripperState[] = []
    await frequencyUpdate(ctx, async (ctx, block) => {
      if (block.header.height >= params.vaultFrom) {
        const vaultContract = new otokenVault.Contract(ctx, block.header, params.otokenVaultAddress)
        const [vaultBuffer, totalValue] = await Promise.all([vaultContract.vaultBuffer(), vaultContract.totalValue()])
        vaults.push(
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
      }

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

      if (params.dripper && params.dripper.from <= block.header.height) {
        const dripperContract = new dripperAbi.Contract(ctx, block.header, params.dripper.address)
        const [dripDuration, { lastCollect, perSecond }, availableFunds, wethBalance] = await Promise.all([
          dripperContract.dripDuration(),
          dripperContract.drip(),
          dripperContract.availableFunds(),
          new erc20Abi.Contract(ctx, block.header, params.dripper.token).balanceOf(params.dripper.address),
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
    })

    return {
      vaults,
      wotokens,
      dripperStates,
    }
  }
}
