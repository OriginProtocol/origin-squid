import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class ExponentialStakingDelegateChanged {
    constructor(props?: Partial<ExponentialStakingDelegateChanged>) {
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
    delegator!: string

    @StringColumn_({nullable: false})
    fromDelegate!: string

    @StringColumn_({nullable: false})
    toDelegate!: string
}
