import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {OGNAddress} from "./ognAddress.model"
import {OGNLockupTxLog} from "./ognLockupTxLog.model"

@Entity_()
export class OGNLockup {
    constructor(props?: Partial<OGNLockup>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    lockupId!: string

    @Index_()
    @ManyToOne_(() => OGNAddress, {nullable: true})
    address!: OGNAddress

    @OneToMany_(() => OGNLockupTxLog, e => e.ognLockup)
    logs!: OGNLockupTxLog[]

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @DateTimeColumn_({nullable: false})
    end!: Date

    @BigIntColumn_({nullable: false})
    xogn!: bigint

    @DateTimeColumn_({nullable: false})
    timestamp!: Date
}
