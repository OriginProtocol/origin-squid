import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {OETHDailyStat} from "./oethDailyStat.model"

@Entity_()
export class OETHCollateralDailyStat {
    constructor(props?: Partial<OETHCollateralDailyStat>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => OETHDailyStat, {nullable: true})
    dailyStatId!: OETHDailyStat

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
     * Price in ETH
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    price!: bigint

    /**
     * Total ETH value
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    value!: bigint
}
