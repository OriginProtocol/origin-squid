import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class OTokenDripperState {
    constructor(props?: Partial<OTokenDripperState>) {
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
    wethBalance!: bigint

    @BigIntColumn_({nullable: false})
    availableFunds!: bigint

    @BigIntColumn_({nullable: false})
    lastCollect!: bigint

    @BigIntColumn_({nullable: false})
    perSecond!: bigint

    @BigIntColumn_({nullable: true})
    perSecondTarget!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    perSecondMax!: bigint | undefined | null

    @BigIntColumn_({nullable: false})
    dripDuration!: bigint
}
