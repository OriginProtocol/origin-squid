import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {OGVLockupEventType} from "./_ogvLockupEventType"
import {OGVLockup} from "./ogvLockup.model"

@Entity_()
export class OGVLockupTxLog {
    constructor(props?: Partial<OGVLockupTxLog>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    hash!: string

    @Column_("varchar", {length: 8, nullable: false})
    event!: OGVLockupEventType

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @ManyToOne_(() => OGVLockup, {nullable: true})
    ogvLockup!: OGVLockup
}
