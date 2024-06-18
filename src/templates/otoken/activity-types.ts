export type ActivityStatus = 'idle' | 'pending' | 'signed' | 'success' | 'error'

export interface ActivityBase {
  id: string
  blockNumber: number
  timestamp: number
  status: ActivityStatus
  txHash: string
  chainId: number
}

export interface ApprovalActivity extends ActivityBase {
  type: 'Approval'
  tokenIn: string
  amountIn: bigint
}

export interface BridgeActivity extends ActivityBase {
  type: 'Bridge'
  chainIn: number
  chainOut: number
  tokenIn: string
  tokenOut: string
  amountIn: bigint
}

export interface ClaimRewardsActivity extends ActivityBase {
  type: 'ClaimRewards'
  tokenIn: string
  amountIn: bigint
}

export interface DelegateVoteActivity extends ActivityBase {
  type: 'DelegateVote'
  tokenIn: string
  votingPower: bigint
  delegateTo: string
}

export interface ExtendStakeActivity extends ActivityBase {
  type: 'ExtendStake'
  amountIn: bigint
  tokenIn: string
  monthDuration: number
  lockupId: string
}

export interface MigrateActivity extends ActivityBase {
  type: 'Migrate'
  amountIn: bigint
  tokenIn: string
  tokenIdStaked: string
  tokenIdLiquid: string
  liquid?: bigint
  staked?: bigint
}

export interface RedeemActivity extends ActivityBase {
  type: 'Redeem'
  tokenIn: string
  tokenOut: string
  amountIn: bigint
}

export interface StakeActivity extends ActivityBase {
  type: 'Stake'
  tokenIn: string
  amountIn: bigint
  monthDuration: number
}

export interface SwapActivity extends ActivityBase {
  type: 'Swap'
  exchange: 'Curve' | 'Balancer'
  pool: string
  tokenIn: string
  tokenOut: string
  amountIn: bigint
  amountOut: bigint
}

export interface UnstakeActivity extends ActivityBase {
  type: 'Unstake'
  tokenIn: string
  tokenOut: string
  lockupId: string
}

export interface VoteActivity extends ActivityBase {
  type: 'Vote'
  tokenIn: string
  choice: string
  proposalId: string
}

export type Activity =
  | ApprovalActivity
  | BridgeActivity
  | ClaimRewardsActivity
  | DelegateVoteActivity
  | ExtendStakeActivity
  | MigrateActivity
  | RedeemActivity
  | StakeActivity
  | SwapActivity
  | UnstakeActivity
  | VoteActivity
