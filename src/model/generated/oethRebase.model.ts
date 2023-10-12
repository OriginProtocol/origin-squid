import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {OETHAPY} from "./oethapy.model"

/**
 * The Rebase entity tracks historical rebase events on the OETH contract.
 */
@Entity_()
export class OETHRebase {
    constructor(props?: Partial<OETHRebase>) {
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
    totalSupply!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    rebasingCredits!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    rebasingCreditsPerToken!: bigint

    @Index_()
    @ManyToOne_(() => OETHAPY, {nullable: true})
    apy!: OETHAPY

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    fee!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    yield!: bigint
}
