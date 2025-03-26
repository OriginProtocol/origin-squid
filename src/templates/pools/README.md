# Pools processor

The goal here is to track what pools exist so we can dynamically understand our state of on-chain liquidity.

AMMs to Process:

- Curve
- SwapX
- Metropolis
- Shadow
- Aerodrome

## Curve

### Curve Deployed Contracts

- https://docs.curve.fi/integration/address-provider/?h=addressprovider
- https://docs.curve.fi/references/deployed-contracts/#stableswap-ng

### Static Data

Legacy Curve Registry Pools
https://etherscan.io/address/0x90E00ACe148ca3b23Ac1bC8C240C2a7Dd9c2d7f5#events

Doesn't seem worth processing - any pools we care about that exist here can be added statically.

### Dynamic Processing

AddressProvider.get_address(11) = CurveStableswapFactoryNG: https://etherscan.io/address/0x6A8cbed756804B16E05E741eDaBd5cB544AE21bf#code
AddressProvider.get_address(12) = CurveTwocryptoFactory: https://etherscan.io/address/0x98EE851a00abeE0d95D08cF4CA2BdCE32aeaAF7F#code
AddressProvider.get_address(13) = CurveTricryptoFactory: https://etherscan.io/address/0x0c0e5f2fF0ff18a3be9b835635039256dC4B4963#code
