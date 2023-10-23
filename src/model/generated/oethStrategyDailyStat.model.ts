import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
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

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    total!: bigint

    /**
     * Sum of tokens in strategy
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    tvl!: bigint

    /**
     * Total ETH value
     */
    @OneToMany_(() => OETHStrategyHoldingDailyStat, e => e.strategyDailyStatId)
    holdings!: OETHStrategyHoldingDailyStat[]
}
