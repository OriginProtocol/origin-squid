import { Block, Context } from '@originprotocol/squid-utils'
import { isContract } from '@utils/isContract'

import { OToken_2021_01_08 } from './otoken-2021-01-08'

enum RebaseOptions {
  NotSet,
  StdNonRebasing = 1,
  StdRebasing = 2,
}

export class OToken_2021_01_25 {
  public readonly MAX_SUPPLY: bigint = BigInt('0xffffffffffffffffffffffffffffffff')
  public totalSupply: bigint = 0n
  public allowances: Record<string, Record<string, bigint>> = {}
  public vaultAddress = '0x0000000000000000000000000000000000000000'
  public creditBalances: Record<string, bigint> = {}
  public rebasingCredits: bigint = 0n
  public rebasingCreditsPerToken: bigint = 10n ** 18n
  public nonRebasingSupply: bigint = 0n
  public nonRebasingCreditsPerToken: Record<string, bigint> = {}
  public rebaseState: Record<string, RebaseOptions> = {}

  public get rebasingSupply(): bigint {
    return this.totalSupply - this.nonRebasingSupply
  }

  public rebasingCreditsPerTokenHighres(): bigint {
    return this.rebasingCreditsPerToken * 10n ** 9n // res up to 27 decimals
  }

  public rebasingCreditsHighres(): bigint {
    return this.rebasingCredits * 10n ** 9n // res up to 27 decimals
  }

  public ctx: Context
  public block: Block
  public address: string

  constructor(ctx: Context, block: Block, address: string) {
    this.ctx = ctx
    this.block = block
    this.address = address
  }

  public initialize(governor: string, _vaultAddress: string, _initialCreditsPerToken: bigint): void {
    this.rebasingCreditsPerToken = _initialCreditsPerToken
    this.vaultAddress = _vaultAddress
  }

  public copyState(other: OToken_2021_01_08): void {
    this.totalSupply = other.totalSupply
    this.allowances = other.allowances
    this.vaultAddress = other.vaultAddress
    this.creditBalances = other.creditBalances
    this.rebasingCredits = other.rebasingCredits
    this.rebasingCreditsPerToken = other.rebasingCreditsPerToken
    this.nonRebasingSupply = other.nonRebasingSupply
    this.nonRebasingCreditsPerToken = other.nonRebasingCreditsPerToken
    this.rebaseState = other.rebaseState
  }

  /**
   * @dev Verifies that the caller is the Savings Manager contract
   */
  private onlyVault(_caller: string): void {
    // if (caller !== this.vaultAddress) {
    //   throw new Error('Caller is not the Vault')
    // }
  }

  /**
   * @dev Gets the balance of the specified address.
   * @param account Address to query the balance of.
   * @return A bigint representing the amount of base units owned by the
   *         specified address.
   */
  balanceOf(account: string): bigint {
    const creditBalance = this.creditBalances[account]
    if (!creditBalance || creditBalance === 0n) return 0n
    return (creditBalance * 10n ** 18n) / this._creditsPerToken(account)
  }

  /**
   * @dev Gets the credits balance of the specified address.
   * @param account The address to query the balance of.
   * @return [bigint, bigint] Credit balance and credits per token of the
   *         address
   */
  creditsBalanceOf(account: string): [bigint, bigint] {
    return [this.creditBalances[account] || 0n, this._creditsPerToken(account)]
  }

  /**
   * @dev Transfer tokens to a specified address.
   * @param to the address to transfer to.
   * @param value the amount to be transferred.
   * @return true on success.
   */
  async transfer(from: string, to: string, value: bigint): Promise<boolean> {
    if (to === '0x0000000000000000000000000000000000000000') {
      throw new Error('Transfer to zero address')
    }
    if (value > this.balanceOf(from)) {
      throw new Error('Transfer greater than balance')
    }

    await this._executeTransfer(from, to, value)

    // emit Transfer(msg.sender, _to, _value);

    return true
  }

