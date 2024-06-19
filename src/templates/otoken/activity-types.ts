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
  account: string
  tokenIn: string
  amountIn: string
}

export interface BridgeActivity extends ActivityBase {
  type: 'Bridge'
  from: string
  to: string
  chainIn: number
  chainOut: number
  tokenIn: string
  tokenOut: string
  amountIn: string
}

export interface ClaimRewardsActivity extends ActivityBase {
  type: 'ClaimRewards'
  account: string
  tokenIn: string
  amountIn: string
}

export interface DelegateVoteActivity extends ActivityBase {
  type: 'DelegateVote'
  account: string
  tokenIn: string
  votingPower: string
  delegateTo: string
}

export interface ExtendStakeActivity extends ActivityBase {
  type: 'ExtendStake'
  account: string
  amountIn: string
  tokenIn: string
  monthDuration: number
  lockupId: string
}

export interface MigrateActivity extends ActivityBase {
  type: 'Migrate'
  account: string
  amountIn: string
  tokenIn: string
  tokenIdStaked: string
  tokenIdLiquid: string
  liquid?: string
  staked?: string
}

export interface StakeActivity extends ActivityBase {
  type: 'Stake'
  account: string
  tokenIn: string
  amountIn: string
  monthDuration: number
}

export interface UnstakeActivity extends ActivityBase {
  type: 'Unstake'
  account: string
  tokenIn: string
  tokenOut: string
  lockupId: string
}

export interface SwapActivity extends ActivityBase {
  type: 'Swap'
  account: string
  exchange: 'Curve' | 'Balancer'
  contract: string
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
}

export interface TransferActivity extends ActivityBase {
  type: 'Transfer'
  token: string
  from: string
  to: string
  amount: string
}

export interface WrapActivity extends ActivityBase {
  type: 'Wrap'
  account: string
  contract: string
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
}

export interface UnwrapActivity extends ActivityBase {
  type: 'Unwrap'
  account: string
  contract: string
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
}

export interface MintActivity extends ActivityBase {
  type: 'Mint'
  account: string
  contract: string
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
}

export interface RedeemActivity extends ActivityBase {
  type: 'Redeem'
  account: string
  contract: string
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
}

export interface VoteActivity extends ActivityBase {
  type: 'Vote'
  account: string
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
  | StakeActivity
  | UnstakeActivity
  | TransferActivity
  | SwapActivity
  | WrapActivity
  | UnwrapActivity
  | MintActivity
  | RedeemActivity
  | VoteActivity
