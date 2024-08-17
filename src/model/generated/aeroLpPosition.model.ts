import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class AeroLPPosition {
    constructor(props?: Partial<AeroLPPosition>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @StringColumn_({nullable: false})
    pool!: string

    @Index_()
    @BigIntColumn_({nullable: false})
    positionId!: bigint

    @Index_()
    @StringColumn_({nullable: false})
    account!: string

    @BigIntColumn_({nullable: false})
    liquidity!: bigint

    @BigIntColumn_({nullable: false})
    staked!: bigint

    @BigIntColumn_({nullable: false})
    amount0!: bigint

    @BigIntColumn_({nullable: false})
    amount1!: bigint

    @BigIntColumn_({nullable: false})
    staked0!: bigint

    @BigIntColumn_({nullable: false})
    staked1!: bigint

    @BigIntColumn_({nullable: false})
    unstakedEarned0!: bigint

    @BigIntColumn_({nullable: false})
    unstakedEarned1!: bigint

    @BigIntColumn_({nullable: false})
    emissionsEarned!: bigint

    @IntColumn_({nullable: false})
    tickLower!: number

    @IntColumn_({nullable: false})
    tickUpper!: number

    @BigIntColumn_({nullable: false})
    sqrtRatioLower!: bigint

    @BigIntColumn_({nullable: false})
    sqrtRatioUpper!: bigint
}
