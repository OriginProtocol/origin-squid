import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
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

    @StringColumn_({nullable: false})
    name!: string

    @BigIntColumn_({nullable: false})
    total!: bigint

    @BigIntColumn_({nullable: false})
    tvl!: bigint

    @OneToMany_(() => OUSDStrategyHoldingDailyStat, e => e.strategyDailyStatId)
    holdings!: OUSDStrategyHoldingDailyStat[]
}
