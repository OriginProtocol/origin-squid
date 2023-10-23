import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
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
    @Column_("text", {nullable: false})
    symbol!: string

    /**
     * Amount held
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amount!: bigint

    /**
     * Total ETH value
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    value!: bigint
}
