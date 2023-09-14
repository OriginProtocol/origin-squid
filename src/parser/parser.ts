import { Context } from '../processor'
import * as oeth from '../abi/oeth'
import * as erc20 from '../abi/oeth'
import { OETH_ADDRESS, OETH_VAULT_ADDRESS } from '../utils/addresses'
import { Bytes20 } from '@subsquid/evm-processor/lib/interfaces/evm'
import { pad } from 'viem'

type ContextBlocks = Context['blocks']
type ContextBlock = ContextBlocks['0']
type ContextLog = ContextBlocks['0']['logs']['0']

export interface BaseLog {
  block: ContextBlock
  id: string
  address: Bytes20
  timestamp: Date
  blockNumber: number
  txHash: string
}

export interface RawTransfer extends BaseLog {
  type: 'transfer'
  value: bigint
  from: string
  to: string
}

export interface RawRebase extends BaseLog {
  type: 'rebase'
  totalSupply: bigint
  rebasingCredits: bigint
  rebasingCreditsPerToken: bigint
}

export type RawLog = RawTransfer | RawRebase

/**
 * Aggregate Transfer and Rebase events from the logs
 */
export function parse(ctx: Context): RawLog[] {
  let logs: RawLog[] = []
  const createBaseLog = (block: ContextBlock, log: ContextLog): BaseLog => {
    return {
      block,
      id: log.id,
      timestamp: new Date(block.header.timestamp),
      blockNumber: block.header.height,
      txHash: log.transactionHash,
      address: log.address,
    }
  }
  const createTransfer = (block: ContextBlock, log: ContextLog) => {
    let { from, to, value } = oeth.events.Transfer.decode(log)
    logs.push({
      ...createBaseLog(block, log),
      type: 'transfer',
      value,
      from: from.toLowerCase(),
      to: to.toLowerCase(),
    })
  }
  const createRebase = (block: ContextBlock, log: ContextLog) => {
    let { totalSupply, rebasingCredits, rebasingCreditsPerToken } =
      oeth.events.TotalSupplyUpdatedHighres.decode(log)
    logs.push({
      ...createBaseLog(block, log),
      type: 'rebase',
      totalSupply,
      rebasingCredits,
      rebasingCreditsPerToken,
    })
  }

  const mapping: Record<
    Bytes20, // EVM Address
    | undefined
    | Record<
        string, // Topic0
        (block: ContextBlock, log: ContextLog) => void
      >
  > = {
    [OETH_ADDRESS]: {
      [oeth.events.Transfer.topic]: createTransfer,
      [oeth.events.TotalSupplyUpdatedHighres.topic]: createRebase,
    },
    default: {
      [erc20.events.Transfer.topic]: (block, log) => {
        if (log.topics[1] === pad(OETH_VAULT_ADDRESS))
          createTransfer(block, log)
        else if (log.topics[2] === pad(OETH_VAULT_ADDRESS))
          createTransfer(block, log)
      },
    },
  }

  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      mapping[log.address]?.[log.topics[0]]?.(block, log)
      mapping['default']?.[log.topics[0]]?.(block, log)
    }
  }

  return logs
}
