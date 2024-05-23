import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class OETHFraxStaking {
    constructor(props?: Partial<OETHFraxStaking>) {
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

    /**
     * - sfrxETH is what's actually stored here, slightly confusing and may want to change.
     * - used by balance sheet
     */
    @BigIntColumn_({nullable: false})
    sfrxETH!: bigint
}
