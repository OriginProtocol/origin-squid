export const range = (count: number): number[] => {
  return Array.from({ length: count }, (_, index) => index)
}
