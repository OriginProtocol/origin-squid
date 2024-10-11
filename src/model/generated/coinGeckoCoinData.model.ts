import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class CoinGeckoCoinData {
    constructor(props?: Partial<CoinGeckoCoinData>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    product!: string

    @Index_()
    @StringColumn_({nullable: false})
    date!: string

    @StringColumn_({nullable: false})
    vsCurrency!: string

    @FloatColumn_({nullable: false})
    price!: number

    @FloatColumn_({nullable: false})
    marketCap!: number

    @FloatColumn_({nullable: false})
    tradingVolume!: number
}
