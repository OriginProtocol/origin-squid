import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Proposal} from "./proposal.model"

@Entity_()
export class ProposalTxLog {
    constructor(props?: Partial<ProposalTxLog>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    hash!: string

    @Column_("text", {nullable: false})
    event!: string

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    @Index_()
    @ManyToOne_(() => Proposal, {nullable: true})
    proposal!: Proposal
}
