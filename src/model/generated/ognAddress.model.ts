import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, Index as Index_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class OGNAddress {
    constructor(props?: Partial<OGNAddress>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @BigIntColumn_({nullable: false})
    balance!: bigint

    @BigIntColumn_({nullable: false})
    staked!: bigint

    @BigIntColumn_({nullable: false})
    xognBalance!: bigint

    @BigIntColumn_({nullable: false})
    votingPower!: bigint

    @Index_()
    @ManyToOne_(() => OGNAddress, {nullable: true})
    delegatee!: OGNAddress | undefined | null

    @DateTimeColumn_({nullable: false})
    lastUpdated!: Date
}
