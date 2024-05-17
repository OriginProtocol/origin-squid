import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
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

    @StringColumn_({nullable: false})
    symbol!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BigIntColumn_({nullable: false})
    price!: bigint

    @BigIntColumn_({nullable: false})
    value!: bigint
}
