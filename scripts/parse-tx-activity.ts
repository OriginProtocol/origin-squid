/**
 * This script takes a transaction hash and parses the activity. Useful for
 * debugging the activity parser without having to run Squid.
 */
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

import { type Transaction, activityFromTx } from '../src/utils/activityFromTx'

const client = createPublicClient({
  chain: mainnet,
  transport: http(process.env.RPC_ENDPOINT),
})

async function go(hash: `0x${string}`) {
  const transaction = await client.getTransaction({ hash })
  const receipt = await client.getTransactionReceipt({ hash })
  const activity = await activityFromTx(
    transaction as Transaction,
    receipt.logs,
  )
  console.log(activity)
}

go('0xd3705c324d3e59545a21eb9773108cbb266631251484ace5016b59c25719a02a')
