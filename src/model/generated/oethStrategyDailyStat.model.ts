import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {OETHDailyStat} from "./oethDailyStat.model"
import {OETHStrategyHoldingDailyStat} from "./oethStrategyHoldingDailyStat.model"

@Entity_()
export class OETHStrategyDailyStat {
    constructor(props?: Partial<OETHStrategyDailyStat>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => OETHDailyStat, {nullable: true})
    dailyStatId!: OETHDailyStat

    @StringColumn_({nullable: false})
    name!: string

    @BigIntColumn_({nullable: false})
    total!: bigint

    /**
     * Sum of tokens in strategy
     */
    @BigIntColumn_({nullable: false})
    tvl!: bigint

    /**
     * Total ETH value
     */
    @OneToMany_(() => OETHStrategyHoldingDailyStat, e => e.strategyDailyStatId)
    holdings!: OETHStrategyHoldingDailyStat[]
}
