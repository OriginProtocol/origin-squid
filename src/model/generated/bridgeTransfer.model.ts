import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class BridgeTransfer {
    constructor(props?: Partial<BridgeTransfer>) {
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

    @Column_("text", {nullable: false})
    txHashIn!: string

    @Column_("text", {nullable: true})
    txHashOut!: string | undefined | null

    @Index_()
    @Column_("text", {nullable: false})
    messageId!: string

    @Index_()
    @Column_("text", {nullable: false})
    bridge!: string

    @Index_()
    @Column_("text", {nullable: false})
    transactor!: string

    @Index_()
    @Column_("text", {nullable: false})
    sender!: string

    @Index_()
    @Column_("text", {nullable: false})
    receiver!: string

    @Index_()
    @Column_("int4", {nullable: false})
    chainIn!: number

    @Column_("int4", {nullable: false})
    chainOut!: number

    @Column_("text", {nullable: false})
    tokenIn!: string

    @Column_("text", {nullable: false})
    tokenOut!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amountIn!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amountOut!: bigint

    @Column_("int4", {nullable: false})
    state!: number
}
