import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {LRTPointRecipient} from "./lrtPointRecipient.model"

@Entity_()
export class LRTPointData {
    constructor(props?: Partial<LRTPointData>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => LRTPointRecipient, {nullable: true})
    recipient!: LRTPointRecipient

    @Column_("text", {nullable: false})
    name!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    staticPoints!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balance!: bigint

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    startDate!: Date

    @Index_()
    @Column_("timestamp with time zone", {nullable: true})
    endDate!: Date | undefined | null
}
