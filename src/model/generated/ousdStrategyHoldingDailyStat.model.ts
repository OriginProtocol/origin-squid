import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {OUSDStrategyDailyStat} from "./ousdStrategyDailyStat.model"

@Entity_()
export class OUSDStrategyHoldingDailyStat {
    constructor(props?: Partial<OUSDStrategyHoldingDailyStat>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => OUSDStrategyDailyStat, {nullable: true})
    strategyDailyStatId!: OUSDStrategyDailyStat

    @StringColumn_({nullable: false})
    symbol!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BigIntColumn_({nullable: false})
    value!: bigint
}
