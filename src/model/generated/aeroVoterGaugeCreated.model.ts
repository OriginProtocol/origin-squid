import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class AeroVoterGaugeCreated {
    constructor(props?: Partial<AeroVoterGaugeCreated>) {
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
    address!: string

    @Index_()
    @StringColumn_({nullable: false})
    poolFactory!: string

    @Index_()
    @StringColumn_({nullable: false})
    votingRewardsFactory!: string

    @Index_()
    @StringColumn_({nullable: false})
    gaugeFactory!: string

    @StringColumn_({nullable: false})
    pool!: string

    @StringColumn_({nullable: false})
    bribeVotingReward!: string

    @StringColumn_({nullable: false})
    feeVotingReward!: string

    @StringColumn_({nullable: false})
    gauge!: string

    @StringColumn_({nullable: false})
    creator!: string
}
