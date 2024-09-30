import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, FloatColumn as FloatColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class OTokenDailyStat {
    constructor(props?: Partial<OTokenDailyStat>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @StringColumn_({nullable: false})
    otoken!: string

    @FloatColumn_({nullable: false})
    apr!: number

    @FloatColumn_({nullable: false})
    apy!: number

    @FloatColumn_({nullable: false})
    apy7!: number

    @FloatColumn_({nullable: false})
    apy14!: number

    @FloatColumn_({nullable: false})
    apy30!: number

    @BigIntColumn_({nullable: false})
    rateUSD!: bigint

    @BigIntColumn_({nullable: false})
    rateETH!: bigint

    @BigIntColumn_({nullable: false})
    totalSupply!: bigint

    @BigIntColumn_({nullable: false})
    rebasingSupply!: bigint

    @BigIntColumn_({nullable: false})
    nonRebasingSupply!: bigint

    @BigIntColumn_({nullable: false})
    wrappedSupply!: bigint

    @BigIntColumn_({nullable: true})
    amoSupply!: bigint | undefined | null

    @BigIntColumn_({nullable: false})
    dripperWETH!: bigint

    @BigIntColumn_({nullable: false})
    yield!: bigint

    @BigIntColumn_({nullable: false})
    fees!: bigint

    @BigIntColumn_({nullable: false})
    cumulativeYield!: bigint

    @BigIntColumn_({nullable: false})
    cumulativeFees!: bigint

    @FloatColumn_({nullable: false})
    marketCapUSD!: number
}
