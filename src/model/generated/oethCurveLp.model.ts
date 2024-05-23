import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class OETHCurveLP {
    constructor(props?: Partial<OETHCurveLP>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @BigIntColumn_({nullable: false})
    totalSupply!: bigint

    @BigIntColumn_({nullable: false})
    eth!: bigint

    @BigIntColumn_({nullable: false})
    oeth!: bigint

    @BigIntColumn_({nullable: false})
    totalSupplyOwned!: bigint

    @BigIntColumn_({nullable: false})
    ethOwned!: bigint

    @BigIntColumn_({nullable: false})
    oethOwned!: bigint
}
