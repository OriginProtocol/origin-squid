import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {RebasingOption} from "./_rebasingOption"
import {History} from "./history.model"

@Entity_()
export class Address {
    constructor(props?: Partial<Address>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

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

    @OneToMany_(() => History, e => e.address)
    history!: History[]
}
