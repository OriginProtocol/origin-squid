import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class AeroVoterEscrowCreateManaged {
    constructor(props?: Partial<AeroVoterEscrowCreateManaged>) {
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
    to!: string

    @Index_()
    @BigIntColumn_({nullable: false})
    mTokenId!: bigint

    @Index_()
    @StringColumn_({nullable: false})
    from!: string

    @StringColumn_({nullable: false})
    lockedManagedReward!: string

    @StringColumn_({nullable: false})
    freeManagedReward!: string
}
