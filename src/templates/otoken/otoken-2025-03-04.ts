/**
 * @title OUSD Token Contract TypeScript Implementation
 * @dev TypeScript implementation of the OUSD contract
 * @dev Implements an elastic supply
 * @author Origin Protocol Inc
 */
import { Block, Context } from '@originprotocol/squid-utils'

import { isContract } from './utils/isContract'

/**
 * Enum for rebasing options
 */
export enum RebaseOptions {
  NotSet = 0,
  OptOut = 1,
  OptIn = 2,
  YieldDelegationSource = 3,
  YieldDelegationTarget = 4,
  StdNonRebasing = 5,
  StdRebasing = 6,
}

/**
 * OToken class representing the OUSD token contract
 */
export class OToken_2025_03_04 {
  public readonly address: string
  public ctx: Context
  public block: Block
  constructor(ctx: Context, block: Block, address: string) {
    this.address = address.toLowerCase()
    this.ctx = ctx
    this.block = block
  }

  // Constants
  private readonly MAX_SUPPLY: bigint = BigInt('340282366920938463463374607431768211455') // uint128 max
  private readonly RESOLUTION_INCREASE: bigint = BigInt('1000000000') // 1e9

  // State variables
  public totalSupply: bigint = 0n
  private allowances: Map<string, Map<string, bigint>> = new Map()
  public vaultAddress: string = ''
  public creditBalances: Map<string, bigint> = new Map()
  public rebasingCredits: bigint = 0n
  public rebasingCreditsPerToken: bigint = 0n
  public nonRebasingSupply: bigint = 0n
  public rebasingSupply: bigint = 0n
  public alternativeCreditsPerToken: Map<string, bigint> = new Map()
  public rebaseState: Map<string, RebaseOptions> = new Map()
  public yieldTo: Map<string, string> = new Map()
  public yieldFrom: Map<string, string> = new Map()
  public governor: string = ''

  /**
   * Initialize the contract
   * @param _vaultAddress Address of the vault contract
   * @param _initialCreditsPerToken The starting rebasing credits per token
   */
  initialize(governor: string, _vaultAddress: string, _initialCreditsPerToken: bigint): void {
    this.requireAddress(_vaultAddress, 'Zero vault address')
    if (this.vaultAddress !== '') {
      throw new Error('Already initialized')
    }

    this.governor = governor
    this.rebasingCreditsPerToken = _initialCreditsPerToken
    this.vaultAddress = _vaultAddress
  }

  /**
   * Modifier to check if caller is governor
   */
  private onlyGovernor(caller: string): void {
    if (caller !== this.governor) {
      throw new Error('Caller is not the Governor')
    }
  }

  private onlyVault(caller: string): void {
    if (caller !== this.vaultAddress) {
      throw new Error('Caller is not the Vault')
    }
  }

  /**
   * Returns the symbol of the token
   */
  symbol(): string {
    return 'OUSD'
  }

  /**
   * Returns the name of the token
   */
  name(): string {
    return 'Origin Dollar'
  }

  /**
   * Returns the number of decimals used for user representation
   */
  decimals(): number {
    return 18
  }

  /**
   * @return High resolution rebasingCreditsPerToken
   */
  rebasingCreditsPerTokenHighres(): bigint {
    return this.rebasingCreditsPerToken
  }

  /**
   * @return Low resolution rebasingCreditsPerToken
   */
  rebasingCreditsPerTokenLowRes(): bigint {
    return this.rebasingCreditsPerToken / this.RESOLUTION_INCREASE
  }

  /**
   * @return High resolution total number of rebasing credits
   */
  rebasingCreditsHighres(): bigint {
    return this.rebasingCredits
  }

  /**
   * @return Low resolution total number of rebasing credits
   */
  rebasingCreditsLowRes(): bigint {
    return this.rebasingCredits / this.RESOLUTION_INCREASE
  }

