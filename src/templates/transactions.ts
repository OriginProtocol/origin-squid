import { TransactionDetails } from '@model'
import { defineProcessor } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'

export const createTransactionProcessor = (params: { from: number; address: string[] }) => {
  const addressSet = new Set(params.address)
  return defineProcessor({
    name: `transactions - ${params.address.join(',')}`,
    from: params.from,
    setup: async (processor: EvmBatchProcessor) => {
      processor.addTransaction({
        from: params.address,
        range: {
          from: params.from,
        },
      })
    },
    process: async (ctx) => {
      const results: TransactionDetails[] = []
      for (const block of ctx.blocksWithContent) {
        for (const transaction of block.transactions) {
          if (addressSet.has(transaction.from)) {
            results.push(
              new TransactionDetails({
                id: `${ctx.chain.id}:${transaction.hash}`,
                chainId: ctx.chain.id,
                txHash: transaction.hash,
                timestamp: new Date(block.header.timestamp),
                blockNumber: block.header.height,
                from: transaction.from,
                to: transaction.to,
                gasUsed: transaction.gasUsed,
                effectiveGasPrice: transaction.effectiveGasPrice,
                transactionFee: transaction.gasUsed * transaction.effectiveGasPrice,
              }),
            )
          }
        }
      }
      await ctx.store.insert(results)
    },
  })
}
