import { pad } from 'viem'

import * as erc20 from '@abi/erc20'
import { Context } from '@originprotocol/squid-utils'

import { ADDRESS_ZERO, ETH_ADDRESS } from './addresses'

export const max = (values: bigint[], start = 0n) => {
  return values.reduce((max, v) => (max > v ? max : v), start)
}

export const lastExcept = <
  T extends {
    id: string
  },
>(
  arr: T[] | undefined,
  id: string,
) => (arr ? (arr[arr.length - 1]?.id === id ? arr[arr.length - 2] : arr[arr.length - 1]) : undefined)

export const trackAddressBalances = async ({
  log,
  address,
  tokens,
  fn,
}: {
  log: Context['blocks']['0']['logs']['0']
  address: string
  tokens: string[]
  fn: (params: {
    address: string
    token: string
    change: bigint
    log: Context['blocks']['0']['logs']['0']
    data: ReturnType<typeof erc20.events.Transfer.decode>
  }) => Promise<void>
}) => {
  const paddedAddress = pad(address as `0x${string}`)
  if (
    (log.topics[1]?.toLowerCase() === paddedAddress || log.topics[2]?.toLowerCase() === paddedAddress) &&
    tokens.includes(log.address.toLowerCase())
  ) {
    const data = erc20.events.Transfer.decode(log)
    if (data.value > 0n) {
      const change = data.from.toLowerCase() === address ? -data.value : data.value
      await fn({ address, token: log.address, change, log, data })
    }
  }
}

export const convertDecimals = (from: number, to: number, value: bigint) => {
  const fromFactor = 10n ** BigInt(from)
  const toFactor = 10n ** BigInt(to)
  return (value * toFactor) / fromFactor
}

const tokenDecimalsCache = new Map<string, number>()

/**
 * ERC20 decimals for a token, cached for the life of the process — decimals are immutable,
 * so one eth_call per token is enough.
 *
 * For tokens a strategy declares, read `assets[].decimals` instead. This exists for the
 * balance getters that discover tokens on-chain (Curve `coins`, Balancer `getPoolTokens`),
 * where the token may not appear in the strategy's asset list at all.
 */
export const getTokenDecimals = async (ctx: Context, block: { height: number }, address: string) => {
  const token = address.toLowerCase()
  // Native-ETH placeholders have no contract to call.
  if (token === ADDRESS_ZERO || token === ETH_ADDRESS) return 18
  const key = `${ctx.chain.id}:${token}`
  let decimals = tokenDecimalsCache.get(key)
  if (decimals === undefined) {
    decimals = await new erc20.Contract(ctx, block, token).decimals()
    tokenDecimalsCache.set(key, decimals)
  }
  return decimals
}

/**
 * Decimals for a token a strategy holds: the declared `assets[].decimals` when the token is
 * one the strategy configures, otherwise read from the token itself.
 *
 * The fallback matters for balance getters that discover tokens on-chain — a Curve pool's
 * `coins` or a Balancer pool's tokens need not all appear in the strategy's asset list.
 */
export const findAssetDecimals = async (
  ctx: Context,
  block: { height: number },
  assets: { address: string; decimals: number }[],
  asset: string,
) =>
  assets.find((a) => a.address.toLowerCase() === asset.toLowerCase())?.decimals ??
  (await getTokenDecimals(ctx, block, asset))
