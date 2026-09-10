export const env = process.env

/** An opt-in flag is on when it is set to anything other than `false` or `0`. */
export const envEnabled = (name: string): boolean => {
  const value = process.env[name]
  return !!value && value !== 'false' && value !== '0'
}
