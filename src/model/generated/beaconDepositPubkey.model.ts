import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {BeaconDepositEvent} from "./beaconDepositEvent.model"

@Entity_()
export class BeaconDepositPubkey {
    constructor(props?: Partial<BeaconDepositPubkey>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @DateTimeColumn_({nullable: false})
    createDate!: Date

    @DateTimeColumn_({nullable: false})
    lastUpdated!: Date

    @IntColumn_({nullable: false})
    count!: number

    @OneToMany_(() => BeaconDepositEvent, e => e.pubkey)
    deposits!: BeaconDepositEvent[]
}
