import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, Index as Index_} from "@subsquid/typeorm-store"
import {OGVLockupEventType} from "./_ogvLockupEventType"
import {OGVLockup} from "./ogvLockup.model"

@Entity_()
export class OGVLockupTxLog {
    constructor(props?: Partial<OGVLockupTxLog>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    hash!: string

    @Column_("varchar", {length: 8, nullable: false})
    event!: OGVLockupEventType

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @IntColumn_({nullable: false})
    blockNumber!: number

    @BigIntColumn_({nullable: false})
    totalSupply!: bigint

    @Index_()
    @ManyToOne_(() => OGVLockup, {nullable: true})
    ogvLockup!: OGVLockup
}
