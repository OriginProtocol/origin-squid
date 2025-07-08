import { createInterface } from 'node:readline'
import { createPublicClient, formatEther, formatGwei, http, parseEther } from 'viem'
import { mainnet } from 'viem/chains'

import erc20Abi from '../abi/erc20.json'
import vaultAbi from '../abi/otoken-vault.json'
import otokenAbi from '../abi/otoken.json'
import { OETH_ADDRESS, OETH_VAULT_ADDRESS, WETH_ADDRESS } from '../src/utils/addresses'

// Create viem client
const client = createPublicClient({
  chain: mainnet,
  transport: http(process.env.RPC_ENDPOINT || 'https://rpc.flashbots.net'),
})

// Create readline interface for user input
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Constants from the vault contract
const MAX_REBASE = BigInt('50000') // 5% in basis points (50000 / 1e6)
const TYPE_UINT64_MAX = BigInt('18446744073709551615') // 2^64 - 1

// Utility functions for formatting
function formatEthTo2Decimals(value: bigint): string {
  return parseFloat(formatEther(value)).toFixed(2)
}

function formatPerSecond(value: bigint): string {
  // Show in gwei for better readability of small values
  const gweiValue = parseFloat(formatGwei(value))
  return `${gweiValue.toFixed(4)} Gwei/sec`
}

function calculateAPR(perSecond: bigint, totalSupply: bigint): number {
  if (totalSupply === 0n) return 0
  const secondsPerYear = 365.25 * 24 * 3600 // Account for leap years
  const annualYield = Number(formatEther(perSecond * BigInt(Math.floor(secondsPerYear))))
  const principal = Number(formatEther(totalSupply))
  return (annualYield / principal) * 100
}

function calculateAPY(perSecond: bigint, totalSupply: bigint, compoundingFrequency: number = 365): number {
  if (totalSupply === 0n) return 0
  const apr = calculateAPR(perSecond, totalSupply) / 100 // Convert to decimal
  // APY = (1 + APR/n)^n - 1, where n is compounding frequency
  return (Math.pow(1 + apr / compoundingFrequency, compoundingFrequency) - 1) * 100
}

function calculateAPYAfterFee(
  perSecond: bigint,
  totalSupply: bigint,
  feeRate: number = 0.2,
  compoundingFrequency: number = 365,
): number {
  if (totalSupply === 0n) return 0
  // Apply fee to the effective yield (80% of original yield gets compounded)
  const effectivePerSecond = BigInt(Math.floor(Number(perSecond) * (1 - feeRate)))
  const effectiveAPR = calculateAPR(effectivePerSecond, totalSupply) / 100 // Convert to decimal
  // APY = (1 + APR/n)^n - 1, where n is compounding frequency
  return (Math.pow(1 + effectiveAPR / compoundingFrequency, compoundingFrequency) - 1) * 100
}

// Helper functions for min/max
function min(a: bigint, b: bigint): bigint {
  return a < b ? a : b
}

function max(a: bigint, b: bigint): bigint {
  return a > b ? a : b
}

interface DripperState {
  dripDuration: bigint
  lastCollect: bigint
  perSecond: bigint
  perSecondTarget: bigint
  perSecondMax: bigint
  totalValue: bigint
  totalSupply: bigint
  nonRebasingSupply: bigint
  rebasingSupply: bigint
  availableFunds: bigint
  wethBalance: bigint
  secondsSinceLastCollect: bigint
  currentTimestamp: bigint
}

interface DripperOverrides {
  dripDuration?: bigint
  perSecondTarget?: bigint
  perSecondMax?: bigint
  totalValue?: bigint
  totalSupply?: bigint
  nonRebasingSupply?: bigint
  wethBalance?: bigint
  timeAdvance?: bigint
}

