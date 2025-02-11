import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class PoolBoosterCampaign {
    constructor(props?: Partial<PoolBoosterCampaign>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @Index_()
    @StringColumn_({nullable: false})
    gauge!: string

    @BigIntColumn_({nullable: true})
    campaignId!: bigint | undefined | null

    @StringColumn_({nullable: false})
    rewardToken!: string

    @BigIntColumn_({nullable: false})
    maxRewardPerVote!: bigint

    @BigIntColumn_({nullable: false})
    totalRewardAmount!: bigint

    @BooleanColumn_({nullable: false})
    closed!: boolean
}
