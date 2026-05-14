import { ContractBase } from '../abi.support.js'
import { BASE_TOKEN, QUOTE_TOKEN, decimals, description, getPrices, getRoundData, lastCorrectRoundId, latestRoundData, maximumDeviation, maximumOracleDelay, pendingTimelockAddress, priceSource, rounds, supportsInterface, timelockAddress, version } from './functions.js'
import type { GetRoundDataParams, RoundsParams, SupportsInterfaceParams } from './functions.js'

export class Contract extends ContractBase {
    BASE_TOKEN() {
        return this.eth_call(BASE_TOKEN, {})
    }

    QUOTE_TOKEN() {
        return this.eth_call(QUOTE_TOKEN, {})
    }

    decimals() {
        return this.eth_call(decimals, {})
    }

    description() {
        return this.eth_call(description, {})
    }

    getPrices() {
        return this.eth_call(getPrices, {})
    }

    getRoundData(_roundId: GetRoundDataParams["_roundId"]) {
        return this.eth_call(getRoundData, {_roundId})
    }

    lastCorrectRoundId() {
        return this.eth_call(lastCorrectRoundId, {})
    }

    latestRoundData() {
        return this.eth_call(latestRoundData, {})
    }

    maximumDeviation() {
        return this.eth_call(maximumDeviation, {})
    }

    maximumOracleDelay() {
        return this.eth_call(maximumOracleDelay, {})
    }

    pendingTimelockAddress() {
        return this.eth_call(pendingTimelockAddress, {})
    }

    priceSource() {
        return this.eth_call(priceSource, {})
    }

    rounds(_0: RoundsParams["_0"]) {
        return this.eth_call(rounds, {_0})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(supportsInterface, {interfaceId})
    }

    timelockAddress() {
        return this.eth_call(timelockAddress, {})
    }

    version() {
        return this.eth_call(version, {})
    }
}
