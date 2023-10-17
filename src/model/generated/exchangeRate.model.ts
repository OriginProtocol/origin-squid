import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

/**
 * Any entity which has a price associated with it should have that price go in here.
 * Prices can change very frequently and we don't want those changes on the same track
 * as values which change less frequently.
 */
@Entity_()
export class ExchangeRate {
    constructor(props?: Partial<ExchangeRate>) {
        Object.assign(this, props)
    }

    /**
     * Format: 'blockNumber:pair' ex '123456789:ETH_USD'
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Column_("text", {nullable: false})
    pair!: string

    @Column_("text", {nullable: false})
    base!: string

    @Column_("text", {nullable: false})
    quote!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    rate!: bigint
}
