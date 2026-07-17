import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class WOTokenAddressYield {
    constructor(props?: Partial<WOTokenAddressYield>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    wotoken!: string

    @Index_()
    @StringColumn_({nullable: false})
    otoken!: string

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @Index_()
    @StringColumn_({nullable: false})
    date!: string

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @BigIntColumn_({nullable: false})
    balance!: bigint

    @BigIntColumn_({nullable: false})
    value!: bigint

    @BigIntColumn_({nullable: false})
    costBasis!: bigint

    @BigIntColumn_({nullable: false})
    yield!: bigint

    @BigIntColumn_({nullable: false})
    cumulativeYield!: bigint

    @FloatColumn_({nullable: false})
    roi!: number

    @BigIntColumn_({nullable: false})
    lastR!: bigint

    @BigIntColumn_({nullable: false})
    yieldRemainder!: bigint
}
