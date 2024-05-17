import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class OTokenActivity {
    constructor(props?: Partial<OTokenActivity>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    otoken!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string

    @StringColumn_({nullable: false})
    callDataLast4Bytes!: string

    @StringColumn_({nullable: true})
    address!: string | undefined | null

    @StringColumn_({nullable: true})
    sighash!: string | undefined | null

    @StringColumn_({nullable: true})
    action!: string | undefined | null

    @StringColumn_({nullable: true})
    exchange!: string | undefined | null

    @StringColumn_({nullable: true})
    interface!: string | undefined | null

    @StringColumn_({nullable: true})
    fromSymbol!: string | undefined | null

    @StringColumn_({nullable: true})
    toSymbol!: string | undefined | null

    @BigIntColumn_({nullable: true})
    amount!: bigint | undefined | null
}
