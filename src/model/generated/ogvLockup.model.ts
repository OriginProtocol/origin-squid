import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, ManyToOne as ManyToOne_, Relation as Relation_, OneToMany as OneToMany_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
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
    @StringColumn_({nullable: false})
    lockupId!: string

    @Index_()
    @ManyToOne_(() => OGVAddress, {nullable: true})
    address!: Relation_<OGVAddress>

    @OneToMany_(() => OGVLockupTxLog, e => e.ogvLockup)
    logs!: Relation_<OGVLockupTxLog[]>

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @DateTimeColumn_({nullable: false})
    end!: Date

    @BigIntColumn_({nullable: false})
    veogv!: bigint

    @DateTimeColumn_({nullable: false})
    timestamp!: Date
}