  /**
   * Gets the balance of the specified address
   * @param _account The address to query the balance of
   * @return The balance of the specified address
   */
  balanceOf(_account: string): bigint {
    const state = this.rebaseState.get(_account) || RebaseOptions.NotSet

    if (state === RebaseOptions.YieldDelegationSource) {
      // Saves a slot read when transferring to or from a yield delegating source
      // since we know creditBalances equals the balance.
      return this.creditBalances.get(_account) || 0n
    }

    const creditsPerToken = this._creditsPerToken(_account)
    const creditBalance = this.creditBalances.get(_account) || 0n
    const baseBalance = (creditBalance * 10n ** 18n) / creditsPerToken

    if (state === RebaseOptions.YieldDelegationTarget) {
      // creditBalances of yieldFrom accounts equals token balances
      const yieldFromAccount = this.yieldFrom.get(_account) || ''
      const yieldFromBalance = this.creditBalances.get(yieldFromAccount) || 0n
      return baseBalance - yieldFromBalance
    }

    return baseBalance
  }

  /**
   * Gets the credits balance of the specified address
   * @param _account The address to query the credits balance of
   * @return The credits balance and credits per token of the specified address
   */
  creditsBalanceOf(_account: string): [bigint, bigint] {
    const cpt = this._creditsPerToken(_account)
    return [this.creditBalances.get(_account) || 0n, cpt]
  }

  /**
   * Gets the credits balance of the specified address with high resolution
   * @param _account The address to query the credits balance of
   * @return The credits balance, credits per token of the specified address, and isUpgraded
   */
  creditsBalanceOfHighres(_account: string): [bigint, bigint, boolean] {
    return [
      this.creditBalances.get(_account) || 0n,
      this._creditsPerToken(_account),
      true, // All accounts are considered upgraded in this implementation
    ]
  }

  /**
   * Backwards compatible view
   */
  nonRebasingCreditsPerToken(_account: string): bigint {
    return this.alternativeCreditsPerToken.get(_account) || 0n
  }

  /**
   * Transfer tokens to a specified address
   * @param _to The address to transfer to
   * @param _value The amount to be transferred
   * @return true on success
   */
  async transfer(caller: string, _to: string, _value: bigint): Promise<boolean> {
    this.requireAddress(_to, 'Transfer to zero address')

    await this._executeTransfer(caller, _to, _value)

    // Emit event (would be handled by event system in actual implementation)
    // emit Transfer(caller, _to, _value)

    return true
  }

  /**
   * Transfer tokens from one address to another
   * @param _from The address to transfer from
   * @param _to The address to transfer to
   * @param _value The amount to be transferred
   * @return true on success
   */
  async transferFrom(caller: string, _from: string, _to: string, _value: bigint): Promise<boolean> {
    this.requireAddress(_to, 'Transfer to zero address')

    const userAllowance = this.allowances.get(_from)?.get(caller) || 0n
    if (_value > userAllowance) {
      debugger
      throw new Error('Allowance exceeded')
    }

    // Update allowance
    const fromAllowances = this.allowances.get(_from) || new Map<string, bigint>()
    fromAllowances.set(caller, userAllowance - _value)
    this.allowances.set(_from, fromAllowances)

    await this._executeTransfer(_from, _to, _value)

    // Emit event (would be handled by event system in actual implementation)
    // emit Transfer(_from, _to, _value)

    return true
  }

  /**
   * Execute transfer between addresses
   * @param _from The address to transfer from
   * @param _to The address to transfer to
   * @param _value The amount to be transferred
   */
  private async _executeTransfer(_from: string, _to: string, _value: bigint): Promise<void> {
    const result = await Promise.all([
      this._adjustAccount(_from, -BigInt(_value)),
      this._adjustAccount(_to, BigInt(_value)),
    ])
    const [fromRebasingCreditsDiff, fromNonRebasingSupplyDiff] = result[0]
    const [toRebasingCreditsDiff, toNonRebasingSupplyDiff] = result[1]

    this._adjustGlobals(
      fromRebasingCreditsDiff + toRebasingCreditsDiff,
      fromNonRebasingSupplyDiff + toNonRebasingSupplyDiff,
    )
  }

