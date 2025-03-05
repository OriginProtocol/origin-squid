import { SafeMath } from './SafeMath'

/**
 * @title StableMath
 * @dev Math operations for stable tokens with additional safety checks
 */
export class StableMath {
  private static readonly SCALE = BigInt(1e18)

  /**
   * @dev Multiply and truncate with scaling factor
   */
  static mulTruncate(a: bigint, b: bigint): bigint {
    return SafeMath.div(SafeMath.mul(a, b), this.SCALE)
  }

  /**
   * @dev Divide with scaling factor
   */
  static divPrecisely(a: bigint, b: bigint): bigint {
    return SafeMath.div(SafeMath.mul(a, this.SCALE), b)
  }

  /**
   * @dev Convert to scaled number
   */
  static scaleBy(a: bigint, decimals: number): bigint {
    if (decimals === 18) return a
    if (decimals > 18) {
      return SafeMath.div(a, BigInt(10) ** BigInt(decimals - 18))
    }
    return SafeMath.mul(a, BigInt(10) ** BigInt(18 - decimals))
  }

  /**
   * @dev Convert from scaled number
   */
  static fromScale(a: bigint, decimals: number): bigint {
    if (decimals === 18) return a
    if (decimals > 18) {
      return SafeMath.mul(a, BigInt(10) ** BigInt(decimals - 18))
    }
    return SafeMath.div(a, BigInt(10) ** BigInt(18 - decimals))
  }
}
