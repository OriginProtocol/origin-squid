import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class AeroVoterEscrowMerge {
    constructor(props?: Partial<AeroVoterEscrowMerge>) {
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
    address!: string

    @Index_()
    @StringColumn_({nullable: false})
    sender!: string

    @Index_()
    @BigIntColumn_({nullable: false})
    from!: bigint

    @Index_()
    @BigIntColumn_({nullable: false})
    to!: bigint

    @BigIntColumn_({nullable: false})
    amountFrom!: bigint

    @BigIntColumn_({nullable: false})
    amountTo!: bigint

    @BigIntColumn_({nullable: false})
    amountFinal!: bigint

    @BigIntColumn_({nullable: false})
    locktime!: bigint

    @BigIntColumn_({nullable: false})
    ts!: bigint
}
