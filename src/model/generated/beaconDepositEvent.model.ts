import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {BeaconDepositPubkey} from "./beaconDepositPubkey.model"

@Entity_()
export class BeaconDepositEvent {
    constructor(props?: Partial<BeaconDepositEvent>) {
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

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string

    @Index_()
    @StringColumn_({nullable: false})
    caller!: string

    @Index_()
    @ManyToOne_(() => BeaconDepositPubkey, {nullable: true})
    pubkey!: BeaconDepositPubkey

    @StringColumn_({nullable: false})
    withdrawalCredentials!: string

    @StringColumn_({nullable: false})
    amount!: string

    @StringColumn_({nullable: false})
    signature!: string

    @StringColumn_({nullable: false})
    index!: string
}
