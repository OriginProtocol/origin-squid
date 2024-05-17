import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class ExponentialStakingDelegateVotesChanged {
    constructor(props?: Partial<ExponentialStakingDelegateVotesChanged>) {
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

    @Index_()
    @StringColumn_({nullable: false})
    delegate!: string

    @BigIntColumn_({nullable: false})
    previousBalance!: bigint

    @BigIntColumn_({nullable: false})
    newBalance!: bigint
}
