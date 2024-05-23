import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
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

    @StringColumn_({nullable: true})
    description!: string | undefined | null

    @Index_()
    @ManyToOne_(() => OGVAddress, {nullable: true})
    proposer!: OGVAddress

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @BigIntColumn_({nullable: false})
    startBlock!: bigint

    @BigIntColumn_({nullable: false})
    endBlock!: bigint

    @DateTimeColumn_({nullable: false})
    lastUpdated!: Date

    @Column_("varchar", {length: 9, nullable: false})
    status!: OGVProposalState

    @OneToMany_(() => OGVProposalTxLog, e => e.proposal)
    logs!: OGVProposalTxLog[]

    @BigIntColumn_({nullable: false})
    quorum!: bigint

    @StringColumn_({array: true, nullable: false})
    choices!: (string | undefined | null)[]

    @StringColumn_({array: true, nullable: false})
    scores!: (string | undefined | null)[]
}
