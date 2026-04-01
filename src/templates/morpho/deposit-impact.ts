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
 * @param depositAmount  Deposit size as a decimal string in loan-token units
 */
export async function computeDepositImpact(
  client: PublicClient,
  chainId: number,
  vaultAddress: string,
  depositAmount: string,
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
  const sim = simulateDeposit(markets, BigInt(depositAmount))

  let newApy = currentApy
  try {
    newApy = weightedVaultApy(markets, sim)
  } catch {
    // If simulation fails, newApy stays at currentApy → impactBps = 0
  }

  return {
    currentApy,
    newApy,
    impactBps: Math.round((currentApy - newApy) * 10000),
  }
}
