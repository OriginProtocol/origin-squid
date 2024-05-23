import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, ManyToOne as ManyToOne_, Index as Index_} from "@subsquid/typeorm-store"
import {OGVProposalEvent} from "./_ogvProposalEvent"
import {OGVProposal} from "./ogvProposal.model"

@Entity_()
export class OGVProposalTxLog {
    constructor(props?: Partial<OGVProposalTxLog>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    hash!: string

    @Column_("varchar", {length: 8, nullable: false})
    event!: OGVProposalEvent

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @ManyToOne_(() => OGVProposal, {nullable: true})
    proposal!: OGVProposal
}
