import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

/**
 * The OUSD entity tracks the change in total supply of OUSD over time.
 */
@Entity_()
export class OUSD {
    constructor(props?: Partial<OUSD>) {
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
    totalSupply!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    rebasingSupply!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    nonRebasingSupply!: bigint
}
