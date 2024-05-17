import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
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

    @BigIntColumn_({nullable: false})
    weight!: bigint

    @Column_("varchar", {length: 7, nullable: false})
    type!: OGVVoteType

    @StringColumn_({nullable: false})
    txHash!: string

    @DateTimeColumn_({nullable: false})
    timestamp!: Date
}
