import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {GovernanceProposal} from "./governanceProposal.model"
import {GovernanceVoteType} from "./_governanceVoteType"

@Entity_()
export class GovernanceProposalVote {
    constructor(props?: Partial<GovernanceProposalVote>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    chainId!: number

    @StringColumn_({nullable: false})
    address!: string

    @Index_()
    @ManyToOne_(() => GovernanceProposal, {nullable: true})
    proposal!: GovernanceProposal

    @Index_()
    @StringColumn_({nullable: false})
    voter!: string

    @BigIntColumn_({nullable: false})
    weight!: bigint

    @Column_("varchar", {length: 7, nullable: false})
    type!: GovernanceVoteType

    @StringColumn_({nullable: false})
    txHash!: string

    @DateTimeColumn_({nullable: false})
    timestamp!: Date
}
