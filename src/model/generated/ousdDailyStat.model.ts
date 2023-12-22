import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
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
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    apr!: number

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    apy!: number

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    apy7DayAvg!: number

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    apy14DayAvg!: number

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    apy30DayAvg!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalSupply!: bigint

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    totalSupplyUSD!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    rebasingSupply!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    nonRebasingSupply!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amoSupply!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    dripperWETH!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    wrappedSupply!: bigint

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    tradingVolumeUSD!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    yieldETH!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    yieldETH7Day!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    yieldETHAllTime!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    yieldUSD!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    yieldUSD7Day!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    yieldUSDAllTime!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    feesETH!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    feesETH7Day!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    feesETHAllTime!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    feesUSD!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    feesUSD7Day!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    feesUSDAllTime!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    pegPrice!: bigint

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    marketCapUSD!: number

    @Column_("int4", {nullable: false})
    holdersOverThreshold!: number

    @OneToMany_(() => OUSDStrategyDailyStat, e => e.dailyStatId)
    strategies!: OUSDStrategyDailyStat[]

    @OneToMany_(() => OUSDCollateralDailyStat, e => e.dailyStatId)
    collateral!: OUSDCollateralDailyStat[]
}
