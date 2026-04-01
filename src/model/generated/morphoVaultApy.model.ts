import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class MorphoVaultApy {
    constructor(props?: Partial<MorphoVaultApy>) {
        Object.assign(this, props)
    }

    /**
     * Format: '{chainId}:{vaultAddress}:{blockNumber}'
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @StringColumn_({nullable: false})
    vaultAddress!: string

    @FloatColumn_({nullable: false})
    apy!: number
}
