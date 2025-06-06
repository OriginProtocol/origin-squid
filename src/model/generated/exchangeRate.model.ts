import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

/**
 * Any entity which has a price associated with it should have that price go in here.
 * Prices can change very frequently and we don't want those changes on the same track
 * as values which change less frequently.
 */
@Entity_()
export class ExchangeRate {
    constructor(props?: Partial<ExchangeRate>) {
        Object.assign(this, props)
    }

    /**
     * Format: 'chainId:blockNumber:pair' ex '1:123456789:ETH_USD'
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

    @StringColumn_({nullable: false})
    pair!: string

    @StringColumn_({nullable: false})
    base!: string

    @StringColumn_({nullable: false})
    quote!: string

    @BigIntColumn_({nullable: false})
    rate!: bigint

    @IntColumn_({nullable: false})
    decimals!: number
}