  /**
   * Adjust account balances and return changes to rebasing credits and non-rebasing supply
   * @param _account The account to adjust
   * @param _balanceChange The change in balance
   * @return Changes to rebasing credits and non-rebasing supply
   */
  private async _adjustAccount(_account: string, _balanceChange: bigint): Promise<[bigint, bigint]> {
    const state = this.rebaseState.get(_account) || RebaseOptions.NotSet
    const currentBalance = this.balanceOf(_account)

    let newBalance = currentBalance + _balanceChange
    if (newBalance < 0n) {
      if (newBalance < -10n) {
        debugger
        throw new Error(`Transfer amount exceeds balance: ${newBalance} for account: ${_account}`)
      }
    }

    let rebasingCreditsDiff = 0n
    let nonRebasingSupplyDiff = 0n

    if (state === RebaseOptions.YieldDelegationSource) {
      const target = this.yieldTo.get(_account) || ''
      const targetOldBalance = this.balanceOf(target)
      const targetNewCredits = this._balanceToRebasingCredits(targetOldBalance + newBalance)

      rebasingCreditsDiff = targetNewCredits - (this.creditBalances.get(target) || 0n)

      this.creditBalances.set(_account, newBalance)
      this.creditBalances.set(target, targetNewCredits)
    } else if (state === RebaseOptions.YieldDelegationTarget) {
      const source = this.yieldFrom.get(_account) || ''
      const newCredits = this._balanceToRebasingCredits(newBalance + (this.creditBalances.get(source) || 0n))

      rebasingCreditsDiff = newCredits - (this.creditBalances.get(_account) || 0n)
      this.creditBalances.set(_account, newCredits)
    } else {
      await this._autoMigrate(_account)
      const alternativeCreditsPerTokenMem = this.alternativeCreditsPerToken.get(_account) || 0n

      if (alternativeCreditsPerTokenMem > 0n) {
        nonRebasingSupplyDiff = _balanceChange
        if (alternativeCreditsPerTokenMem !== 10n ** 18n) {
          this.alternativeCreditsPerToken.set(_account, 10n ** 18n)
        }
        this.creditBalances.set(_account, newBalance)
      } else {
        const newCredits = this._balanceToRebasingCredits(newBalance)
        rebasingCreditsDiff = newCredits - (this.creditBalances.get(_account) || 0n)
        this.creditBalances.set(_account, newCredits)
      }
    }

    return [rebasingCreditsDiff, nonRebasingSupplyDiff]
  }

  /**
   * Adjust global values for rebasing credits and non-rebasing supply
   * @param _rebasingCreditsDiff Change in rebasing credits
   * @param _nonRebasingSupplyDiff Change in non-rebasing supply
   */
  private _adjustGlobals(_rebasingCreditsDiff: bigint, _nonRebasingSupplyDiff: bigint): void {
    if (_rebasingCreditsDiff !== 0n) {
      this.rebasingCredits = this.rebasingCredits + _rebasingCreditsDiff
    }

    if (_nonRebasingSupplyDiff !== 0n) {
      this.nonRebasingSupply = this.nonRebasingSupply + _nonRebasingSupplyDiff
    }
  }

  /**
   * Returns the amount of tokens that an owner allowed to a spender
   * @param _owner The address which owns the funds
   * @param _spender The address which will spend the funds
   * @return The amount of tokens still available for the spender
   */
  allowance(_owner: string, _spender: string): bigint {
    return this.allowances.get(_owner)?.get(_spender) || 0n
  }

  /**
   * Approve the passed address to spend the specified amount of tokens on behalf of msg.sender
   * @param caller The address which is approving
   * @param _spender The address which will spend the funds
   * @param _value The amount of tokens to be spent
   * @return true on success
   */
  approve(caller: string, _spender: string, _value: bigint): boolean {
    const callerAllowances = this.allowances.get(caller) || new Map<string, bigint>()
    callerAllowances.set(_spender, _value)
    this.allowances.set(caller, callerAllowances)

    // Emit event (would be handled by event system in actual implementation)
    // emit Approval(caller, _spender, _value)

    return true
  }

