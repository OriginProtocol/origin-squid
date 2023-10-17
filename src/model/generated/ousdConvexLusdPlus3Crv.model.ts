import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class OUSDConvexLUSDPlus3Crv {
    constructor(props?: Partial<OUSDConvexLUSDPlus3Crv>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    dai!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    usdt!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    usdc!: bigint
}
