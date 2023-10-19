import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class OETHFraxStaking {
    constructor(props?: Partial<OETHFraxStaking>) {
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

    /**
     * - sfrxETH is what's actually stored here, slightly confusing and may want to change.
     * - used by balance sheet
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    sfrxETH!: bigint
}
