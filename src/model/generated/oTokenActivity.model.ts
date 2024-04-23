import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class OTokenActivity {
    constructor(props?: Partial<OTokenActivity>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    chainId!: number

    @Index_()
    @Column_("text", {nullable: false})
    otoken!: string

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("text", {nullable: false})
    txHash!: string

    @Column_("text", {nullable: false})
    callDataLast4Bytes!: string

    @Column_("text", {nullable: true})
    address!: string | undefined | null

    @Column_("text", {nullable: true})
    sighash!: string | undefined | null

    @Column_("text", {nullable: true})
    action!: string | undefined | null

    @Column_("text", {nullable: true})
    exchange!: string | undefined | null

    @Column_("text", {nullable: true})
    interface!: string | undefined | null

    @Column_("text", {nullable: true})
    fromSymbol!: string | undefined | null

    @Column_("text", {nullable: true})
    toSymbol!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    amount!: bigint | undefined | null
}
