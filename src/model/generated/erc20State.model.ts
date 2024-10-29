import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class ERC20State {
    constructor(props?: Partial<ERC20State>) {
        Object.assign(this, props)
    }

    /**
     * Format: 'address:blockNumber'
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
    address!: string

    @BigIntColumn_({nullable: false})
    totalSupply!: bigint

    @IntColumn_({nullable: false})
    holderCount!: number

    @BigIntColumn_({nullable: true})
    rebasingCreditsPerToken!: bigint | undefined | null
}
