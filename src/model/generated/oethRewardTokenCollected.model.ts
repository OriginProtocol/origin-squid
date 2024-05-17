import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, IntColumn as IntColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class OETHRewardTokenCollected {
    constructor(props?: Partial<OETHRewardTokenCollected>) {
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

    @StringColumn_({nullable: false})
    strategy!: string

    @StringColumn_({nullable: false})
    recipient!: string

    @StringColumn_({nullable: false})
    rewardToken!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint
}
