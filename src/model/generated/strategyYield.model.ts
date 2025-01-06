import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, IntColumn as IntColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class StrategyYield {
    constructor(props?: Partial<StrategyYield>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @StringColumn_({nullable: false})
    otoken!: string

    @Index_()
    @StringColumn_({nullable: false})
    strategy!: string

    @StringColumn_({nullable: false})
    asset!: string

    @BigIntColumn_({nullable: false})
    balance!: bigint

    @FloatColumn_({nullable: false})
    balanceWeight!: number

    @BigIntColumn_({nullable: false})
    earnings!: bigint

    @BigIntColumn_({nullable: false})
    earningsChange!: bigint
}
