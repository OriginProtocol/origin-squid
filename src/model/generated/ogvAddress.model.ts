import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, Index as Index_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class OGVAddress {
    constructor(props?: Partial<OGVAddress>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @BigIntColumn_({nullable: false})
    balance!: bigint

    @BigIntColumn_({nullable: false})
    staked!: bigint

    @BigIntColumn_({nullable: false})
    veogvBalance!: bigint

    @BigIntColumn_({nullable: false})
    votingPower!: bigint

    @Index_()
    @ManyToOne_(() => OGVAddress, {nullable: true})
    delegatee!: OGVAddress | undefined | null

    @DateTimeColumn_({nullable: false})
    lastUpdated!: Date
}
