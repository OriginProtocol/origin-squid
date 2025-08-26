import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class OTokenWithdrawalRequest {
    constructor(props?: Partial<OTokenWithdrawalRequest>) {
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
    otoken!: string

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

    @DateTimeColumn_({nullable: true})
    claimedAt!: Date | undefined | null

    @BigIntColumn_({nullable: true})
    queueWait!: bigint | undefined | null

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string
}
