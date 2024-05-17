import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {LiquiditySourceType} from "./_liquiditySourceType"

@Entity_()
export class LiquiditySource {
    constructor(props?: Partial<LiquiditySource>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    address!: string

    @Column_("varchar", {length: 12, nullable: false})
    type!: LiquiditySourceType

    @StringColumn_({nullable: false})
    token!: string
}
