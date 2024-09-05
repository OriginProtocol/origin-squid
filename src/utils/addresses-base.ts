import { compact, keyBy, omit, uniq } from 'lodash'

const superOETHb = {
  address: '0xdbfefd2e8460a6ee4955a68582f85708baea60a3',
  wrapped: '0x7fcd174e80f264448ebee8c88a7c4476aaf58ea6',
  vault: '0x98a0cbef61bd2d21435f433be4cd42b56b38cc93',
  oracleRouter: '0xc72bda59e382be10bb5d71abd01ecc65aa16fd83',
  dripper: '0x0030c7dc6cb7f449e9566f273342c3370ee6b16a',
  strategies: {
    bridgedWOETH: '0x80c864704dd06c3693ed5179190786ee38acf835',
    amo: '0xf611cc500eee7e4e4763a05fe623e2363c86d2af',
  },
  zapper: '0x3b56c09543d3068f8488ed34e6f383c3854d2bc1',
  harvester: undefined,
  vaultTokens: ['0x4200000000000000000000000000000000000006'],
} as const

export const tokens = {
  USDC: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  WETH: '0x4200000000000000000000000000000000000006',
  OGN: '0x7002458b1df59eccb57387bc79ffc7c29e22e6f7',
  cbETH: '0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22',
  AERO: '0x940181a94a35a4569e4529a3cdfb74e38fd98631',
  bridgedWOETH: '0xd8724322f44e5c58d7a815f542036fb17dbbf839',
  superOETHb: superOETHb.address,
  wsuperOETHb: superOETHb.wrapped,
} as const

export const aerodromePools = {
  'vAMM-WETH/OGN': {
    name: 'vAMM-WETH/OGN',
    type: 'amm',
    address: '0x8ea4c49b712217fd6e29db920e3dd48287a0d50d',
    assets: [
      {
        address: '0x4200000000000000000000000000000000000006',
        decimals: 18,
      },
      { address: '0x7002458b1df59eccb57387bc79ffc7c29e22e6f7', decimals: 18 },
    ],
    lps: [],
    from: 15676793,
    gauge: { address: '0xa88bcfecc886dea1e8b3108179f0532d53c8c055', from: 16014718 },
  },
  'vAMM-OGN/superOETHb': {
    name: 'vAMM-OGN/superOETHb',
    type: 'amm',
    address: '0x6fb655476fdcfb9712dd200308d941a1c6d1119e',
    assets: [
      {
        address: '0x7002458b1df59eccb57387bc79ffc7c29e22e6f7',
        decimals: 18,
      },
      { address: '0xdbfefd2e8460a6ee4955a68582f85708baea60a3', decimals: 18 },
    ],
    lps: ['0xfd9e6005187f448957a0972a7d0c0a6da2911236'],
    from: 18084976,
    gauge: {
      address: '0x147587251c3a4f8c907edbc0e5a5ea953bda743d',
      from: 18633758,
    },
  },
  'CL1-WETH/superOETHb': {
    name: 'CL1-WETH/superOETHb',
    type: 'cl',
    address: '0x6446021f4e396da3df4235c62537431372195d38',
    assets: [
      {
        address: '0x4200000000000000000000000000000000000006',
        decimals: 18,
      },
      { address: '0xdbfefd2e8460a6ee4955a68582f85708baea60a3', decimals: 18 },
    ],
    lps: [superOETHb.strategies.amo],
    from: 18056601,
    gauge: {
      address: '0xdd234dbe2eff53bed9e8fc0e427ebcd74ed4f429',
      from: 18633733,
    },
  },
  'CL1-cbETH/WETH': {
    name: 'CL1-cbETH/WETH',
    type: 'cl',
    address: '0x47ca96ea59c13f72745928887f84c9f52c3d7348',
    assets: [
      {
        address: '0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22',
        decimals: 18,
      },
      { address: '0x4200000000000000000000000000000000000006', decimals: 18 },
    ],
    lps: [],
    from: 13900345,
    gauge: { address: '0xf5550f8f0331b8caa165046667f4e6628e9e3aac', from: 13903874 },
  },
  'CL100-WETH/USDC': {
    name: 'CL100-WETH/USDC',
    type: 'cl',
    address: '0xb2cc224c1c9fee385f8ad6a55b4d94e92359dc59',
    from: 13899892,
    assets: [
      {
        address: '0x4200000000000000000000000000000000000006',
        decimals: 18,
      },
      { address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', decimals: 6 },
    ],
    lps: ['0x0d90e61805c101d88ddc614344274c0249b793ef'],
    gauge: { address: '0xf33a96b5932d9e9b9a0eda447abd8c9d48d2e0c8', from: 13903905 },
  },
} as const

export type PoolDefinition = (typeof aerodromePools)[keyof typeof aerodromePools]
export const aerodromePoolArray: PoolDefinition[] = Object.values(aerodromePools)

export const baseAddresses = {
  multisig: {
    '5/8': '0x92a19381444a001d62ce67baff066fa1111d7202',
    '2/8': '0x28bce2ee5775b652d92bb7c2891a89f036619703',
    reservoir: '0xb6d85ce798660076152d6fd3a484129668839c95',
  },
  baseHotWallet: '0x3c112e20141b65041c252a68a611ef145f58b7bc',
  tokens,
  superOETHb,
  origin: compact(
    uniq(
      [
        ...Object.values(omit(superOETHb, 'vaultTokens', 'strategies')),
        ...Object.values(superOETHb.strategies).map((a) => a?.toLowerCase()),
      ]
        .flat()
        .map((a) => a?.toLowerCase()),
    ),
  ),
  aerodrome: {
    voter: '0x16613524e02ad97edfef371bc883f2f5d6c480a5',
    basePrices: '0xee717411f6e44f9fee011835c8e6faac5deff166',
    offchainOracle: '0x5b80fd3dc871d56a31bf7bb13b14cd8a8fbf7baf',
    sugarLPV3: '0x68c19e13618c41158fe4baba1b8fb3a9c74bdb0a',
    factoryRegistry: '0x5c3f18f06cc09ca1910767a34a20f771039e37c0',
    slipstreamNft: '0x827922686190790b37229fd06084350e74485b72',
    pools: aerodromePools,
  },
} as const
