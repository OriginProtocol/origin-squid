import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class OGVDailyStat {
    constructor(props?: Partial<OGVDailyStat>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @BigIntColumn_({nullable: false})
    totalSupply!: bigint

    @FloatColumn_({nullable: false})
    totalSupplyUSD!: number

    @BigIntColumn_({nullable: false})
    totalStaked!: bigint

    @FloatColumn_({nullable: false})
    tradingVolumeUSD!: number

    @FloatColumn_({nullable: false})
    marketCapUSD!: number

    @FloatColumn_({nullable: false})
    priceUSD!: number

    @IntColumn_({nullable: false})
    holdersOverThreshold!: number
}
