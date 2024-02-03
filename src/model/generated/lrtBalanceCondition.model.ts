import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {LRTBalanceData} from "./lrtBalanceData.model"

@Entity_()
export class LRTBalanceCondition {
    constructor(props?: Partial<LRTBalanceCondition>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => LRTBalanceData, {nullable: true})
    balanceData!: LRTBalanceData

    @Column_("text", {nullable: false})
    name!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    multiplier!: bigint

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    startDate!: Date

    @Index_()
    @Column_("timestamp with time zone", {nullable: true})
    endDate!: Date | undefined | null
}
