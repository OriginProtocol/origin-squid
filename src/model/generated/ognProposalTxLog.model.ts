import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, ManyToOne as ManyToOne_, Index as Index_} from "@subsquid/typeorm-store"
import {OGNProposalEvent} from "./_ognProposalEvent"
import {OGNProposal} from "./ognProposal.model"

@Entity_()
export class OGNProposalTxLog {
    constructor(props?: Partial<OGNProposalTxLog>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    hash!: string

    @Column_("varchar", {length: 8, nullable: false})
    event!: OGNProposalEvent

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @ManyToOne_(() => OGNProposal, {nullable: true})
    proposal!: OGNProposal
}
