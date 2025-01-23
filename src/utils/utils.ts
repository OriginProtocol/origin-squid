import { pad } from 'viem'

import * as erc20 from '@abi/erc20'
import { Context } from '@originprotocol/squid-utils'

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
