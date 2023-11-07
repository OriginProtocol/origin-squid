import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {OGVProposal} from "./ogvProposal.model"
import {OGVAddress} from "./ogvAddress.model"
import {OGVVoteType} from "./_ogvVoteType"

@Entity_()
export class OGVProposalVote {
    constructor(props?: Partial<OGVProposalVote>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => OGVProposal, {nullable: true})
    proposal!: OGVProposal

    @Index_()
    @ManyToOne_(() => OGVAddress, {nullable: true})
    voter!: OGVAddress

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    weight!: bigint

    @Column_("varchar", {length: 7, nullable: false})
    type!: OGVVoteType

    @Column_("text", {nullable: false})
    txHash!: string

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date
}
