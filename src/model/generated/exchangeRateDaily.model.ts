import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

/**
 * Daily historical exchange rates for selected FX pairs.
 */
@Entity_()
export class ExchangeRateDaily {
    constructor(props?: Partial<ExchangeRateDaily>) {
        Object.assign(this, props)
    }

    /**
     * Format: 'chainId:date:pair' ex '1:2026-04-17:ETH_USD'
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    date!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
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