  /**
   * @dev Transfer tokens from one address to another.
   * @param from The address you want to send tokens from.
   * @param to The address you want to transfer to.
   * @param value The amount of tokens to be transferred.
   */
  async transferFrom(spender: string, from: string, to: string, value: bigint): Promise<boolean> {
    if (to === '0x0000000000000000000000000000000000000000') {
      throw new Error('Transfer to zero address')
    }
    if (value > this.balanceOf(from)) {
      throw new Error('Transfer greater than balance')
    }

    const fromAllowances = this.allowances[from] || {}
    const currentAllowance = fromAllowances[spender] || 0n
    fromAllowances[spender] = currentAllowance - value
    this.allowances[from] = fromAllowances

    await this._executeTransfer(from, to, value)
    return true
  }

  /**
   * @dev Update the count of non rebasing credits in response to a transfer
   * @param from The address you want to send tokens from.
   * @param to The address you want to transfer to.
   * @param value Amount of OUSD to transfer
   */
  private async _executeTransfer(from: string, to: string, value: bigint): Promise<void> {
    const isNonRebasingTo = await this._isNonRebasingAccount(to)
    const isNonRebasingFrom = await this._isNonRebasingAccount(from)

    const creditsCredited = (value * this._creditsPerToken(to)) / 10n ** 18n
    const creditsDeducted = (value * this._creditsPerToken(from)) / 10n ** 18n

    const fromBalance = this.creditBalances[from] || 0n
    if (fromBalance < creditsDeducted) {
      throw new Error('Transfer amount exceeds balance')
    }
    this.creditBalances[from] = fromBalance - creditsDeducted

    const toBalance = this.creditBalances[to] || 0n
    this.creditBalances[to] = toBalance + creditsCredited

    if (isNonRebasingTo && !isNonRebasingFrom) {
      this.nonRebasingSupply = this.nonRebasingSupply + value
      this.rebasingCredits = this.rebasingCredits - creditsDeducted
    } else if (!isNonRebasingTo && isNonRebasingFrom) {
      this.nonRebasingSupply = this.nonRebasingSupply - value
      this.rebasingCredits = this.rebasingCredits + creditsCredited
    }
  }

  /**
   * @dev Function to check the amount of tokens that an owner has allowed to a spender.
   * @param owner The address which owns the funds.
   * @param spender The address which will spend the funds.
   * @return The number of tokens still available for the spender.
   */
  allowance(owner: string, spender: string): bigint {
    const ownerAllowances = this.allowances[owner]
    if (!ownerAllowances) return 0n
    return ownerAllowances[spender] || 0n
  }

  /**
   * @dev Approve the passed address to spend the specified amount of tokens on behalf of
   * msg.sender.
   * @param spender The address which will spend the funds.
   * @param value The amount of tokens to be spent.
   */
  approve(caller: string, _spender: string, _value: bigint): boolean {
    const callerAllowances = this.allowances[caller] || {}
    callerAllowances[_spender] = _value
    this.allowances[caller] = callerAllowances

    // Emit event (would be handled by event system in actual implementation)
    // emit Approval(caller, _spender, _value)

    return true
  }

  /**
   * @dev Increase the amount of tokens that an owner has allowed to
   *      `_spender`.
   *      This method should be used instead of approve() to avoid the double
   *      approval vulnerability described above.
   * @param _spender The address which will spend the funds.
   * @param _addedValue The amount of tokens to increase the allowance by.
   */
  public increaseAllowance(caller: string, _spender: string, _addedValue: bigint): boolean {
    const newAllowance = this.allowance(caller, _spender) + _addedValue
    this.approve(caller, _spender, newAllowance)
    // this.emitApproval(caller, _spender, newAllowance)
    return true
  }

