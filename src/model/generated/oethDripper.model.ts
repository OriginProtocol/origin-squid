import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class OETHDripper {
    constructor(props?: Partial<OETHDripper>) {
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

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    weth!: bigint

    @Column_("int4", {nullable: false})
    lastCollectTimestamp!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    dripRatePerBlock!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    dripDuration!: bigint
}
