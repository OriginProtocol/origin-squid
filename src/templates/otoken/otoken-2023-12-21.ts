import { Block, Context } from '@originprotocol/squid-utils'

import { SafeMath } from './utils/SafeMath'
import { isContract } from './utils/isContract'

/**
 * @title OUSD Token Contract
 * @dev TypeScript implementation of OUSD token with elastic supply
 * @author Origin Protocol Inc
 */

enum RebaseOptions {
  NotSet,
  OptOut,
  OptIn,
}

export class OToken_2023_12_21 {
  public readonly MAX_SUPPLY = BigInt('340282366920938463463374607431768211455') // (2^128) - 1
  public _totalSupply: bigint = 0n
  public _allowances: Map<string, Map<string, bigint>> = new Map()
  public vaultAddress: string = '0x0000000000000000000000000000000000000000'
  public creditBalances: Map<string, bigint> = new Map()
  public rebasingCredits: bigint = 0n
  public rebasingCreditsPerToken: bigint = 0n
  public nonRebasingSupply: bigint = 0n
  public nonRebasingCreditsPerToken: Map<string, bigint> = new Map()
  public rebaseState: Map<string, RebaseOptions> = new Map()
  public isUpgraded: Map<string, bigint> = new Map()
  public readonly RESOLUTION_INCREASE: bigint = BigInt(1e9)

  public governor: string = ''
  public ctx: Context
  public block: Block
  public address: string

  constructor(ctx: Context, block: Block, address: string) {
    this.ctx = ctx
    this.block = block
    this.address = address
  }

  /**
   * @dev Initialize the contract with initial parameters
   */
  public initialize(governor: string, vaultAddress: string, initialCreditsPerToken: bigint): void {
    if (this.vaultAddress !== '0x0000000000000000000000000000000000000000') {
      throw new Error('Already initialized')
    }
    this.governor = governor
    this.rebasingCreditsPerToken = initialCreditsPerToken
    this.vaultAddress = vaultAddress
  }

  private onlyVault(caller: string): void {
    if (caller !== this.vaultAddress) {
      throw new Error('Caller is not the Vault')
    }
  }

  private onlyGovernor(caller: string): void {
    if (caller !== this.governor) {
      throw new Error('Caller is not the Governor')
    }
  }

  /**
   * @dev Get the total supply of OUSD
   */
  public totalSupply(): bigint {
    return this._totalSupply
  }

  /**
   * @dev Get the balance of a specific account
   */
  public balanceOf(account: string): bigint {
    const credits = this.creditBalances.get(account) || 0n
    if (credits === 0n) return 0n
    return SafeMath.divPrecisely(credits, this._creditsPerToken(account))
  }

  /**
   * @dev Transfer tokens to another address
   */
  public async transfer(caller: string, to: string, value: bigint): Promise<boolean> {
    if (to === '0x0000000000000000000000000000000000000000') {
      throw new Error('Transfer to zero address')
    }
    const fromBalance = this.balanceOf(caller)
    if (value > fromBalance) {
      this.ctx.log.warn(`Transfer amount exceeds balance: requested ${value}, available ${fromBalance}`)
    }

    await this._executeTransfer(caller, to, value)
    // this.emitTransfer(caller, to, value)
    return true
  }

  public async transferFrom(caller: string, from: string, to: string, value: bigint): Promise<boolean> {
    if (to === '0x0000000000000000000000000000000000000000') {
      throw new Error('Transfer to zero address')
    }
    if (value > this.balanceOf(from)) {
      this.ctx.log.warn(`Transfer greater than balance: requested ${value}, available ${this.balanceOf(from)}`)
    }

    const allowance = this._allowances.get(from)?.get(caller) || 0n
    this._allowances.set(from, (this._allowances.get(from) || new Map()).set(caller, SafeMath.sub(allowance, value)))

    await this._executeTransfer(from, to, value)

    // this.emitTransfer(from, to, value)

    return true
  }

  /**
   * @dev Get credits balance of an account
   */
  public creditsBalanceOf(account: string): [bigint, bigint] {
    const cpt = this._creditsPerToken(account)
    if (cpt === BigInt('1' + '0'.repeat(27))) {
      // 1e27
      return [this.creditBalances.get(account) || 0n, cpt]
    } else {
      return [
        SafeMath.div(this.creditBalances.get(account) || 0n, this.RESOLUTION_INCREASE),
        SafeMath.div(cpt, this.RESOLUTION_INCREASE),
      ]
    }
  }