  /**
   * @dev Decrease the amount of tokens that an owner has allowed to
   *      `_spender`.
   * @param _spender The address which will spend the funds.
   * @param _subtractedValue The amount of tokens to decrease the allowance
   *        by.
   */
  public decreaseAllowance(caller: string, _spender: string, _subtractedValue: bigint): boolean {
    const oldValue = this.allowance(caller, _spender)
    let newAllowance: bigint

    if (_subtractedValue >= oldValue) {
      newAllowance = 0n
    } else {
      newAllowance = oldValue - _subtractedValue
    }

    this.approve(caller, _spender, newAllowance)
    // this.emitApproval(caller, _spender, newAllowance)
    return true
  }

  /**
   * @dev Mints new tokens, increasing totalSupply.
   */
  async mint(caller: string, account: string, amount: bigint): Promise<void> {
    this.onlyVault(caller)
    await this._mint(account, amount)
  }

  /**
   * @dev Creates amount tokens and assigns them to account, increasing
   * the total supply.
   */
  private async _mint(account: string, amount: bigint): Promise<void> {
    if (account === '0x0000000000000000000000000000000000000000') {
      throw new Error('Mint to the zero address')
    }

    const isNonRebasingAccount = await this._isNonRebasingAccount(account)
    const creditAmount = (amount * this._creditsPerToken(account)) / 10n ** 18n

    const currentBalance = this.creditBalances[account] || 0n
    this.creditBalances[account] = currentBalance + creditAmount

    if (isNonRebasingAccount) {
      this.nonRebasingSupply = this.nonRebasingSupply + amount
    } else {
      this.rebasingCredits = this.rebasingCredits + creditAmount
    }

    this.totalSupply = this.totalSupply + amount

    if (this.totalSupply >= this.MAX_SUPPLY) {
      throw new Error('Max supply')
    }
  }

  /**
   * @dev Burns tokens, decreasing totalSupply.
   */
  async burn(caller: string, account: string, amount: bigint): Promise<void> {
    this.onlyVault(caller)
    await this._burn(account, amount)
  }

  /**
   * @dev Destroys amount tokens from account, reducing the total supply.
   */
  private async _burn(account: string, amount: bigint): Promise<void> {
    if (account === '0x0000000000000000000000000000000000000000') {
      throw new Error('Burn from the zero address')
    }
    if (amount === 0n) {
      return
    }

    const isNonRebasingAccount = await this._isNonRebasingAccount(account)
    const creditAmount = (amount * this._creditsPerToken(account)) / 10n ** 18n
    const currentCredits = this.creditBalances[account] || 0n

    if (currentCredits === creditAmount || currentCredits - 1n === creditAmount) {
      this.creditBalances[account] = 0n
    } else if (currentCredits > creditAmount) {
      this.creditBalances[account] = currentCredits - creditAmount
    } else {
      throw new Error('Remove exceeds balance')
    }

    if (isNonRebasingAccount) {
      this.nonRebasingSupply = this.nonRebasingSupply - amount
    } else {
      this.rebasingCredits = this.rebasingCredits - creditAmount
    }

    this.totalSupply = this.totalSupply - amount
  }

  /**
   * @dev Get the credits per token for an account. Returns a fixed amount
   *      if the account is non-rebasing.
   * @param account Address of the account.
   */
  private _creditsPerToken(account: string): bigint {
    const nonRebasingCredits = this.nonRebasingCreditsPerToken[account]
    if (nonRebasingCredits && nonRebasingCredits !== 0n) {
      return nonRebasingCredits
    }
    return this.rebasingCreditsPerToken
  }

