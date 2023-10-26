export interface EntityClassT<T> {
  new (partial: Partial<T>): T
}

export type InstanceTypeOfConstructor<
  T extends {
    new (...args: any[]): any
  },
> = T extends {
  new (...args: any[]): infer R
}
  ? R
  : any
