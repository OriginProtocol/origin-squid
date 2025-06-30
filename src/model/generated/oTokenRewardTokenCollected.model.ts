import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class OTokenRewardTokenCollected {
    constructor(props?: Partial<OTokenRewardTokenCollected>) {
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

    @StringColumn_({nullable: false})
    strategy!: string

    @StringColumn_({nullable: false})
    recipient!: string

    @StringColumn_({nullable: false})
    rewardToken!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint
}
