import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, FloatColumn as FloatColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class OTokenAPY {
    constructor(props?: Partial<OTokenAPY>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    otoken!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string

    @Index_()
    @StringColumn_({nullable: false})
    date!: string

    @FloatColumn_({nullable: false})
    apr!: number

    @FloatColumn_({nullable: false})
    apy!: number

    @FloatColumn_({nullable: false})
    apy7DayAvg!: number

    @FloatColumn_({nullable: false})
    apy14DayAvg!: number

    @FloatColumn_({nullable: false})
    apy30DayAvg!: number

    @BigIntColumn_({nullable: false})
    rebasingCreditsPerToken!: bigint
}
