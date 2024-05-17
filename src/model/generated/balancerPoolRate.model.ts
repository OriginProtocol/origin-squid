import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, IntColumn as IntColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class BalancerPoolRate {
    constructor(props?: Partial<BalancerPoolRate>) {
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

    @StringColumn_({nullable: false})
    address!: string

    @BigIntColumn_({nullable: false})
    rate0!: bigint

    @BigIntColumn_({nullable: false})
    rate1!: bigint

    @BigIntColumn_({nullable: false})
    rate2!: bigint

    @BigIntColumn_({nullable: false})
    rate3!: bigint
}
