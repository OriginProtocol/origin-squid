// node_modules/@subsquid/evm-processor/src/ds-rpc/request.ts#L118
export const TX_RECEIPT_FIELDS = {
  gasUsed: true,
  cumulativeGasUsed: true,
  effectiveGasPrice: true,
  contractAddress: true,
  type: true,
  status: true,
  l1Fee: true,
  l1FeeScalar: true,
  l1GasPrice: true,
  l1GasUsed: true,
  l1BaseFeeScalar: true,
  l1BlobBaseFee: true,
  l1BlobBaseFeeScalar: true,
} as const

export const EXCLUDE_TX_RECEIPT_FIELDS = {
  gasUsed: false,
  cumulativeGasUsed: false,
  effectiveGasPrice: false,
  contractAddress: false,
  type: false,
  status: false,
  l1Fee: false,
  l1FeeScalar: false,
  l1GasPrice: false,
  l1GasUsed: false,
  l1BaseFeeScalar: false,
  l1BlobBaseFee: false,
  l1BlobBaseFeeScalar: false,
} as const
