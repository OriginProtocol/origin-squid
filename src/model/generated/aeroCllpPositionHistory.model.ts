import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class AeroCLLPPositionHistory {
    constructor(props?: Partial<AeroCLLPPositionHistory>) {
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
    pool!: string

    @Index_()
    @BigIntColumn_({nullable: false})
    positionId!: bigint

    @Index_()
    @StringColumn_({nullable: false})
    lp!: string

    @BigIntColumn_({nullable: false})
    liquidity!: bigint

    @IntColumn_({nullable: false})
    tickLower!: number

    @IntColumn_({nullable: false})
    tickUpper!: number

    @IntColumn_({nullable: false})
    tickSpacing!: number

    @FloatColumn_({nullable: false})
    priceLower!: number

    @FloatColumn_({nullable: false})
    priceUpper!: number
}
