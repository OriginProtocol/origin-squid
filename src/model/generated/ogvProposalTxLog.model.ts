import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {OGVProposalEvent} from "./_ogvProposalEvent"
import {OGVProposal} from "./ogvProposal.model"

@Entity_()
export class OGVProposalTxLog {
    constructor(props?: Partial<OGVProposalTxLog>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    hash!: string

    @Column_("varchar", {length: 8, nullable: false})
    event!: OGVProposalEvent

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @ManyToOne_(() => OGVProposal, {nullable: true})
    proposal!: OGVProposal
}
