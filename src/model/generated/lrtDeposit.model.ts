import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class LRTDeposit {
    constructor(props?: Partial<LRTDeposit>) {
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

    @Index_()
    @Column_("text", {nullable: false})
    referralId!: string

    @Index_()
    @Column_("text", {nullable: false})
    depositor!: string

    @Column_("text", {nullable: false})
    asset!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    depositAmount!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amountReceived!: bigint
}
