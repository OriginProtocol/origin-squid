import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class LegacyStaker {
    constructor(props?: Partial<LegacyStaker>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @BigIntColumn_({nullable: false})
    inputAmount!: bigint

    @BigIntColumn_({nullable: false})
    outputAmount!: bigint

    @BigIntColumn_({nullable: false})
    balance!: bigint

    @BigIntColumn_({nullable: false})
    rewardAmount!: bigint
}
