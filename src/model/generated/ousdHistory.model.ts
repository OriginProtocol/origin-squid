import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {OUSDAddress} from "./ousdAddress.model"
import {OUSDHistoryType} from "./_ousdHistoryType"

/**
 * The History entity tracks events that change the balance of OUSD for an address.
 */
@Entity_()
export class OUSDHistory {
    constructor(props?: Partial<OUSDHistory>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => OUSDAddress, {nullable: true})
    address!: OUSDAddress

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    value!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balance!: bigint

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("text", {nullable: false})
    txHash!: string

    @Column_("varchar", {length: 8, nullable: false})
    type!: OUSDHistoryType
}
