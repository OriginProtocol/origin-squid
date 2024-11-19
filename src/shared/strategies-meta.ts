import { addresses } from '@utils/addresses'
import { baseAddresses } from '@utils/addresses-base'

export const ousdStrategiesMeta = [
  {
    oToken: addresses.ousd.address,
    addresses: [addresses.strategies.ousd.AaveStrategy],
    title: 'AAVE',
    description: `Aave is a liquidity protocol where users can participate as suppliers or borrowers. Each loan is over-collateralized to ensure repayment. OUSD deploys stablecoins to three of the Aave V2 markets and earns interest approximately every 12 seconds. Additional yield is generated from protocol token incentives (AAVE), which are regularly sold for USDT on Uniswap and compounded.`,
    color: '#9896FF',
  },
  {
    oToken: addresses.ousd.address,
    addresses: [addresses.strategies.ousd.CompoundStrategy],
    title: 'Compound',
    description: `Compound is an interest rate protocol allowing lenders to earn yield on digital assets by supplying them to borrowers. Each loan is over-collateralized to ensure repayment. OUSD deploys stablecoins to three of the Compound V2 markets and earns interest approximately every 12 seconds. Additional yield is generated from protocol token incentives (COMP), which are regularly sold for USDT on Uniswap and compounded.`,
    color: '##00D395',
  },
  {
    oToken: addresses.ousd.address,
    addresses: [addresses.strategies.ousd.ConvexStrategy],
    title: 'Convex',
    description: `Convex allows liquidity providers and stakers to earn greater rewards from Curve, a stablecoin-centric automated market maker (AMM). OUSD earns trading fees and protocol token incentives (both CRV and CVX). This strategy employs base pools and metapools, including the Origin Dollar factory pool, which enables OUSD to safely leverage its own deposits to multiply returns and maintain the pool's balance.`,
    color: '#3A3A3A',
  },
  {
    oToken: addresses.ousd.address,
    addresses: [addresses.strategies.ousd.MakerStrategy],
    title: 'Maker',
    description: `MakerDAO is the decentralized organization responsible for issuing DAI. The Dai Savings Rate (DSR) is a key mechanism of the Maker protocol designed to stabilize the value and supply of DAI by incentivizing users to hold and save it. OUSD utilizes the DSR as its base strategy for earning yield from DAI holdings.`,
    color: '#1aab9b',
  },
  {
    oToken: addresses.ousd.address,
    addresses: [addresses.strategies.ousd.MetaMorphoStrategy],
    title: 'Morpho Steakhouse Vault',
    description: `Morpho Vaults (formerly MetaMorpho) is an open-source protocol for permissionless risk management on top of Morpho, a decentralized platform for overcollateralized lending and borrowing of ERC20 and ERC4626 tokens on Ethereum. The MetaMorpho Factory deploys ERC4626-compliant vaults that allocate deposits across multiple Morpho markets. These noncustodial, immutable vaults let users earn interest passively while the vault actively manages risk. Users retain full control and can withdraw anytime. Morpho Vaults offer tailored risk options, unlike traditional pools exposed to the riskiest assets.`,
    color: '#0B43CB',
  },
  {
    oToken: addresses.ousd.address,
    addresses: [addresses.strategies.ousd.MorphoAaveStrategy],
    title: 'Morpho AAVE V2 Optimizer',
    description: `Morpho adds a peer-to-peer layer on top of Compound and Aave allowing lenders and borrowers to be matched more efficiently with better interest rates. When no matching opportunity exists, funds flow directly through to the underlying protocol. OUSD supplies stablecoins to three of Morpho's Compound markets to earn interest. Additional yield is generated from protocol token incentives, including both COMP (regularly sold for USDT) and MORPHO (currently locked).`,
    color: '#9bc3e9',
  },
  {
    oToken: addresses.ousd.address,
    addresses: [addresses.ousd.vault],
    title: 'Origin Vault',
    description: `Origin Vault holds Origin Protocol treasury assets`,
    color: '#0074F0',
  },
]

