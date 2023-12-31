import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class StrategyBalance {
    constructor(props?: Partial<StrategyBalance>) {
        Object.assign(this, props)
    }

    /**
     * Format: 'strategy:asset:blockNumber'
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Column_("text", {nullable: false})
    strategy!: string

    @Column_("text", {nullable: false})
    asset!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balance!: bigint
}