  /**
   * @dev Internal function to handle transfers
   */
  private async _executeTransfer(from: string, to: string, value: bigint): Promise<void> {
    const isNonRebasingTo = await this._isNonRebasingAccount(to)
    const isNonRebasingFrom = await this._isNonRebasingAccount(from)

    const creditsCredited = SafeMath.mulTruncate(value, this._creditsPerToken(to))
    const creditsDeducted = SafeMath.mulTruncate(value, this._creditsPerToken(from))

    const fromCredits = this.creditBalances.get(from) || 0n
    if (fromCredits < creditsDeducted) {
      this.ctx.log.warn(`Transfer amount exceeds balance: requested ${creditsDeducted}, available ${fromCredits}`)
    }

    this.creditBalances.set(from, fromCredits - creditsDeducted)
    this.creditBalances.set(to, (this.creditBalances.get(to) || 0n) + creditsCredited)

    if (isNonRebasingTo && !isNonRebasingFrom) {
      this.nonRebasingSupply += value
      this.rebasingCredits -= creditsDeducted
    } else if (!isNonRebasingTo && isNonRebasingFrom) {
      this.nonRebasingSupply -= value
      this.rebasingCredits += creditsCredited
    }
  }

  /**
   * @dev Function to check the amount of tokens that _owner has allowed to
   *      `_spender`.
   * @param _owner The address which owns the funds.
   * @param _spender The address which will spend the funds.
   * @return The number of tokens still available for the _spender.
   */
  public allowance(_owner: string, _spender: string): bigint {
    return this._allowances.get(_owner)?.get(_spender) || 0n
  }

  /**
   * @dev Approve the passed address to spend the specified amount of tokens
   *      on behalf of msg.sender. This method is included for ERC20
   *      compatibility. `increaseAllowance` and `decreaseAllowance` should be
   *      used instead.
   *
   *      Changing an allowance with this method brings the risk that someone
   *      may transfer both the old and the new allowance - if they are both
   *      greater than zero - if a transfer transaction is mined before the
   *      later approve() call is mined.
   * @param _spender The address which will spend the funds.
   * @param _value The amount of tokens to be spent.
   */
  public approve(caller: string, _spender: string, _value: bigint): boolean {
    if (!this._allowances.has(caller)) {
      this._allowances.set(caller, new Map())
    }
    this._allowances.get(caller)?.set(_spender, _value)
    // this.emitApproval(caller, _spender, _value)
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
    const currentAllowance = this.allowance(caller, _spender)
    const newAllowance = SafeMath.add(currentAllowance, _addedValue)

    if (!this._allowances.has(caller)) {
      this._allowances.set(caller, new Map())
    }
    this._allowances.get(caller)?.set(_spender, newAllowance)
    // this.emitApproval(caller, _spender, newAllowance)
    return true
  }

  /**
     * @dev Decrease the amount of tokens that an owner has allowed to
            `_spender`.
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
      newAllowance = SafeMath.sub(oldValue, _subtractedValue)
    }

    if (!this._allowances.has(caller)) {
      this._allowances.set(caller, new Map())
    }
    this._allowances.get(caller)?.set(_spender, newAllowance)
    // this.emitApproval(caller, _spender, newAllowance)
    return true
  }

  /**
   * @dev Mints new tokens, increasing totalSupply.
   */
  public async mint(caller: string, _account: string, _amount: bigint): Promise<void> {
    this.onlyVault(caller)
    await this._mint(_account, _amount)
  }

  /**
   * @dev Creates `_amount` tokens and assigns them to `_account`, increasing
   * the total supply.
   *
   * Emits a {Transfer} event with `from` set to the zero address.
   *
   * Requirements
   *
   * - `to` cannot be the zero address.
   */
  private async _mint(_account: string, _amount: bigint): Promise<void> {
    if (_account === '') throw new Error('Mint to the zero address')

    const isNonRebasingAccount = await this._isNonRebasingAccount(_account)

    const creditAmount = SafeMath.mulTruncate(_amount, this._creditsPerToken(_account))
    this.creditBalances.set(_account, SafeMath.add(this.creditBalances.get(_account) || 0n, creditAmount))

    // If the account is non rebasing and doesn't have a set creditsPerToken
    // then set it i.e. this is a mint from a fresh contract
    if (isNonRebasingAccount) {
      this.nonRebasingSupply = SafeMath.add(this.nonRebasingSupply, _amount)
    } else {
      this.rebasingCredits = SafeMath.add(this.rebasingCredits, creditAmount)
    }

    this._totalSupply = SafeMath.add(this._totalSupply, _amount)

    if (this._totalSupply >= this.MAX_SUPPLY) throw new Error('Max supply')

    // this.emitTransfer('', _account, _amount)
  }

