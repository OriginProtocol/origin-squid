import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {RebasingOption} from "./_rebasingOption"
import {OTokenHistory} from "./oTokenHistory.model"

@Entity_()
export class OTokenAddress {
    constructor(props?: Partial<OTokenAddress>) {
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
    @Column_("text", {nullable: false})
    address!: string

    @Column_("bool", {nullable: false})
    isContract!: boolean

    @Column_("varchar", {length: 6, nullable: false})
    rebasingOption!: RebasingOption

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balance!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    earned!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    credits!: bigint

    @Column_("timestamp with time zone", {nullable: false})
    lastUpdated!: Date

    @OneToMany_(() => OTokenHistory, e => e.address)
    history!: OTokenHistory[]
}
