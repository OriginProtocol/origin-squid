import * as legacyStakingAbi from '@abi/legacy-staking'
import { LegacyStaker } from '@model'
import { Context, EvmBatchProcessor } from '@originprotocol/squid-utils'
import { LEGACY_OGN_STAKING } from '@utils/addresses'

export const from = 11469389 // https://etherscan.io/tx/0xe6aebd9182872d2a360b281dd60dbd991548da71f8660028526363cac2c80bde

interface IProcessResult {
  legacyStakers: Map<string, LegacyStaker>
}

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: [LEGACY_OGN_STAKING],
    topic0: [
      legacyStakingAbi.events['Staked(address indexed,uint256)'],
      legacyStakingAbi.events['Staked(address indexed,uint256,uint256,uint256)'],
      legacyStakingAbi.events['Withdrawn(address indexed,uint256)'],
      legacyStakingAbi.events['Withdrawn(address indexed,uint256,uint256)'],
      legacyStakingAbi.events.StakesTransfered,
    ].map((ev) => ev.topic),
    range: { from },
  })
}

export const process = async (ctx: Context) => {
  const result: IProcessResult = {
    legacyStakers: new Map<string, LegacyStaker>(),
  }

  for (const block of ctx.blocksWithContent) {
    for (const log of block.logs) {
      const firstTopic = log.topics[0]

      if (![LEGACY_OGN_STAKING].includes(log.address.toLowerCase())) {
        continue
      }

      if (firstTopic === legacyStakingAbi.events['Staked(address indexed,uint256)'].topic) {
        let { user, amount } = legacyStakingAbi.events['Staked(address indexed,uint256)'].decode(log)
        const staker = await _getStaker(ctx, user, result)
        staker.inputAmount += amount
        staker.balance += amount
      } else if (firstTopic === legacyStakingAbi.events['Staked(address indexed,uint256,uint256,uint256)'].topic) {
        let { user, amount } = legacyStakingAbi.events['Staked(address indexed,uint256,uint256,uint256)'].decode(log)
        const staker = await _getStaker(ctx, user, result)
        staker.inputAmount += amount
        staker.balance += amount
      } else if (firstTopic === legacyStakingAbi.events['Withdrawn(address indexed,uint256)'].topic) {
        let { user, amount } = legacyStakingAbi.events['Withdrawn(address indexed,uint256)'].decode(log)
        const staker = await _getStaker(ctx, user, result)
        staker.outputAmount += amount
        staker.balance -= amount
      } else if (firstTopic === legacyStakingAbi.events['Withdrawn(address indexed,uint256,uint256)'].topic) {
        let { user, amount, stakedAmount } =
          legacyStakingAbi.events['Withdrawn(address indexed,uint256,uint256)'].decode(log)
        const staker = await _getStaker(ctx, user, result)
        staker.outputAmount += stakedAmount
        staker.rewardAmount += amount - stakedAmount
        staker.balance -= stakedAmount
      } else if (firstTopic === legacyStakingAbi.events.StakesTransfered.topic) {
        let { toUser, fromUser } = legacyStakingAbi.events.StakesTransfered.decode(log)

        const toStaker = await _getStaker(ctx, toUser, result)
        const fromStaker = await _getStaker(ctx, fromUser, result)

        toStaker.inputAmount += fromStaker.inputAmount
        toStaker.outputAmount += fromStaker.outputAmount
        toStaker.rewardAmount += fromStaker.rewardAmount
        toStaker.balance += fromStaker.balance

        fromStaker.inputAmount = 0n
        fromStaker.outputAmount = 0n
        fromStaker.rewardAmount = 0n
        fromStaker.balance = 0n
      }
    }
  }

  await ctx.store.upsert(Array.from(result.legacyStakers.values()))
}

const _getStaker = async (ctx: Context, id: string, result: IProcessResult): Promise<LegacyStaker> => {
  id = id.toLowerCase()
  const { legacyStakers } = result

  if (legacyStakers.has(id)) {
    return legacyStakers.get(id)!
  }

  let legacyStaker = await ctx.store.findOneBy(LegacyStaker, {
    id,
  })

  if (!legacyStaker) {
    legacyStaker = new LegacyStaker({
      id: id.toLowerCase(),
      inputAmount: 0n,
      outputAmount: 0n,
      rewardAmount: 0n,
      balance: 0n,
    })
  }

  legacyStakers.set(id, legacyStaker)

  return legacyStaker
}
