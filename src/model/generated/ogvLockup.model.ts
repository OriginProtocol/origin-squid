import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {OGVAddress} from "./ogvAddress.model"
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
    @ManyToOne_(() => OGVAddress, {nullable: true})
    address!: OGVAddress

    @OneToMany_(() => OGVLockupTxLog, e => e.ogvLockup)
    logs!: OGVLockupTxLog[]

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amount!: bigint

    @Column_("timestamp with time zone", {nullable: false})
    end!: Date

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    veogv!: bigint

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date
}
