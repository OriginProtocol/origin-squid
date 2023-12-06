import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {OUSDDailyStat} from "./ousdDailyStat.model"
import {OUSDStrategyHoldingDailyStat} from "./ousdStrategyHoldingDailyStat.model"

@Entity_()
export class OUSDStrategyDailyStat {
    constructor(props?: Partial<OUSDStrategyDailyStat>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => OUSDDailyStat, {nullable: true})
    dailyStatId!: OUSDDailyStat

    @Column_("text", {nullable: false})
    name!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    total!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    tvl!: bigint

    @OneToMany_(() => OUSDStrategyHoldingDailyStat, e => e.strategyDailyStatId)
    holdings!: OUSDStrategyHoldingDailyStat[]
}