// Implement the vault's _nextYield logic
function calculateNextYield(
  supply: bigint,
  vaultValue: bigint,
  nonRebasingSupply: bigint,
  elapsed: bigint,
  lastRebase: bigint,
  currentTimestamp: bigint,
  dripDuration: bigint,
  rebasePerSecondTarget: bigint,
  rebasePerSecondMax: bigint,
  debug: boolean = false,
): { yieldAmount: bigint; targetRate: bigint } {
  const rebasing = supply - nonRebasingSupply
  let targetRate = rebasePerSecondTarget

  if (debug) {
    console.log('\n--- Debug: calculateNextYield ---')
    console.log(`Supply: ${formatEther(supply)}`)
    console.log(`Vault Value: ${formatEther(vaultValue)}`)
    console.log(`Non-Rebasing Supply: ${formatEther(nonRebasingSupply)}`)
    console.log(`Rebasing Supply: ${formatEther(rebasing)}`)
    console.log(`Elapsed: ${elapsed} seconds`)
    console.log(`Last Rebase: ${lastRebase}`)
    console.log(`Current Timestamp: ${currentTimestamp}`)
    console.log(`Drip Duration: ${dripDuration}`)
    console.log(`Target Rate: ${formatGwei(rebasePerSecondTarget)} Gwei/sec`)
    console.log(`Max Rate: ${formatGwei(rebasePerSecondMax)} Gwei/sec`)
  }

  // Early return conditions
  if (elapsed === 0n) {
    if (debug) console.log('Early return: elapsed === 0')
    return { yieldAmount: 0n, targetRate }
  }

  if (rebasing === 0n) {
    if (debug) console.log('Early return: rebasing === 0')
    return { yieldAmount: 0n, targetRate }
  }

  if (supply > vaultValue) {
    if (debug) console.log('Early return: supply > vaultValue')
    return { yieldAmount: 0n, targetRate }
  }

  if (currentTimestamp >= TYPE_UINT64_MAX) {
    if (debug) console.log('Early return: timestamp overflow')
    return { yieldAmount: 0n, targetRate }
  }

  // Start with the full difference available
  let yieldAmount = vaultValue - supply

  if (debug) {
    console.log(`Initial yield amount: ${formatEther(yieldAmount)}`)
  }

  // Cap via optional automatic duration smoothing
  if (dripDuration > 1n) {
    const sustainableRate = yieldAmount / (dripDuration * 2n)
    const minRequiredRate = yieldAmount / dripDuration

    if (debug) {
      console.log(`Sustainable rate (2x duration): ${formatGwei(sustainableRate)} Gwei/sec`)
      console.log(`Min required rate: ${formatGwei(minRequiredRate)} Gwei/sec`)
    }

    // If we are able to sustain an increased drip rate for
    // double the duration, then increase the target drip rate
    targetRate = max(targetRate, sustainableRate)
    // If we cannot sustain the target rate any more,
    // then rebase what we can, and reduce the target
    targetRate = min(targetRate, minRequiredRate)
    // drip at the new target rate
    yieldAmount = min(yieldAmount, targetRate * elapsed)

    if (debug) {
      console.log(`Adjusted target rate: ${formatGwei(targetRate)} Gwei/sec`)
      console.log(`Yield after duration smoothing: ${formatEther(yieldAmount)}`)
    }
  }

  // Cap per second. elapsed is not 1e18 denominated
  const perSecondCap = (rebasing * elapsed * rebasePerSecondMax) / BigInt(1e18)
  yieldAmount = min(yieldAmount, perSecondCap)

  if (debug) {
    console.log(`Per-second cap: ${formatEther(perSecondCap)}`)
    console.log(`Yield after per-second cap: ${formatEther(yieldAmount)}`)
  }

  // Cap at a hard max per rebase, to avoid long durations resulting in huge rebases
  const hardCap = (rebasing * MAX_REBASE) / BigInt(1e6) // MAX_REBASE is in basis points (50000 = 5%)
  yieldAmount = min(yieldAmount, hardCap)

  if (debug) {
    console.log(`Hard cap (5%): ${formatEther(hardCap)}`)
    console.log(`Final yield amount: ${formatEther(yieldAmount)}`)
  }

  return { yieldAmount, targetRate }
}

