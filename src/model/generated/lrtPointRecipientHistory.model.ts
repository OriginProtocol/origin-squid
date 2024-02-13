import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class LRTPointRecipientHistory {
    constructor(props?: Partial<LRTPointRecipientHistory>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Column_("text", {nullable: false})
    recipient!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balance!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    points!: bigint

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    pointsDate!: Date

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    referralPoints!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    elPoints!: bigint

    @Column_("int4", {nullable: false})
    referralCount!: number

    @Column_("int4", {nullable: false})
    referrerCount!: number
}
