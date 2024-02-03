import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {LRTPointRecipient} from "./lrtPointRecipient.model"

@Entity_()
export class LRTBalanceData {
    constructor(props?: Partial<LRTBalanceData>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => LRTPointRecipient, {nullable: true})
    recipient!: LRTPointRecipient

    @Column_("timestamp with time zone", {nullable: false})
    staticPointsDate!: Date

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    staticPoints!: bigint

    @Column_("text", {nullable: true})
    asset!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balance!: bigint

    @Column_("timestamp with time zone", {nullable: false})
    balanceDate!: Date
}
