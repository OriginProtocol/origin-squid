import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class ERC20Supply {
    constructor(props?: Partial<ERC20Supply>) {
        Object.assign(this, props)
    }

    /**
     * Format: 'address:blockNumber'
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
    address!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalSupply!: bigint
}