  /**
   * Mint new tokens for the account
   * @param caller The address which is calling this function
   * @param _account The address that will receive the minted tokens
   * @param _amount The amount of tokens to mint
   */
  async mint(caller: string, _account: string, _amount: bigint): Promise<void> {
    this.onlyVault(caller)
    this.requireAddress(_account, 'Mint to the zero address')

    // Account
    const [toRebasingCreditsDiff, toNonRebasingSupplyDiff] = await this._adjustAccount(_account, _amount)

    // Globals
    this._adjustGlobals(toRebasingCreditsDiff, toNonRebasingSupplyDiff)
    this.totalSupply = this.totalSupply + _amount

    if (this.totalSupply >= this.MAX_SUPPLY) {
      throw new Error('Max supply')
    }

    // Emit event (would be handled by event system in actual implementation)
    // emit Transfer(ADDRESS_ZERO, _account, _amount)
  }

  /**
   * Burn tokens from the account
   * @param caller The address which is calling this function
   * @param _account The address that will have tokens burned
   * @param _amount The amount of tokens to burn
   */
  async burn(caller: string, _account: string, _amount: bigint): Promise<void> {
    this.onlyVault(caller)
    this.requireAddress(_account, 'Burn from the zero address')

    if (_amount === 0n) {
      return
    }

    // Account
    const [toRebasingCreditsDiff, toNonRebasingSupplyDiff] = await this._adjustAccount(_account, -_amount)

    // Globals
    this._adjustGlobals(toRebasingCreditsDiff, toNonRebasingSupplyDiff)
    this.totalSupply = this.totalSupply - _amount

    // Emit event (would be handled by event system in actual implementation)
    // emit Transfer(_account, ADDRESS_ZERO, _amount)
  }

  /**
   * Get the credits per token for an account
   * @param _account Address of the account
   * @return Credits per token
   */
  public _creditsPerToken(_account: string): bigint {
    const alternativeCreditsPerTokenMem = this.alternativeCreditsPerToken.get(_account) || 0n

    if (alternativeCreditsPerTokenMem !== 0n) {
      return alternativeCreditsPerTokenMem
    } else {
      return this.rebasingCreditsPerToken
    }
  }

  /**
   * Auto migrate an account to the appropriate rebasing state
   * @param _account Address of the account
   */
  private async _autoMigrate(_account: string): Promise<void> {
    // In previous code versions, contracts would not have had their
    // rebaseState[_account] set to RebaseOptions.NonRebasing when migrated
    // therefore we check the actual accounting used on the account instead.
    if (
      (await isContract(this.ctx, _account)) &&
      (this.rebaseState.get(_account) || RebaseOptions.NotSet) === RebaseOptions.NotSet &&
      (this.alternativeCreditsPerToken.get(_account) || 0n) === 0n
    ) {
      this._rebaseOptOut(_account)
    }
  }

  /**
   * Convert balance to rebasing credits
   * @param _balance Balance of the account
   * @return Rebasing credits
   */
  private _balanceToRebasingCredits(_balance: bigint): bigint {
    // Rounds up, because we need to ensure that accounts always have
    // at least the balance that they should have.
    if (_balance === 0n) return 0n

    return (_balance * this.rebasingCreditsPerToken + 10n ** 18n - 1n) / 10n ** 18n
  }

  /**
   * Governance controlled opt in to rebasing for an account
   * @param caller The address which is calling this function
   * @param _account Address of the account
   */
  governanceRebaseOptIn(caller: string, _account: string): void {
    this.onlyGovernor(caller)
    this.requireAddress(_account, 'Zero address not allowed')
    this._rebaseOptIn(_account)
  }

  /**
   * Opt in to rebasing
   * @param caller The address which is calling this function
   */
  rebaseOptIn(caller: string): void {
    this._rebaseOptIn(caller)
  }

