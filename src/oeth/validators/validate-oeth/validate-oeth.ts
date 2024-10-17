import { sortBy } from 'lodash'

import {
  ERC20Balance,
  OETHDailyStat,
  OETHMorphoAave,
  OETHVault,
  OToken,
  OTokenAPY,
  OTokenDailyStat,
  OTokenHistory,
  OTokenRebase,
  StrategyBalance,
} from '@model'
import { Context } from '@processor'
import { env } from '@utils/env'
import { entities } from '@validation/entities'
import { validateExpectations } from '@validation/validate'

export const name = 'validate-oeth'

let firstBlock = true

export const process = async (ctx: Context) => {
  if (env.BLOCK_FROM) return
  for (const block of ctx.blocks) {
    await validateExpectations(ctx, block, OToken, firstBlock, entities.oeth_oTokens)
    await validateExpectations(ctx, block, OTokenAPY, firstBlock, entities.oeth_oTokenApies)
    await validateExpectations(ctx, block, OTokenHistory, firstBlock, entities.oeth_oTokenHistories)
    await validateExpectations(ctx, block, OTokenRebase, firstBlock, entities.oeth_oTokenRebases)
    await validateExpectations(ctx, block, OTokenDailyStat, firstBlock, entities.oeth_oTokenDailyStats)
    await validateExpectations(ctx, block, ERC20Balance, firstBlock, entities.oeth_erc20Balances)
    await validateExpectations(ctx, block, OETHVault, firstBlock, expectations.oethVaults)
    await validateExpectations(ctx, block, OETHMorphoAave, firstBlock, expectations.oethMorphoAave)
    await validateExpectations(ctx, block, StrategyBalance, firstBlock, expectations.strategyBalances)
    await validateExpectations(ctx, block, OETHDailyStat, firstBlock, expectations.oethDailyStats)
    firstBlock = false
  }
}

const e = (arr: any[]) => {
  return sortBy(arr, (v) => v.blockNumber)
}
const expectations = {
  oethVaults: e([
    {
      id: '2023-04-28T00:39:11.000Z',
      timestamp: '2023-04-28T00:39:11.000000Z',
      blockNumber: 17141121,
      rETH: '9360000000000000',
      stETH: '215069621854827437',
      weth: '1119651661749004532',
      frxETH: '7695288773432093',
    },
    {
      id: '2023-06-10T19:50:59.000Z',
      timestamp: '2023-06-10T19:50:59.000000Z',
      blockNumber: 17451954,
      rETH: '2554674408676488827943',
      stETH: '779656163342992671163',
      weth: '1026508082715309353868',
      frxETH: '0',
    },
    {
      id: '2023-06-10T19:52:11.000Z',
      timestamp: '2023-06-10T19:52:11.000000Z',
      blockNumber: 17451960,
      rETH: '2554674408676488827943',
      stETH: '779656163342992671163',
      weth: '1026508082715309353868',
      frxETH: '99144201818216785',
    },
    {
      id: '2023-06-19T06:59:47.000Z',
      timestamp: '2023-06-19T06:59:47.000000Z',
      blockNumber: 17512166,
      rETH: '2554674408676488827943',
      stETH: '781491659677780491225',
      weth: '368830581327791252482',
      frxETH: '0',
    },
  ]),
  oethMorphoAave: e([
    {
      id: '2023-05-31T13:54:35.000Z',
      timestamp: '2023-05-31T13:54:35.000000Z',
      blockNumber: 17379284,
      weth: '57200000000000000000',
    },
    {
      id: '2023-06-02T09:51:11.000Z',
      timestamp: '2023-06-02T09:51:11.000000Z',
      blockNumber: 17392282,
      weth: '0',
    },
    {
      id: '2023-06-14T17:54:35.000Z',
      timestamp: '2023-06-14T17:54:35.000000Z',
      blockNumber: 17479788,
      weth: '103288680000000000000',
    },
  ]),
  strategyBalances: e([
    // Place verified strategy balances in here.
  ]),
  oethDailyStats: e([
    {
      apr: 0.03984341,
      apy: 0.04064554,
      apy7DayAvg: 0.04625612,
      apy14DayAvg: 0.04809284,
      apy30DayAvg: 0.05619015,
      feesETH: '878804180645600601',
      feesETHAllTime: '230978291319157636904',
      feesUSD7Day: '16449862756198776028058',
      feesUSD: '2243350542568443313402',
      amoSupply: '1722869226314461370269',
      nonRebasingSupply: '3679373640235293829673',
      yieldETH7Day: '26801301608036751292',
      dripperWETH: '29850741093608056030',
      totalSupplyUSD: 0,
      blockNumber: 19008501,
      feesETH7Day: '6700325402009187818',
      yieldETHAllTime: '923913165276630548993',
      rebasingSupply: '32229193002740154821849',
      yieldETH: '3515216722582402407',
      id: '2024-01-14',
      yieldUSD7Day: '65799451024795104161690',
      yieldUSDAllTime: '1744446969809430546091488',
      yieldUSD: '8973402170273773261269',
      wrappedSupply: '1879893054273530385147',
      feesUSDAllTime: '436111742452357635874322',
      timestamp: '2024-01-14T23:47:23.000Z',
      totalSupply: '35908566642975448651522',
    },
  ]),
} as const
