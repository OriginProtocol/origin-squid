import { addresses } from './addresses'
import { baseAddresses } from './addresses-base'
import { sonicAddresses } from './addresses-sonic'

export const otokenProducts = [
  {
    product: 'OUSD',
    processorId: 'ousd',
    otokenAddress: addresses.ousd.address,
    productId: `1:OUSD`,
  },
  {
    product: 'OETH',
    processorId: 'oeth',
    otokenAddress: addresses.oeth.address,
    productId: `1:OETH`,
  },
  {
    product: 'superOETHb',
    processorId: 'oethb',
    otokenAddress: baseAddresses.superOETHb.address,
    productId: `8453:superOETHb`,
  },
  {
    product: 'OS',
    processorId: 'sonic',
    otokenAddress: sonicAddresses.OS.address,
    productId: `146:OS`,
  },
] as const

export const armProducts = [
  {
    product: 'ARM-WETH-stETH',
    processorId: 'mainnet',
    armAddress: addresses.arms['ARM-WETH-stETH'].address,
    productId: `1:ARM-WETH-stETH`,
  },
  {
    product: 'ARM-WETH-eETH',
    processorId: 'mainnet',
    armAddress: addresses.arms['ARM-WETH-eETH'].address,
    productId: `1:ARM-WETH-eETH`,
  },
  {
    product: 'ARM-USDe-sUSDe',
    processorId: 'mainnet',
    armAddress: addresses.arms['ARM-USDe-sUSDe'].address,
    productId: `1:ARM-USDe-sUSDe`,
  },
  {
    product: 'ARM-WS-OS',
    processorId: 'sonic',
    armAddress: sonicAddresses.armOS.address,
    productId: `146:ARM-WS-OS`,
  },
] as const

export type OTokenProduct = (typeof otokenProducts)[number]
export type ArmProduct = (typeof armProducts)[number]
export type Product = OTokenProduct | ArmProduct
export type ProductName = Product['product']

export const getProductByName = (product: ProductName) => {
  const productByName = new Map([...otokenProducts, ...armProducts].map((product) => [product.product, product]))
  return productByName.get(product)
}
