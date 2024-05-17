import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {OETHStrategyDailyStat} from "./oethStrategyDailyStat.model"

@Entity_()
export class OETHStrategyHoldingDailyStat {
    constructor(props?: Partial<OETHStrategyHoldingDailyStat>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => OETHStrategyDailyStat, {nullable: true})
    strategyDailyStatId!: OETHStrategyDailyStat

    /**
     * Token symbol
     */
    @StringColumn_({nullable: false})
    symbol!: string

    /**
     * Amount held
     */
    @BigIntColumn_({nullable: false})
    amount!: bigint

    /**
     * Total ETH value
     */
    @BigIntColumn_({nullable: false})
    value!: bigint
}