  /**
   * Internal implementation of opt in to rebasing
   * @param _account Address of the account
   */
  private _rebaseOptIn(_account: string): void {
    const balance = this.balanceOf(_account)
    const alternativeCreditsPerTokenMem = this.alternativeCreditsPerToken.get(_account) || 0n
    const creditBalanceMem = this.creditBalances.get(_account) || 0n

    if (!(alternativeCreditsPerTokenMem > 0n || creditBalanceMem === 0n)) {
      throw new Error('Account must be non-rebasing')
    }

    const state = this.rebaseState.get(_account) || RebaseOptions.NotSet

    if (!(state === RebaseOptions.StdNonRebasing || state === RebaseOptions.NotSet)) {
      throw new Error('Only standard non-rebasing accounts can opt in')
    }

    const newCredits = this._balanceToRebasingCredits(balance)

    // Account
    this.rebaseState.set(_account, RebaseOptions.StdRebasing)
    this.alternativeCreditsPerToken.set(_account, 0n)
    this.creditBalances.set(_account, newCredits)

    // Globals
    this._adjustGlobals(newCredits, -balance)

    // Emit event (would be handled by event system in actual implementation)
    // emit AccountRebasingEnabled(_account)
  }

  /**
   * Opt out of rebasing
   * @param caller The address which is calling this function
   */
  rebaseOptOut(caller: string): void {
    this._rebaseOptOut(caller)
  }

  /**
   * Internal implementation of opt out of rebasing
   * @param _account Address of the account
   */
  private _rebaseOptOut(_account: string): void {
    if ((this.alternativeCreditsPerToken.get(_account) || 0n) !== 0n) {
      this.ctx.log.error('Account must be rebasing')
    }

    const state = this.rebaseState.get(_account) || RebaseOptions.NotSet

    if (!(state === RebaseOptions.StdRebasing || state === RebaseOptions.NotSet)) {
      this.ctx.log.error('Only standard rebasing accounts can opt out')
    }

    const oldCredits = this.creditBalances.get(_account) || 0n
    const balance = this.balanceOf(_account)

    // Account
    this.rebaseState.set(_account, RebaseOptions.StdNonRebasing)
    this.alternativeCreditsPerToken.set(_account, 10n ** 18n)
    this.creditBalances.set(_account, balance)

    // Globals
    this._adjustGlobals(-oldCredits, balance)

    // Emit event (would be handled by event system in actual implementation)
    // emit AccountRebasingDisabled(_account)
  }

  /**
   * Change the supply of OUSD by altering the rebasingCreditsPerToken
   * @param caller The address which is calling this function
   * @param _newTotalSupply New total supply of OUSD
   */
  changeSupply(caller: string, _newTotalSupply: bigint): void {
    this.onlyVault(caller)

    if (this.totalSupply === 0n) {
      throw new Error('Cannot increase 0 supply')
    }

    if (this.totalSupply === _newTotalSupply) {
      // Emit event (would be handled by event system in actual implementation)
      // emit TotalSupplyUpdatedHighres(this.totalSupply, this.rebasingCredits, this.rebasingCreditsPerToken)
      return
    }

    this.totalSupply = _newTotalSupply > this.MAX_SUPPLY ? this.MAX_SUPPLY : _newTotalSupply

    const rebasingSupply = this.totalSupply - this.nonRebasingSupply
    // round up in the favour of the protocol

    if (this.block.header.timestamp < Date.parse('2025-01-08T00:00:00Z')) {
      this.rebasingCreditsPerToken = (this.rebasingCredits * 10n ** 18n) / rebasingSupply
      // Validate total supply calculation
      this.totalSupply = (this.rebasingCredits * 10n ** 18n) / this.rebasingCreditsPerToken + this.nonRebasingSupply
    } else {
      this.rebasingCreditsPerToken = (this.rebasingCredits * 10n ** 18n + rebasingSupply - 1n) / rebasingSupply
    }

    if (this.rebasingCreditsPerToken === 0n) {
      throw new Error('Invalid change in supply')
    }

    // Emit event (would be handled by event system in actual implementation)
    // emit TotalSupplyUpdatedHighres(this.totalSupply, this.rebasingCredits, this.rebasingCreditsPerToken)
  }

