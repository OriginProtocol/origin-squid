import { Address } from '../model';
import { Context } from '../processor';

/**
 * Create a new Address entity
 *
 * @param {Context} ctx subsquid context
 * @param {string} addr
 * @returns {Promise<Address>} new Address entity
 */
export async function createAddress(ctx: Context, addr: string): Promise<Address> {
  let isContract: boolean = false;
  if (addr !== '0x0000000000000000000000000000000000000000') {
    isContract =
      (await ctx._chain.client.call('eth_getCode', [addr, 'latest'])) !== '0x';
  }

  // ctx.log.info(`New address ${rawAddress}`);
  return new Address({
    id: addr.toLowerCase(),
    balance: 0,
    earned: 0,
    credits: BigInt(0),
    isContract,
    rebasingOption: isContract ? 'OptOut' : 'OptIn',
    lastUpdated: new Date(1),

    ogvVotes: BigInt(0),
  });
}

/**
 * Find an existing entry in DB. If it doesn't exist,
 * create and store it
 *
 * @param {Context} ctx subsquid context
 * @param {string} addr
 * @returns {Promise<Address>} new Address entity
 */
export async function findOrCreateAddress(ctx: Context, addr: string): Promise<Address> {
  let _address = await ctx.store.findOneBy(Address, {
    id: addr.toLowerCase()
  })

  if (!_address) {
    _address = await createAddress(ctx, addr)
    ctx.store.insert(_address)
  }
  
  return _address
}
