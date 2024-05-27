import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {ESLockupEventType} from "./_esLockupEventType"
import {ESLockup} from "./esLockup.model"

@Entity_()
export class ESLockupEvent {
    constructor(props?: Partial<ESLockupEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Column_("varchar", {length: 8, nullable: false})
    event!: ESLockupEventType

    @Index_()
    @ManyToOne_(() => ESLockup, {nullable: true})
    lockup!: ESLockup
}
