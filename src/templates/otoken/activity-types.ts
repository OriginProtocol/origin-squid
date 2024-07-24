export type ActivityStatus = 'idle' | 'pending' | 'signed' | 'success' | 'error'
export type Exchange = 'Curve' | 'Balancer' | '1inch' | 'other' | 'UniswapV2' | 'UniswapV3' | 'Kyber Swap'

export interface ActivityBase {
  id: string
  blockNumber: number
  timestamp: number
  status: ActivityStatus
  txHash: string
  chainId: number
  processor: string
}

export interface ApprovalActivity extends ActivityBase {
  type: 'Approval'
  owner: string
  spender: string
  token: string
  value: string
}

export interface BridgeActivity extends ActivityBase {
  type: 'Bridge'
  txHashIn: string
  txHashOut: string | undefined | null
  messageId: string
  bridge: string
  transactor: string
  sender: string
  receiver: string
  chainIn: number
  chainOut: number
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
  /**
   * 0 = untouched
   * 1 = processing
   * 2 = complete
   * 3 = failed
   */
  state: number
}

// TODO
export interface ClaimRewardsActivity extends ActivityBase {
  type: 'ClaimRewards'
  account: string
  tokenIn: string
  amountIn: string
}

// TODO
export interface DelegateVoteActivity extends ActivityBase {
  type: 'DelegateVote'
  account: string
  tokenIn: string
  votingPower: string
  delegateTo: string
}

// TODO
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

// TODO
export interface StakeActivity extends ActivityBase {
  type: 'Stake'
  account: string
  tokenIn: string
  amountIn: string
  monthDuration: number
}

// TODO
export interface UnstakeActivity extends ActivityBase {
  type: 'Unstake'
  account: string
  tokenIn: string
  tokenOut: string
  lockupId: string
}

// TODO
export interface ExtendStakeActivity extends ActivityBase {
  type: 'ExtendStake'
  account: string
  amountIn: string
  tokenIn: string
  monthDuration: number
  lockupId: string
}

export interface SwapActivity extends ActivityBase {
  type: 'Swap'
  account: string
  exchange: Exchange
  contract: string
  tokensIn: { token: string; amount: string }[]
  tokensOut: { token: string; amount: string }[]
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

export interface ZapActivity extends ActivityBase {
  type: 'Zap'
  account: string
  contract: string
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
}

// TODO
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
  | ZapActivity
  | VoteActivity
