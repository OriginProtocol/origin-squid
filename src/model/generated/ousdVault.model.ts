import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

/**
 * The Vault entity tracks the OUSD vault balance over time.
 */
@Entity_()
export class OUSDVault {
    constructor(props?: Partial<OUSDVault>) {
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
    dai!: bigint

    @BigIntColumn_({nullable: false})
    usdt!: bigint

    @BigIntColumn_({nullable: false})
    usdc!: bigint
}
