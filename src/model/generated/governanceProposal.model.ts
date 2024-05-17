import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"
import {GovernanceProposalState} from "./_governanceProposalState"
import {GovernanceProposalTxLog} from "./governanceProposalTxLog.model"

@Entity_()
export class GovernanceProposal {
    constructor(props?: Partial<GovernanceProposal>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: true})
    description!: string | undefined | null

    @StringColumn_({nullable: false})
    proposer!: string

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @BigIntColumn_({nullable: false})
    startBlock!: bigint

    @BigIntColumn_({nullable: false})
    endBlock!: bigint

    @DateTimeColumn_({nullable: false})
    lastUpdated!: Date

    @Column_("varchar", {length: 9, nullable: false})
    status!: GovernanceProposalState

    @OneToMany_(() => GovernanceProposalTxLog, e => e.proposal)
    logs!: GovernanceProposalTxLog[]

    @BigIntColumn_({nullable: false})
    quorum!: bigint

    @StringColumn_({array: true, nullable: false})
    choices!: (string | undefined | null)[]

    @FloatColumn_({array: true, nullable: false})
    scores!: (number | undefined | null)[]
}
