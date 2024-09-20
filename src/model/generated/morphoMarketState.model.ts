import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class MorphoMarketState {
    constructor(props?: Partial<MorphoMarketState>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    chainId!: number

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @IntColumn_({nullable: false})
    blockNumber!: number

    @StringColumn_({nullable: false})
    marketId!: string

    @BigIntColumn_({nullable: false})
    totalSupplyAssets!: bigint

    @BigIntColumn_({nullable: false})
    totalSupplyShares!: bigint

    @BigIntColumn_({nullable: false})
    totalBorrowAssets!: bigint

    @BigIntColumn_({nullable: false})
    totalBorrowShares!: bigint

    @BigIntColumn_({nullable: false})
    lastUpdate!: bigint

    @BigIntColumn_({nullable: false})
    fee!: bigint
}
