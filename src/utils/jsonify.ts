function replacer(key: string, value: unknown) {
  if (typeof value === 'bigint') {
    return value.toString()
  } else {
    return value
  }
}

export const jsonify = (
  value: any,
  customReplacer?: (key: string, value: unknown) => unknown,
) =>
  JSON.stringify(value, (key, value) =>
    replacer(key, customReplacer?.(key, value) ?? value),
  )
