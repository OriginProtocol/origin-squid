import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, FloatColumn as FloatColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class AeroCLPoolTick {
    constructor(props?: Partial<AeroCLPoolTick>) {
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
    address!: string

    @Index_()
    @IntColumn_({nullable: false})
    tick!: number

    @FloatColumn_({nullable: false})
    tickPrice!: number

    @BigIntColumn_({nullable: false})
    sqrtPriceX96!: bigint

    @BigIntColumn_({nullable: false})
    liquidityGross!: bigint

    @BigIntColumn_({nullable: false})
    liquidityNet!: bigint

    @BigIntColumn_({nullable: false})
    stakedLiquidityNet!: bigint

    @BigIntColumn_({nullable: false})
    feeGrowthOutside0X128!: bigint

    @BigIntColumn_({nullable: false})
    feeGrowthOutside1X128!: bigint

    @BigIntColumn_({nullable: false})
    rewardGrowthOutsideX128!: bigint

    @BigIntColumn_({nullable: false})
    tickCumulativeOutside!: bigint

    @BigIntColumn_({nullable: false})
    secondsPerLiquidityOutsideX128!: bigint

    @IntColumn_({nullable: false})
    secondsOutside!: number
}
