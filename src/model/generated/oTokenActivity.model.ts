import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, JSONColumn as JSONColumn_} from "@subsquid/typeorm-store"
import {OTokenActivityType} from "./_oTokenActivityType"

@Entity_()
export class OTokenActivity {
    constructor(props?: Partial<OTokenActivity>) {
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

    @Column_("varchar", {length: 12, nullable: true})
    type!: OTokenActivityType | undefined | null

    @JSONColumn_({nullable: true})
    data!: unknown | undefined | null
}
