import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Address} from "./address.model"
import {ProposalTxLog} from "./proposalTxLog.model"

@Entity_()
export class Proposal {
    constructor(props?: Partial<Proposal>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: true})
    description!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Address, {nullable: true})
    proposer!: Address

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    @Column_("int4", {nullable: false})
    status!: number

    @OneToMany_(() => ProposalTxLog, e => e.proposal)
    logs!: ProposalTxLog[]
}
