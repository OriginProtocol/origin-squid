import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_, JSONColumn as JSONColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class ProtocolDailyRevenue {
    constructor(props?: Partial<ProtocolDailyRevenue>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    date!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @BigIntColumn_({nullable: false})
    totalEth!: bigint

    @BigIntColumn_({nullable: false})
    totalUsd!: bigint

    @BigIntColumn_({nullable: false})
    avg7Eth!: bigint

    @BigIntColumn_({nullable: false})
    avg14Eth!: bigint

    @BigIntColumn_({nullable: false})
    avg30Eth!: bigint

    @BigIntColumn_({nullable: false})
    avg7Usd!: bigint

    @BigIntColumn_({nullable: false})
    avg14Usd!: bigint

    @BigIntColumn_({nullable: false})
    avg30Usd!: bigint

    @JSONColumn_({nullable: false})
    split!: unknown
}
