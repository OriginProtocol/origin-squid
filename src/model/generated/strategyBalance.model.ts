import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class StrategyBalance {
    constructor(props?: Partial<StrategyBalance>) {
        Object.assign(this, props)
    }

    /**
     * Format: 'chainId:strategy:asset:blockNumber'
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

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
