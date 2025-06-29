import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {OTokenAddress} from "./oTokenAddress.model"
import {RebasingOption} from "./_rebasingOption"

@Entity_()
export class OTokenRebaseOption {
    constructor(props?: Partial<OTokenRebaseOption>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    otoken!: string

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @IntColumn_({nullable: false})
    blockNumber!: number

    @StringColumn_({nullable: false})
    txHash!: string

    @Index_()
    @ManyToOne_(() => OTokenAddress, {nullable: true})
    address!: OTokenAddress

    @Column_("varchar", {length: 21, nullable: false})
    status!: RebasingOption

    @StringColumn_({nullable: true})
    delegatedTo!: string | undefined | null
}
