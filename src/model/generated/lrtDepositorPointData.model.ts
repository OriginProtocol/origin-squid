import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {LRTDepositor} from "./lrtDepositor.model"

@Entity_()
export class LRTDepositorPointData {
    constructor(props?: Partial<LRTDepositorPointData>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => LRTDepositor, {nullable: true})
    depositor!: LRTDepositor

    @Column_("text", {nullable: false})
    name!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balance!: bigint

    @Column_("timestamp with time zone", {nullable: false})
    startDate!: Date

    @Column_("timestamp with time zone", {nullable: true})
    endDate!: Date | undefined | null
}
