import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class AeroCLPoolCollect {
    constructor(props?: Partial<AeroCLPoolCollect>) {
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
    owner!: string

    @StringColumn_({nullable: false})
    recipient!: string

    @IntColumn_({nullable: false})
    tickLower!: number

    @IntColumn_({nullable: false})
    tickUpper!: number

    @BigIntColumn_({nullable: false})
    amount0!: bigint

    @BigIntColumn_({nullable: false})
    amount1!: bigint
}