async function fetchCurrentDripperState(): Promise<DripperState> {
  console.log('Fetching current dripper state...')

  const currentTimestamp = BigInt(Math.floor(Date.now() / 1000))

  // Fetch vault state
  const [
    dripDuration,
    lastCollect,
    perSecondTarget,
    perSecondMax,
    totalValue,
    totalSupply,
    nonRebasingSupply,
    wethBalance,
  ] = await Promise.all([
    client.readContract({
      address: OETH_VAULT_ADDRESS as `0x${string}`,
      abi: vaultAbi,
      functionName: 'dripDuration',
    }),
    client.readContract({
      address: OETH_VAULT_ADDRESS as `0x${string}`,
      abi: vaultAbi,
      functionName: 'lastRebase',
    }),
    client.readContract({
      address: OETH_VAULT_ADDRESS as `0x${string}`,
      abi: vaultAbi,
      functionName: 'rebasePerSecondTarget',
    }),
    client.readContract({
      address: OETH_VAULT_ADDRESS as `0x${string}`,
      abi: vaultAbi,
      functionName: 'rebasePerSecondMax',
    }),
    client.readContract({
      address: OETH_VAULT_ADDRESS as `0x${string}`,
      abi: vaultAbi,
      functionName: 'totalValue',
    }),
    client.readContract({
      address: OETH_ADDRESS as `0x${string}`,
      abi: erc20Abi,
      functionName: 'totalSupply',
    }),
    client.readContract({
      address: OETH_ADDRESS as `0x${string}`,
      abi: otokenAbi,
      functionName: 'nonRebasingSupply',
    }),
    client.readContract({
      address: WETH_ADDRESS as `0x${string}`,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [OETH_VAULT_ADDRESS as `0x${string}`],
    }),
  ])

  const totalValueBigInt = totalValue as bigint
  const totalSupplyBigInt = totalSupply as bigint
  const nonRebasingSupplyBigInt = nonRebasingSupply as bigint
  const lastCollectBigInt = lastCollect as bigint
  const availableFunds = totalValueBigInt - totalSupplyBigInt
  const secondsSinceLastCollect = currentTimestamp - lastCollectBigInt

  // Calculate actual yield using vault logic
  const { yieldAmount: calculatedYield, targetRate: adjustedTargetRate } = calculateNextYield(
    totalSupplyBigInt,
    totalValueBigInt,
    nonRebasingSupplyBigInt,
    secondsSinceLastCollect,
    lastCollectBigInt,
    currentTimestamp,
    dripDuration as bigint,
    perSecondTarget as bigint,
    perSecondMax as bigint,
  )

  const perSecond = secondsSinceLastCollect > 0n ? calculatedYield / secondsSinceLastCollect : 0n

  return {
    dripDuration: dripDuration as bigint,
    lastCollect: lastCollectBigInt,
    perSecond,
    perSecondTarget: perSecondTarget as bigint,
    perSecondMax: perSecondMax as bigint,
    totalValue: totalValueBigInt,
    totalSupply: totalSupplyBigInt,
    nonRebasingSupply: nonRebasingSupplyBigInt,
    rebasingSupply: totalSupplyBigInt - nonRebasingSupplyBigInt,
    availableFunds,
    wethBalance: wethBalance as bigint,
    secondsSinceLastCollect,
    currentTimestamp,
  }
}

