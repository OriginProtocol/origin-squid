import * as otoken from '@abi/otoken'
import * as otokenOld from '@abi/otoken-old'
import { createERC20PollingTracker } from '@templates/erc20'
import { createRebasingERC20Tracker, getErc20RebasingParams } from '@templates/erc20/erc20-rebasing'
import { OUSD_ADDRESS, OUSD_VAULT_ADDRESS, ousdStrategyArray, tokens } from '@utils/addresses'
import { logFilter } from '@utils/logFilter'

const rebasingTracks: Record<string, Parameters<typeof createRebasingERC20Tracker>[0]> = {
  OUSD: {
    from: 11585978, // From Reset:
    address: tokens.OUSD,
    rebasing: {
      rebaseEventFilter: logFilter({
        address: [OUSD_ADDRESS],
        topic0: [otokenOld.events.TotalSupplyUpdated.topic, otoken.events.TotalSupplyUpdatedHighres.topic],
        transaction: true,
        range: { from: 11585978 },
      }),
      getCredits: async (ctx, block, address) => {
        const oToken = new otoken.Contract(ctx, block.header, tokens.OUSD)
        if (block.header.height < 13533937) {
          return oToken.creditsBalanceOf(address).then((credits) => credits._0 * 1000000000n)
        }
        return oToken.creditsBalanceOfHighres(address).then((credits) => credits._0)
      },
      getCreditsPerToken: async (ctx, block) => {
        const oToken = new otoken.Contract(ctx, block.header, tokens.OUSD)
        if (block.header.height < 13533937) {
          return oToken.rebasingCreditsPerToken().then((cpt) => cpt * 1000000000n)
        }
        return oToken.rebasingCreditsPerTokenHighres()
      },
      ...getErc20RebasingParams({
        from: 11585978,
        yieldDelegationFrom: 21325305,
        address: OUSD_ADDRESS,
        rebaseOptTraceUntil: 20000000,
      }),
    },
  },
}

const tracks: Record<string, Parameters<typeof createERC20PollingTracker>[0]> = {
  // OUSD Related
  USDT: {
    // from: 11362821,
    from: 16933090, // oeth deploy date
    address: tokens.USDT,
    accountFilter: [
      ...ousdStrategyArray,
      OUSD_VAULT_ADDRESS,
      '0x3ed3b47dd13ec9a98b44e6204a523e766b225811', // aUSDT
      '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9', // cUSDT
    ],
    intervalTracking: true,
  },
  USDC: {
    // from: 11367200,
    from: 16933090, // oeth deploy date
    address: tokens.USDC,
    accountFilter: [
      ...ousdStrategyArray,
      OUSD_VAULT_ADDRESS,
      '0xbcca60bb61934080951369a648fb03df4f96263c', // aUSDC
      '0x39aa39c021dfbae8fac545936693ac917d5e7563', // cUSDC
    ],
    intervalTracking: true,
  },
  DAI: {
    // from: 11367184,
    from: 16933090, // oeth deploy date
    address: tokens.DAI,
    accountFilter: [
      ...ousdStrategyArray,
      OUSD_VAULT_ADDRESS,
      '0x028171bca77440897b824ca71d1c56cac55b68a3', // aDAI
      '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643', // cDAI
    ],
    intervalTracking: true,
  },
}

// This is a function to allow others to subscribe to balance tracking
export const erc20s = () => [
  ...Object.values(rebasingTracks).map(createRebasingERC20Tracker),
  ...Object.values(tracks).map(createERC20PollingTracker),
]
