import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class ArmDailyStat {
    constructor(props?: Partial<ArmDailyStat>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @StringColumn_({nullable: false})
    date!: string

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @BigIntColumn_({nullable: false})
    assets0!: bigint

    @BigIntColumn_({nullable: false})
    assets1!: bigint

    @BigIntColumn_({nullable: false})
    outstandingAssets1!: bigint

    @BigIntColumn_({nullable: false})
    marketAssets!: bigint

    @BigIntColumn_({nullable: false})
    totalAssets!: bigint

    @BigIntColumn_({nullable: false})
    totalAssetsCap!: bigint

    @BigIntColumn_({nullable: false})
    totalSupply!: bigint

    @BigIntColumn_({nullable: false})
    assetsPerShare!: bigint

    @BigIntColumn_({nullable: false})
    totalDeposits!: bigint

    @BigIntColumn_({nullable: false})
    totalWithdrawals!: bigint

    @BigIntColumn_({nullable: false})
    totalWithdrawalsClaimed!: bigint

    @FloatColumn_({nullable: false})
    apr!: number

    @FloatColumn_({nullable: false})
    apy!: number

    @BigIntColumn_({nullable: false})
    yield!: bigint

    @BigIntColumn_({nullable: false})
    fees!: bigint

    @FloatColumn_({nullable: false})
    rateUSD!: number

    @FloatColumn_({nullable: false})
    rateETH!: number
}
