import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {APY} from "./apy.model"

@Entity_()
export class Rebase {
    constructor(props?: Partial<Rebase>) {
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
    @ManyToOne_(() => APY, {nullable: true})
    apy!: APY
}
