import { Context } from '../../processor'
import {
  createER20BalanceSetup,
  createERC20BalanceProcessor,
} from '../../processor-templates/erc20-balance'

const ESTIMATED_BPS = 12.06 // Circa 2023
const SECONDS_PER_DAY = 86400
const BLOCKS_PER_DAY = SECONDS_PER_DAY / ESTIMATED_BPS
const UPDATE_FREQUENCY = Math.floor(BLOCKS_PER_DAY)

const tracks: Parameters<typeof createERC20BalanceProcessor>[0][] = [
  {
    from: 11362821,
    address: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811', // aUSDT
    token: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
    frequency: UPDATE_FREQUENCY,
  },
  {
    from: 11367200,
    address: '0xBcca60bB61934080951369a648Fb03DF4F96263C', // aUSDC
    token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    frequency: UPDATE_FREQUENCY,
  },
  {
    from: 11367184,
    address: '0x028171bca77440897b824ca71d1c56cac55b68a3', // aDAI
    token: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    frequency: UPDATE_FREQUENCY,
  },
]

export const from = Math.min(...tracks.map((t) => t.from))

export const setup = createER20BalanceSetup(from)

const processors = tracks.map(createERC20BalanceProcessor)
export const process = async (ctx: Context) => {
  await Promise.all(processors.map((p) => p(ctx)))
}
