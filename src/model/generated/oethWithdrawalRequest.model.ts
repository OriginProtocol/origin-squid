import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class OETHWithdrawalRequest {
    constructor(props?: Partial<OETHWithdrawalRequest>) {
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

    @BigIntColumn_({nullable: false})
    requestId!: bigint

    @StringColumn_({nullable: false})
    withdrawer!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BigIntColumn_({nullable: false})
    queued!: bigint

    @BooleanColumn_({nullable: false})
    claimed!: boolean

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string
}
