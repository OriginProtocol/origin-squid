import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {OGNAddress} from "./ognAddress.model"
import {OGNProposalState} from "./_ognProposalState"
import {OGNProposalTxLog} from "./ognProposalTxLog.model"

@Entity_()
export class OGNProposal {
    constructor(props?: Partial<OGNProposal>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: true})
    description!: string | undefined | null

    @Index_()
    @ManyToOne_(() => OGNAddress, {nullable: true})
    proposer!: OGNAddress

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @BigIntColumn_({nullable: false})
    startBlock!: bigint

    @BigIntColumn_({nullable: false})
    endBlock!: bigint

    @DateTimeColumn_({nullable: false})
    lastUpdated!: Date

    @Column_("varchar", {length: 9, nullable: false})
    status!: OGNProposalState

    @OneToMany_(() => OGNProposalTxLog, e => e.proposal)
    logs!: OGNProposalTxLog[]

    @BigIntColumn_({nullable: false})
    quorum!: bigint

    @StringColumn_({array: true, nullable: false})
    choices!: (string | undefined | null)[]

    @StringColumn_({array: true, nullable: false})
    scores!: (string | undefined | null)[]
}
