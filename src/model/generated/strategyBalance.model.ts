import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, IntColumn as IntColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class StrategyBalance {
    constructor(props?: Partial<StrategyBalance>) {
        Object.assign(this, props)
    }

    /**
     * Format: 'strategy:asset:blockNumber'
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
    strategy!: string

    @StringColumn_({nullable: false})
    asset!: string

    @BigIntColumn_({nullable: false})
    balance!: bigint
}
