import { BlockData } from '@subsquid/evm-processor';
import { TypeormDatabase } from '@subsquid/typeorm-store';
import { LessThanOrEqual } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import * as oeth from './abi/oeth';
import { Address, History } from './model';
import { Context, OETH_ADDRESS, processor } from './processor';

interface RawTransfer {
  id: string;
  value: bigint;
  from: string;
  to: string;
  timestamp: Date;
  blockNumber: number;
  txHash: string;
}

interface RawRebase {
  id: string;
  totalSupply: bigint;
  rebasingCredits: bigint;
  rebasingCreditsPerToken: bigint;
  timestamp: Date;
  blockNumber: number;
  txHash: string;
}

/**
 * Aggregate Transfer and Rebase events from the logs
 *
 * @param {Context} ctx subsquid context
 * @returns {(RawTransfer|RawRebase)[]} array of Transfer and Rebase events
 */
function getRawLogs(ctx: Context): (RawTransfer | RawRebase)[] {
  let logs: (RawTransfer | RawRebase)[] = [];
  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      if (
        log.address === OETH_ADDRESS &&
        log.topics[0] === oeth.events.Transfer.topic
      ) {
        // Trasnfer events
        let { from, to, value } = oeth.events.Transfer.decode(log);
        logs.push({
          id: log.id,
          value,
          from: from.toLowerCase(),
          to: to.toLowerCase(),
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          txHash: log.transactionHash,
        });
      } else if (
        log.address === OETH_ADDRESS &&
        log.topics[0] === oeth.events.TotalSupplyUpdatedHighres.topic
      ) {
        // Rebase events
        let { totalSupply, rebasingCredits, rebasingCreditsPerToken } =
          oeth.events.TotalSupplyUpdatedHighres.decode(log);
        logs.push({
          id: log.id,
          totalSupply,
          rebasingCredits,
          rebasingCreditsPerToken,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          txHash: log.transactionHash,
        });
      }
    }
  }

  return logs;
}

/**
 * Verify if the log is a Transfer event
 *
 * @param {(RawTransfer|RawRebase)} log
 * @returns {boolean} true if the log is a Transfer event
 */
function isRawTransfer(log: RawTransfer | RawRebase): log is RawTransfer {
  return (
    (log as RawTransfer).value !== undefined &&
    (log as RawTransfer).from !== undefined &&
    (log as RawTransfer).to !== undefined
  );
}

/**
 * Verify if the log is a Rebase event
 *
 * @param {(RawTransfer|RawRebase)} log
 * @returns {boolean} true if the log is a Rebase event
 */
function isRawRebase(log: RawTransfer | RawRebase): log is RawRebase {
  return (
    (log as RawRebase).totalSupply !== undefined &&
    (log as RawRebase).rebasingCredits !== undefined &&
    (log as RawRebase).rebasingCreditsPerToken !== undefined
  );
}

/**
 * Create a new Address entity
 *
 * @param {Context} ctx subsquid context
 * @param {string} addr
 * @returns {Promise<Address>} new Address entity
 */
async function createAddress(ctx: Context, addr: string): Promise<Address> {
  let isContract: boolean = false;
  if (addr !== '0x0000000000000000000000000000000000000000') {
    isContract =
      (await ctx._chain.client.call('eth_getCode', [addr, 'latest'])) !== '0x';
  }

  // ctx.log.info(`New address ${rawAddress}`);
  return new Address({
    id: addr,
    balance: 0,
    earned: 0,
    isContract,
    rebasingOption: isContract ? 'OptOut' : 'OptIn',
  });
}

/**
 * Process on-chain data
 *
 */
processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  const rawLogs = getRawLogs(ctx);
  const history: History[] = [];

  // get all addresses from the database.
  // we need this because we increase their balance based on rebase events
  const owners: Map<string, Address> = await ctx.store
    .find(Address)
    .then((q) => new Map(q.map((i) => [i.id, i])));

  for (let t of rawLogs) {
    // let rebase = await ctx.store.findOne(History, {
    //   where: { blockNumber: LessThanOrEqual(t.blockNumber), type: 'Rebase' },
    //   order: { blockNumber: 'DESC' },
    // });

    // Bind the token contract to the block number
    const block = ctx.blocks.find(
      (b) => b.header.height === t.blockNumber,
    ) as BlockData;
    const token = new oeth.Contract(ctx, block.header, OETH_ADDRESS);

    if (isRawTransfer(t)) {
      // Trasnfer events
      let addressSub = owners.get(t.from);
      let addressAdd = owners.get(t.to);

      if (addressSub == null) {
        addressSub = await createAddress(ctx, t.from);
        owners.set(addressSub.id, addressSub);
      }
      if (addressAdd == null) {
        addressAdd = await createAddress(ctx, t.to);
        owners.set(addressAdd.id, addressAdd);
      }

      addressSub.lastUpdated = t.timestamp;
      addressAdd.lastUpdated = t.timestamp;

      // update the address balance
      await Promise.all(
        [addressSub, addressAdd].map(async (address) => {
          const credits = await token.creditsBalanceOfHighres(address.id);
          const newBalance = Number(credits[0]) / Number(credits[1]);
          history.push(
            new History({
              // we can't use {t.id} because it's not unique
              id: uuidv4(),
              address: address,
              value: newBalance - address.balance,
              balance: newBalance,
              timestamp: t.timestamp,
              blockNumber: t.blockNumber,
              txHash: t.txHash,
              type: 'Swap',
            }),
          );
          address.credits = BigInt(credits[0]); // token credits
          address.balance = Number(credits[0]) / Number(credits[1]); // token balance
        }),
      );
    } else if (isRawRebase(t)) {
      // Rebase events
      for (const address of owners.values()) {
        const newBalance =
          Number(address.credits) / Number(t.rebasingCreditsPerToken);
        const earned = newBalance - address.balance;

        history.push(
          new History({
            id: uuidv4(),
            // we can't use {t.id} because it's not unique
            address: address,
            value: earned,
            balance: newBalance,
            timestamp: t.timestamp,
            blockNumber: t.blockNumber,
            txHash: t.txHash,
            type: 'Yield',
          }),
        );

        address.balance = newBalance;
        address.earned += earned;
      }
    }
  }

  await ctx.store.upsert([...owners.values()]);
  await ctx.store.insert(history);
});
