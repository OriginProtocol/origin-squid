import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class ProtocolDailyStatDetail {
    constructor(props?: Partial<ProtocolDailyStatDetail>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    date!: string

    @Index_()
    @StringColumn_({nullable: false})
    product!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @BigIntColumn_({nullable: false})
    rateUSD!: bigint

    @BigIntColumn_({nullable: false})
    earningTVL!: bigint

    @BigIntColumn_({nullable: false})
    tvl!: bigint

    @BigIntColumn_({nullable: false})
    revenue!: bigint

    @FloatColumn_({nullable: false})
    apy!: number
}
