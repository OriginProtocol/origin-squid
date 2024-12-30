export const sumBigIntBy = <T>(array: T[], key: keyof T) => {
  return array.reduce((acc, item) => acc + BigInt(item[key] as bigint), 0n)
}
