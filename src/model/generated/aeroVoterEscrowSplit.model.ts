import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class AeroVoterEscrowSplit {
    constructor(props?: Partial<AeroVoterEscrowSplit>) {
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
    @BigIntColumn_({nullable: false})
    from!: bigint

    @Index_()
    @BigIntColumn_({nullable: false})
    tokenId1!: bigint

    @Index_()
    @BigIntColumn_({nullable: false})
    tokenId2!: bigint

    @StringColumn_({nullable: false})
    sender!: string

    @BigIntColumn_({nullable: false})
    splitAmount1!: bigint

    @BigIntColumn_({nullable: false})
    splitAmount2!: bigint

    @BigIntColumn_({nullable: false})
    locktime!: bigint

    @BigIntColumn_({nullable: false})
    ts!: bigint
}