function displayDripperState(state: DripperState, title: string = 'Current Dripper State') {
  const perSecondMaxWei = (state.perSecondMax * state.rebasingSupply) / 10n ** 18n
  console.log(`\n=== ${title} ===`)
  console.log(
    `Drip Duration: ${state.dripDuration.toString()} seconds (${(Number(state.dripDuration) / 3600).toFixed(2)} hours)`,
  )
  console.log(
    `Last Collect: ${state.lastCollect.toString()} (${new Date(Number(state.lastCollect) * 1000).toISOString()})`,
  )
  console.log(`Seconds Since Last Collect: ${state.secondsSinceLastCollect.toString()}`)
  console.log(`Per Second (Current): ${formatPerSecond(state.perSecond)}`)
  console.log(`Per Second Target: ${formatPerSecond(state.perSecondTarget)}`)
  console.log(`Per Second Max: ${formatPerSecond(perSecondMaxWei)}`)
  console.log(`Total Value: ${formatEthTo2Decimals(state.totalValue)} ETH`)
  console.log(`Total Supply: ${formatEthTo2Decimals(state.totalSupply)} OETH`)
  console.log(`Non-Rebasing Supply: ${formatEthTo2Decimals(state.nonRebasingSupply)} OETH`)
  console.log(`Rebasing Supply: ${formatEthTo2Decimals(state.rebasingSupply)} OETH`)
  console.log(`Available Funds: ${formatEthTo2Decimals(state.availableFunds)} ETH`)
  console.log(`WETH Balance: ${formatEthTo2Decimals(state.wethBalance)} WETH`)

  // Calculate potential yield over different time periods
  const hourlyYield = calculateNextYield(
    state.totalSupply,
    state.totalValue,
    state.nonRebasingSupply,
    3600n, // 1 hour
    state.lastCollect,
    state.currentTimestamp,
    state.dripDuration,
    state.perSecondTarget,
    state.perSecondMax,
  ).yieldAmount

  const dailyYield = calculateNextYield(
    state.totalSupply,
    state.totalValue,
    state.nonRebasingSupply,
    86400n, // 1 day
    state.lastCollect,
    state.currentTimestamp,
    state.dripDuration,
    state.perSecondTarget,
    state.perSecondMax,
  ).yieldAmount

  // For longer periods, use simple rate multiplication to avoid hitting hard caps
  const weeklyYield = state.perSecond * 604800n // 7 days * 24 hours * 3600 seconds
  const annualYield = state.perSecond * BigInt(Math.floor(365.25 * 24 * 3600)) // 1 year in seconds

  console.log(`\n--- Yield Projections (using vault logic) ---`)
  console.log(`Hourly Yield: ${formatEthTo2Decimals(hourlyYield)} ETH`)
  console.log(`Daily Yield: ${formatEthTo2Decimals(dailyYield)} ETH`)
  console.log(`Weekly Yield: ${formatEthTo2Decimals(weeklyYield)} ETH (sustained rate)`)
  console.log(`Annual Yield: ${formatEthTo2Decimals(annualYield)} ETH (sustained rate)`)

  // Calculate APR/APY based on current effective rate
  const currentAPR = calculateAPR(state.perSecond, state.rebasingSupply)
  const currentAPY = calculateAPY(state.perSecond, state.rebasingSupply)
  const currentAPYAfterFee = calculateAPYAfterFee(state.perSecond, state.rebasingSupply)
  const targetAPR = calculateAPR(state.perSecondTarget, state.rebasingSupply)
  const targetAPY = calculateAPY(state.perSecondTarget, state.rebasingSupply)
  const targetAPYAfterFee = calculateAPYAfterFee(state.perSecondTarget, state.rebasingSupply)
  const maxAPR = calculateAPR(perSecondMaxWei, state.rebasingSupply)
  const maxAPY = calculateAPY(perSecondMaxWei, state.rebasingSupply)
  const maxAPYAfterFee = calculateAPYAfterFee(perSecondMaxWei, state.rebasingSupply)

  console.log(`\n--- Annual Percentage Rates (for rebasing supply) ---`)
  console.log(`Current APR: ${currentAPR.toFixed(2)}%`)
  console.log(`Current APY: ${currentAPY.toFixed(2)}% (daily compounding)`)
  console.log(`Current APY After Fee: ${currentAPYAfterFee.toFixed(2)}% (daily compounding, 20% fee)`)
  console.log(`Target APR: ${targetAPR.toFixed(2)}%`)
  console.log(`Target APY: ${targetAPY.toFixed(2)}% (daily compounding)`)
  console.log(`Target APY After Fee: ${targetAPYAfterFee.toFixed(2)}% (daily compounding, 20% fee)`)
  console.log(`Max APR: ${maxAPR.toFixed(2)}%`)
  console.log(`Max APY: ${maxAPY.toFixed(2)}% (daily compounding)`)
  console.log(`Max APY After Fee: ${maxAPYAfterFee.toFixed(2)}% (daily compounding, 20% fee)`)
}

