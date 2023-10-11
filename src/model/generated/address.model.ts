import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {RebasingOption} from "./_rebasingOption"
import {History} from "./history.model"

/**
 * The OETH balance, history and other information for a given address.
 */
@Entity_()
export class Address {
    constructor(props?: Partial<Address>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("bool", {nullable: false})
    isContract!: boolean

    /**
     * Is the address opted in our out of yield.
     */
    @Column_("varchar", {length: 6, nullable: false})
    rebasingOption!: RebasingOption

    /**
     * The current balance of OETH held by the address.
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balance!: bigint

    /**
     * The total amount of OETH earned by the address.
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    earned!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    credits!: bigint

    /**
     * The last time the address information was updated.
     */
    @Column_("timestamp with time zone", {nullable: false})
    lastUpdated!: Date

    @OneToMany_(() => History, e => e.address)
    history!: History[]
}
