import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {GovernanceProposalEventType} from "./_governanceProposalEventType"
import {GovernanceProposal} from "./governanceProposal.model"

@Entity_()
export class GovernanceProposalEvent {
    constructor(props?: Partial<GovernanceProposalEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string

    @Column_("varchar", {length: 8, nullable: false})
    event!: GovernanceProposalEventType

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @ManyToOne_(() => GovernanceProposal, {nullable: true})
    proposal!: GovernanceProposal
}
