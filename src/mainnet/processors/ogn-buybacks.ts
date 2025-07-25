import { compact } from 'lodash'
import { formatUnits, parseEther } from 'viem'

import * as erc20Abi from '@abi/erc20'
import { OGNBuyback } from '@model'
import { Transaction, defineProcessor, logFilter } from '@originprotocol/squid-utils'
import { ensureExchangeRate } from '@shared/post-processors/exchange-rates'
import { CurrencyAddress } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { OGN_ADDRESS, OGN_REWARDS_SOURCE_ADDRESS, OGV_ADDRESS, XOGN_ADDRESS, addresses } from '@utils/addresses'

/**
 * Calculate net gain/loss for a collection of addresses from a transaction
 * @param transaction - The transaction to analyze
 * @param addresses - Array of addresses to track
 * @returns Object with tokensIn and tokensOut records, excluding zero balances
 */
function calculateNetGainLoss(
  transaction: Transaction,
  addresses: string[],
): {
  operators: string[]
  tokensIn: Record<string, bigint>
  tokensOut: Record<string, bigint>
} {
  const operators = new Set<string>()
  const tokensIn: Record<string, bigint> = {}
  const tokensOut: Record<string, bigint> = {}

  // Track addresses in lowercase for case-insensitive comparison
  const trackedAddresses = addresses.map((addr) => addr.toLowerCase())

  // Process all transfer logs in the transaction
  for (const log of transaction.logs) {
    if (log.topics[0] === erc20Abi.events.Transfer.topic) {
      try {
        const { from, to, value } = erc20Abi.events.Transfer.decode(log)
        const tokenAddress = log.address.toLowerCase()

        // Check if from address is tracked
        if (trackedAddresses.includes(from.toLowerCase())) {
          operators.add(from.toLowerCase())
          tokensOut[tokenAddress] = (tokensOut[tokenAddress] || 0n) + value
        }

        // Check if to address is tracked
        if (trackedAddresses.includes(to.toLowerCase())) {
          operators.add(to.toLowerCase())
          tokensIn[tokenAddress] = (tokensIn[tokenAddress] || 0n) + value
        }
      } catch (err) {
        // Skip invalid transfer logs
        continue
      }
    }
  }

  // Calculate net positions and filter out zero balances
  const netTokensIn: Record<string, bigint> = {}
  const netTokensOut: Record<string, bigint> = {}

  // Get all unique token addresses
  const allTokens = new Set([...Object.keys(tokensIn), ...Object.keys(tokensOut)])

  for (const token of allTokens) {
    const inAmount = tokensIn[token] || 0n
    const outAmount = tokensOut[token] || 0n

    if (inAmount > outAmount) {
      netTokensIn[token] = inAmount - outAmount
    } else if (outAmount > inAmount) {
      netTokensOut[token] = outAmount - inAmount
    }
    // If equal, don't include (net is 0)
  }

  return {
    operators: Array.from(operators),
    tokensIn: netTokensIn,
    tokensOut: netTokensOut,
  }
}

/**
 * Split tokensIn evenly across multiple tokensOut when there's only one token in but multiple tokens out.
 * Returns an array of gain/loss objects with the same structure as calculateNetGainLoss.
 * When splitting is not needed, returns the original gain/loss object in an array.
 */
function splitTokensInEvenly(gainLoss: {
  operators: string[]
  tokensIn: Record<string, bigint>
  tokensOut: Record<string, bigint>
}): Array<{
  operators: string[]
  tokensIn: Record<string, bigint>
  tokensOut: Record<string, bigint>
}> {
  const tokensInKeys = Object.keys(gainLoss.tokensIn)
  const tokensOutKeys = Object.keys(gainLoss.tokensOut)

  // Only process if there's exactly one token in and multiple tokens out
  if (tokensInKeys.length !== 1 || tokensOutKeys.length <= 1) {
    return [gainLoss]
  }

  const tokenIn = tokensInKeys[0]
  const totalAmountIn = gainLoss.tokensIn[tokenIn]
  const numTokensOut = tokensOutKeys.length

  // Split the total amount evenly across all tokens out
  const splitAmount = totalAmountIn / BigInt(numTokensOut)
  const remainder = totalAmountIn % BigInt(numTokensOut)

  const buybackEntries = []
  let distributedAmount = 0n

  for (let i = 0; i < tokensOutKeys.length; i++) {
    const tokenOut = tokensOutKeys[i]
    const amountOut = gainLoss.tokensOut[tokenOut]

    // Add remainder to the first token to handle uneven division
    const amountIn = splitAmount + (i === 0 ? remainder : 0n)
    distributedAmount += amountIn

    buybackEntries.push({
      operators: gainLoss.operators,
      tokensIn: { [tokenIn]: amountIn },
      tokensOut: { [tokenOut]: amountOut },
    })
  }

  // Verify the total distributed amount matches the original
  if (distributedAmount !== totalAmountIn) {
    throw new Error(`Amount distribution mismatch: distributed ${distributedAmount}, original ${totalAmountIn}`)
  }

  return buybackEntries
}

const buybackOperators = [
  addresses.multisig['multichain-guardian'],
  '0xd7b28d06365b85933c64e11e639ea0d3bc0e3bab', // Legacy OUSD Buyback
  '0xfd6c58850cacf9ccf6e8aee479bfb4df14a362d2', // Legacy OETH Buyback
  '0xbb077e716a5f1f1b63ed5244ebff5214e50fec8c', // Current Operator
]

