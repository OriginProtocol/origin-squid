import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class Arm {
    constructor(props?: Partial<Arm>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    chainId!: number

    @StringColumn_({nullable: false})
    address!: string

    @StringColumn_({nullable: false})
    name!: string

    @StringColumn_({nullable: false})
    symbol!: string

    @IntColumn_({nullable: false})
    decimals!: number

    @StringColumn_({nullable: false})
    token0!: string

    @StringColumn_({nullable: false})
    token1!: string

    @StringColumn_({array: true, nullable: false})
    assets!: (string)[]

    @StringColumn_({array: true, nullable: false})
    assetSymbols!: (string)[]

    @IntColumn_({array: true, nullable: false})
    assetDecimals!: (number)[]

    @BooleanColumn_({array: true, nullable: false})
    assetPegged!: (boolean)[]

    @StringColumn_({array: true, nullable: false})
    assetAdapters!: (string)[]

    @IntColumn_({nullable: true})
    upgradeBlock!: number | undefined | null
}
