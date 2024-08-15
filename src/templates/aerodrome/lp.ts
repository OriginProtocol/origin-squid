import { uniqBy } from 'lodash'

import * as aerodromeCLPoolAbi from '@abi/aerodrome-cl-pool'
import * as slipstreamNftAbi from '@abi/aerodrome-slipstream-nft'
import { AeroCLLPPosition, AeroCLLPPositionHistory } from '@model'
import { Processor } from '@processor'
import { getPriceFromTick } from '@templates/aerodrome/prices'
import { baseAddresses } from '@utils/addresses-base'
import { logFilter } from '@utils/logFilter'

export const aerodromeLP = (params: {
  address: string
  from: number
  account: string[]
  decimals0?: number
  decimals1?: number
}): Processor => {
  const mintFilter = logFilter({
    address: [params.address],
    topic0: [aerodromeCLPoolAbi.events.Mint.topic],
    topic1: [baseAddresses.aerodrome.slipstreamNft],
    range: { from: params.from },
  })
  const burnFilter = logFilter({
    address: [params.address],
    topic0: [aerodromeCLPoolAbi.events.Burn.topic],
    topic1: [baseAddresses.aerodrome.slipstreamNft],
    range: { from: params.from },
  })
  const nftMintFilter = logFilter({
    address: [baseAddresses.aerodrome.slipstreamNft],
    topic0: [slipstreamNftAbi.events.Transfer.topic],
    topic1: ['0x00'],
    topic2: params.account,
    range: { from: params.from },
    transaction: true,
    transactionLogs: true,
  })
  const nftBurnFilter = logFilter({
    address: [baseAddresses.aerodrome.slipstreamNft],
    topic0: [slipstreamNftAbi.events.Transfer.topic],
    topic1: params.account,
    topic2: ['0x00'],
    range: { from: params.from },
    transaction: true,
    transactionLogs: true,
  })

  return {
    from: params.from,
    name: `Aerodrome LP ${params.address}`,
    setup: (processor) => {
      processor.addLog(nftMintFilter.value)
      processor.addLog(nftBurnFilter.value)
    },
    process: async (ctx) => {
      const positionMap = new Map<string, AeroCLLPPosition>()
      const positionHistoryMap = new Map<string, AeroCLLPPositionHistory[]>()
      const getLatest = async (positionId: bigint) => {
        const position = positionMap.get(positionId.toString())
        const positionHistoryArray = positionHistoryMap.get(positionId.toString()) ?? []
        positionHistoryMap.set(positionId.toString(), positionHistoryArray)
        const latestHistory =
          positionHistoryArray[positionHistoryArray.length - 1] ??
          (await ctx.store.findOne(AeroCLLPPositionHistory, {
            where: { positionId },
            order: { timestamp: 'desc' },
          }))
        return { positionHistoryArray, latestHistory, position }
      }
      for (const block of ctx.blocks) {
        for (const log of block.logs) {
          if (nftMintFilter.matches(log)) {
            const mintLog = log.transaction?.logs?.find((l) => mintFilter.matches(l))
            // Checking that this exists helps determine the log is from a pool we care about.
            if (mintLog) {
              const nftData = slipstreamNftAbi.events.Transfer.decode(log)
              const nftContract = new slipstreamNftAbi.Contract(
                ctx,
                block.header,
                baseAddresses.aerodrome.slipstreamNft,
              )
              const nftPosition = await nftContract.positions(nftData.tokenId)
              const positionHistory = new AeroCLLPPositionHistory({
                id: `${block.header.height}-${nftData.tokenId}`,
                chainId: ctx.chain.id,
                blockNumber: block.header.height,
                timestamp: new Date(block.header.timestamp),
                pool: params.address,
                positionId: nftData.tokenId,
                lp: nftData.to.toLowerCase(),
                liquidity: nftPosition.liquidity, // This *can* change over time.
                tickLower: nftPosition.tickLower,
                tickUpper: nftPosition.tickUpper,
                tickSpacing: nftPosition.tickSpacing,
                priceLower: getPriceFromTick(nftPosition.tickLower, params.decimals0, params.decimals1),
                priceUpper: getPriceFromTick(nftPosition.tickUpper, params.decimals0, params.decimals1),
              })
              const positionHistoryArray = positionHistoryMap.get(nftData.tokenId.toString()) ?? []
              positionHistoryArray.push(positionHistory)
              positionHistoryMap.set(nftData.tokenId.toString(), positionHistoryArray)

              const position = new AeroCLLPPosition({
                ...positionHistory,
                id: nftData.tokenId.toString(),
              })
              positionMap.set(position.id, position)

              ctx.log.info(
                `${block.header.height} Aerodrome CL LP Position NFT #${
                  nftData.tokenId
                } minted for ${nftData.to.toLowerCase()}`,
              )
            }
          } else if (nftBurnFilter.matches(log)) {
            const burnLog = log.transaction?.logs?.find((l) => burnFilter.matches(l))
            // Checking that this exists helps determine the log is from a pool we care about.
            if (burnLog) {
              const burnData = aerodromeCLPoolAbi.events.Burn.decode(burnLog)
              const nftData = slipstreamNftAbi.events.Transfer.decode(log)
              const { latestHistory, positionHistoryArray } = await getLatest(nftData.tokenId)
              if (latestHistory) {
                const positionHistory = new AeroCLLPPositionHistory({
                  ...latestHistory,
                  id: `${block.header.height}-${nftData.tokenId}`,
                  blockNumber: block.header.height,
                  timestamp: new Date(block.header.timestamp),
                  liquidity: 0n,
                })
                positionHistoryArray.push(positionHistory)

                const position = new AeroCLLPPosition({
                  ...positionHistory,
                  id: nftData.tokenId.toString(),
                })
                positionMap.set(position.id, position)

                ctx.log.info(
                  `${block.header.height} Aerodrome CL LP Position NFT #${
                    nftData.tokenId
                  } burned for ${nftData.to.toLowerCase()}`,
                )
              }
            }
          }
        }
      }

      // These entities look the same but have different uniqueness by IDs.
      // One is stored by tokenId, the other by block & tokenId.
      await ctx.store.upsert([...positionMap.values()])
      await ctx.store.insert([...positionHistoryMap.values()].flat())
    },
  }
}
