import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class PoolBoosterBribeExecuted {
    constructor(props?: Partial<PoolBoosterBribeExecuted>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @StringColumn_({nullable: false})
    txHash!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BigIntColumn_({nullable: false})
    fee!: bigint
}
