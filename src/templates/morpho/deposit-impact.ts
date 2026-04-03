import type { PublicClient } from 'viem'

import { ousd } from '@utils/addresses'
import { fetchVaultApyViem } from './fetch'
import { simulateDeposit, weightedVaultApy } from './math'

export interface DepositImpactResult {
  currentApy: number
  newApy: number
  impactBps: number
}

/**
 * Compute the APY impact of a deposit into a MetaMorpho vault.
 * Makes live on-chain RPC calls via the provided viem PublicClient.
 *
 * @param client   viem PublicClient for the target chain
 * @param chainId  Chain ID (used to resolve the Morpho Blue singleton address)
 * @param vaultAddress  MetaMorpho V1.1 vault address
 * @param depositAmount  Deposit size in loan-token base units (e.g. 1e18 for 1 ETH)
 */
export async function computeDepositImpact(
  client: PublicClient,
  chainId: number,
  vaultAddress: string,
  depositAmount: bigint,
): Promise<DepositImpactResult> {
  const morphoAddress = ousd.morpho.blue[chainId]
  if (!morphoAddress) {
    throw new Error(`No Morpho Blue address configured for chainId ${chainId}`)
  }

  const result = await fetchVaultApyViem(client, vaultAddress, morphoAddress)
  if (!result) {
    return { currentApy: 0, newApy: 0, impactBps: 0 }
  }

  const { apy: currentApy, markets } = result
  const sim = simulateDeposit(markets, depositAmount)
  const newApy = weightedVaultApy(markets, sim)

  return {
    currentApy,
    newApy,
    impactBps: Math.round((currentApy - newApy) * 10000),
  }
}