function calculateNewState(originalState: DripperState, overrides: DripperOverrides): DripperState {
  const newState = { ...originalState }

  // Apply overrides
  if (overrides.dripDuration !== undefined) newState.dripDuration = overrides.dripDuration
  if (overrides.perSecondTarget !== undefined) newState.perSecondTarget = overrides.perSecondTarget
  if (overrides.perSecondMax !== undefined) newState.perSecondMax = overrides.perSecondMax
  if (overrides.totalValue !== undefined) newState.totalValue = overrides.totalValue
  if (overrides.totalSupply !== undefined) newState.totalSupply = overrides.totalSupply
  if (overrides.nonRebasingSupply !== undefined) newState.nonRebasingSupply = overrides.nonRebasingSupply
  if (overrides.wethBalance !== undefined) newState.wethBalance = overrides.wethBalance

  // Recalculate derived values
  newState.availableFunds = newState.totalValue - newState.totalSupply
  newState.rebasingSupply = newState.totalSupply - newState.nonRebasingSupply

  // Handle time advancement
  if (overrides.timeAdvance !== undefined) {
    newState.currentTimestamp = originalState.currentTimestamp + overrides.timeAdvance
    newState.secondsSinceLastCollect = newState.currentTimestamp - newState.lastCollect
  }

  // Recalculate per second using actual vault logic
  const { yieldAmount: calculatedYield } = calculateNextYield(
    newState.totalSupply,
    newState.totalValue,
    newState.nonRebasingSupply,
    newState.secondsSinceLastCollect,
    newState.lastCollect,
    newState.currentTimestamp,
    newState.dripDuration,
    newState.perSecondTarget,
    newState.perSecondMax,
  )

  newState.perSecond = newState.secondsSinceLastCollect > 0n ? calculatedYield / newState.secondsSinceLastCollect : 0n

  return newState
}

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim())
    })
  })
}

async function getUserOverrides(): Promise<DripperOverrides> {
  const overrides: DripperOverrides = {}

  console.log('\n=== Override Values (press Enter to skip) ===')

  const dripDuration = await askQuestion('New drip duration (seconds): ')
  if (dripDuration) overrides.dripDuration = BigInt(dripDuration)

  const perSecondTarget = await askQuestion('New per second target (ETH): ')
  if (perSecondTarget) overrides.perSecondTarget = parseEther(perSecondTarget)

  const perSecondMax = await askQuestion('New per second max (ETH): ')
  if (perSecondMax) overrides.perSecondMax = parseEther(perSecondMax)

  const totalValue = await askQuestion('New total value (ETH): ')
  if (totalValue) overrides.totalValue = parseEther(totalValue)

  const totalSupply = await askQuestion('New total supply (OETH): ')
  if (totalSupply) overrides.totalSupply = parseEther(totalSupply)

  const nonRebasingSupply = await askQuestion('New non-rebasing supply (OETH): ')
  if (nonRebasingSupply) overrides.nonRebasingSupply = parseEther(nonRebasingSupply)

  const wethBalance = await askQuestion('New WETH balance (WETH): ')
  if (wethBalance) overrides.wethBalance = parseEther(wethBalance)

  const timeAdvance = await askQuestion('Time advance (seconds): ')
  if (timeAdvance) overrides.timeAdvance = BigInt(timeAdvance)

  return overrides
}

const main = async () => {
  try {
    // Fetch current state
    const currentState = await fetchCurrentDripperState()
    displayDripperState(currentState, 'Current Dripper State')

    // Get user overrides
    const overrides = await getUserOverrides()

    // Calculate new state
    const newState = calculateNewState(currentState, overrides)
    displayDripperState(newState, 'Projected Dripper State')

    // Show differences
    console.log('\n=== Changes ===')
    console.log(
      `Available Funds: ${formatEthTo2Decimals(currentState.availableFunds)} → ${formatEthTo2Decimals(
        newState.availableFunds,
      )} ETH`,
    )
    console.log(
      `Per Second: ${formatPerSecond(currentState.perSecond)} → ${formatPerSecond(newState.perSecond)} ETH/sec`,
    )

    const currentDailyYield = currentState.perSecond * 86400n
    const newDailyYield = newState.perSecond * 86400n
    console.log(`Daily Yield: ${formatEthTo2Decimals(currentDailyYield)} → ${formatEthTo2Decimals(newDailyYield)} ETH`)

    // Show APY change (compounding benefit)
    const currentAPY = calculateAPYAfterFee(currentState.perSecond, currentState.rebasingSupply)
    const newAPY = calculateAPYAfterFee(newState.perSecond, newState.rebasingSupply)
    console.log(`APY Change: ${currentAPY.toFixed(2)}% → ${newAPY.toFixed(2)}%`)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    rl.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
