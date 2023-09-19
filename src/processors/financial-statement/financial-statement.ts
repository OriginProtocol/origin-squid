import { LessThan, LessThanOrEqual } from 'typeorm'

import {
  CurveLP,
  Dripper,
  FinancialStatement,
  FraxStaking,
  MorphoAave,
  Vault,
} from '../../model'
import { Context } from '../../processor'
import { useProcessorState } from '../../utils/state'

export const useFinancialStatements = () => {
  return useProcessorState<Map<string, FinancialStatement>>(
    'financial-statement',
    new Map<string, FinancialStatement>(),
  )
}

export const updateFinancialStatement = async (
  ctx: Context,
  block: Context['blocks']['0'],
  partial: Partial<
    Pick<
      FinancialStatement,
      'vault' | 'curveLP' | 'dripper' | 'fraxStaking' | 'morphoAave'
    >
  >,
) => {
  const timestamp = new Date(block.header.timestamp)
  const timestampId = timestamp.toISOString()
  const blockNumber = block.header.height
  const [financialStatements] = useFinancialStatements()

  const lastFinancialStatement = await ctx.store.findOne(FinancialStatement, {
    where: { id: LessThan(timestampId) },
    order: { id: 'desc' },
    relations: {
      vault: true,
      morphoAave: true,
      dripper: true,
      curveLP: true,
      fraxStaking: true,
    },
  })

  ctx.log.info({ lastFinancialStatement })

  let financialStatement: FinancialStatement
  if (!lastFinancialStatement) {
    financialStatement = new FinancialStatement({
      id: timestampId,
      timestamp,
      blockNumber,
      ...partial,
    })
    if (!financialStatement.curveLP) {
      financialStatement.curveLP = new CurveLP({
        id: timestampId,
        timestamp,
        blockNumber,
        eth: 0n,
        ethOwned: 0n,
        oeth: 0n,
        oethOwned: 0n,
        totalSupply: 0n,
        totalSupplyOwned: 0n,
      })
      await ctx.store.insert(financialStatement.curveLP)
    }
    if (!financialStatement.fraxStaking) {
      financialStatement.fraxStaking = new FraxStaking({
        id: timestampId,
        timestamp,
        blockNumber,
        frxETH: 0n,
      })
      await ctx.store.insert(financialStatement.fraxStaking)
    }
    if (!financialStatement.dripper) {
      financialStatement.dripper = new Dripper({
        id: timestampId,
        timestamp,
        blockNumber,
        weth: 0n,
      })
      await ctx.store.insert(financialStatement.dripper)
    }
    if (!financialStatement.morphoAave) {
      financialStatement.morphoAave = new MorphoAave({
        id: timestampId,
        timestamp,
        blockNumber,
        weth: 0n,
      })
      await ctx.store.insert(financialStatement.morphoAave)
    }
    if (!financialStatement.vault) {
      financialStatement.vault = new Vault({
        id: timestampId,
        timestamp,
        blockNumber,
        eth: 0n,
        weth: 0n,
        frxETH: 0n,
        rETH: 0n,
        stETH: 0n,
      })
      await ctx.store.insert(financialStatement.vault)
    }
  } else {
    financialStatement =
      financialStatements.get(timestampId) ??
      new FinancialStatement({
        ...lastFinancialStatement,
        id: timestampId,
        timestamp,
        blockNumber,
        ...partial,
      })
  }

  financialStatements.set(timestampId, financialStatement)
}

export const process = async (ctx: Context) => {
  const [financialStatements] = useFinancialStatements()
  await ctx.store.upsert([...financialStatements.values()])
}
