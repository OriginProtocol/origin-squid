import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class MerklCampaign {
    constructor(props?: Partial<MerklCampaign>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    campaignId!: string

    @Index_()
    @StringColumn_({nullable: false})
    armAddress!: string

    @StringColumn_({nullable: false})
    creator!: string

    @Index_()
    @StringColumn_({nullable: false})
    rewardToken!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @Index_()
    @IntColumn_({nullable: false})
    campaignType!: number

    @DateTimeColumn_({nullable: false})
    startTimestamp!: Date

    @DateTimeColumn_({nullable: false})
    endTimestamp!: Date

    @IntColumn_({nullable: false})
    duration!: number

    @StringColumn_({nullable: false})
    campaignData!: string

    @Index_()
    @IntColumn_({nullable: false})
    createdBlockNumber!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
    createdTimestamp!: Date

    @Index_()
    @StringColumn_({nullable: false})
    createdTxHash!: string

    @IntColumn_({nullable: false})
    lastUpdatedBlockNumber!: number

    @DateTimeColumn_({nullable: false})
    lastUpdatedTimestamp!: Date
}
