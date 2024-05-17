import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, IntColumn as IntColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class NativeBalance {
    constructor(props?: Partial<NativeBalance>) {
        Object.assign(this, props)
    }

    /**
     * Format: 'account:blockNumber'
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @StringColumn_({nullable: false})
    account!: string

    @BigIntColumn_({nullable: false})
    balance!: bigint
}
