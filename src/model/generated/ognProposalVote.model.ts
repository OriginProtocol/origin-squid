import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {OGNProposal} from "./ognProposal.model"
import {OGNAddress} from "./ognAddress.model"
import {OGNVoteType} from "./_ognVoteType"

@Entity_()
export class OGNProposalVote {
    constructor(props?: Partial<OGNProposalVote>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => OGNProposal, {nullable: true})
    proposal!: OGNProposal

    @Index_()
    @ManyToOne_(() => OGNAddress, {nullable: true})
    voter!: OGNAddress

    @BigIntColumn_({nullable: false})
    weight!: bigint

    @Column_("varchar", {length: 7, nullable: false})
    type!: OGNVoteType

    @StringColumn_({nullable: false})
    txHash!: string

    @DateTimeColumn_({nullable: false})
    timestamp!: Date
}
