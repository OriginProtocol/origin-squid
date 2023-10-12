import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {OETHRebasingOption} from "./_oethRebasingOption"
import {OETHHistory} from "./oethHistory.model"

/**
 * The OETH balance, history and other information for a given address.
 */
@Entity_()
export class OETHAddress {
    constructor(props?: Partial<OETHAddress>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("bool", {nullable: false})
    isContract!: boolean

    @Column_("varchar", {length: 6, nullable: false})
    rebasingOption!: OETHRebasingOption

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balance!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    earned!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    credits!: bigint

    @Column_("timestamp with time zone", {nullable: false})
    lastUpdated!: Date

    @OneToMany_(() => OETHHistory, e => e.address)
    history!: OETHHistory[]
}
