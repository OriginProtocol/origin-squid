import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class ERC20Transfer {
    constructor(props?: Partial<ERC20Transfer>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @StringColumn_({nullable: false})
    txHash!: string

    @IntColumn_({nullable: false})
    blockNumber!: number

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @StringColumn_({nullable: false})
    from!: string

    @BigIntColumn_({nullable: false})
    fromBalance!: bigint

    @StringColumn_({nullable: false})
    to!: string

    @BigIntColumn_({nullable: false})
    toBalance!: bigint

    @BigIntColumn_({nullable: false})
    value!: bigint
}
