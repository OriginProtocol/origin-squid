/**
 * @title SafeMath
 * @dev Math operations with safety checks that revert on error
 */
export class SafeMath {
  /**
   * @dev Multiplies two numbers, reverts on overflow.
   */
  static mul(a: bigint, b: bigint): bigint {
    if (a === BigInt(0)) return BigInt(0)
    const c = a * b
    if (c / a !== b) throw new Error('SafeMath: multiplication overflow')
    return c
  }

  /**
   * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
   */
  static div(a: bigint, b: bigint): bigint {
    if (b === BigInt(0)) throw new Error('SafeMath: division by zero')
    return a / b
  }

  /**
   * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
   */
  static sub(a: bigint, b: bigint): bigint {
    if (b > a) throw new Error('SafeMath: subtraction overflow')
    return a - b
  }

  /**
   * @dev Adds two numbers, reverts on overflow.
   */
  static add(a: bigint, b: bigint): bigint {
    const c = a + b
    if (c < a) throw new Error('SafeMath: addition overflow')
    return c
  }

  /**
   * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
   * reverts when dividing by zero.
   */
  static mod(a: bigint, b: bigint): bigint {
    if (b === BigInt(0)) throw new Error('SafeMath: modulo by zero')
    return a % b
  }

  /**
   * @dev Multiplies two numbers and truncates the result
   */
  static mulTruncate(a: bigint, b: bigint): bigint {
    return this.div(this.mul(a, b), BigInt(1e18))
  }

  /**
   * @dev Divides two numbers and returns the result with high precision
   */
  static divPrecisely(a: bigint, b: bigint): bigint {
    return this.div(this.mul(a, BigInt(1e18)), b)
  }
}
