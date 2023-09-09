import { BlockData } from '@subsquid/evm-processor';
import { LessThan, MoreThanOrEqual } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import * as oeth from '../abi/oeth';
import { APY, Address, History, Rebase } from '../model';
import { Context } from '../processor';
import { ADDRESS_ZERO, OETH_ADDRESS } from '../addresses';
import { createAddress } from '../utils/address';

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

type RawLog = RawTransfer | RawRebase;

/**
 * Aggregate Transfer and Rebase events from the logs
 *
 * @param {Context} ctx subsquid context
 * @returns {(RawLog)[]} array of Transfer and Rebase events
 */
function getRawLogs(ctx: Context): (RawLog)[] {
  let logs: (RawLog)[] = [];
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
 * @param {(RawLog)} log
 * @returns {boolean} true if the log is a Transfer event
 */
function isRawTransfer(log: RawLog): log is RawTransfer {
  return (
    (log as RawTransfer).value !== undefined &&
    (log as RawTransfer).from !== undefined &&
    (log as RawTransfer).to !== undefined
  );
}

/**
 * Verify if the log is a Rebase event
 *
 * @param {(RawLog)} log
 * @returns {boolean} true if the log is a Rebase event
 */
function isRawRebase(log: RawLog): log is RawRebase {
  return (
    (log as RawRebase).totalSupply !== undefined &&
    (log as RawRebase).rebasingCredits !== undefined &&
    (log as RawRebase).rebasingCreditsPerToken !== undefined
  );
}

/**
 * Create Rebase entity and set APY
 *
 * @param {Context} ctx subsquid context
 * @param {RawRebase} rebaseEvent rebase event
 * @returns {Promise<Rebase>} Rebase entity
 */
async function createRebaseAPY(
  ctx: Context,
  rebaseEvent: RawRebase,
): Promise<Rebase> {
  const r = new Rebase({ ...rebaseEvent });

  // use date as id for APY
  const date = new Date(rebaseEvent.timestamp);
  const dateId = date.toISOString().substring(0, 10);
  date.setDate(date.getDate() - 1);
  const lastDateId = date.toISOString().substring(0, 10);

  // use date as id for APY
  date.setDate(date.getDate() - 6);
  const last7daysDateId = {
    key: 'apy7DayAvg',
    value: date.toISOString().substring(0, 10),
  };
  date.setDate(date.getDate() - 14);
  const last14daysDateId = {
    key: 'apy14DayAvg',
    value: date.toISOString().substring(0, 10),
  };
  date.setDate(date.getDate() - 16);
  const last30daysDateId = {
    key: 'apy30DayAvg',
    value: date.toISOString().substring(0, 10),
  };

  // get last APY to compare with current one
  let lastApy = await ctx.store.findOne(APY, {
    where: { id: LessThan(dateId) },
    order: { id: 'DESC' },
  });

  // check if there is already an APY for the current date
  let apy = await ctx.store.findOne(APY, { where: { id: dateId } });
  ctx.log.info(`APY: ${dateId} ${apy}, ${lastDateId} ${lastApy}`);
  // create a new APY if it doesn't exist
  if (!apy) {
    apy = new APY({
      id: dateId,
      blockNumber: rebaseEvent.blockNumber,
      timestamp: rebaseEvent.timestamp,
      txHash: rebaseEvent.txHash,
      rebasingCreditsPerToken: rebaseEvent.rebasingCreditsPerToken,
    });
  }
  // should only happen for the first rebase event
  if (!lastApy) {
    apy.apr = 0;
    apy.apy = 0;
    apy.apy7DayAvg = 0;
    apy.apy14DayAvg = 0;
    apy.apy30DayAvg = 0;

    await ctx.store.upsert(apy);
    return r;
  }

  // update APY with the new rebase event
  apy.blockNumber = rebaseEvent.blockNumber;
  apy.timestamp = rebaseEvent.timestamp;
  apy.txHash = rebaseEvent.txHash;
  apy.rebasingCreditsPerToken = rebaseEvent.rebasingCreditsPerToken;

  // this should normally be 1 day but more secure to calculate it
  const diffTime = Math.abs(
    new Date(apy.id).getTime() - new Date(lastApy.id).getTime(),
  );
  const dayDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  apy.apr =
    ((Number(lastApy.rebasingCreditsPerToken) /
      Number(apy.rebasingCreditsPerToken) -
      1) *
      100 *
      365.25) /
    dayDiff;
  const periods_per_year = 365.25 / dayDiff;
  apy.apy =
    ((1 + apy.apr / periods_per_year / 100) ** periods_per_year - 1) * 100;

  // calculate average APY for the last 7, 14 and 30 days
  for (const i of [last7daysDateId, last14daysDateId, last30daysDateId]) {
    let pastAPYs = await ctx.store.findBy(APY, {
      id: MoreThanOrEqual(i.value),
    });
    // @ts-ignore
    apy[i.key] =
      pastAPYs.reduce((acc: number, cur: APY) => acc + cur.apy, apy.apy) /
      (pastAPYs.length + 1);
  }

  await ctx.store.upsert(apy);
  return r;
}

/**
 * Process on-chain data
 *
 */
export default async (ctx: Context) => {
  const rawLogs = getRawLogs(ctx);
  const history: History[] = [];
  const rebases: Rebase[] = [];

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

      const isSwap = [t.from, t.to].includes(ADDRESS_ZERO);

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
              type: isSwap ? 'Swap' : (addressSub === address ? 'Sent' : 'Received'),
            }),
          );
          address.credits = BigInt(credits[0]); // token credits
          address.balance = Number(credits[0]) / Number(credits[1]); // token balance
        }),
      );
    } else if (isRawRebase(t)) {
      // Rebase events
      let rebase = createRebaseAPY(ctx, t);
      for (const address of owners.values()) {
        if (address.rebasingOption === 'OptOut') {
          continue;
        }
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
      rebases.push(await rebase);
    }
  }

  await ctx.store.upsert([...owners.values()]);
  await ctx.store.insert(history);
  await ctx.store.insert(rebases);
} 
