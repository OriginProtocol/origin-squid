import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, IntColumn as IntColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class BridgeTransfer {
    constructor(props?: Partial<BridgeTransfer>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @StringColumn_({nullable: false})
    txHashIn!: string

    @StringColumn_({nullable: true})
    txHashOut!: string | undefined | null

    @Index_()
    @StringColumn_({nullable: false})
    messageId!: string

    @Index_()
    @StringColumn_({nullable: false})
    bridge!: string

    @Index_()
    @StringColumn_({nullable: false})
    transactor!: string

    @Index_()
    @StringColumn_({nullable: false})
    sender!: string

    @Index_()
    @StringColumn_({nullable: false})
    receiver!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainIn!: number

    @IntColumn_({nullable: false})
    chainOut!: number

    @StringColumn_({nullable: false})
    tokenIn!: string

    @StringColumn_({nullable: false})
    tokenOut!: string

    @BigIntColumn_({nullable: false})
    amountIn!: bigint

    @BigIntColumn_({nullable: false})
    amountOut!: bigint

    @IntColumn_({nullable: false})
    state!: number
}