  /**
   * @dev Burns tokens, decreasing totalSupply.
   */
  public async burn(caller: string, account: string, amount: bigint): Promise<void> {
    this.onlyVault(caller)
    await this._burn(account, amount)
  }

  /**
   * @dev Destroys `_amount` tokens from `_account`, reducing the
   * total supply.
   *
   * Emits a {Transfer} event with `to` set to the zero address.
   *
   * Requirements
   *
   * - `_account` cannot be the zero address.
   * - `_account` must have at least `_amount` tokens.
   */
  private async _burn(_account: string, _amount: bigint): Promise<void> {
    if (_account === '') throw new Error('Burn from the zero address')
    if (_amount === 0n) {
      return
    }

    const isNonRebasingAccount = await this._isNonRebasingAccount(_account)
    const creditAmount = SafeMath.mulTruncate(_amount, this._creditsPerToken(_account))
    const currentCredits = this.creditBalances.get(_account) || 0n

    // Remove the credits, burning rounding errors
    if (currentCredits === creditAmount || currentCredits - BigInt(1) === creditAmount) {
      // Handle dust from rounding
      this.creditBalances.set(_account, 0n)
    } else if (currentCredits > creditAmount) {
      this.creditBalances.set(_account, SafeMath.sub(currentCredits, creditAmount))
    } else {
      throw new Error('Remove exceeds balance')
    }

    // Remove from the credit tallies and non-rebasing supply
    if (isNonRebasingAccount) {
      this.nonRebasingSupply = SafeMath.sub(this.nonRebasingSupply, _amount)
    } else {
      this.rebasingCredits = SafeMath.sub(this.rebasingCredits, creditAmount)
    }

    this._totalSupply = SafeMath.sub(this._totalSupply, _amount)

    // this.emitTransfer(_account, '', _amount)
  }

  /**
   * @dev Get credits per token for an account
   */
  private _creditsPerToken(account: string): bigint {
    return this.nonRebasingCreditsPerToken.get(account) || this.rebasingCreditsPerToken
  }

  /**
   * @dev Check if an account is non-rebasing
   */
  private async _isNonRebasingAccount(account: string): Promise<boolean> {
    if ((await isContract(this.ctx, account)) && this.rebaseState.get(account) === RebaseOptions.NotSet) {
      this._ensureRebasingMigration(account)
    }
    return (this.nonRebasingCreditsPerToken.get(account) || 0n) > 0n
  }

  /**
   * @dev Ensures internal account for rebasing and non-rebasing credits and
   *      supply is updated following deployment of frozen yield change.
   */
  private _ensureRebasingMigration(account: string): void {
    if (!this.nonRebasingCreditsPerToken.has(account)) {
      // this.emitAccountRebasingDisabled(account)
      if (!this.creditBalances.has(account) || this.creditBalances.get(account) === 0n) {
        // Since there is no existing balance, we can directly set to high resolution
        this.nonRebasingCreditsPerToken.set(account, BigInt('1' + '0'.repeat(27))) // 1e27
      } else {
        // Migrate an existing account
        // Set fixed credits per token for this account
        this.nonRebasingCreditsPerToken.set(account, this.rebasingCreditsPerToken)
        // Update non rebasing supply
        this.nonRebasingSupply = SafeMath.add(this.nonRebasingSupply, this.balanceOf(account))
        // Update credit tallies
        this.rebasingCredits = SafeMath.sub(this.rebasingCredits, this.creditBalances.get(account) || 0n)
      }
    }
  }

  /**
   * @notice Enable rebasing for an account.
   * @dev Add a contract address to the non-rebasing exception list. The
   * address's balance will be part of rebases and the account will be exposed
   * to upside and downside.
   * @param caller The address calling this function
   * @param account Address of the account.
   */
  public async governanceRebaseOptIn(caller: string, account: string): Promise<void> {
    this.onlyGovernor(caller)
    await this._rebaseOptIn(account)
  }

