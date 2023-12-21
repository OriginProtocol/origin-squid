import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import {LiquiditySourceType} from "./_liquiditySourceType"

@Entity_()
export class LiquiditySource {
    constructor(props?: Partial<LiquiditySource>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    address!: string

    @Column_("varchar", {length: 12, nullable: false})
    type!: LiquiditySourceType

    @Column_("text", {nullable: false})
    token!: string
}
