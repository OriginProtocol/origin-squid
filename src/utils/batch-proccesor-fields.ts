// node_modules/@subsquid/evm-processor/src/ds-rpc/request.ts#L118

export const DEFAULT_FIELDS = {
  transaction: {
    from: true,
    to: true,
    hash: true,
    gas: true,
    value: true,
    sighash: true,
    input: true,
    status: true,
  },
  log: {
    transactionHash: true,
    topics: true,
    data: true,
  },
  trace: {
    callFrom: true,
    callTo: true,
    callSighash: true,
    callValue: true,
    callInput: true,
    createResultAddress: true,
    suicideRefundAddress: true,
    suicideAddress: true,
    suicideBalance: true,
    error: true,
    revertReason: true,
  },
}

export const FIELDS_WITH_RECEIPTS_INFO = {
  transaction: {
    from: true,
    to: true,
    hash: true,
    gasUsed: true,
    gas: true,
    value: true,
    sighash: true,
    input: true,
    status: true,
    effectiveGasPrice: true,
  },
  log: {
    transactionHash: true,
    topics: true,
    data: true,
  },
  trace: {
    callFrom: true,
    callTo: true,
    callSighash: true,
    callValue: true,
    callInput: true,
    createResultAddress: true,
    suicideRefundAddress: true,
    suicideAddress: true,
    suicideBalance: true,
    error: true,
    revertReason: true,
  },
}