// const buybackReceivers = [
//   '0xf14bbdf064e3f67f51cd9bd646ae3716ad938fdc', // Multisig 2 (?)
//   '0x4ff1b9d9ba8558f5eafcec096318ea0d8b541971', //
//   OGN_REWARDS_SOURCE_ADDRESS,
// ]

const transferFilter = logFilter({
  address: [OGN_ADDRESS],
  topic0: [erc20Abi.events.Transfer.topic],
  topic2: [OGN_REWARDS_SOURCE_ADDRESS],
  transaction: true,
  transactionLogs: true,
  range: { from: 13369290 },
})

const oldBuybackAddresses = [
  '0x77314eb392b2be47c014cde0706908b3307ad6a9', // Very old buybacks
  '0xd7b28d06365b85933c64e11e639ea0d3bc0e3bab', // Legacy OUSD Buyback
  '0xfd6c58850cacf9ccf6e8aee479bfb4df14a362d2', // Legacy OETH Buyback
  '0xba0e6d6ea72cdc0d6f9fcdcc04147c671ba83db5', // Legacy ARM Buyback
  '0x6c5cdfb47150efc52072cb93eea1e0f123529748', // Legacy OGV Buybacks
  '0x7d82e86cf1496f9485a8ea04012afeb3c7489397', // Rewards Source,
]

const oldBuybackFilter = logFilter({
  address: [OGN_ADDRESS, OGV_ADDRESS],
  topic0: [erc20Abi.events.Transfer.topic],
  topic2: oldBuybackAddresses,
  transaction: true,
  transactionLogs: true,
  range: { from: 13369290 },
})

export const ognBuybacks = defineProcessor({
  name: 'ogn-buybacks',
  from: 13369290,
  setup: (p) => {
    p.addLog(transferFilter.value)
    p.addLog(oldBuybackFilter.value)
  },
  process: async (ctx) => {
    const buybacks = []
    for (const block of ctx.blocksWithContent) {
      for (const transaction of block.transactions) {
        if (transaction.logs.some((l) => oldBuybackFilter.matches(l))) {
          const buybackOperatorsGainLoss = calculateNetGainLoss(transaction, oldBuybackAddresses)
          const splitEntries = splitTokensInEvenly(buybackOperatorsGainLoss)
          for (const entry of splitEntries) {
            const tokensIn = Object.keys(entry.tokensIn)
            const tokensOut = Object.keys(entry.tokensOut)
            if (Object.keys(entry.tokensOut).length > 1) throw new Error('multiple tokens out')
            const tokenOut = tokensOut[0]
            const tokenIn = tokensIn[0]

            // Don't process if theres no observed token out or the token out is OGN.
            if (!tokenOut) {
              // console.log('no token out ' + transaction.hash)
              continue
            }
            if (tokenOut === OGN_ADDRESS) continue

            if (Object.keys(entry.tokensIn).length > 1) throw new Error('multiple tokens in')
            if (tokenIn === OGN_ADDRESS || tokenIn === OGV_ADDRESS) {
              const [tokenOutDecimals, tokenRate] = await Promise.all([
                new erc20Abi.Contract(ctx, block.header, tokenOut).decimals(),
                ensureExchangeRate(ctx, block, tokenOut as CurrencyAddress, 'USD'),
              ])
              const tokenOutAmount = entry.tokensOut[tokenOut]
              let tokenInAmount = entry.tokensIn[tokenIn]
              if (tokenIn === OGV_ADDRESS) {
                tokenInAmount = (tokenInAmount * parseEther('0.09137')) / 10n ** 18n
              }
              const buyback = new OGNBuyback({
                id: `${ctx.chain.id}-${transaction.hash}-${tokenOut}`,
                blockNumber: block.header.height,
                timestamp: new Date(block.header.timestamp),
                operator: entry.operators[0],
                tokenSold: tokenOut,
                amountSold: tokenOutAmount,
                ognBought: tokenInAmount,
                ognBoughtUSD: Number(
                  formatUnits(
                    (tokenOutAmount * (tokenRate?.rate ?? 0n)) / 10n ** BigInt(tokenRate?.decimals ?? 18),
                    tokenOutDecimals,
                  ),
                ),
                txHash: transaction.hash,
              })
              buybacks.push(buyback)
            }
          }
        }
      }
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
          if (!transferFrom) {
            // console.log('no transferFrom', log.transactionHash)
            continue
          }

          const tokenOut = transferFrom.log.address

          // Don't process if the token out is OGN.
          if (tokenOut === OGN_ADDRESS) continue

          const [tokenOutDecimals, tokenRate] = await Promise.all([
            new erc20Abi.Contract(ctx, block.header, tokenOut).decimals(),
            ensureExchangeRate(ctx, block, tokenOut as CurrencyAddress, 'USD'),
          ])

          const { from, value } = erc20Abi.events.Transfer.decode(log)
          if (from !== XOGN_ADDRESS) {
            const buyback = new OGNBuyback({
              id: `${ctx.chain.id}-${log.transactionHash}-${tokenOut}`,
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
            if (buybacks.find((b) => b.id === buyback.id)) {
              throw new Error('duplicate buyback ' + buyback.id)
            }
            buybacks.push(buyback)
          }
        }
      }
    }
    await ctx.store.insert(buybacks)
  },
})
