import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, ManyToOne as ManyToOne_, Index as Index_} from "@subsquid/typeorm-store"
import {GovernanceProposalEvent} from "./_governanceProposalEvent"
import {GovernanceProposal} from "./governanceProposal.model"

@Entity_()
export class GovernanceProposalTxLog {
    constructor(props?: Partial<GovernanceProposalTxLog>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    hash!: string

    @Column_("varchar", {length: 8, nullable: false})
    event!: GovernanceProposalEvent

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @ManyToOne_(() => GovernanceProposal, {nullable: true})
    proposal!: GovernanceProposal
}
