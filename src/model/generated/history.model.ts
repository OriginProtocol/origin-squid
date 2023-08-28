import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Address} from "./address.model"

@Entity_()
export class History {
    constructor(props?: Partial<History>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Address, {nullable: true})
    address!: Address

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    value!: number

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    balance!: number

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("text", {nullable: false})
    txHash!: string

    @Column_("text", {nullable: false})
    type!: string
}
