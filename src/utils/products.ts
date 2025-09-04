import { addresses } from './addresses'
import { baseAddresses } from './addresses-base'
import { plumeAddresses } from './addresses-plume'
import { sonicAddresses } from './addresses-sonic'

export const otokenProducts = [
  { product: 'OUSD', processorId: 'ousd', otokenAddress: addresses.ousd.address },
  { product: 'OETH', processorId: 'oeth', otokenAddress: addresses.oeth.address },
  { product: 'superOETHb', processorId: 'oethb', otokenAddress: baseAddresses.superOETHb.address },
  { product: 'OS', processorId: 'sonic', otokenAddress: sonicAddresses.OS.address },
  { product: 'superOETHp', processorId: 'plume', otokenAddress: plumeAddresses.superOETHp.address },
] as const

export const armProducts = [
  { product: 'ARM-WETH-stETH', processorId: 'mainnet', armAddress: addresses.arm.address },
  { product: 'ARM-WS-OS', processorId: 'sonic', armAddress: sonicAddresses.armOS.address },
] as const

export type OTokenProduct = (typeof otokenProducts)[number]
export type ArmProduct = (typeof armProducts)[number]
export type Product = OTokenProduct | ArmProduct
export type ProductName = Product['product']
