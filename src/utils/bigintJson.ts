/**
 * Converts an object containing bigint values to a JSON string
 * Bigint values are converted to strings with 'n' suffix
 * @param value - The object to convert
 * @param indent - Optional indentation for the JSON string
 * @returns A JSON string with bigint values represented as strings with 'n' suffix
 */
export const bigintJsonStringify = (value: any, indent?: number): string => {
  return JSON.stringify(
    value,
    (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString() + 'n'
      }
      return value
    },
    indent,
  )
}

/**
 * Parses a JSON string containing bigint values (represented as strings with 'n' suffix)
 * back to an object with actual bigint values
 * @param jsonString - The JSON string to parse
 * @returns An object with bigint values restored
 */
export const bigintJsonParse = (jsonString: string): any => {
  return JSON.parse(jsonString, (key, value) => {
    if (typeof value === 'string' && /^-?\d+n$/.test(value)) {
      return BigInt(value.slice(0, -1))
    }
    return value
  })
}
