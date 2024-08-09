export const baseAddresses = {
  USDC: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  WETH: '0x4200000000000000000000000000000000000006',
  OGN: '0x7002458b1df59eccb57387bc79ffc7c29e22e6f7',
  superOETHb: '0xdbfefd2e8460a6ee4955a68582f85708baea60a3',
  aerodromeBasePrices: '0xee717411f6e44f9fee011835c8e6faac5deff166',
  aerodromeVoter: '0x16613524e02ad97edfef371bc883f2f5d6c480a5',
  aerodrome: {
    'vAMM-WETH/OGN': {
      pool: {
        address: '0x8ea4c49b712217fd6e29db920e3dd48287a0d50d',
        assets: [
          { address: '0x4200000000000000000000000000000000000006', decimals: 18 },
          { address: '0x7002458b1df59eccb57387bc79ffc7c29e22e6f7', decimals: 18 },
        ],
        from: 15676793,
      },
      gauge: {
        address: '0xa88bcfecc886dea1e8b3108179f0532d53c8c055',
        from: 16014718,
      },
    },
    'vAMM-OGN/OETHb': {
      pool: {
        address: '0x6fb655476fdcfb9712dd200308d941a1c6d1119e',
        assets: [
          { address: '0x7002458b1df59eccb57387bc79ffc7c29e22e6f7', decimals: 18 },
          { address: '0xdbfefd2e8460a6ee4955a68582f85708baea60a3', decimals: 18 },
        ],
        from: 18084976,
      },
      gauge: null,
    },
    'CL1-WETH/OETHb': {
      pool: {
        address: '0x6446021f4e396da3df4235c62537431372195d38',
        assets: [
          { address: '0x4200000000000000000000000000000000000006', decimals: 18 },
          { address: '0xdbfefd2e8460a6ee4955a68582f85708baea60a3', decimals: 18 },
        ],
        from: 18056601,
      },
      gauge: null,
    },
    'CL1-cbETH/WETH': {
      pool: {
        address: '0x47cA96Ea59C13F72745928887f84C9F52C3D7348',
        assets: [
          { address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22', decimals: 18 },
          { address: '0x4200000000000000000000000000000000000006', decimals: 18 },
        ],
        from: 13900345,
      },
      gauge: {
        address: '0xF5550F8F0331B8CAA165046667f4E6628E9E3Aac',
        from: 13903874,
      },
    },
  },
}