export const oethStrategiesMeta = [
  {
    oToken: addresses.oeth.address,
    addresses: [addresses.strategies.oeth.BalancerMetaPoolStrategy],
    title: 'Balancer',
    description: `Balancer meta stable pool`,
    color: '#E5D3BE',
  },
  {
    oToken: addresses.oeth.address,
    addresses: [addresses.strategies.oeth.ConvexEthMetaStrategy],
    title: 'Curve AMO',
    description: `Curve is a stableswap AMM that offers efficient trading of stablecoins and volatile assets. The AMO strategy on Curve automates liquidity management and maximizes rewards by balancing assets in the pool. It deploys additional OETH or ETH to maintain the peg and doubles liquidity to increase earnings. Convex enhances this by boosting rewards from Curve pools. The LP tokens are staked on Convex to earn higher CRV and CVX rewards, which are then converted to OETH and distributed to holders, increasing their balances automatically through rebasing.`,
    color: '#0074F0',
  },
  {
    oToken: addresses.oeth.address,
    addresses: [addresses.strategies.oeth.FraxETHStrategy],
    title: 'Frax Staking',
    description: `OETH Frax Staking`,
    color: '#0074F0',
  },
  {
    oToken: addresses.oeth.address,
    addresses: [addresses.strategies.oeth.MorphoAaveStrategy],
    title: 'Morpho AAVE V2 Optimizer',
    description: `Morpho adds a peer-to-peer layer on top of Compound and Aave allowing lenders and borrowers to be matched more efficiently with better interest rates. When no matching opportunity exists, funds flow directly through to the underlying protocol. OUSD supplies stablecoins to three of Morpho's Compound markets to earn interest. Additional yield is generated from protocol token incentives, including both COMP (regularly sold for USDT) and MORPHO (currently locked).`,
    color: '#9bc3e9',
  },
  {
    oToken: addresses.oeth.address,
    addresses: addresses.strategies.oeth.NativeStakingStrategies,
    title: 'Native staking',
    description: `SSV network acts as our native staking solution and is a decentralized, open-source ETH staking platform using Secret Shared Validator (SSV) technology, also known as Distributed Validator Technology (DVT). It splits a validator key into multiple KeyShares to run an Ethereum validator across multiple non-trusting nodes. This setup provides active-active redundancy, enhances validator key security, and supports the Ethereum network, staking pools, services, and solo stakers.`,
    color: '#0074F0',
  },
  {
    oToken: addresses.oeth.address,
    addresses: [addresses.oeth.vault],
    title: 'Origin Vault',
    description: `Origin Vault holds Origin Protocol treasury assets`,
    color: '#0074F0',
  },
]

export const superOETHbStrategiesMeta = [
  {
    oToken: baseAddresses.superOETHb.address,
    addresses: [baseAddresses.superOETHb.strategies.amo],
    title: 'Aerodrome',
    description: `Aerodrome Finance is a next-generation AMM that combines the best of Curve, Convex and Uniswap, designed to serve as Base's central liquidity hub. Aerodrome NFTs vote on token emissions and receive incentives and fees generated by the protocol.`,
    color: '#0433FF',
  },
  {
    oToken: baseAddresses.superOETHb.address,
    addresses: [baseAddresses.superOETHb.strategies.bridgedWOETH],
    title: 'Bridge wOETH',
    description: `Bridged wOETH on Base`,
    color: '#0074F0',
  },
  {
    oToken: baseAddresses.superOETHb.address,
    addresses: [baseAddresses.superOETHb.vault],
    title: 'Origin Vault',
    description: `Origin Vault holds Origin Protocol treasury assets`,
    color: '#0074F0',
  },
]

export const strategiesMeta = [...ousdStrategiesMeta, ...oethStrategiesMeta, ...superOETHbStrategiesMeta] as const

export type StrategyMeta = (typeof strategiesMeta)[number]

export const getStrategyMeta = (oToken: string, address: string) => {
  return strategiesMeta.find((m) => m.oToken === oToken && m.addresses.find((a) => a === address))
}
