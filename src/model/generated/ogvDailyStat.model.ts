import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class OGVDailyStat {
    constructor(props?: Partial<OGVDailyStat>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalSupply!: bigint

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    totalSupplyUSD!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalStaked!: bigint

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    tradingVolumeUSD!: number

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    marketCapUSD!: number

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    priceUSD!: number

    @Column_("int4", {nullable: false})
    holdersOverThreshold!: number
}
