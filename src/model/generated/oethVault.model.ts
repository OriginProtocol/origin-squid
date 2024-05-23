import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

/**
 * The Vault entity tracks the OETH vault balance over time.
 */
@Entity_()
export class OETHVault {
    constructor(props?: Partial<OETHVault>) {
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
    weth!: bigint

    @BigIntColumn_({nullable: false})
    stETH!: bigint

    @BigIntColumn_({nullable: false})
    rETH!: bigint

    @BigIntColumn_({nullable: false})
    frxETH!: bigint
}
