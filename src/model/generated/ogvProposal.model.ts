import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {OGVAddress} from "./ogvAddress.model"
import {OGVProposalState} from "./_ogvProposalState"
import {OGVProposalTxLog} from "./ogvProposalTxLog.model"

@Entity_()
export class OGVProposal {
    constructor(props?: Partial<OGVProposal>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: true})
    description!: string | undefined | null

    @Index_()
    @ManyToOne_(() => OGVAddress, {nullable: true})
    proposer!: OGVAddress

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    startBlock!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    endBlock!: bigint

    @Column_("timestamp with time zone", {nullable: false})
    lastUpdated!: Date

    @Column_("varchar", {length: 9, nullable: false})
    status!: OGVProposalState

    @OneToMany_(() => OGVProposalTxLog, e => e.proposal)
    logs!: OGVProposalTxLog[]

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    quorum!: bigint

    @Column_("text", {array: true, nullable: false})
    choices!: (string | undefined | null)[]

    @Column_("numeric", {array: true, nullable: false})
    scores!: (number | undefined | null)[]
}
