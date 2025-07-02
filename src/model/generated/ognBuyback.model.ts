import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, IntColumn as IntColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class OGNBuyback {
    constructor(props?: Partial<OGNBuyback>) {
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
    operator!: string

    @StringColumn_({nullable: false})
    tokenSold!: string

    @BigIntColumn_({nullable: false})
    amountSold!: bigint

    @BigIntColumn_({nullable: false})
    ognBought!: bigint

    @FloatColumn_({nullable: false})
    ognBoughtUSD!: number

    @StringColumn_({nullable: false})
    txHash!: string
}
