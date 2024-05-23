import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {ESLockupState} from "./_esLockupState"

@Entity_()
export class ESLockup {
    constructor(props?: Partial<ESLockup>) {
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
    account!: string

    @Index_()
    @BigIntColumn_({nullable: false})
    lockupId!: bigint

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @DateTimeColumn_({nullable: false})
    lastUpdated!: Date

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BigIntColumn_({nullable: false})
    end!: bigint

    @BigIntColumn_({nullable: false})
    points!: bigint

    @BigIntColumn_({nullable: false})
    withdrawAmount!: bigint

    @BigIntColumn_({nullable: false})
    penalty!: bigint

    @Column_("varchar", {length: 6, nullable: true})
    state!: ESLockupState | undefined | null
}
