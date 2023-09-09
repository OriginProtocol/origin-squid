import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Proposal} from "./proposal.model"
import {Address} from "./address.model"

@Entity_()
export class OGVProposalVoter {
    constructor(props?: Partial<OGVProposalVoter>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Proposal, {nullable: true})
    proposal!: Proposal

    @Index_()
    @ManyToOne_(() => Address, {nullable: true})
    voter!: Address
}
