import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class ArmSwap {
    constructor(props?: Partial<ArmSwap>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string

    @StringColumn_({nullable: false})
    txFrom!: string

    @StringColumn_({nullable: false})
    txTo!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @StringColumn_({nullable: false})
    from!: string

    @Index_()
    @StringColumn_({nullable: false})
    tokenIn!: string

    @Index_()
    @StringColumn_({nullable: false})
    tokenOut!: string

    @BigIntColumn_({nullable: false})
    amountIn!: bigint

    @BigIntColumn_({nullable: false})
    amountOut!: bigint

    @BigIntColumn_({nullable: false})
    rateIn!: bigint

    @BigIntColumn_({nullable: false})
    rateOut!: bigint

    @BigIntColumn_({nullable: false})
    assets0!: bigint

    @BigIntColumn_({nullable: false})
    assets1!: bigint
}
