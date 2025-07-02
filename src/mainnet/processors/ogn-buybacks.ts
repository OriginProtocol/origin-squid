import { compact } from 'lodash'
import { formatUnits } from 'viem'

import * as erc20Abi from '@abi/erc20'
import { OGNBuyback } from '@model'
import { defineProcessor, logFilter } from '@originprotocol/squid-utils'
import { ensureExchangeRate } from '@shared/post-processors/exchange-rates'
import { CurrencyAddress } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { OGN_ADDRESS, OGN_REWARDS_SOURCE_ADDRESS, XOGN_ADDRESS, addresses } from '@utils/addresses'

const buybackOperators = [
  addresses.multisig['multichain-guardian'],
  '0xd7b28d06365b85933c64e11e639ea0d3bc0e3bab', // Legacy OUSD Buyback
  '0xfd6c58850cacf9ccf6e8aee479bfb4df14a362d2', // Legacy OETH Buyback
  '0xbb077e716a5f1f1b63ed5244ebff5214e50fec8c', // Current Operator
]

const transferFilter = logFilter({
  address: [OGN_ADDRESS],
  topic0: [erc20Abi.events.Transfer.topic],
  topic2: [OGN_REWARDS_SOURCE_ADDRESS],
  transaction: true,
  transactionLogs: true,
  range: { from: 19919742 },
})

export const ognBuybacks = defineProcessor({
  name: 'ogn-buybacks',
  from: 19919742,
  setup: (p) => {
    p.addLog(transferFilter.value)
  },
  process: async (ctx) => {
    const buybacks = []
    for (const block of ctx.blocksWithContent) {
      for (const log of block.logs) {
        if (transferFilter.matches(log)) {
          // Find what the operator transfered out
          const transactionLogs = log.transaction!.logs
          const transactionTransfers = transactionLogs.filter((l) => l.topics[0] === erc20Abi.events.Transfer.topic)
          const transactionTransfersData = compact(
            transactionTransfers.map((l) => {
              try {
                return { log: l, data: erc20Abi.events.Transfer.decode(l) }
              } catch (err) {
                return undefined
              }
            }),
          )

          const transferFrom = transactionTransfersData.find((l) =>
            buybackOperators.includes(l.data.from.toLowerCase()),
          )
          if (!transferFrom) return

          const tokenOut = transferFrom.log.address
          const [tokenOutDecimals, tokenRate] = await Promise.all([
            new erc20Abi.Contract(ctx, block.header, tokenOut).decimals(),
            ensureExchangeRate(ctx, block, tokenOut as CurrencyAddress, 'USD'),
          ])

          const { from, value } = erc20Abi.events.Transfer.decode(log)
          if (from !== XOGN_ADDRESS) {
            const buyback = new OGNBuyback({
              id: log.id,
              blockNumber: block.header.height,
              timestamp: new Date(block.header.timestamp),
              operator: transferFrom.data.from.toLowerCase(),
              tokenSold: tokenOut,
              amountSold: transferFrom.data.value,
              ognBought: value,
              ognBoughtUSD: Number(
                formatUnits(
                  (transferFrom.data.value * (tokenRate?.rate ?? 0n)) / 10n ** BigInt(tokenRate?.decimals ?? 18),
                  tokenOutDecimals,
                ),
              ),
              txHash: log.transactionHash,
            })
            buybacks.push(buyback)
          }
        }
      }
    }
    await ctx.store.save(buybacks)
  },
})
