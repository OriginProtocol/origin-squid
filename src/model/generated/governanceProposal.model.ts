import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {GovernanceProposalState} from "./_governanceProposalState"
import {GovernanceProposalEvent} from "./governanceProposalEvent.model"

@Entity_()
export class GovernanceProposal {
    constructor(props?: Partial<GovernanceProposal>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @BigIntColumn_({nullable: false})
    proposalId!: bigint

    @StringColumn_({nullable: true})
    description!: string | undefined | null

    @StringColumn_({nullable: false})
    proposer!: string

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string

    @BigIntColumn_({nullable: false})
    startBlock!: bigint

    @BigIntColumn_({nullable: false})
    endBlock!: bigint

    @StringColumn_({array: true, nullable: false})
    targets!: (string | undefined | null)[]

    @StringColumn_({array: true, nullable: false})
    values!: (string | undefined | null)[]

    @StringColumn_({array: true, nullable: false})
    signatures!: (string | undefined | null)[]

    @StringColumn_({array: true, nullable: false})
    calldatas!: (string | undefined | null)[]

    @DateTimeColumn_({nullable: false})
    lastUpdated!: Date

    @Column_("varchar", {length: 9, nullable: false})
    status!: GovernanceProposalState

    @OneToMany_(() => GovernanceProposalEvent, e => e.proposal)
    events!: GovernanceProposalEvent[]

    @BigIntColumn_({nullable: false})
    quorum!: bigint

    @StringColumn_({array: true, nullable: false})
    choices!: (string | undefined | null)[]

    @StringColumn_({array: true, nullable: false})
    scores!: (string | undefined | null)[]
}
