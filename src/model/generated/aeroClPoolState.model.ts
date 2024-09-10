import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"
import {AeroCLPoolTick} from "./aeroClPoolTick.model"

@Entity_()
export class AeroCLPoolState {
    constructor(props?: Partial<AeroCLPoolState>) {
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

    @BigIntColumn_({nullable: false})
    totalUsd!: bigint

    @BigIntColumn_({nullable: false})
    liquidity!: bigint

    @BigIntColumn_({nullable: false})
    stakedLiquidity!: bigint

    @BigIntColumn_({nullable: false})
    asset0!: bigint

    @BigIntColumn_({nullable: false})
    asset1!: bigint

    @BigIntColumn_({nullable: false})
    voteWeight!: bigint

    @BigIntColumn_({nullable: false})
    votePercentage!: bigint

    @Index_()
    @ManyToOne_(() => AeroCLPoolTick, {nullable: true})
    tick!: AeroCLPoolTick

    @FloatColumn_({nullable: false})
    tickPrice!: number

    @BigIntColumn_({nullable: false})
    sqrtPriceX96!: bigint
}
