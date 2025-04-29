import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class SFCWithdrawal {
    constructor(props?: Partial<SFCWithdrawal>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @IntColumn_({nullable: false})
    createdAtBlock!: number

    @Index_()
    @StringColumn_({nullable: false})
    delegator!: string

    @Index_()
    @StringColumn_({nullable: false})
    toValidatorID!: string

    @Index_()
    @StringColumn_({nullable: false})
    wrID!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BigIntColumn_({nullable: true})
    penalty!: bigint | undefined | null

    @DateTimeColumn_({nullable: true})
    withdrawnAt!: Date | undefined | null

    @IntColumn_({nullable: true})
    withdrawnAtBlock!: number | undefined | null
}