  /**
   * @dev Is an accounts balance non rebasing, i.e. does not alter with rebases
   * @param account Address of the account.
   */
  private async _isNonRebasingAccount(account: string): Promise<boolean> {
    const accountRebaseState = this.rebaseState[account]
    if (accountRebaseState == RebaseOptions.StdRebasing) {
      // The address has chosen to be rebasing.
      return false
    } else if (accountRebaseState == RebaseOptions.StdNonRebasing) {
      // The address has chosen to be non-rebasing.
      return true
    } else {
      // The address has not chosen explicitly, so use the default
      // for its type.
      if (await isContract(this.ctx, this.block, account)) {
        // Contracts default to be non-rebasing.

        // Migrate if needed, making sure the rebasing/non-rebasing
        // supply is updated and fixed credits per token is set
        // for this account.
        this._ensureRebasingMigration(account)
        return true
      } else {
        // User accounts default to be rebasing.

        // Disallow contracts from interacting with OUSD if the following
        // sequence has occurred: The contract has self-destructed, been
        // recreated at the same address with CREATE2, and then is interacting
        // with OUSD again from the contract's constructor.
        if ((this.nonRebasingCreditsPerToken[account] ?? 0n) !== 0n) {
          throw new Error('Previous Contract')
        }
        return false
      }
    }
  }

  /**
   * @dev Ensures internal account for rebasing and non-rebasing credits and
   *      supply is updated following deployment of frozen yield change.
   */
  private _ensureRebasingMigration(account: string): void {
    const nonRebasingCredits = this.nonRebasingCreditsPerToken[account]
    if (!nonRebasingCredits || nonRebasingCredits === 0n) {
      this.nonRebasingCreditsPerToken[account] = this.rebasingCreditsPerToken
      this.nonRebasingSupply = this.nonRebasingSupply + this.balanceOf(account)
      const currentBalance = this.creditBalances[account] || 0n
      this.rebasingCredits = this.rebasingCredits - currentBalance
    }
  }

  /**
   * @dev Add a contract address to the non rebasing exception list.
   */
  async rebaseOptIn(account: string): Promise<void> {
    if (!(await this._isNonRebasingAccount(account))) {
      throw new Error('Account has not opted out')
    }

    const currentBalance = this.creditBalances[account] || 0n
    const newCreditBalance = (currentBalance * this.rebasingCreditsPerToken) / this._creditsPerToken(account)

    this.nonRebasingSupply = this.nonRebasingSupply - this.balanceOf(account)
    this.creditBalances[account] = newCreditBalance
    this.rebasingCredits = this.rebasingCredits + newCreditBalance
    this.rebaseState[account] = RebaseOptions.StdRebasing
    delete this.nonRebasingCreditsPerToken[account]
  }

  /**
   * @dev Remove a contract address to the non rebasing exception list.
   */
  async rebaseOptOut(account: string): Promise<void> {
    if (await this._isNonRebasingAccount(account)) {
      throw new Error('Account has not opted in')
    }

    this.nonRebasingSupply = this.nonRebasingSupply + this.balanceOf(account)
    this.nonRebasingCreditsPerToken[account] = this.rebasingCreditsPerToken
    const currentBalance = this.creditBalances[account] || 0n
    this.rebasingCredits = this.rebasingCredits - currentBalance
    this.rebaseState[account] = RebaseOptions.StdNonRebasing
  }

  /**
   * @dev Modify the supply without minting new tokens.
   * @param newTotalSupply New total supply of OUSD.
   */
  changeSupply(caller: string, newTotalSupply: bigint): void {
    this.onlyVault(caller)
    if (this.totalSupply === 0n) {
      throw new Error('Cannot increase 0 supply')
    }

    if (this.totalSupply === newTotalSupply) {
      return
    }

    this.totalSupply = newTotalSupply > this.MAX_SUPPLY ? this.MAX_SUPPLY : newTotalSupply

    this.rebasingCreditsPerToken = (this.rebasingCredits * 10n ** 18n) / (this.totalSupply - this.nonRebasingSupply)

    if (this.rebasingCreditsPerToken === 0n) {
      throw new Error('Invalid change in supply')
    }

    this.totalSupply = (this.rebasingCredits * 10n ** 18n) / this.rebasingCreditsPerToken + this.nonRebasingSupply
  }

  /* compat for object fit */

  public async governanceRebaseOptIn(_caller: string, _account: string): Promise<void> {
    return
  }
}
