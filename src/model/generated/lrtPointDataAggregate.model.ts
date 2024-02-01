import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class LRTPointDataAggregate {
    constructor(props?: Partial<LRTPointDataAggregate>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    name!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balance!: bigint

    @Column_("timestamp with time zone", {nullable: false})
    startDate!: Date

    @Column_("timestamp with time zone", {nullable: true})
    endDate!: Date | undefined | null
}
