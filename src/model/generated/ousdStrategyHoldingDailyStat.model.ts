import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
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

    @Column_("text", {nullable: false})
    symbol!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amount!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    value!: bigint
}
