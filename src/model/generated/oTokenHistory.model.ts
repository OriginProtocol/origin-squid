import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {OTokenAddress} from "./oTokenAddress.model"
import {HistoryType} from "./_historyType"

@Entity_()
export class OTokenHistory {
    constructor(props?: Partial<OTokenHistory>) {
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

    @Index_()
    @ManyToOne_(() => OTokenAddress, {nullable: true})
    address!: OTokenAddress

    @BigIntColumn_({nullable: false})
    value!: bigint

    @BigIntColumn_({nullable: false})
    balance!: bigint

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string

    @Column_("varchar", {length: 8, nullable: false})
    type!: HistoryType
}
