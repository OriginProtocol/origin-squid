import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Curve {
    constructor(props?: Partial<Curve>) {
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
    txHash!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    eth!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    oeth!: bigint
}
