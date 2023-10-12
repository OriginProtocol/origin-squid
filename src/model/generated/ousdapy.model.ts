import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

/**
 * The APY entity tracks historical APY values by day.
 */
@Entity_()
export class OUSDAPY {
    constructor(props?: Partial<OUSDAPY>) {
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

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    apr!: number

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    apy!: number

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    apy7DayAvg!: number

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    apy14DayAvg!: number

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    apy30DayAvg!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    rebasingCreditsPerToken!: bigint
}
