const OS = {
  initializeBlock: 3884286,
  address: '0xb1e25689d55734fd3fffc939c4c3eb52dff8a794',
  dripper: '0x5b72992e9cde8c07ce7c8217eb014ec7fd281f03',
  oracleRouter: '0xe68e0c66950a7e02335fc9f44daa05d115c4e88b',
  harvester: '0x0000000000000000000000000000000000000000',
  vault: '0xa3c0eca00d2b76b4d1f170b0ab3fdea16c180186',
  vaultAdmin: '0x4bc73050916e6d1738286d8863f8fdcffaa879f8',
  vaultValueChecker: '0x06f172e6852085eca886b7f9fd8f7b21db3d2c40',
  wrapped: '0x9f0df7799f6fdad409300080cff680f5a23df4b1',
  zapper: '0xe25a2b256ffb3ad73678d5e80de8d2f6022fab21',
  strategies: [] as { from: number; address: string }[],
} as const

export const sonicTokens = {
  OS: OS.address,
  wOS: OS.wrapped,
  wS: '0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38',
  WETH: '0x309c92261178fa0cf748a855e90ae73fdb79ebc7',
  USDC: '0x29219dd400f2bf60e5a23d13be72b486d4038894',
} as const

export const sonicOrigin = {
  timelock: '0x31a91336414d3b955e494e7d485a6b06b55fc8fb',
} as const

export const sonicMultisig = {
  'multichain-guardian': '0x4ff1b9d9ba8558f5eafcec096318ea0d8b541971',
} as const

export const sonicContracts = {
  SFC: '0xfc00face00000000000000000000000000000000',
  Multicall3: '0xca11bde05977b3631167028862be2a173976ca11',
} as const

export const sonicAddresses = {
  multisig: sonicMultisig,
  tokens: sonicTokens,
  origin: sonicOrigin,
  contracts: sonicContracts,
  OS,
} as const
