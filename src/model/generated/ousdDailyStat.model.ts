import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, FloatColumn as FloatColumn_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {OUSDStrategyDailyStat} from "./ousdStrategyDailyStat.model"
import {OUSDCollateralDailyStat} from "./ousdCollateralDailyStat.model"

@Entity_()
export class OUSDDailyStat {
    constructor(props?: Partial<OUSDDailyStat>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @FloatColumn_({nullable: false})
    apr!: number

    @FloatColumn_({nullable: false})
    apy!: number

    @FloatColumn_({nullable: false})
    apy7DayAvg!: number

    @FloatColumn_({nullable: false})
    apy14DayAvg!: number

    @FloatColumn_({nullable: false})
    apy30DayAvg!: number

    @BigIntColumn_({nullable: false})
    totalSupply!: bigint

    @FloatColumn_({nullable: false})
    totalSupplyUSD!: number

    @BigIntColumn_({nullable: false})
    rebasingSupply!: bigint

    @BigIntColumn_({nullable: false})
    nonRebasingSupply!: bigint

    @BigIntColumn_({nullable: false})
    amoSupply!: bigint

    @BigIntColumn_({nullable: false})
    dripperWETH!: bigint

    @BigIntColumn_({nullable: false})
    wrappedSupply!: bigint

    @FloatColumn_({nullable: false})
    tradingVolumeUSD!: number

    @BigIntColumn_({nullable: false})
    yieldETH!: bigint

    @BigIntColumn_({nullable: false})
    yieldETH7Day!: bigint

    @BigIntColumn_({nullable: false})
    yieldETHAllTime!: bigint

    @BigIntColumn_({nullable: false})
    yieldUSD!: bigint

    @BigIntColumn_({nullable: false})
    yieldUSD7Day!: bigint

    @BigIntColumn_({nullable: false})
    yieldUSDAllTime!: bigint

    @BigIntColumn_({nullable: false})
    feesETH!: bigint

    @BigIntColumn_({nullable: false})
    feesETH7Day!: bigint

    @BigIntColumn_({nullable: false})
    feesETHAllTime!: bigint

    @BigIntColumn_({nullable: false})
    feesUSD!: bigint

    @BigIntColumn_({nullable: false})
    feesUSD7Day!: bigint

    @BigIntColumn_({nullable: false})
    feesUSDAllTime!: bigint

    @BigIntColumn_({nullable: false})
    pegPrice!: bigint

    @FloatColumn_({nullable: false})
    marketCapUSD!: number

    @IntColumn_({nullable: false})
    holdersOverThreshold!: number

    @OneToMany_(() => OUSDStrategyDailyStat, e => e.dailyStatId)
    strategies!: OUSDStrategyDailyStat[]

    @OneToMany_(() => OUSDCollateralDailyStat, e => e.dailyStatId)
    collateral!: OUSDCollateralDailyStat[]
}
