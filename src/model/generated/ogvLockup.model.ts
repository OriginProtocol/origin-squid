import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Address} from "./address.model"
import {OGVLockupTxLog} from "./ogvLockupTxLog.model"

@Entity_()
export class OGVLockup {
    constructor(props?: Partial<OGVLockup>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    lockupId!: number

    @Index_()
    @ManyToOne_(() => Address, {nullable: true})
    user!: Address

    @OneToMany_(() => OGVLockupTxLog, e => e.ogvLockup)
    logs!: OGVLockupTxLog[]

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amount!: bigint

    @Column_("timestamp with time zone", {nullable: false})
    end!: Date

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    @Column_("bool", {nullable: true})
    active!: boolean | undefined | null
}