  /**
   * Delegate yield from one account to another
   * @param caller The address which is calling this function
   * @param _from The address to delegate yield from
   * @param _to The address to delegate yield to
   */
  delegateYield(caller: string, _from: string, _to: string): void {
    this.onlyGovernor(caller)
    this.requireAddress(_from, 'Zero from address not allowed')
    this.requireAddress(_to, 'Zero to address not allowed')

    if (_from === _to) {
      throw new Error('Cannot delegate to self')
    }

    if (
      this.yieldFrom.get(_to) !== undefined ||
      this.yieldTo.get(_to) !== undefined ||
      this.yieldFrom.get(_from) !== undefined ||
      this.yieldTo.get(_from) !== undefined
    ) {
      throw new Error('Blocked by existing yield delegation')
    }

    const stateFrom = this.rebaseState.get(_from) || RebaseOptions.NotSet
    const stateTo = this.rebaseState.get(_to) || RebaseOptions.NotSet

    if (
      !(
        stateFrom === RebaseOptions.NotSet ||
        stateFrom === RebaseOptions.StdNonRebasing ||
        stateFrom === RebaseOptions.StdRebasing
      )
    ) {
      throw new Error('Invalid rebaseState from')
    }

    if (
      !(
        stateTo === RebaseOptions.NotSet ||
        stateTo === RebaseOptions.StdNonRebasing ||
        stateTo === RebaseOptions.StdRebasing
      )
    ) {
      throw new Error('Invalid rebaseState to')
    }

    if ((this.alternativeCreditsPerToken.get(_from) || 0n) === 0n) {
      this._rebaseOptOut(_from)
    }

    if ((this.alternativeCreditsPerToken.get(_to) || 0n) > 0n) {
      this._rebaseOptIn(_to)
    }

    const fromBalance = this.balanceOf(_from)
    const toBalance = this.balanceOf(_to)
    const oldToCredits = this.creditBalances.get(_to) || 0n
    const newToCredits = this._balanceToRebasingCredits(fromBalance + toBalance)

    // Set up the bidirectional links
    this.yieldTo.set(_from, _to)
    this.yieldFrom.set(_to, _from)

    // Local
    this.rebaseState.set(_from, RebaseOptions.YieldDelegationSource)
    this.alternativeCreditsPerToken.set(_from, 10n ** 18n)
    this.creditBalances.set(_from, fromBalance)
    this.rebaseState.set(_to, RebaseOptions.YieldDelegationTarget)
    this.creditBalances.set(_to, newToCredits)

    // Global
    const creditsChange = newToCredits - oldToCredits
    this._adjustGlobals(creditsChange, -fromBalance)

    // Emit event (would be handled by event system in actual implementation)
    // emit YieldDelegated(_from, _to)
  }

  /**
   * Stop sending the yield from one account to another account
   * @param caller The address which is calling this function
   * @param _from The address to stop delegating yield from
   */
  undelegateYield(caller: string, _from: string): void {
    this.onlyGovernor(caller)

    // Require a delegation, which will also ensure a valid delegation
    if (this.yieldTo.get(_from) === undefined) {
      throw new Error('Zero address not allowed')
    }

    const to = this.yieldTo.get(_from) || ''
    const fromBalance = this.balanceOf(_from)
    const toBalance = this.balanceOf(to)
    const oldToCredits = this.creditBalances.get(to) || 0n
    const newToCredits = this._balanceToRebasingCredits(toBalance)

    // Remove the bidirectional links
    this.yieldFrom.delete(to)
    this.yieldTo.delete(_from)

    // Local
    this.rebaseState.set(_from, RebaseOptions.StdNonRebasing)
    // alternativeCreditsPerToken[from] already 1e18 from `delegateYield()`
    this.creditBalances.set(_from, fromBalance)
    this.rebaseState.set(to, RebaseOptions.StdRebasing)
    // alternativeCreditsPerToken[to] already 0 from `delegateYield()`
    this.creditBalances.set(to, newToCredits)

    // Global
    const creditsChange = newToCredits - oldToCredits
    this._adjustGlobals(creditsChange, fromBalance)

    // Emit event (would be handled by event system in actual implementation)
    // emit YieldUndelegated(_from, to)
  }

  /**
   * Helper method to require a non-zero address
   * @param _address Address to check
   * @param _message Error message
   */
  private requireAddress(_address: string, _message: string): void {
    if (_address === '' || _address === '0x0000000000000000000000000000000000000000') {
      throw new Error(_message)
    }
  }
}
