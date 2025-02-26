import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class PoolBooster {
    constructor(props?: Partial<PoolBooster>) {
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
    address!: string

    @Index_()
    @StringColumn_({nullable: false})
    registryAddress!: string

    @Index_()
    @StringColumn_({nullable: false})
    ammPoolAddress!: string

    @Index_()
    @StringColumn_({nullable: false})
    factoryAddress!: string

    @IntColumn_({nullable: false})
    poolBoosterType!: number

    @BooleanColumn_({nullable: false})
    active!: boolean
}
