// Fix RPC issues
// import * as fs from 'node:fs'
import { CallOptions, RpcClient } from '@subsquid/rpc-client'
import { RpcCall } from '@subsquid/rpc-client/src/interfaces'
import { processingStats } from '@utils/processing-stats'

;(RpcClient.prototype as any)._call = RpcClient.prototype.call
;(RpcClient.prototype as any)._batchCall = RpcClient.prototype.batchCall

// let count = 0
RpcClient.prototype.call = async function <T = any>(
  method: string,
  params?: any[],
  options?: CallOptions<T>,
): Promise<T> {
  processingStats.rpcCalls++
  const response = await (this as any)._call(method, params, options)
  if (method === 'debug_traceBlockByHash') {
    fixSelfDestructs(response)
  }
  // fs.writeFileSync(`rpcResponse${count}-in.json`, JSON.stringify({ method, params, options }, null, 2))
  // fs.writeFileSync(`rpcResponse${count++}.json`, JSON.stringify(response, null, 2))
  return response
}
RpcClient.prototype.batchCall = async function <T = any>(batch: RpcCall[], options?: CallOptions<T>): Promise<T[]> {
  processingStats.rpcCalls += batch.length
  const response = await (this as any)._batchCall(batch, options)
  for (let i = 0; i < batch.length; i++) {
    if (batch[i].method === 'debug_traceBlockByHash') {
      fixSelfDestructs(response[i])
    }
  }
  // fs.writeFileSync(`rpcResponse$${count}-in.json`, JSON.stringify({ batch, options }, null, 2))
  // fs.writeFileSync(`rpcResponse$${count++}.json`, JSON.stringify(response, null, 2))
  return response
}

const fixSelfDestructs = (input: any) => {
  if (!input) return
  if (typeof input !== 'object') return
  if (Array.isArray(input)) {
    input.forEach((v) => fixSelfDestructs(v))
  }
  if ('calls' in input && Array.isArray(input.calls)) {
    input.calls.forEach((v: any) => fixSelfDestructs(v))
  }
  if ('type' in input && input.type === 'SELFDESTRUCT' && !input.to) {
    input.to = '0x0'
  }
  if ('result' in input) {
    fixSelfDestructs(input.result)
  }
}