  /**
   * @dev Add a contract address to the non-rebasing exception list. The
   * address's balance will be part of rebases and the account will be exposed
   * to upside and downside.
   * @param caller The address calling this function
   */
  public async rebaseOptIn(caller: string): Promise<void> {
    await this._rebaseOptIn(caller)
  }

  /**
   * @dev Internal implementation of opt in to rebasing
   * @param account Address of the account
   */
  private async _rebaseOptIn(account: string): Promise<void> {
    // if (!(await this._isNonRebasingAccount(account))) {
    //   throw new Error('Account has not opted out')
    // }

    // Convert balance into the same amount at the current exchange rate
    const newCreditBalance = SafeMath.div(
      SafeMath.mul(this.creditBalances.get(account) || 0n, this.rebasingCreditsPerToken),
      this._creditsPerToken(account),
    )

    // Decreasing non rebasing supply
    this.nonRebasingSupply = SafeMath.sub(this.nonRebasingSupply, this.balanceOf(account))

    this.creditBalances.set(account, newCreditBalance)

    // Increase rebasing credits, totalSupply remains unchanged so no
    // adjustment necessary
    this.rebasingCredits = SafeMath.add(this.rebasingCredits, this.creditBalances.get(account) || 0n)

    this.rebaseState.set(account, RebaseOptions.OptIn)

    // Delete any fixed credits per token
    this.nonRebasingCreditsPerToken.delete(account)

    // Mock event emission - replace with actual implementation
    // this.emitAccountRebasingEnabled(account)
  }

  /**
   * @dev Explicitly mark that an address is non-rebasing.
   * @param caller The address calling this function
   */
  public async rebaseOptOut(caller: string): Promise<void> {
    // if (await this._isNonRebasingAccount(caller)) {
    //   throw new Error('Account has not opted in')
    // }

    // Increase non rebasing supply
    this.nonRebasingSupply = SafeMath.add(this.nonRebasingSupply, this.balanceOf(caller))

    // Set fixed credits per token
    this.nonRebasingCreditsPerToken.set(caller, this.rebasingCreditsPerToken)

    // Decrease rebasing credits, total supply remains unchanged so no
    // adjustment necessary
    this.rebasingCredits = SafeMath.sub(this.rebasingCredits, this.creditBalances.get(caller) || 0n)

    // Mark explicitly opted out of rebasing
    this.rebaseState.set(caller, RebaseOptions.OptOut)

    // Mock event emission - replace with actual implementation
    // this.emitAccountRebasingDisabled(caller)
  }

  // Mock event emission - replace with actual implementation
  private emitAccountRebasingEnabled(account: string): void {
    console.log('AccountRebasingEnabled', { account })
  }

  /**
   * @dev Change the total supply of OUSD
   * @param caller The address calling this function
   * @param _newTotalSupply The new total supply
   */
  public changeSupply(caller: string, _newTotalSupply: bigint): void {
    this.onlyVault(caller)

    if (this._totalSupply <= 0n) {
      throw new Error('Cannot increase 0 supply')
    }

    if (this._totalSupply === _newTotalSupply) {
      // Mock event emission - replace with actual implementation
      console.log('TotalSupplyUpdatedHighres', {
        totalSupply: this._totalSupply.toString(),
        rebasingCredits: this.rebasingCredits.toString(),
        rebasingCreditsPerToken: this.rebasingCreditsPerToken.toString(),
      })
      return
    }

    this._totalSupply = _newTotalSupply > this.MAX_SUPPLY ? this.MAX_SUPPLY : _newTotalSupply

    this.rebasingCreditsPerToken = SafeMath.divPrecisely(
      this.rebasingCredits,
      SafeMath.sub(this._totalSupply, this.nonRebasingSupply),
    )

    if (this.rebasingCreditsPerToken <= 0n) {
      throw new Error('Invalid change in supply')
    }

    this._totalSupply = SafeMath.add(
      SafeMath.divPrecisely(this.rebasingCredits, this.rebasingCreditsPerToken),
      this.nonRebasingSupply,
    )

    // Mock event emission - replace with actual implementation
    // console.log('TotalSupplyUpdatedHighres', {
    //   totalSupply: this._totalSupply.toString(),
    //   rebasingCredits: this._rebasingCredits.toString(),
    //   rebasingCreditsPerToken: this._rebasingCreditsPerToken.toString(),
    // })
  }
}
