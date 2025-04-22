const superOETHp = {
  address: '0xfcbe50dbe43bf7e5c88c6f6fb9ef432d4165406e',
  wrapped: '0x2de8a403f7a5c6c5161d4a129918ec9f0b653918',
  vault: '0xf1d0bb43c194371b04717ee8029a467a218c69b4',
  oracleRouter: '0xa6c76fc1ac0ac86f19cd874524726b456905ea81',
  dripper: '0x3b56c09543d3068f8488ed34e6f383c3854d2bc1',
  strategies: {},
  zapper: undefined,
  harvester: undefined,
  vaultTokens: ['0xca59ca09e5602fae8b629dee83ffa819741f14be'],
} as const

export const tokens = {
  superOETHp: superOETHp.address,
  WOETH: '0xd8724322f44e5c58d7a815f542036fb17dbbf839',
  WETH: '0xca59ca09e5602fae8b629dee83ffa819741f14be',
  ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  USDC: '0x54fd4da2fa19cf0f63d8f93a6ea5bed3f9c042c6',
} as const

export const plumeAddresses = {
  multisig: {
    '5/8': '0x92a19381444a001d62ce67baff066fa1111d7202',
  },
  timelock: '0x6c6f8f839a7648949873d3d2beea936fc2932e5c',
  superOETHp,
  tokens,
} as const
